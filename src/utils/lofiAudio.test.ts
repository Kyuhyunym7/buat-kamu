import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LOFI_TEMPO_BPM,
  TOTAL_PATTERN_STEPS,
  TRACK_TITLE,
  findChordSegment,
  getEighthNoteDurationSec,
  getStepSchedule,
  midiToFreq,
} from './lofiAudio';

test('midiToFreq converts A4 (69) to 440Hz and octaves cleanly', () => {
  assert.equal(Math.round(midiToFreq(69)), 440);
  assert.equal(Math.round(midiToFreq(57)), 220);
});

test('track metadata and tempo match Nanti Kita Seperti Ini in C major at 85 BPM', () => {
  assert.equal(TRACK_TITLE, 'Nanti Kita Seperti Ini');
  assert.equal(LOFI_TEMPO_BPM, 85);
  const duration = getEighthNoteDurationSec(LOFI_TEMPO_BPM);
  assert.ok(Math.abs(duration - 60 / 85 / 2) < 1e-6);
});

test('chord progression follows Verse (C-F-Dm-G) and Chorus (F-G-Am-G/B-C) and wraps modulo 96', () => {
  assert.equal(findChordSegment(0).name, 'C');
  assert.equal(findChordSegment(8).name, 'F');
  assert.equal(findChordSegment(16).name, 'Dm');
  assert.equal(findChordSegment(24).name, 'G');
  assert.equal(findChordSegment(32).name, 'F');
  assert.equal(findChordSegment(48).name, 'Am');
  assert.equal(findChordSegment(52).name, 'G/B');
  assert.equal(findChordSegment(56).name, 'C');

  const bar0 = getStepSchedule(0);
  assert.ok(bar0.padChordFreqs && bar0.padChordFreqs.length === 4);
  assert.ok(bar0.pluckFreq && bar0.melodyFreq);
  assert.equal(bar0.hasKick, true);

  const wrapped = getStepSchedule(TOTAL_PATTERN_STEPS);
  assert.deepEqual(wrapped, bar0);
});
