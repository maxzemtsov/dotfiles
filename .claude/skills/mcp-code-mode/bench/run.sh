#!/bin/zsh
# Benchmark harness for the mcp-code-mode skill. Runs headless Claude Code on the
# subscription (no API key) and records token usage per run.
#   run.sh <label> <mcp-config.json> <tool-search: on|off> <allowed tools> <prompt>
# Output: $BENCH_OUT/<label>.jsonl  (stream-json; summarise with summarize.py)
set -u
label=$1; cfg=$2; ts=$3; allowed=$4; prompt=$5
out=${BENCH_OUT:-$PWD/out}; work=${BENCH_CWD:-$out/cwd}
mkdir -p "$out" "$work"; cd "$work"
[[ $ts == off ]] && export ENABLE_TOOL_SEARCH=false || unset ENABLE_TOOL_SEARCH
unset ANTHROPIC_API_KEY ANTHROPIC_AUTH_TOKEN
start=$(date +%s)
claude -p "$prompt" --model "${BENCH_MODEL:-sonnet}" --output-format stream-json --verbose \
  --strict-mcp-config --mcp-config "$cfg" --allowedTools "$allowed" > "$out/$label.jsonl" 2> "$out/$label.err"
echo "{\"type\":\"bench_wall\",\"seconds\":$(( $(date +%s) - start ))}" >> "$out/$label.jsonl"
