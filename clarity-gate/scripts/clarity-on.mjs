#!/usr/bin/env node
import { projectRoot, writeState, emit } from "./lib.mjs";

const root = process.argv[2] || process.env.CURSOR_PROJECT_DIR || process.cwd();
const state = writeState(root, { enabled: true });
console.log(`Clarity Gate ON (threshold ${state.threshold}) in ${root}`);
