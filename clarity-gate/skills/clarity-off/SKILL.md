---
name: clarity-off
description: >-
  Disable Clarity Gate for this workspace. Use when the user says /clarity-off
  or wants unrestricted Agent prompts.
disable-model-invocation: true
---

# /clarity-off

Disable Clarity Gate in the current workspace.

1. Run: `node "<path-to-plugin>/scripts/clarity-off.mjs" "<workspace-root>"`
2. Confirm: enabled=false.
3. Remind: one-shot bypass is still available later via `[clarity:skip]` after re-enabling.
