# Tools

## `validation-matrix.mjs`

End-to-end validation runner for Bas 5 Minute.

### What it validates

- API health and core routes (`/api/health`, isochrone providers, AI caption providers, order/license/payment flows)
- UI generation flow and provider radio selection
- Export formats and finish-style selection
- Static code assertions for critical regressions (for example hardcoded map-provider behavior)

### Usage

1. Start app locally on default port:

```bash
npm run dev
```

2. Run validator:

```bash
node tools/validation-matrix.mjs
```

3. Optional custom base URL:

```bash
BASE_URL=http://localhost:5111 node tools/validation-matrix.mjs
```

4. Optional strict mode (treat all failures as blocking):

```bash
VALIDATION_STRICT=1 node tools/validation-matrix.mjs
```

### Artifacts

- `tools/validation-home.png`: full-page screenshot taken during validation.

### Notes

- Browser checks require Playwright Chromium:

```bash
npx playwright install chromium
```

- Environment-dependent checks are reported as `SKIP` when capabilities are not configured (for example missing provider credentials).
