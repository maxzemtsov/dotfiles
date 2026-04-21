---
name: anthropic-batch
description: Anthropic Message Batches API — cost-efficient bulk inference with prompt caching. Invoke when building/debugging ANY batch workload (LLM simulation, large-scale eval, bulk content generation, persona triangulation) on Claude models. Covers pricing math, per-model cache minimums, structural patterns for cache hits, and checkpoint schema requirements. Prevents the "$17.80 silent cache miss" failure mode.
---

# Anthropic Message Batches API — cost-efficient bulk inference

Use this skill whenever you need to:
- Run bulk LLM simulation (personas, evals, content generation, SD rating, etc.) on Claude
- Reduce cost vs on-demand API (50% batch discount, stacks with prompt caching)
- Debug "why is my batch more expensive than estimated?"
- Pick the right Claude model for a batch workload given prompt length

**For credentials and secrets, use the `/op-secrets` skill. NEVER accept keys pasted in chat.**

---

## Cheat sheet — minimum cache-eligible prompt length per model

**Critical:** if your cacheable block is BELOW the minimum, Anthropic **silently ignores** your `cache_control` marker — no error, no warning, just no caching. You pay full price and `cache_creation_input_tokens` / `cache_read_input_tokens` will be 0 in the response.

| Model | Min tokens for cache | Batch input / output (USD/MTok) |
|---|---|---|
| Claude Opus 4.7 / 4.6 / 4.5 | **4,096** | $2.50 / $12.50 |
| Claude Opus 4.1 / 4 | 1,024 | $7.50 / $37.50 |
| Claude Sonnet 4.6 | **2,048** | $1.50 / $7.50 |
| **Claude Sonnet 4.5** | **1,024** | **$1.50 / $7.50** |
| Claude Sonnet 4 | 1,024 | $1.50 / $7.50 |
| **Claude Haiku 4.5** | **4,096** | **$0.50 / $2.50** |
| Claude Haiku 3.5 (deprecated) | 2,048 | $0.40 / $2.00 |
| Claude Haiku 3 (deprecated) | 4,096 | $0.125 / $0.625 |

**Picking a model for a batch workload:**
- If your cacheable preamble is **< 1024 tokens** → choose Haiku 4.5 without caching (cheapest per call), or inflate the preamble to hit a threshold.
- If your preamble is **1024–2047 tokens** → Sonnet 4.5 is the cheapest model that will actually cache. Avoids Sonnet 4.6 (min 2048) and Haiku 4.5 (min 4096, same price).
- If your preamble is **2048+ tokens** → Sonnet 4.6 is better (newer, same price as 4.5).
- If your preamble is **4096+ tokens** → Haiku 4.5 dominates (much cheaper per token, caching works).
- For **fast / cheap sanity checks** → Haiku 3.5 (deprecated but cheap, min 2048) or Haiku 3 (cheapest, min 4096).

---

## Pricing math (exact)

All multipliers are of the **base (on-demand) input rate**:

| Operation | Multiplier vs base input |
|---|---|
| On-demand input | 1.00× |
| Batch input | **0.50×** (50% discount) |
| 5-minute cache-write | 1.25× |
| **1-hour cache-write** | **2.00×** |
| Cache-read | **0.10×** |

**Multipliers stack.** Examples for Haiku 4.5 ($1.00/M base input):

| Mode | Effective rate |
|---|---|
| On-demand, no cache | $1.00/M |
| Batch, no cache | $0.50/M |
| Batch + 5m cache write | $0.625/M (= $1.00 × 1.25 × 0.50) |
| Batch + 1h cache write | $1.00/M (= $1.00 × 2.00 × 0.50) |
| Batch + cache read | $0.05/M (= $1.00 × 0.10 × 0.50) |

**Output pricing has no cache multiplier.** Batch discount is 0.50× for output too.

---

## Best practices for batches (do these EVERY TIME)

### 1. Use 1-hour cache TTL for batch workloads
Anthropic's own tip in the batch docs:
> Since batches can take longer than 5 minutes to process, consider using the **1-hour cache duration** with prompt caching for better cache hit rates.

```python
"cache_control": {"type": "ephemeral", "ttl": "1h"}   # ← ALWAYS for batches
```

The 1-hour TTL costs 1.6× more on writes (2.00× vs 1.25× base) but is **essential** because batches can take 11+ minutes, and the 5-min default expires mid-batch.

### 2. Structure the prompt so cached content is a single stable prefix
The cache key is a hash of the **entire prefix up to and including the cache_control boundary**. For maximum cache reuse, put STABLE content in the first block(s), VARIABLE content in the last block.

```python
"system": [
    {
        "type": "text",
        "text": SHARED_PREAMBLE,          # domain rules, scale anchors,
                                          # dim definitions, examples — same
                                          # for every request in batch
        "cache_control": {"type": "ephemeral", "ttl": "1h"},
    },
    {
        "type": "text",
        "text": per_request_persona,       # θ vector / per-persona content
                                          # NO cache_control — this is the
                                          # part that varies per request
    },
]
```

This way the PREAMBLE caches once and is reused across all N requests, even if per-request content differs. The hit rate in the batch can be 30-98% depending on request dispatch order.

### 3. Capture cache stats in your checkpoint
When parsing batch results, ALWAYS pull these fields into your local row:

```python
u = result.message.usage
row = {
    "input_tokens":  u.input_tokens,
    "output_tokens": u.output_tokens,
    "cache_creation_input_tokens": u.cache_creation_input_tokens,  # write
    "cache_read_input_tokens":     u.cache_read_input_tokens,      # read
    "cache_creation": {
        "ephemeral_5m_input_tokens": u.cache_creation.ephemeral_5m_input_tokens,
        "ephemeral_1h_input_tokens": u.cache_creation.ephemeral_1h_input_tokens,
    },
}
```

**Quick post-batch check:**
```python
from statistics import mean
cache_reads = [r["cache_read_input_tokens"] for r in rows]
cache_writes = [r["cache_creation_input_tokens"] for r in rows]
non_cached  = [r["input_tokens"] for r in rows]  # "input_tokens" = the NON-cached portion
hit_rate = sum(cache_reads) / max(sum(cache_reads) + sum(non_cached), 1)
print(f"Cache hit rate: {hit_rate:.1%}  (writes={sum(cache_writes):,}, reads={sum(cache_reads):,})")
if hit_rate < 0.30 and sum(cache_writes) == 0:
    print("⚠ Zero writes — check cacheable block length vs model minimum (silent drop).")
```

### 4. Check prompt length against model minimum BEFORE submitting
Write a helper that refuses to submit if the cacheable block is below the model's threshold:

```python
CACHE_MINIMUMS = {
    "claude-haiku-4-5":        4096,
    "claude-haiku-3-5":        2048,  # deprecated
    "claude-haiku-3":          4096,  # deprecated
    "claude-sonnet-4-5":       1024,
    "claude-sonnet-4-6":       2048,
    "claude-opus-4-5":         4096,
    "claude-opus-4-6":         4096,
    "claude-opus-4-7":         4096,
}

def verify_cache_eligible(model: str, preamble_tokens: int) -> None:
    min_t = CACHE_MINIMUMS.get(model)
    if min_t is None:
        print(f"WARN: unknown model {model}, can't verify cache minimum")
        return
    if preamble_tokens < min_t:
        raise ValueError(
            f"{model} requires {min_t} tokens to cache; preamble is {preamble_tokens}. "
            f"Options: (a) pad preamble above {min_t}, (b) remove cache_control, "
            f"(c) switch to a model with lower minimum (e.g. claude-sonnet-4-5)."
        )
```

Token counting before submit:
```python
import anthropic
client = anthropic.Anthropic()
count = client.messages.count_tokens(
    model="claude-haiku-4-5",
    system=[{"type": "text", "text": SHARED_PREAMBLE}],
    messages=[{"role": "user", "content": "x"}],
)
print(f"Preamble tokens: {count.input_tokens}")
```

### 5. Batch size & timing
- **Max batch size:** 100,000 requests OR 256 MB, whichever hits first.
- **Processing time:** most batches finish <1h (docs claim). In practice, short-prompt batches on Haiku 4.5 can finish in **10-15 min** for 25K requests.
- **Results retained:** 29 days after creation.
- **Rate limits** apply to BOTH HTTP requests to the batches endpoint AND per-request counts within a queue. See `/docs/en/api/rate-limits#message-batches-api`.

### 6. Submit-and-collect pattern
```python
# 1. Submit
batch = client.messages.batches.create(requests=requests_list)
print(f"Batch {batch.id}  status={batch.processing_status}")

# 2. Poll every 60s
while True:
    b = client.messages.batches.retrieve(batch.id)
    rc = b.request_counts
    print(f"{b.processing_status}: P={rc.processing} S={rc.succeeded} "
          f"E={rc.errored} C={rc.canceled} Ex={rc.expired}")
    if b.processing_status == "ended":
        break
    time.sleep(60)

# 3. Collect
for result in client.messages.batches.results(batch.id):
    cid = result.custom_id
    if result.result.type == "succeeded":
        msg = result.result.message
        # ... parse + write to checkpoint (see #3 above for usage fields)
```

---

## Reference implementation in this repo

Production reference (TraitTune): `studies/mfc_resim_haiku_batch.py`

Key features demonstrated:
- Generates batch JSONL matching `mfc_resim.py` prompt logic
- Submit-and-collect workflow
- Parses + writes checkpoint in the same schema as on-demand resim (so Thurstonian calibration can consume both sources interchangeably)
- Cost estimator with cache hit assumptions
- `--dry-run` / `--submit` / `--collect BATCH_ID` modes

When adapting for a new project, copy this script and swap `build_mfc_system_prompt` / `build_mfc_user_prompt` for your domain-specific prompt builders. Keep the submit/collect/caching machinery intact.

---

## Failure-mode log

### "$17.80 silent cache miss" (2026-04-21, TraitTune v10)
**Symptom:** Batch of 25K Haiku 4.5 requests cost $17.80. `cache_read_input_tokens = 0` for every request. Our estimate had been $4.68–$9.06.

**Root cause:** Cacheable block was ~1000 tokens. Haiku 4.5 minimum is 4,096. Anthropic silently ignored `cache_control`.

**Lessons encoded in this skill:**
1. Check model's cache minimum BEFORE submit (see §4 "Check prompt length").
2. Use `ttl: "1h"` not default 5-min for batches (§1).
3. Capture `cache_creation_input_tokens` / `cache_read_input_tokens` in checkpoint so you SEE the problem post-hoc (§3).
4. For short-prompt workloads (1–2K tokens shared content), use **Sonnet 4.5** (min 1024, same output price as 4.6) — don't default to Haiku for the cheapest per-token rate when caching won't apply.

### "Batch stuck in_progress" troubleshooting
- Batch `processing_status` fields: `in_progress` → `ended` → results available
- If stuck beyond 24h → batch expires, partial results may be collected for the succeeded portion
- Check `request_counts.errored` and `request_counts.expired` — if those grow, the Anthropic side is struggling; reduce batch size or split into multiple batches

---

## Quick cost estimator (paste into any prompt)

For a batch of N requests with S shared preamble tokens + P per-request tokens input + O output tokens, model with base input rate $I/M and base output rate $O_r/M:

```
without caching (batch only):
  cost ≈ N × (S + P) × ($I × 0.50 / 1e6) + N × O × ($O_r × 0.50 / 1e6)

with perfect 1h caching (90% hit):
  cache_writes = 1  (one write for the shared preamble, if all 25K share it)
  cache_reads  = 0.9 × N
  non_cached_misses = 0.1 × N
  cost ≈ (1 × S × $I × 2.00 × 0.50 / 1e6)                   # single 1h cache-write
       + (cache_reads × S × $I × 0.10 × 0.50 / 1e6)          # reads
       + (non_cached_misses × S × $I × 0.50 / 1e6)           # misses
       + (N × P × $I × 0.50 / 1e6)                           # per-request input
       + (N × O × $O_r × 0.50 / 1e6)                         # output

IMPORTANT: if S < model's cache-minimum, the "with caching" formula does NOT apply —
cost degrades to "without caching" and `cache_read_input_tokens = 0` everywhere.
```

---

## Checklist before submitting any batch

- [ ] Counted tokens in cacheable preamble; it's ≥ model's minimum (see table §1)
- [ ] `cache_control: {"type": "ephemeral", "ttl": "1h"}` applied to stable prefix
- [ ] Variable content (per-request) placed AFTER the `cache_control` block
- [ ] API key sourced via `op run --env-file=...` (never pasted in chat)
- [ ] `ANTHROPIC_API_KEY` verified in env of submit process
- [ ] `--dry-run` executed first; printed sample request + cost estimate
- [ ] Batch size check: < 100K requests, < 256 MB serialized JSONL
- [ ] Collector captures `cache_creation_input_tokens` / `cache_read_input_tokens` / per-TTL variant tokens
- [ ] Post-batch: compute hit-rate; if < 30% and writes == 0, investigate (likely prompt < minimum)
