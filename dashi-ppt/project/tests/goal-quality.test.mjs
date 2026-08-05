import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateGoalQualityContract,
  validateGoalSpec,
} from '../scripts/validate-goal-spec.mjs';
import { layoutSemanticFamily } from '../scripts/workflow/layout-query.mjs';

function provenance(pageQuestion, claimIds, fieldRefs = {}) {
  return {
    pageQuestion,
    sectionId: 'company',
    claimIds,
    fieldRefs,
  };
}

function slide(id, pageQuestion, claimIds, presentation = {}, variants = [], fieldRefs = {}) {
  return {
    id,
    content: {
      provenance: provenance(pageQuestion, claimIds, fieldRefs),
      presentation: {
        structure: 'single',
        ...presentation,
      },
    },
    variants,
  };
}

function approved(id, ownerSlideId = 's1') {
  return { id, status: 'approved', locator: `source:${id}`, ownerSlideId };
}

test('legacy and ordinary creative goals remain compatible', () => {
  assert.deepEqual(validateGoalQualityContract({
    slides: [{ content: { presentation: { items: [{ label: 'legacy' }] } } }],
  }), []);
  assert.deepEqual(validateGoalQualityContract({
    contentMode: 'creative',
    slides: [{ content: { presentation: { summary: 'Workshop prompt' } } }],
  }), []);
});

test('external source-bound requirement cannot be bypassed by omitting all markers', () => {
  const errors = validateGoalQualityContract({ slides: [] }, { requireSourceBound: true });
  assert.ok(errors.some(error => error.includes('contentMode')));
  assert.ok(errors.some(error => error.includes('sourceLedger')));
});

test('source-bound mode requires a non-empty page claim list', () => {
  const errors = validateGoalQualityContract({
    contentMode: 'source-bound',
    sourceLedger: { claims: [approved('claim-1')] },
    slides: [slide('s1', 'What is supported?', [])],
  });
  assert.ok(errors.some(error => error.includes('at least one source claim id')));
});

test('blocked and excluded claims cannot be presented and require denied terms', () => {
  const errors = validateGoalQualityContract({
    sourceLedger: {
      claims: [
        { id: 'blocked-1', status: 'blocked', locator: 'user:correction-1', ownerSlideId: 's1' },
        { id: 'excluded-1', status: 'excluded', locator: 'source:paragraph-2', ownerSlideId: 's1' },
      ],
    },
    slides: [slide('s1', 'What does the company actually provide?', ['blocked-1', 'excluded-1'])],
  });
  assert.ok(errors.some(error => error.includes('blocked and excluded claims require')));
  assert.ok(errors.some(error => error.includes('"blocked-1" is blocked')));
  assert.ok(errors.some(error => error.includes('"excluded-1" is excluded')));
});

test('pending claims stay unpublished and every claim needs a locator', () => {
  const errors = validateGoalQualityContract({
    sourceLedger: {
      claims: [
        { id: 'pending-1', status: 'pending', locator: 'source:conflict-1', ownerSlideId: 's1' },
        { id: 'approved-without-locator', status: 'approved', ownerSlideId: 's1' },
      ],
    },
    slides: [slide('s1', 'Which facts are ready to publish?', ['pending-1'])],
  });
  assert.ok(errors.some(error => error.includes('"pending-1" is pending')));
  assert.ok(errors.some(error => error.includes('approved-without-locator') && error.includes('.locator')));
});

test('the main goal validator executes the source quality contract', () => {
  const errors = validateGoalSpec({
    title: 'integration',
    goal: 'integration',
    sourceLedger: {
      claims: [{
        id: 'blocked-1',
        status: 'blocked',
        locator: 'user:correction-1',
        ownerSlideId: 's1',
        terms: ['blocked'],
      }],
    },
    slides: [slide('s1', 'What is approved for publication?', ['blocked-1'])],
  });
  assert.ok(errors.some(error => error.includes('"blocked-1" is blocked')));
});

test('title summary and takeaway must bind to page-approved claims', () => {
  const base = {
    contentMode: 'source-bound',
    sourceLedger: { claims: [approved('claim-1')] },
    slides: [slide('s1', 'What is the company?', ['claim-1'], {
      title: 'Company',
      summary: 'AIGC platform',
      takeaway: 'Enterprise content generation',
    })],
  };
  const missing = validateGoalQualityContract(base);
  assert.ok(missing.some(error => error.includes('fieldRefs.title')));
  assert.ok(missing.some(error => error.includes('fieldRefs.summary')));
  assert.ok(missing.some(error => error.includes('fieldRefs.takeaway')));

  base.slides[0].content.provenance.fieldRefs = {
    title: ['claim-1'],
    summary: ['claim-1'],
    takeaway: ['claim-1'],
  };
  assert.deepEqual(validateGoalQualityContract(base), []);
});

test('fieldRefs reject ghost keys and canonical keys without visible content', () => {
  const ghostKeyErrors = validateGoalQualityContract({
    contentMode: 'source-bound',
    sourceLedger: { claims: [approved('claim-1')] },
    slides: [slide(
      's1',
      'What is the company?',
      ['claim-1'],
      { summary: 'AIGC platform' },
      [],
      { summary: ['claim-1'], ghost: ['claim-1'] },
    )],
  });
  assert.ok(ghostKeyErrors.some(error => error.includes('fieldRefs.ghost') && error.includes('unsupported field reference')));

  const absentFieldErrors = validateGoalQualityContract({
    contentMode: 'source-bound',
    sourceLedger: { claims: [approved('claim-1')] },
    slides: [slide(
      's1',
      'What is the company?',
      ['claim-1'],
      { summary: 'AIGC platform' },
      [],
      { title: ['claim-1'], summary: ['claim-1'] },
    )],
  });
  assert.ok(absentFieldErrors.some(error => error.includes('fieldRefs.title') && error.includes('does not correspond to a visible')));
});

test('every fieldRefs claim must also be approved in the page claimIds', () => {
  const errors = validateGoalQualityContract({
    contentMode: 'source-bound',
    sourceLedger: { claims: [approved('claim-1'), approved('claim-2')] },
    slides: [slide(
      's1',
      'What is the company?',
      ['claim-1'],
      { summary: 'AIGC platform' },
      [],
      { summary: ['claim-2'] },
    )],
  });
  assert.ok(errors.some(error => error.includes('fieldRefs.summary') && error.includes('must also appear in provenance.claimIds')));
});

test('excluded terms are checked in canonical, template and bespoke visible content', () => {
  const errors = validateGoalQualityContract({
    sourceLedger: {
      claims: [
        approved('approved-1'),
        { id: 'excluded-agent', status: 'excluded', locator: 'user:correction-2', terms: ['Agent', '运维'] },
      ],
    },
    slides: [slide(
      's1',
      'What does the platform provide?',
      ['approved-1'],
      { summary: 'AIGC 平台' },
      [
        { id: 'v1', kind: 'template', props: { subtitle: 'Agent' } },
        {
          id: 'v4',
          kind: 'bespoke',
          composition: { elements: [{ type: 'text', text: '运维' }] },
        },
      ],
      { summary: ['approved-1'] },
    )],
  });
  assert.ok(errors.some(error => error.includes('source term "Agent"')));
  assert.ok(errors.some(error => error.includes('source term "运维"')));
});

test('cross-slide claim reuse requires explicit authorization', () => {
  const base = {
    sourceLedger: { claims: [approved('claim-1')] },
    slides: [
      slide('s1', 'What is the platform?', ['claim-1']),
      slide('s2', 'Which functions does it include?', ['claim-1']),
    ],
  };
  const blocked = validateGoalQualityContract(base);
  assert.ok(blocked.some(error => error.includes('without allowReuse=true')));

  const authorized = structuredClone(base);
  authorized.sourceLedger.claims[0].allowReuse = true;
  assert.deepEqual(validateGoalQualityContract(authorized), []);
});

test('parallel content rejects timeline process and sequence compositions', () => {
  for (const family of ['timeline', 'process', 'sequence']) {
    const errors = validateGoalQualityContract({
      sourceLedger: { claims: [approved('claim-1')] },
      slides: [slide(
        's1',
        'Which capabilities exist in parallel?',
        ['claim-1'],
        { structure: 'parallel' },
        [{
          id: 'v4',
          kind: 'bespoke',
          composition: { designIntent: { compositionFamily: family } },
        }],
      )],
    });
    assert.ok(errors.some(error => error.includes('contradicts presentation.structure "parallel"')));
  }
  assert.equal(
    layoutSemanticFamily({ slot: 'process', label: 'Five-step process', roles: [], fillPlan: {} }),
    'sequence',
  );
});

test('one source claim may support multiple distinct visible items', () => {
  const errors = validateGoalQualityContract({
    sourceLedger: { claims: [approved('claim-1')] },
    slides: [slide('s1', 'Which capabilities are evidenced?', ['claim-1'], {
      structure: 'parallel',
      items: [
        { label: 'Image generation', claimIds: ['claim-1'] },
        { label: 'Video generation', claimIds: ['claim-1'] },
        { label: 'Text generation', claimIds: ['claim-1'] },
      ],
    })],
  });
  assert.deepEqual(errors, []);
});

test('duplicate visible item text is rejected as padding', () => {
  const errors = validateGoalQualityContract({
    sourceLedger: { claims: [approved('claim-1')] },
    slides: [slide('s1', 'Which capabilities are evidenced?', ['claim-1'], {
      structure: 'parallel',
      items: [
        { label: 'Same point', claimIds: ['claim-1'] },
        { label: 'Same point', claimIds: ['claim-1'] },
      ],
    })],
  });
  assert.ok(errors.some(error => error.includes('repeated visible fact text')));
});

test('binding external reference is blocked instead of approximated', () => {
  const errors = validateGoalQualityContract({
    designMode: 'reference-bound',
    referenceBinding: {
      version: 1,
      kind: 'external-deck',
      policy: 'binding',
      sourceSha256: 'a'.repeat(64),
      sourceLabel: 'reference.pdf',
      supportStatus: 'blocked',
    },
    slides: [],
  }, { requireReferenceBound: true });
  assert.ok(errors.some(error => error.includes('stop instead of using an approximate theme')));
  assert.ok(errors.some(error => error.includes('external binding reference themes are not registered')));
});
