#!/usr/bin/env node
import { existsSync } from 'node:fs';
import path from 'node:path';

import {
  deckRootForHtml,
  verifyExportManifest,
} from './workflow/artifact-chain.mjs';

const CALLER_CWD = process.env.INIT_CWD || process.cwd();

main();

function main() {
  const parsed = parseArgs(process.argv.slice(2));
  if (parsed.help) {
    printUsage();
    process.exit(0);
  }
  if (parsed.error || parsed.positional.length !== 2) {
    if (parsed.error) console.error(parsed.error);
    printUsage();
    process.exit(2);
  }

  const [deckArg, artifactArg] = parsed.positional;
  const deckCandidate = path.resolve(CALLER_CWD, deckArg);
  const deckFile = path.extname(deckCandidate).toLowerCase() === '.html'
    ? deckCandidate
    : path.join(deckCandidate, 'index.html');
  const artifactFile = path.resolve(CALLER_CWD, artifactArg);
  const goalPath = parsed.goal
    ? path.resolve(CALLER_CWD, parsed.goal)
    : path.join(deckRootForHtml(deckFile), 'goal.json');
  const manifestFile = parsed.manifest
    ? path.resolve(CALLER_CWD, parsed.manifest)
    : null;

  if (!existsSync(deckFile)) {
    console.error(`Deck index.html not found: ${deckFile}`);
    process.exit(1);
  }

  const result = verifyExportManifest({
    goalPath,
    deckFile,
    artifactFile,
    manifestFile,
  });
  if (result.errors.length) {
    console.error('Export manifest verification failed:');
    for (const error of result.errors) console.error(`- ${error}`);
    console.error('Scope: local workflow consistency only; this is not a digital signature or external trust proof.');
    process.exit(1);
  }

  console.log(`Export manifest verified: ${path.relative(CALLER_CWD, result.artifactFile) || result.artifactFile}`);
  console.log(`Artifact SHA-256: ${result.artifactSha256}`);
  console.log(`HTML SHA-256: ${result.htmlSha256}`);
  console.log(`Workflow run: ${result.workflowRunId}`);
  console.log('Scope: local workflow consistency only; this is not a digital signature or external trust proof.');
}

function parseArgs(argv) {
  const result = {
    positional: [],
    goal: null,
    manifest: null,
    help: false,
    error: null,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      result.help = true;
    } else if (arg === '--goal' || arg === '--manifest') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        result.error = `${arg} requires a path`;
        return result;
      }
      result[arg.slice(2)] = value;
      index += 1;
    } else if (arg.startsWith('--')) {
      result.error = `Unknown option: ${arg}`;
      return result;
    } else {
      result.positional.push(arg);
    }
  }
  return result;
}

function printUsage() {
  console.error('Usage:');
  console.error('  node scripts/verify-export-manifest.mjs <deck-ppt-dir|index.html> <artifact.pptx|artifact.pdf> [--goal <goal.json>] [--manifest <sidecar.json>]');
  console.error('  npm run verify:export-manifest -- <deck-ppt-dir> <artifact.pptx|artifact.pdf>');
}
