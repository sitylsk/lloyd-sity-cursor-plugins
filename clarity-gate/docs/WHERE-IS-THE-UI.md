# Where is the Clarity Gate UI?

There is **no separate window**.

When Agent is blocked, Cursor shows a **small popup/toast** with a short message, and Clarity Gate also writes the full board to:

```text
.cursor/clarity-gate/RESOLVE_BOARD.md
```

Open that file in the editor — that is the Resolve Board.

## Checklist if you see nothing

1. You are on **Cursor Pro / Pro+ / Ultra / Teams** (Hobby/free does **not** get hooks).
2. Mode is **Agent** (not Ask / chat).
3. You ran **Developer: Reload Window** after install.
4. Prompt is vague, e.g. `fix it`.
5. Check `.cursor/clarity-gate/debug.log` — if empty after send, the hook never fired.
6. Confirm hooks exist in:
   - project: `.cursor/hooks.json`
   - user: `~/.cursor/hooks.json`

## Expected popup text

```text
Clarity Gate blocked this (ambiguity 94/100).
Open: .cursor/clarity-gate/RESOLVE_BOARD.md
Or resend: [clarity:1a,2a,3a] fix it
...
```
