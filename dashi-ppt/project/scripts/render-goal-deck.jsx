#!/usr/bin/env node
import { scrubLocalPaths } from './scrub-local-paths.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { composeDeck } from '../src/deckComposer.jsx';
import { renderDeck } from '../src/renderDeck.jsx';
import { validateGoalSpec } from './validate-goal-spec.mjs';
import {
  beginWorkflowStage,
  workflowTelemetryPath,
} from './workflow-telemetry.mjs';
import {
  sha256File,
  writeBuildManifest,
} from './workflow/artifact-chain.mjs';

// 相对路径按调用方目录解析:npm run(含 --prefix)会把脚本 cwd 切到项目根,INIT_CWD 才是用户所在目录。
const CALLER_CWD = process.env.INIT_CWD || process.cwd();

const cli = parseCliArgs(process.argv.slice(2));
const { specArg, outArg } = cli;

if (!specArg || !outArg) {
  console.error('Usage: npm run render:goal -- <goal-spec.json> <output/ppt/index.html> [--require-source-bound] [--require-reference-bound]');
  process.exit(2);
}

const specPath = path.resolve(CALLER_CWD, specArg);
const outFile = path.resolve(CALLER_CWD, outArg);
const renderTelemetry = beginWorkflowStage({
  goalPath: specPath,
  telemetryFile: workflowTelemetryPath(specPath),
  stage: 'render',
  kind: 'render',
  command: 'render:goal',
});

try {
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const goalSha256 = sha256File(specPath);
  const validationTelemetry = beginWorkflowStage({
    goalPath: specPath,
    telemetryFile: workflowTelemetryPath(specPath),
    stage: 'validate-goal-spec',
    kind: 'validate',
    command: 'validate:goal-spec',
  });
  const specErrors = validateGoalSpec(spec, {
    requireSourceBound: cli.requireSourceBound,
    requireReferenceBound: cli.requireReferenceBound,
  });
  if (specErrors.length) {
    const error = new Error(`Goal spec validation failed: ${specErrors.join('; ')}`);
    validationTelemetry.finish({ ok: false, error });
    renderTelemetry.finish({ ok: false, error });
    console.error('Goal spec validation failed:');
    for (const specError of specErrors) console.error(`- ${scrubLocalPaths(specError)}`);
    process.exit(1);
  }
  validationTelemetry.finish({ ok: true, metrics: { goalSha256 } });
  const deck = composeDeck(spec);

  renderDeck(deck, { outFile });
  copyGoalSpec(specPath, outFile);
  const generatorVersion = JSON.parse(fs.readFileSync(path.join(path.resolve(import.meta.dirname, '..'), 'package.json'), 'utf8')).version;
  const build = writeBuildManifest({ goalPath: specPath, deckFile: outFile, generatorVersion });
  renderTelemetry.finish({
    ok: true,
    metrics: {
      goalSha256,
      htmlSha256: build.manifest.htmlSha256,
      buildManifestSha256: build.buildManifestSha256,
    },
  });
  console.log(`Rendered ${deck.slides.length} slide(s): ${displayPath(outFile)}`);
} catch (error) {
  renderTelemetry.finish({ ok: false, error });
  console.error(`Could not render goal deck: ${scrubLocalPaths(error?.message || error)}`);
  process.exit(1);
}

function copyGoalSpec(from, to) {
  const outDir = path.dirname(to);
  const deckDir = path.basename(outDir) === 'ppt' ? path.dirname(outDir) : outDir;
  const target = path.join(deckDir, 'goal.json');
  fs.mkdirSync(deckDir, { recursive: true });
  if (path.resolve(from) !== path.resolve(target)) {
    fs.copyFileSync(from, target);
  }
}

function displayPath(file) {
  const relative = path.relative(CALLER_CWD, file);
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative) ? relative : path.basename(file);
}

function parseCliArgs(argv) {
  const positional = [];
  const parsed = { requireSourceBound: false, requireReferenceBound: false };
  for (const arg of argv) {
    if (arg === '--require-source-bound') {
      parsed.requireSourceBound = true;
    } else if (arg === '--require-reference-bound') {
      parsed.requireReferenceBound = true;
    } else if (arg.startsWith('-')) {
      console.error(`Unknown option: ${arg}`);
      process.exit(2);
    } else {
      positional.push(arg);
    }
  }
  [parsed.specArg, parsed.outArg] = positional;
  return parsed;
}
