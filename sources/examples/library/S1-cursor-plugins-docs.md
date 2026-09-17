---
id: S1
title: Plugins
url: https://cursor.com/docs/plugins
retrieved: 2026-09-17
publisher: Cursor
tags: [cursor, plugins, marketplace]
---

Fetched 2026-09-17. Notes from the page:

"Plugins package rules, skills, agents, commands, MCP servers, and hooks into distributable bundles."

Component table: Rules are "Persistent AI guidance and coding standards (`.mdc` files)" and are listed as available in Cursor Plugins. Skills are available in both formats. Agents, commands, and hooks are listed as Cursor Plugins. MCP servers are listed as both formats.

"Cursor Plugins: plugins with a `.cursor-plugin/plugin.json` manifest, which add rules, agents, commands, hooks, and variables"

"Cursor Plugin manifests only require a `name`. Components are discovered from their default directories, or you can specify custom paths in the manifest."

"The Cursor Marketplace is where you discover and install official Cursor Plugins. Plugins are distributed as Git repositories and submitted through the Cursor team."

"Every plugin is manually reviewed before it's listed."

Local test: put the plugin in `~/.cursor/plugins/local`, then "Restart Cursor, or run Developer: Reload Window." Then "Open Customize and confirm the plugin components you expect".

"When your plugin is ready, submit it for review at cursor.com/marketplace/publish."

"Cursor Plugins can use `.cursor-plugin/marketplace.json` for multi-plugin repositories."

Team marketplaces: "Use this flow to import a GitHub repository as a team marketplace" via Dashboard -> Plugins.
