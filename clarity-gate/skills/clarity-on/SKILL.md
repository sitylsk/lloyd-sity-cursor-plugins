---
name: clarity-on
description: >-
  Enable Clarity Gate for this workspace so vague Agent prompts are blocked
  with a Resolve Board. Use when the user says /clarity-on or wants the gate armed.
disable-model-invocation: true
---

# /clarity-on

Enable Clarity Gate in the current workspace.

1. Run: `node "<path-to-plugin>/scripts/clarity-on.mjs" "<workspace-root>"`
   - Plugin path is typically `~/.cursor/plugins/local/clarity-gate` or the repo checkout.
2. Confirm: enabled=true, show threshold (default 45).
3. Tell the user: Agent prompts scoring ≥ threshold will show a Resolve Board before any model call.
