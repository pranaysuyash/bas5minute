# Validation Report (2026-05-11)

## Commands run

1. `npm test`
2. `npm run lint`
3. `npm run build`
4. `node tools/validation-matrix.mjs`

## Current outcome snapshot

- Core tests/lint/build pass in local environment.
- Validation matrix verifies API/UI/export paths and emits explicit PASS/FAIL/WARN records.

## Important environment-dependent failures observed

1. `ai/caption:openai`: quota error (HTTP 429).
2. `ai/caption:anthropic`: invalid key (HTTP 401).
3. `isochrone/backend`: `BACKEND_API_URL` not configured.

These are configuration/credential issues, not compile-time failures.

## Regression guardrails added

1. Validation script includes static assertion for hardcoded map-provider regressions.
2. Map provider behavior is now centralized in `lib/mapProviders.ts`.
3. `tools/README.md` documents repeatable validation usage for future agents.
