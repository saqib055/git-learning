import test from 'node:test';
import assert from 'node:assert/strict';
import { buildQuery, checkAnswer, getOutput, countCompleted } from './logic.mjs';

test('buildQuery combines Google operators', () => {
  assert.equal(buildQuery('  JavaScript   arrays  ', { exact: true, site: true, excludeVideo: true }), '"JavaScript arrays" site:developer.mozilla.org -video');
  assert.equal(buildQuery('  '), '');
});
test('checkAnswer accepts correct options and rejects incorrect ones', () => {
  assert.equal(checkAnswer('git', 'b'), true);
  assert.equal(checkAnswer('search', 'b'), false);
  assert.equal(checkAnswer('code', 'b'), true);
  assert.equal(checkAnswer('not-a-topic', 'b'), false);
});
test('getOutput enforces bounds and selects branch', () => {
  assert.equal(getOutput('5'), 'Great job!');
  assert.equal(getOutput(4), 'Keep practicing!');
  assert.equal(getOutput('11'), null);
  assert.equal(getOutput(''), null);
  assert.equal(getOutput('1.5'), null);
});
test('countCompleted ignores unexpected values and topics', () => {
  assert.equal(countCompleted({ git: true, search: true, code: false, extra: true }), 2);
  assert.equal(countCompleted({}), 0);
});
