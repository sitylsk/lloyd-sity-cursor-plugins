---
name: build-origin-report
description: Regenerate BUILD_ORIGIN.md for GitHub visibility. Use for /build-origin-report.
disable-model-invocation: true
---

# /build-origin-report

1. Run `node "<plugin>/scripts/build-origin-report.mjs" "<workspace>"`
2. Tell the user to commit `BUILD_ORIGIN.md` (and optionally `.cursor/build-origin/ledger.json`) so GitHub shows the split.
