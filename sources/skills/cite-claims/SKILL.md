---
name: cite-claims
description: >-
  Review a draft and attach one .sources/ library citation per factual claim.
  Flag or refuse unsourced claims. Use when the user asks to cite this, add
  sources, or check a post/doc/brief for missing citations.
---

# Cite claims

Force citation discipline on existing text. The library is `.sources/` in the user's project.

## When to use

- User pastes or points at a draft and wants citations
- User says “cite this”, “add sources”, or “what is unsourced?”
- After `draft-from-library`, as a second pass

## Steps

1. **Load the library.** Read `.sources/index.md`. If it is missing or empty, stop: tell the user to run `save-research` first. Do not browse the web to invent a library.
2. **Open the notes** you may need (`.sources/notes/<note-id>.md`). Prefer notes whose claims/tags match the draft.
3. **Split the draft into claims.** A claim is a sentence (or clause) that asserts a fact: a number, a name, an outcome, a quote, or an attributed position. Skip:
   - Opinions and recommendations
   - Process / how-to steps that are not sourced facts
   - Questions and headings
4. **Match each claim** to a library note. A match is valid only when the note actually supports that claim (same fact, not merely the same topic).
5. **Rewrite** the draft:
   - After each supported claim, add ` [S:<note-id>]`
   - After each unsupported factual claim, add ` [UNCITED]` and keep the sentence visible so the user can delete it, rephrase it as opinion, or save a source
6. **Append a Sources list** that resolves every `[S:<note-id>]` used:

   ```markdown
   ## Sources

   - [S:<note-id>] — <title> — <locator or unknown> — `.sources/notes/<note-id>.md`
   ```

7. **Report a tally:** cited claims, `[UNCITED]` claims, notes used. If any `[UNCITED]` remain, say the draft is not ready to publish as factual.

## Matching rules

- Topic overlap is not enough. “A note about climate” does not support a specific ppm figure unless that figure is in the note.
- If two notes support the same claim, cite the more specific one (or both).
- Quotes must match the note’s wording (or a clearly marked paraphrase).
- Never attach a citation to make a claim look sourced when the note does not contain it.

## Refuse / flag

- Do **not** silently drop `[UNCITED]` markers to “clean up” the draft.
- Do **not** fetch or invent sources to clear flags unless the user provides material and you save it with `save-research` first.
- If the user asks you to publish or finalize while `[UNCITED]` factual claims remain, refuse that finish line. Offer: delete the claim, mark it as opinion, or save a source.

## Output

Return the full marked-up draft (or edit the file they named). Keep their voice. Citation markers are the only required additions besides the Sources list.
