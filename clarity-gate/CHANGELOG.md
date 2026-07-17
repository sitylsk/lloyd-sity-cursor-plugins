# Changelog

## 1.1.0 — 2026-07-17

- ROI tracking: every block estimates the tokens a vague Agent turn would have
  wasted (conservative, score- and missing-field-weighted) and persists it
- New `/clarity-roi` command + skill; writes a GitHub-visible
  `.cursor/clarity-gate/CLARITY_ROI.md` (tokens/$ saved, blocks, comply rate)
- `/clarity-status` now shows a quick ROI summary
- Block popup now shows tokens saved on each block
- Tracks comply rate: clarified-and-resent vs `[clarity:skip]` bypasses
- Configurable `usdPerMillionTokens` in state for the $ estimate

## 1.0.0 — 2026-07-15

- Initial release
- `beforeSubmitPrompt` hard gate with ambiguity scorer
- Resolve Board UX (TARGET / SUCCESS / SCOPE / RISK)
- Bypass: `[clarity:skip]`, `[clarity:resolved]`, compact picks
- Commands/skills: `/clarify`, `/clarity-on`, `/clarity-off`, `/clarity-status`
- Soft always-on rule for slipped prompts
- Fail-open on script errors; Agent-mode only by default
