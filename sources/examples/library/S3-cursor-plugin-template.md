---
id: S3
title: Cursor plugin template
url: https://github.com/cursor/plugin-template
retrieved: 2026-09-17
publisher: cursor/plugin-template
tags: [cursor, template, marketplace]
---

Fetched 2026-09-17 from https://raw.githubusercontent.com/cursor/plugin-template/main/README.md (same content as the repository README).

"Build and publish Cursor Marketplace plugins from a single repo."

"Two starter plugins are included:"

- "**starter-simple**: rules and skills only"
- "**starter-advanced**: rules, skills, agents, commands, hooks, MCP, and scripts"

"This template defaults to **multi-plugin** (multiple plugins in one repo)."

"For a **single plugin**, move your plugin folder contents to the repository root, keep one `.cursor-plugin/plugin.json`, and remove `.cursor-plugin/marketplace.json`."

Getting started tells you to customize `.cursor-plugin/marketplace.json` and `plugins/*/.cursor-plugin/plugin.json`, including `name` (lowercase kebab-case), `author`, `description`, `keywords`, `license`, and `version`.

Submission checklist on this README:

- "Each plugin has a valid `.cursor-plugin/plugin.json`."
- "Plugin names are unique, lowercase, and kebab-case."
- "`.cursor-plugin/marketplace.json` entries map to real plugin folders."
- "All frontmatter metadata is present in rule, skill, agent, and command files."
- "Logos are committed and referenced with relative paths."
- "`node scripts/validate-template.mjs` passes."
