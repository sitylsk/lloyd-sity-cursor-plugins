# What belongs in a Cursor Plugin

A short brief for adding a plugin to a Cursor marketplace repo. Facts below are limited to the saved library.

## Bundle and format

A plugin can package rules, skills, agents, commands, MCP servers, and hooks.[S1] Cursor Plugins keep their manifest at `.cursor-plugin/plugin.json`.[S1][S2] That manifest only requires a `name`; other fields and component paths are optional.[S1][S2] The `name` must be lowercase kebab-case, using alphanumerics, hyphens, and periods, and it must start and end with an alphanumeric character.[S2]

## Default folders

If the manifest does not override paths, Cursor discovers skills in `skills/` (each folder with a `SKILL.md`), rules in `rules/`, and commands in `commands/`.[S2] Rules are `.mdc` guidance files and need YAML frontmatter that can include `description`, `alwaysApply`, and `globs`.[S1][S2] Skills need frontmatter `name` and `description`.[S2] Commands may include the same two frontmatter fields.[S2]

## Official starters

The official template ships two starters: **starter-simple** (rules and skills only) and **starter-advanced** (rules, skills, agents, commands, hooks, MCP, and scripts).[S3] That template defaults to a multi-plugin repo.[S3] For a single-plugin repo, the template says to move the plugin files to the repository root, keep one `.cursor-plugin/plugin.json`, and remove `.cursor-plugin/marketplace.json`.[S3]

## Multi-plugin marketplace

A repo can list several plugins in `.cursor-plugin/marketplace.json` at the repository root.[S1][S2] Each marketplace `source` is a folder path; the parser then looks for `<folder>/.cursor-plugin/plugin.json`.[S2] Marketplace entries must point at real plugin folders, and plugin names must be unique.[S3]

## Ship and submit

Commit a logo and reference it with a relative path such as `assets/logo.svg`.[S2][S3] Include a `README.md` that documents usage.[S2] Test locally by placing the plugin under `~/.cursor/plugins/local` and running Developer: Reload Window, then confirm components under Customize.[S1] Official listing is a Git-repo submit through the Cursor team; every listed plugin is manually reviewed.[S1] The public submit URL is cursor.com/marketplace/publish.[S1][S2]

## Sources

- **[S1]** Plugins — https://cursor.com/docs/plugins
- **[S2]** Plugins reference — https://cursor.com/docs/reference/plugins
- **[S3]** Cursor plugin template — https://github.com/cursor/plugin-template
