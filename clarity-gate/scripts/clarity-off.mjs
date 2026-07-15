#!/usr/bin/env node
import { projectRoot, writeState } from "./lib.mjs";

const root = process.argv[2] || process.env.CURSOR_PROJECT_DIR || process.cwd();
const state = writeState(root, { enabled: false });
console.log(`Clarity Gate OFF in ${root}`);
