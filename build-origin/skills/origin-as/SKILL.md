---
name: origin-as
description: Force this session's build platform to desktop, mobile, cloud, or web. Use for /origin-as.
disable-model-invocation: true
---

# /origin-as

Force platform tagging for the current session.

1. Read the user's choice: `desktop`, `mobile`, `cloud`, or `web`.
2. Run `node "<plugin>/scripts/origin-as.mjs" "<platform>" "<workspace>"`
3. Confirm future edits in this session count toward that platform.

Examples:
- `/origin-as mobile` — you are driving from Cursor iOS / phone
- `/origin-as desktop` — local Cursor IDE
- `/origin-as cloud` — Cloud Agent
- `/origin-as web` — cursor.com/agents in browser
