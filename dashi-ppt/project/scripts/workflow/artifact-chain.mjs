import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';

import {
  readWorkflowTelemetry,
  workflowTelemetryPath,
} from '../workflow-telemetry.mjs';

export const ARTIFACT_CONTRACT_VERSION = 1;
export const BUILD_MANIFEST_NAME = 'dashi-build.json';
export const EXPORT_MANIFEST_SUFFIX = '.dashi-export.json';

export function sha256File(file) {
  return createHash('sha256').update(readFileSync(path.resolve(file))).digest('hex');
}

export function deckRootForHtml(deckFile) {
  const html = path.resolve(deckFile);
  const parent = path.dirname(html);
  return path.basename(parent).toLowerCase() === 'ppt' ? path.dirname(parent) : parent;
}

export function buildManifestPathForHtml(deckFile) {
  return path.join(deckRootForHtml(deckFile), BUILD_MANIFEST_NAME);
}

export function exportManifestPathForArtifact(artifactFile) {
  return `${path.resolve(artifactFile)}${EXPORT_MANIFEST_SUFFIX}`;
}

export function isStrictArtifactGoal(goal) {
  return goal?.artifactContract?.version === ARTIFACT_CONTRACT_VERSION
    && goal?.artifactContract?.required === true;
}

export function writeBuildManifest({ goalPath, deckFile, generatorVersion }) {
  const goal = JSON.parse(readFileSync(path.resolve(goalPath), 'utf8'));
  const goalSha256 = sha256File(goalPath);
  const htmlSha256 = sha256File(deckFile);
  const manifest = {
    schemaVersion: 1,
    producer: 'dashi-ppt',
    generatorVersion: String(generatorVersion || 'unknown'),
    workflowRunId: String(goal?.workflowRunId || ''),
    goalSha256,
    htmlSha256,
    renderedAt: new Date().toISOString(),
  };
  const file = buildManifestPathForHtml(deckFile);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(manifest, null, 2)}\n`);
  return {
    file,
    manifest,
    buildManifestSha256: sha256File(file),
  };
}

export function verifyBuildChain({ goalPath, deckFile, requireQuality = false }) {
  const resolvedDeck = path.resolve(deckFile);
  const resolvedGoal = goalPath ? path.resolve(goalPath) : null;
  const goal = readJsonIfPresent(resolvedGoal);
  const strict = isStrictArtifactGoal(goal);
  const state = {
    strict,
    goal,
    goalPath: resolvedGoal,
    deckFile: resolvedDeck,
    identity: strict ? 'strict-pending' : 'legacy-unverified',
    errors: [],
    workflowRunId: goal?.workflowRunId ? String(goal.workflowRunId) : null,
    goalSha256: resolvedGoal && existsSync(resolvedGoal) ? sha256File(resolvedGoal) : null,
    htmlSha256: existsSync(resolvedDeck) ? sha256File(resolvedDeck) : null,
    buildManifestSha256: null,
    buildManifest: null,
    telemetry: null,
    stageSequences: {},
  };

  if (!strict) return state;
  if (!resolvedGoal || !goal) state.errors.push('strict artifact contract requires a readable goal.json');
  if (!state.workflowRunId) state.errors.push('strict artifact contract requires goal.workflowRunId');
  if (!state.htmlSha256) state.errors.push('strict artifact contract requires a readable rendered HTML deck');

  const manifestFile = buildManifestPathForHtml(resolvedDeck);
  const manifest = readJsonIfPresent(manifestFile);
  state.buildManifest = manifest;
  if (!manifest) {
    state.errors.push(`missing ${BUILD_MANIFEST_NAME}; render with Dashi before validation`);
  } else {
    state.buildManifestSha256 = sha256File(manifestFile);
    if (manifest.producer !== 'dashi-ppt') state.errors.push('build manifest producer is not dashi-ppt');
    if (manifest.workflowRunId !== state.workflowRunId) state.errors.push('build manifest workflowRunId does not match goal');
    if (manifest.goalSha256 !== state.goalSha256) state.errors.push('goal changed after Dashi render');
    if (manifest.htmlSha256 !== state.htmlSha256) state.errors.push('HTML changed after Dashi render');
  }

  const telemetryFile = resolvedGoal ? workflowTelemetryPath(resolvedGoal) : null;
  try {
    state.telemetry = telemetryFile ? readWorkflowTelemetry(telemetryFile) : null;
  } catch {
    state.telemetry = null;
  }
  if (!state.telemetry) {
    state.errors.push('missing workflow telemetry for strict artifact contract');
  } else if (state.telemetry.runId !== state.workflowRunId) {
    state.errors.push('workflow telemetry runId does not match goal');
  } else {
    verifyStage(state, 'scaffold');
    verifyStage(state, 'validate-goal-spec', { goalSha256: state.goalSha256 });
    verifyStage(state, 'render', {
      goalSha256: state.goalSha256,
      htmlSha256: state.htmlSha256,
      buildManifestSha256: state.buildManifestSha256,
    });
    verifyStage(state, 'validate-swiss', { htmlSha256: state.htmlSha256 });
    verifyStage(state, 'validate-goal-copy', {
      goalSha256: state.goalSha256,
      htmlSha256: state.htmlSha256,
    });
    if (requireQuality) {
      verifyStage(state, 'validate-four-variant-quality', {
        goalSha256: state.goalSha256,
        htmlSha256: state.htmlSha256,
        buildManifestSha256: state.buildManifestSha256,
      });
      const renderSequence = state.stageSequences.render || 0;
      const qualitySequence = state.stageSequences['validate-four-variant-quality'] || 0;
      if (qualitySequence && qualitySequence <= renderSequence) {
        state.errors.push('quality validation is older than the current render');
      }
    }
  }

  if (!state.errors.length) state.identity = requireQuality ? 'pre-export-verified' : 'verified-build';
  return state;
}

export function writeExportManifest({ state, artifactFile, format, exporterVersion }) {
  const resolvedArtifact = path.resolve(artifactFile);
  const manifest = {
    schemaVersion: 1,
    producer: state.strict ? 'dashi-ppt' : 'legacy-unverified',
    verified: state.strict && state.errors.length === 0,
    status: state.strict && state.errors.length === 0 ? 'verified' : 'legacy-unverified',
    exporterVersion: String(exporterVersion || 'unknown'),
    workflowRunId: state.workflowRunId,
    goalSha256: state.goalSha256,
    htmlSha256: state.htmlSha256,
    buildManifestSha256: state.buildManifestSha256,
    format,
    artifactSha256: sha256File(resolvedArtifact),
    exportedAt: new Date().toISOString(),
  };
  const file = exportManifestPathForArtifact(resolvedArtifact);
  writeFileSync(file, `${JSON.stringify(manifest, null, 2)}\n`);
  return { file, manifest, manifestSha256: sha256File(file) };
}

export function verifyExportManifest({ goalPath, deckFile, artifactFile, manifestFile = null }) {
  const resolvedArtifact = path.resolve(artifactFile);
  const resolvedManifest = manifestFile
    ? path.resolve(manifestFile)
    : exportManifestPathForArtifact(resolvedArtifact);
  const chain = verifyBuildChain({
    goalPath,
    deckFile,
    requireQuality: true,
  });
  const state = {
    ...chain,
    errors: [...chain.errors],
    identity: 'export-unverified',
    artifactFile: resolvedArtifact,
    artifactSha256: null,
    exportManifestFile: resolvedManifest,
    exportManifest: null,
    exportManifestSha256: null,
    exportStage: null,
    exportStageSequence: 0,
  };

  if (!chain.strict) {
    state.errors.push('verified export requires a strict Dashi artifact contract');
  }

  if (!existsSync(resolvedArtifact)) {
    state.errors.push(`export artifact is missing: ${resolvedArtifact}`);
  } else {
    state.artifactSha256 = sha256File(resolvedArtifact);
  }

  const manifest = readJsonIfPresent(resolvedManifest);
  state.exportManifest = manifest;
  if (!manifest) {
    state.errors.push(`missing or unreadable export manifest: ${resolvedManifest}`);
  } else {
    state.exportManifestSha256 = sha256File(resolvedManifest);
    if (manifest.schemaVersion !== 1) state.errors.push('unsupported export manifest schemaVersion');
    if (manifest.producer !== 'dashi-ppt') state.errors.push('export manifest producer is not dashi-ppt');
    if (manifest.verified !== true || manifest.status !== 'verified') {
      state.errors.push('export manifest is not marked verified');
    }
    compareManifestField(state, manifest, 'workflowRunId', state.workflowRunId);
    compareManifestField(state, manifest, 'goalSha256', state.goalSha256);
    compareManifestField(state, manifest, 'htmlSha256', state.htmlSha256);
    compareManifestField(state, manifest, 'buildManifestSha256', state.buildManifestSha256);
    compareManifestField(state, manifest, 'artifactSha256', state.artifactSha256);

    const artifactFormat = path.extname(resolvedArtifact).slice(1).toLowerCase();
    if (!['pptx', 'pdf'].includes(manifest.format)) {
      state.errors.push('export manifest format must be pptx or pdf');
    } else if (artifactFormat !== manifest.format) {
      state.errors.push('export manifest format does not match the artifact extension');
    }
  }

  verifyExportTelemetry(state);
  if (!state.errors.length) state.identity = 'delivery-verified';
  return state;
}

function verifyStage(state, stageName, expectedMetrics = {}) {
  const stage = state.telemetry?.stages?.[stageName];
  const latest = [...(stage?.attempts || [])].sort((a, b) => Number(a.sequence) - Number(b.sequence)).at(-1);
  if (!latest) {
    state.errors.push(`missing workflow stage: ${stageName}`);
    return;
  }
  state.stageSequences[stageName] = Number(latest.sequence) || 0;
  if (latest.status !== 'passed') {
    state.errors.push(`latest workflow stage failed: ${stageName}`);
    return;
  }
  for (const [key, expected] of Object.entries(expectedMetrics)) {
    if (!expected) continue;
    if (latest?.metrics?.[key] !== expected) {
      state.errors.push(`workflow stage ${stageName} does not match current ${key}`);
    }
  }
}

function compareManifestField(state, manifest, key, expected) {
  if (manifest?.[key] !== expected) {
    state.errors.push(`export manifest does not match current ${key}`);
  }
}

function verifyExportTelemetry(state) {
  const format = state.exportManifest?.format;
  const stageName = format === 'pdf' ? 'export-pdf' : format === 'pptx' ? 'export-pptx' : null;
  if (!stageName || !state.telemetry) return;

  const attempts = state.telemetry?.stages?.[stageName]?.attempts || [];
  const matchingAttempt = [...attempts]
    .filter(attempt => attempt?.status === 'passed')
    .filter(attempt => attempt?.runId === state.workflowRunId)
    .filter(attempt => attempt?.metrics?.goalSha256 === state.goalSha256)
    .filter(attempt => attempt?.metrics?.htmlSha256 === state.htmlSha256)
    .filter(attempt => attempt?.metrics?.artifactSha256 === state.artifactSha256)
    .filter(attempt => attempt?.metrics?.exportManifestSha256 === state.exportManifestSha256)
    .sort((left, right) => Number(left.sequence) - Number(right.sequence))
    .at(-1);

  if (!matchingAttempt) {
    state.errors.push(`workflow telemetry has no passed ${stageName} attempt matching the current artifact and export manifest`);
    return;
  }

  state.exportStage = stageName;
  state.exportStageSequence = Number(matchingAttempt.sequence) || 0;
  const matchingQualityAttempt = [...(state.telemetry?.stages?.['validate-four-variant-quality']?.attempts || [])]
    .filter(attempt => attempt?.status === 'passed')
    .filter(attempt => attempt?.runId === state.workflowRunId)
    .filter(attempt => attempt?.metrics?.goalSha256 === state.goalSha256)
    .filter(attempt => attempt?.metrics?.htmlSha256 === state.htmlSha256)
    .filter(attempt => attempt?.metrics?.buildManifestSha256 === state.buildManifestSha256)
    .some(attempt => Number(attempt.sequence) < state.exportStageSequence);
  if (!matchingQualityAttempt) {
    state.errors.push(`${stageName} is not linked to an earlier matching quality validation`);
  }
}

function readJsonIfPresent(file) {
  if (!file || !existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}
