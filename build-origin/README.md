# Build Origin

**Know whether a Cursor project was built on desktop, mobile, cloud, web — or a mix.**

Created by **Lloyd Sity**.

Cursor now has mobile apps, but repos still look the same on GitHub. Build Origin tracks Agent/Tab edits by platform and writes a public `BUILD_ORIGIN.md` you can commit so anyone can see the split.

## Requirements

- Cursor **Pro+** (hooks)
- Node.js 18+

## Install

```powershell
# from this folder
powershell -ExecutionPolicy Bypass -File .\scripts\install-local.ps1
```

Reload Cursor window. Then in a project:

```text
/build-origin-on
```

## Easy on / off

| Command | Effect |
|---|---|
| `/build-origin-on` | Start tracking |
| `/build-origin-off` | Stop tracking |
| `/build-origin-status` | Show split |
| `/build-origin-report` | Refresh `BUILD_ORIGIN.md` |
| `/origin-as mobile` | Force this session = mobile |
| `/origin-as desktop` | Force this session = desktop |
| `/origin-as cloud` | Force = Cloud Agent |
| `/origin-as web` | Force = cursor.com/agents |

## Honest detection limits

Cursor does **not always** tell hooks “this prompt came from iOS.” Build Origin:

1. **Auto-detects** when signals exist (`source: iosApp`, cloud/remote env, desktop OS)
2. Lets you **force-tag** with `/origin-as …` (recommended when using the phone)
3. Attributes every Agent/Tab file edit to the active session platform

## GitHub visibility

After you work, commit these files so the report shows on GitHub:

```text
BUILD_ORIGIN.md
.cursor/build-origin/ledger.json   (optional but recommended)
```

Copy the workflow from `github-action/build-origin.yml` into your repo as `.github/workflows/build-origin.yml` to refresh the report on push.

Example verdict in `BUILD_ORIGIN.md`:

```text
## Verdict: `mixed`
| Platform | Edits | % edits |
| desktop  | 40    | 67%     |
| mobile   | 20    | 33%     |
```

## How it works

- `sessionStart` — detect/tag platform, set `BUILD_ORIGIN_PLATFORM`
- `afterFileEdit` / `afterTabFileEdit` — count edits + line work per platform + feature area
- `stop` — refresh `BUILD_ORIGIN.md`

## Smoke test

```bash
node scripts/self-test.mjs
```

## License

MIT · © Lloyd Sity
