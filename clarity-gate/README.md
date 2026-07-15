# Clarity Gate

Created by **Lloyd Sity**.

**Block vague Agent prompts before they burn tokens.**

Clarity Gate scores each Agent prompt for ambiguity. If the score is too high, it stops the request and shows a short popup plus a **Resolve Board** file. You pick TARGET / SUCCESS / SCOPE / RISK, resend, then Agent runs.

> No expensive work until the intent is clear.

## Requirements

- **Cursor Pro / Pro+ / Ultra / Teams / Enterprise** (hooks are not available on Hobby/free)
- Node.js 18+

## Install

### Option A — local plugin (recommended)

```bash
git clone https://github.com/REPLACE_ME/clarity-gate.git
```

**Windows (PowerShell):**

```powershell
cd clarity-gate
powershell -ExecutionPolicy Bypass -File .\scripts\install-local.ps1
```

**macOS / Linux:**

```bash
mkdir -p ~/.cursor/plugins/local
ln -sfn "$(pwd)" ~/.cursor/plugins/local/clarity-gate
```

Then in Cursor: **Developer: Reload Window**.

Confirm under **Customize → Plugins** that `clarity-gate` is listed.

### Option B — project hook only

From any repo:

```bash
node /path/to/clarity-gate/scripts/register-project-hook.mjs .
node /path/to/clarity-gate/scripts/clarity-on.mjs .
```

## Where is the UI?

There is **no separate window**. On block you get:

1. A short **popup/toast**
2. Full board at `.cursor/clarity-gate/RESOLVE_BOARD.md` ← open this

See [docs/WHERE-IS-THE-UI.md](docs/WHERE-IS-THE-UI.md).

## Usage

| Action | How |
|---|---|
| Arm | `/clarity-on` |
| Disarm | `/clarity-off` |
| Status | `/clarity-status` |
| Finish board | `/clarify` or open `RESOLVE_BOARD.md` |
| Bypass once | Prepend `[clarity:skip]` |
| Resolved resend | `[clarity:1b,2b,3a] your task…` |

### Try it

1. Agent mode
2. Send: `fix it`
3. Open `.cursor/clarity-gate/RESOLVE_BOARD.md`
4. Resend with picks, e.g. `[clarity:1b,2b,3a] fix login in src/auth.ts — tests must pass`

## Configure

`.cursor/clarity-gate/state.json`:

```json
{
  "enabled": true,
  "threshold": 45,
  "modes": ["agent"],
  "allowFollowUps": true
}
```

Lower `threshold` = stricter.

## How it works

1. `beforeSubmitPrompt` runs `scripts/before-submit.mjs`
2. Heuristic scorer rates ambiguity 0–100
3. Score ≥ threshold in Agent mode → block + Resolve Board
4. Ask mode, follow-ups (`yes`, `lgtm`), and bypass tags pass through
5. Fail-open on script errors

## Smoke test

```bash
node scripts/self-test.mjs
node scripts/cli-score.mjs "fix it"
```

## Deploy / Marketplace

See [docs/DEPLOY.md](docs/DEPLOY.md).

Submit for Cursor Marketplace review: [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish)

## License

MIT · © Lloyd Sity
