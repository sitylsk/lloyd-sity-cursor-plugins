#!/usr/bin/env node
import { writeState } from "./lib.mjs";
const root = process.argv[2] || process.env.CURSOR_PROJECT_DIR || process.cwd();
writeState(root, { enabled: false });
console.log(`Build Origin OFF in ${root}`);
