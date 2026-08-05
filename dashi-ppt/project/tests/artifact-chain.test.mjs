import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  sha256File,
  verifyBuildChain,
  verifyExportManifest,
  writeBuildManifest,
  writeExportManifest,
} from '../scripts/workflow/artifact-chain.mjs';
import {
  beginWorkflowStage,
  workflowTelemetryPath,
} from '../scripts/workflow-telemetry.mjs';

const VERIFY_EXPORT_CLI = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../scripts/verify-export-manifest.mjs',
);

function withTempDeck(fn) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'dashi-chain-'));
  try {
    const ppt = path.join(root, 'ppt');
    mkdirSync(ppt, { recursive: true });
    return fn({ root, goalPath: path.join(root, 'goal.json'), deckFile: path.join(ppt, 'index.html') });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function strictGoal(runId) {
  return {
    schemaVersion: 2,
    artifactContract: { version: 1, required: true },
    workflowRunId: runId,
    contentMode: 'creative',
    designMode: 'preset',
    title: 'Test',
    goal: 'Test',
    slides: [],
  };
}

function finishStage(goalPath, runId, stage, metrics = {}) {
  beginWorkflowStage({
    goalPath,
    telemetryFile: workflowTelemetryPath(goalPath),
    runId,
    stage,
    kind: stage,
    command: stage,
  }).finish({ ok: true, metrics });
}

test('legacy HTML without a goal remains inspectable but unverified', () => withTempDeck(({ deckFile }) => {
  writeFileSync(deckFile, '<!doctype html><title>legacy</title>');
  const state = verifyBuildChain({ goalPath: null, deckFile });
  assert.equal(state.strict, false);
  assert.equal(state.identity, 'legacy-unverified');
  assert.deepEqual(state.errors, []);
}));

test('strict artifact contract fails without a build manifest and workflow stages', () => withTempDeck(({ goalPath, deckFile }) => {
  writeFileSync(goalPath, JSON.stringify(strictGoal('run-missing')));
  writeFileSync(deckFile, '<!doctype html><title>strict</title>');
  const state = verifyBuildChain({ goalPath, deckFile });
  assert.ok(state.errors.some(error => error.includes('missing dashi-build.json')));
  assert.ok(state.errors.some(error => error.includes('missing workflow telemetry')));
}));

test('build and quality hashes form a strict pre-export chain', () => withTempDeck(({ goalPath, deckFile, root }) => {
  const runId = 'run-verified';
  writeFileSync(goalPath, JSON.stringify(strictGoal(runId)));
  writeFileSync(deckFile, '<!doctype html><title>strict</title>');
  finishStage(goalPath, runId, 'scaffold');
  const goalSha256 = sha256File(goalPath);
  finishStage(goalPath, runId, 'validate-goal-spec', { goalSha256 });
  const build = writeBuildManifest({ goalPath, deckFile, generatorVersion: 'test' });
  finishStage(goalPath, runId, 'render', {
    goalSha256,
    htmlSha256: build.manifest.htmlSha256,
    buildManifestSha256: build.buildManifestSha256,
  });
  finishStage(goalPath, runId, 'validate-swiss', { htmlSha256: build.manifest.htmlSha256 });
  finishStage(goalPath, runId, 'validate-goal-copy', {
    goalSha256,
    htmlSha256: build.manifest.htmlSha256,
  });

  const built = verifyBuildChain({ goalPath, deckFile });
  assert.equal(built.identity, 'verified-build');
  assert.deepEqual(built.errors, []);

  finishStage(goalPath, runId, 'validate-four-variant-quality', {
    goalSha256,
    htmlSha256: build.manifest.htmlSha256,
    buildManifestSha256: build.buildManifestSha256,
  });
  const ready = verifyBuildChain({ goalPath, deckFile, requireQuality: true });
  assert.equal(ready.identity, 'pre-export-verified');
  assert.deepEqual(ready.errors, []);

  const artifact = path.join(root, 'deck.pptx');
  writeFileSync(artifact, 'pptx-bytes');
  const exportRecord = writeExportManifest({
    state: ready,
    artifactFile: artifact,
    format: 'pptx',
    exporterVersion: 'test',
  });
  assert.equal(exportRecord.manifest.verified, true);
  assert.equal(exportRecord.manifest.artifactSha256, sha256File(artifact));
  finishStage(goalPath, runId, 'export-pptx', {
    goalSha256,
    htmlSha256: build.manifest.htmlSha256,
    artifactSha256: exportRecord.manifest.artifactSha256,
    exportManifestSha256: exportRecord.manifestSha256,
  });

  const delivered = verifyExportManifest({ goalPath, deckFile, artifactFile: artifact });
  assert.equal(delivered.identity, 'delivery-verified');
  assert.deepEqual(delivered.errors, []);

  const cliPass = spawnSync(process.execPath, [VERIFY_EXPORT_CLI, path.dirname(deckFile), artifact], {
    encoding: 'utf8',
  });
  assert.equal(cliPass.status, 0, cliPass.stderr);
  assert.match(cliPass.stdout, /Export manifest verified/);

  writeFileSync(artifact, 'replaced-pptx-bytes');
  const replacedArtifact = verifyExportManifest({ goalPath, deckFile, artifactFile: artifact });
  assert.ok(replacedArtifact.errors.some(error => error.includes('current artifactSha256')));
  const cliFail = spawnSync(process.execPath, [VERIFY_EXPORT_CLI, path.dirname(deckFile), artifact], {
    encoding: 'utf8',
  });
  assert.equal(cliFail.status, 1);
  assert.match(cliFail.stderr, /verification failed/i);
  writeFileSync(artifact, 'pptx-bytes');

  const originalSidecar = readFileSync(exportRecord.file, 'utf8');
  writeFileSync(exportRecord.file, originalSidecar.replace('"verified": true', '"verified": false'));
  const replacedSidecar = verifyExportManifest({ goalPath, deckFile, artifactFile: artifact });
  assert.ok(replacedSidecar.errors.some(error => error.includes('not marked verified')));
  assert.ok(replacedSidecar.errors.some(error => error.includes('no passed export-pptx attempt')));
  writeFileSync(exportRecord.file, originalSidecar);
  assert.deepEqual(verifyExportManifest({ goalPath, deckFile, artifactFile: artifact }).errors, []);

  writeFileSync(deckFile, '<!doctype html><title>changed after quality</title>');
  const stale = verifyBuildChain({ goalPath, deckFile, requireQuality: true });
  assert.ok(stale.errors.some(error => error.includes('HTML changed after Dashi render')));
  assert.ok(stale.errors.some(error => error.includes('does not match current htmlSha256')));
  const replacedHtml = verifyExportManifest({ goalPath, deckFile, artifactFile: artifact });
  assert.ok(replacedHtml.errors.some(error => error.includes('HTML changed after Dashi render')));
  assert.ok(replacedHtml.errors.some(error => error.includes('export manifest does not match current htmlSha256')));
}));
