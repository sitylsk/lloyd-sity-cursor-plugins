# Deploy Clarity Gate

## Honest answer on “Pro only, not free”

Cursor does **not** let marketplace publishers sell plugins or mark them “Pro-only” in the listing.

From [Marketplace Publisher Terms](https://cursor.com/marketplace-publisher-terms):

> Plugin will be made available to Users **at no cost**. You will not charge Users any fees for access to or use of a Plugin through the Marketplace.

### What you *can* rely on

| Plan | Hooks? | Clarity Gate hard block works? |
|---|---|---|
| Hobby (free) | No | **No** — gate cannot run |
| Pro / Pro+ / Ultra | Yes | **Yes** |
| Teams / Enterprise | Yes | **Yes** |

Cursor Pricing: Pro includes **“MCPs, skills, and hooks”**. Hobby does not.

So: publish the plugin for free on the Marketplace → **only Pro+ users get the real product** (the hard gate). Free users can install skills/rules, but the block will not fire.

You **cannot** charge money for a Marketplace plugin. Monetization would be outside Marketplace (Cursor acquires it, Teams distribution, etc.).

## Ways to ship it

### A) Public Marketplace (best for everyone on Pro+)

1. Push `clarity-gate/` to a **public GitHub repo**
2. Submit at [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish)
3. Pass Cursor review (open source, permissive license — MIT already)
4. People install from Customize → Marketplace

### B) Team Marketplace (private company)

- Requires **Teams or Enterprise**
- Admin: Dashboard → Plugins → Import GitHub repo
- Only your org sees it

### C) GitHub / local install (beta)

```powershell
git clone https://github.com/<you>/clarity-gate.git
cd clarity-gate
powershell -ExecutionPolicy Bypass -File .\scripts\install-local.ps1
# then: Developer: Reload Window
```

### D) Acquisition path

- Ship polished open plugin + usage traction
- Pitch Cursor for native send-button Clarity Gate
