---
name: clarity-status
description: >-
  Show Clarity Gate status for this workspace (on/off, threshold, last board).
  Use when the user says /clarity-status or asks if Clarity Gate is active.
disable-model-invocation: true
---

# /clarity-status

1. Run: `node "<path-to-plugin>/scripts/clarity-status.mjs" "<workspace-root>"`
2. Summarize enabled, threshold, modes, and last blocked score if any.
3. If a last board exists, offer `/clarify` to finish resolving it.
