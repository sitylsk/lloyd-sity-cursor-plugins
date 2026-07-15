# Example project hooks (replace PLUGIN_ROOT with your clone path, or install via plugins/local)

{
  "version": 1,
  "hooks": {
    "beforeSubmitPrompt": [
      {
        "command": "node \"${CURSOR_PLUGIN_ROOT}/scripts/before-submit.mjs\"",
        "timeout": 8
      }
    ]
  }
}

Note: Prefer installing plugins into ~/.cursor/plugins/local so each plugin's own hooks/hooks.json loads with CURSOR_PLUGIN_ROOT. Project hooks are only a fallback.
