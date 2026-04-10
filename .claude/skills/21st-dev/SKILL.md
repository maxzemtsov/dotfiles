---
name: 21st-dev
description: Search and install shadcn/ui-based React components from 21st.dev registry. Use when user needs UI components, wants to find ready-made React/Tailwind components, or asks to build UI with 21st.dev.
---

# 21st.dev — UI Component Registry & Search

Largest marketplace of shadcn/ui-based React + Tailwind components, blocks, and hooks. Search components via API, install with one command.

For credentials and secrets, use the /op-secrets skill. NEVER accept keys pasted in chat.

## Search Components (API)

Use the 21st search engine to find components by keyword:

```bash
# Search for components
curl -s -X POST https://21st-search-engine.fly.dev/search \
  -H "Content-Type: application/json" \
  -d '{"query": "accordion"}' | jq

# List all indexed files/paths
curl -s -X POST https://21st-search-engine.fly.dev/list \
  -H "Content-Type: application/json" \
  -d '{}' | jq

# Read a specific file from search results
curl -s -X POST https://21st-search-engine.fly.dev/read \
  -H "Content-Type: application/json" \
  -d '{"path": "file/path"}' | jq

# Read specific lines
curl -s -X POST https://21st-search-engine.fly.dev/read \
  -H "Content-Type: application/json" \
  -d '{"path": "file/path", "startLine": 1, "endLine": 50}' | jq
```

### Search modes

| Mode | Description |
|------|-------------|
| `substring` (default) | Substring match |
| `regex` | Regular expression match |

Results: up to 50 items, sorted by path + line number, with 2 lines of context.

## Install Components

Components install via the standard shadcn CLI:

```bash
npx shadcn@latest add "https://21st.dev/r/{username}/{component-slug}"
```

### Examples

```bash
# Install accordion from shadcn
npx shadcn@latest add "https://21st.dev/r/shadcn/accordion"

# Install a button component
npx shadcn@latest add "https://21st.dev/r/shadcn/button"

# Install from community authors
npx shadcn@latest add "https://21st.dev/r/{author}/{component}"
```

The command automatically:
- Creates component files in your project
- Extends Tailwind theme if needed
- Adds global styles
- Installs required dependencies

## Registry URL Format

```
https://21st.dev/r/{username}/{component-slug}
```

Browse components at: https://21st.dev

## Workflow: Find & Install UI Components

1. **Search** for what you need:
   ```bash
   curl -s -X POST https://21st-search-engine.fly.dev/search \
     -H "Content-Type: application/json" \
     -d '{"query": "date picker"}' | jq '.[] | {path, line}'
   ```

2. **Read** the source code to evaluate:
   ```bash
   curl -s -X POST https://21st-search-engine.fly.dev/read \
     -H "Content-Type: application/json" \
     -d '{"path": "found/file/path"}' | jq
   ```

3. **Install** the component:
   ```bash
   npx shadcn@latest add "https://21st.dev/r/{user}/{component}"
   ```

4. **Customize** — edit the installed files in your project (components are fully editable React code)

## 21st Agents SDK (optional)

For building AI-powered chat agents with UI:

```bash
npm install @21st-sdk/agent @21st-sdk/nextjs @21st-sdk/react @21st-sdk/node
```

### CLI commands

```bash
# Login with API key
API_KEY_21ST="$(op read 'op://Claude_Code/21st.dev/Claude Code API key')" \
  npx @21st-sdk/cli login --api-key $API_KEY_21ST

# Deploy an agent
npx @21st-sdk/cli deploy

# Manage env vars for deployed agent
npx @21st-sdk/cli env list my-agent
npx @21st-sdk/cli env set my-agent KEY value
npx @21st-sdk/cli env remove my-agent KEY
```

### Agent project structure

```
agents/
  my-agent/
    agent.ts        # Agent definition (model, tools, systemPrompt)
```

```typescript
import { agent, tool } from "@21st-sdk/agent"
import { z } from "zod"

export default agent({
  model: "claude-sonnet-4-6",
  systemPrompt: "You are a helpful assistant.",
  tools: {
    myTool: tool({
      description: "Does something",
      inputSchema: z.object({ input: z.string() }),
      execute: async ({ input }) => ({
        content: [{ type: "text", text: `Result: ${input}` }],
      }),
    }),
  },
})
```

### React integration

```tsx
import { AgentChat, createAgentChat } from "@21st-sdk/nextjs"
import { useChat } from "@ai-sdk/react"

const chat = createAgentChat({
  agent: "my-agent",
  tokenUrl: "/api/an-token",
})

export default function Page() {
  const props = useChat({ chat })
  return <AgentChat {...props} />
}
```

## Component Stack

- React + TypeScript
- Tailwind CSS
- Radix UI primitives
- shadcn/ui patterns

## References

- Registry: https://21st.dev
- Search engine: https://21st-search-engine.fly.dev/help
- Agents SDK docs: https://21st.dev/agents/docs
- GitHub: https://github.com/serafimcloud/21st
