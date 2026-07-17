---
name: clarity-roi
description: >-
  Show Clarity Gate ROI for this workspace (estimated tokens and $ saved,
  prompts blocked, and how often blocked prompts were clarified vs bypassed).
  Use when the user says /clarity-roi or asks whether Clarity Gate is worth it
  / how much it has saved.
disable-model-invocation: true
---

# /clarity-roi

1. Run: `node "<path-to-plugin>/scripts/clarity-roi.mjs" "<workspace-root>"`
2. Summarize estimated tokens saved, estimated $ saved, prompts blocked, and
   the comply rate (clarified vs bypassed).
3. Mention the refreshed report at `.cursor/clarity-gate/CLARITY_ROI.md` and that
   committing it makes the savings visible on GitHub.
4. Be honest that the token figure is a conservative estimate, not a measured value.
