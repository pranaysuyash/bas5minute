# Bas 5 Minute - Development Guide

<!-- PROJECTS_MEMORY_AGENT_ALIGNMENT_BEGIN -->

## Projects-Level Agent Alignment (Workspace Memory)

**Purpose:** ensure any agent/LLM (Codex, Copilot, Claude Code, Qwen, GLM, etc.) starts aligned with the same workspace memory + project context.

### Step 0 (first time in this folder)
Generate the per-project context pack:
```bash
/Users/pranay/Projects/agent-start
```

### Step 1 (per shell)
Load the shared defaults for this project session:
```bash
source .agent/STEP1_ENV.sh
# Or (no file read) print exports and eval:
/Users/pranay/Projects/agent-start --print-step1 --skip-index
```

### Step 2 (generate aligned context pack)
```bash
/Users/pranay/Projects/agent-start
```

Outputs:
- `.agent/SESSION_CONTEXT.md`
- `.agent/AGENT_KICKOFF_PROMPT.txt`
- `.agent/STEP1_ENV.sh`

### Automation (already configured)
- Terminal auto-loads `.agent/STEP1_ENV.sh` when you `cd` into a project under `/Users/pranay/Projects` (zsh hook).
- VS Code/Antigravity can run `agent-start --skip-index` on folder open via `.vscode/tasks.json`.

### How agents should use this
- Provide `.agent/AGENT_KICKOFF_PROMPT.txt` and `.agent/SESSION_CONTEXT.md` as the first context for the agent.
- If sources conflict, the agent must cite concrete file paths and ask before proceeding.
- If `.agent` files are missing or stale, run `/Users/pranay/Projects/agent-start --skip-index` before planning changes.
- Do not start implementation until `.agent/AGENT_KICKOFF_PROMPT.txt` and `.agent/SESSION_CONTEXT.md` are loaded.

### Optional commit safety net
Install repo-local git pre-commit hooks that refresh and stage `.agent/*` before commit:
```bash
python3 /Users/pranay/Projects/workspace_memory/scripts/install_git_precommit_agent_hook.py
```

<!-- PROJECTS_MEMORY_AGENT_ALIGNMENT_END -->

## Quick Commands

```bash
# Development
npm run dev          # Start dev server (port 5111)
npm run build        # Production build
npm run lint         # ESLint check
npm start            # Start production server

# Type checking
npx tsc --noEmit     # TypeScript check without emit
```

## Project Overview

**Bas 5 Minute** is a Next.js 14 application that creates isochrone maps showing how far you can travel in X minutes from any location in India. It humorously contrasts the Indian phrase "Bas 5 Minute" (just 5 minutes) with travel reality.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS
- **State:** React Context (`contexts/MapContext.tsx`)
- **Maps:** react-map-gl + Mapbox GL JS (or MapLibre)
- **Payments:** Stripe
- **AI:** Anthropic Claude / OpenAI

## Key Directories

```
app/           → Pages and API routes (Next.js App Router)
components/    → React components
contexts/      → React Context providers (MapContext)
lib/           → Utility libraries (api, themes, captions, filters, etc.)
types/         → TypeScript type definitions
```

## Important Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Main homepage with map app |
| `contexts/MapContext.tsx` | Global state management |
| `components/MapView.tsx` | Interactive map component |
| `components/ControlPanel.tsx` | Main control UI |
| `lib/api.ts` | External API calls (ORS, geocoding) |
| `lib/themes.ts` | 4 color themes |
| `lib/captions.ts` | 50+ caption library |
| `types/index.ts` | All TypeScript types |

## Known Issues (Fix These First)

1. **AI endpoint hardcoded to localhost:3010** in `components/AIFeaturesPanel.tsx:33`
   - Change to relative URL `/api/ai/caption`

2. **Isochrone API hardcoded to localhost:3010** in `lib/api.ts:26`
   - Need backend proxy or use ORS API directly with CORS handling

3. **Sticker buttons non-functional** in `components/AIFeaturesPanel.tsx`
   - Need to implement sticker placement state and canvas rendering

4. **Filters not applied to export** in `components/AIFeaturesPanel.tsx`
   - Filter selection state not connected to export pipeline

5. **Order form only logs to console** in `app/order/page.tsx`
   - Need backend endpoint for order submission

## Environment Variables

Required:
```env
NEXT_PUBLIC_MAPBOX_TOKEN=xxx      # OR use NEXT_PUBLIC_MAPTILER_KEY
NEXT_PUBLIC_ORS_API_KEY=xxx       # OpenRouteService
```

Optional:
```env
ANTHROPIC_API_KEY=xxx             # AI captions
OPENAI_API_KEY=xxx                # Fallback AI
STRIPE_SECRET_KEY=xxx             # Payments
NEXT_PUBLIC_GA_ID=xxx             # Analytics
```

## Code Conventions

- Use TypeScript strict mode
- Follow existing component patterns
- Use Tailwind for styling (no inline styles)
- Use React Context for global state
- Keep components in `components/` folder
- Keep utilities in `lib/` folder
- All types go in `types/index.ts`

## Testing

No test framework currently configured. When adding tests:
- Consider Vitest or Jest
- Add `npm test` script
- Focus on API routes and utility functions first

## Documentation

See `DOCUMENTATION_INDEX.md` for complete docs:
- `README.md` - Project overview
- `TECHNICAL_DOCS.md` - Technical reference
- `UX_AUDIT.md` - UX/UI critique
- `FEATURE_IDEAS.md` - Feature roadmap
