---
name: cite-check
description: >-
  Check a post, doc, or brief so every factual claim cites the Sources library.
  Use when the user says /cite-check, asks if a draft is sourced, or a write-up
  is about to ship.
---

# /cite-check — citation per claim

Fail a draft that states facts without a supporting library id.

## Steps

1. Target, in order: the user’s selection, a path they named, the latest file under `.cursor/sources/drafts/`, or the prose they just pasted.
2. Load `.cursor/sources/INDEX.md` and every cited `library/S*.md`. If the index is missing, fail: nothing is citable yet.
3. Split the draft into sentences. Classify each as:
   - **Claim** — asserts a fact about the world, a product, a date, a quote, or a number
   - **Framing** — opinion, question, transition, or instruction
4. For each **claim**:
   - Require `[S#]` or `[S#, S#]` immediately after it (or the same sentence).
   - `[needs-source]` counts as an explicit fail for that claim, not a pass.
   - Unknown ids are a fail.
   - Open the library file and confirm the entry actually supports that sentence (same work, not a stretched reading).
5. Write `.cursor/sources/CITE_CHECK.md`:

```markdown
# Cite check

**Verdict:** pass | fail
**Draft:** <path or "chat">

| # | Claim (short) | Citation | Result |
|---|---|---|---|
| 1 | … | S1 | pass |
| 2 | … | — | fail — no citation |
| 3 | … | S9 | fail — id missing |
| 4 | … | S1 | fail — source does not support claim |
```

6. Tell the user the verdict. On fail, list only the failing claims and the next action (`save-source` or rewrite). Do not silently add citations.

## Rules

- Inventing a source to clear the check is a fail.
- Quotes must appear in the cited library file.
- Numbers, names, and “X supports Y” need a source that says so.
- Framing lines can be unmarked.
- Do not rewrite the whole draft unless the user asked; this skill reports.
