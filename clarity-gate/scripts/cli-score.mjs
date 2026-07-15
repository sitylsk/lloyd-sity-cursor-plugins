#!/usr/bin/env node
/**
 * CLI smoke harness: node scripts/cli-score.mjs "your prompt"
 */
import { scorePrompt, buildResolveBoard, formatBoardMarkdown, isBypassPrompt, isFollowUp } from "./score.mjs";

const prompt = process.argv.slice(2).join(" ") || "fix it";
if (isBypassPrompt(prompt)) {
  console.log("BYPASS");
  process.exit(0);
}
if (isFollowUp(prompt)) {
  console.log("FOLLOW_UP");
  process.exit(0);
}
const analysis = scorePrompt(prompt, []);
console.log(JSON.stringify(analysis, null, 2));
if (analysis.score >= 45) {
  console.log("\n--- Resolve Board ---\n");
  console.log(formatBoardMarkdown(buildResolveBoard(analysis, prompt)));
}
