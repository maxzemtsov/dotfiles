#!/usr/bin/env python3
"""Summarise bench/out/*.jsonl -> one row per run (tab-separated).

requests   model requests in the run (each tool round trip is one more)
start_ctx  context size of the first request (system prompt + tool definitions + prompt)
end_ctx    context size of the last request (what the session carries forward)
processed  input tokens summed over all requests (cached or not) — the quota-relevant total
"""
import json, sys, glob, os
for f in sorted(sum((glob.glob(a) for a in sys.argv[1:]), [])):
    init = res = None; wall = None; calls = []; msgs = {}
    for line in open(f):
        try: d = json.loads(line)
        except ValueError: continue
        t = d.get('type')
        if t == 'system' and d.get('subtype') == 'init': init = d
        elif t == 'result': res = d
        elif t == 'bench_wall': wall = d['seconds']
        elif t == 'assistant':
            m = d.get('message', {}); msgs[m.get('id')] = m.get('usage', {})
            for c in m.get('content', []):
                if c.get('type') == 'tool_use': calls.append(c['name'].split('__')[-1])
    name = os.path.basename(f)[:-6]
    if not res: print(name, 'NO RESULT', sep='\t'); continue
    tot = lambda x: x.get('input_tokens', 0) + x.get('cache_creation_input_tokens', 0) + x.get('cache_read_input_tokens', 0)
    ctx = [tot(u) for u in msgs.values()] or [0]
    tools = init.get('tools', []) if init else []
    print(name, f"mcp_tools={sum(t.startswith('mcp__') for t in tools)}", f"requests={len(ctx)}",
          f"start_ctx={ctx[0]}", f"end_ctx={ctx[-1]}", f"processed={tot(res['usage'])}",
          f"output={res['usage']['output_tokens']}", f"wall_s={wall}", f"err={res.get('is_error')}",
          'calls=' + ','.join(calls), 'answer=' + ' '.join(str(res.get('result', '')).split())[:200], sep='\t')
