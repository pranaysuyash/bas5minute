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

### Shared Idea Pad Protocol (Required)

- Canonical file: `/Users/pranay/Projects/idea_pad/IDEA_PAD.md`
- Raw capture file: `/Users/pranay/Projects/idea_pad/IDEA_DUMP.md`
- Do not create per-model primary copies of the idea pad.
- Do not overwrite the whole file; use append/update workflow with validation.
- Capture rough ideas in `IDEA_DUMP.md`, then promote high-signal items into `IDEA_PAD.md`.
- Before edits:

```bash
python3 /Users/pranay/Projects/idea_pad/scripts/idea_pad_tool.py validate
```

- Add new ideas safely:

```bash
python3 /Users/pranay/Projects/idea_pad/scripts/idea_pad_tool.py add --title "<title>" --owner "<agent>" --type build
```

- After updates, refresh shared memory index:

```bash
cd /Users/pranay/Projects
./projects-memory index
```

<!-- PROJECTS_MEMORY_AGENT_ALIGNMENT_END -->

## ⚠️ Skills Discovery Protocol (CRITICAL)

**Agents: DO NOT default to using `.claude` skills or `gstack`.** We have an extensive skills ecosystem across multiple locations.

### Complete Skills Reference

For a complete catalog of ALL available skills across the workspace, see:
**`/Users/pranay/Projects/SKILLS_CATALOG.md`**

### Check ALL Skills Locations (in order)

1. `~/.claude/skills/*/` — ~72 skills (Claude Code)
2. `~/.agents/skills/*/` — ~98 skills (includes Azure/Marketing)
3. `~/Projects/skills/*/` — **47 skills (most curated, engineering focus, often missed!)**
4. `~/Projects/external-skills/*/` — 2,898+ community skills
5. `~/Projects/openai-skills/` — OpenAI Codex skills (official standard repo copy)
6. `$CODEX_HOME/skills/*/` — Codex runtime-installed skills (when CODEX_HOME is set)
7. `~/.codex/skills/*/` — Codex local saved skills (default path)
8. `~/.codex/skills/.system/*/` — Codex app bundled/system skills (read-only baseline)

**gstack is NOT your primary testing tool.** Use specialized alternatives instead:

- For browser testing: `browse` skill (faster)
- For QA: `qa` or `qa-only` skills (systematic)
- For E2E: `webapp-testing` or `e2e-testing` skills (comprehensive)
- For debugging: `systematic-debugging` skill (methodology)

See `/Users/pranay/Projects/SKILLS_CATALOG.md` for complete skills reference.

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

| File                          | Purpose                             |
| ----------------------------- | ----------------------------------- |
| `app/page.tsx`                | Main homepage with map app          |
| `contexts/MapContext.tsx`     | Global state management             |
| `components/MapView.tsx`      | Interactive map component           |
| `components/ControlPanel.tsx` | Main control UI                     |
| `lib/api.ts`                  | External API calls (ORS, geocoding) |
| `lib/themes.ts`               | 4 color themes                      |
| `lib/captions.ts`             | 50+ caption library                 |
| `types/index.ts`              | All TypeScript types                |

## Known Issues

All issues resolved. The application is production-ready.

## Production Readiness Checklist

- [x] API key security (ORS_API_KEY server-only)
- [x] robots.txt
- [x] sitemap.xml
- [x] Rate limiting on API routes
- [x] Zod validation for all inputs
- [x] Error boundary (app/error.tsx)
- [x] Health check endpoint (/api/health)
- [x] Security headers (vercel.json)
- [x] GitHub Actions CI/CD
- [x] Test framework (Vitest, 31 tests)

## Test Framework

Vitest is configured. Run tests with:

```bash
npm test           # Run tests once
npm run test:watch # Watch mode
```

## New Features Added

### License System

- License activation via `/api/license/activate`
- License management in ControlPanel (Advanced Options)
- License types: personal, commercial, enterprise
- Test keys: `B5M-TEST-PERS-ONAL`, `B5M-TEST-COMME-RCIAL`, `B5M-TEST-ENTE-RPRISE`

### Print Stylization

New finish styles added:

- `isometric` - Vibrant 3D-style colors
- `watercolor` - Soft artistic paper look
- `neon-glow` - Cyberpunk aesthetic

### Road Network

- `/api/road-network` - Fetch OSM road data
- `RoadNetworkPanel` component - Visualize road hierarchy
- `/api/road-network/route` - Route calculation with road names

### Custom Isochrone

- `/api/isochrone/custom` - Build isochrones from raw OSM data
- Uses Dijkstra's algorithm on road graph
- No external API required

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
