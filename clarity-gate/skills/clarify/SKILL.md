---
name: clarify
description: >-
  Resolve a Clarity Gate block or sharpen a vague task into a Resolve Board.
  Use when the user says /clarify, mentions Clarity Gate blocked them, or asks
  to make a prompt clearer before running Agent.
disable-model-invocation: true
---

# /clarify — Resolve Board

Help the user turn a vague request into a gated, clear prompt.

## Steps

1. Read `.cursor/clarity-gate/last-board.json` if it exists (last blocked prompt + questions).
2. If missing, score the user's latest task yourself using the same dimensions:
   - **TARGET** — where to work
   - **SUCCESS** — what “done” means
   - **SCOPE** — how wide
   - **RISK** — safety posture (only if auth/prod/migrate/delete)
3. Present a compact Resolve Board (2–4 questions, letters a/b/c).
4. Wait for picks. Do **not** start implementing until picks are in.
5. Once picks arrive, restate the locked intent in this form and proceed:

```text
[clarity:resolved]
TARGET: ...
SUCCESS: ...
SCOPE: ...
RISK: ...
---
<original task, sharpened>
```

## Rules

- Prefer asking over guessing when TARGET or SUCCESS is missing.
- Keep the board under 12 lines.
- If the user says `[clarity:skip]` or `/clarity-off`, respect it immediately.
