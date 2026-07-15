#!/usr/bin/env node
import { projectRoot, writeState } from "./lib.mjs";
const root = process.argv[2] || process.env.CURSOR_PROJECT_DIR || process.cwd();
writeState(root, { enabled: true });
console.log(`Build Origin ON in ${root}`);
console.log("Tip: /origin-as mobile  (or desktop|cloud|web) when starting from phone");
