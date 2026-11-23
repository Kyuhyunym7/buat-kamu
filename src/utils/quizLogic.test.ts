import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_CONFIG,
  buildWhatsAppUrl,
  computeSafeDodgePosition,
  createSteps,
  formatAnniversaryDate,
  getCelebrationDisplayName,
  getDodgeButtonText,
  parseConfigFromSearch,
  sanitizeWhatsAppNumber,
} from './quizLogic';

test('DEFAULT_CONFIG permanently locks recipient Lia and WhatsApp +62 857-2367-3077', () => {
  assert.equal(DEFAULT_CONFIG.namaPenerima, 'Lia');
  assert.equal(DEFAULT_CONFIG.nomorWhatsApp, '6285723673077');
  assert.equal(
    buildWhatsAppUrl(DEFAULT_CONFIG),
    'https://wa.me/6285723673077?text=Iya%20aku%20mau%20jadi%20pacar%20kamu%20%E2%9D%A4%EF%B8%8F'
  );
});

test('createSteps personalizes intro title for Lia and preserves 5 steps', () => {
  const steps = createSteps(DEFAULT_CONFIG.namaPenerima);
  assert.equal(steps.length, 5);
  assert.match(steps[0].title, /Hai, Lia!/);
  assert.equal(steps[4].type, 'climax');
  assert.equal(steps[4].progress, 100);
});

test('sanitizeWhatsAppNumber normalizes +62 and leading zero formats', () => {
  assert.equal(sanitizeWhatsAppNumber('+62 857-2367-3077'), '6285723673077');
  assert.equal(sanitizeWhatsAppNumber('0857-2367-3077'), '6285723673077');
  assert.equal(sanitizeWhatsAppNumber(''), DEFAULT_CONFIG.nomorWhatsApp);
});

test('parseConfigFromSearch locks config to Lia while honoring autostart/step flags', () => {
  const parsed = parseConfigFromSearch('?nama=Lain&wa=0811111111&autostart=1');
  assert.equal(parsed.config.namaPenerima, 'Lia');
  assert.equal(parsed.config.nomorWhatsApp, '6285723673077');
  assert.equal(parsed.initialStep, 1);

  const clamped = parseConfigFromSearch('?step=99');
  assert.equal(clamped.initialStep, 4);
});

test('getCelebrationDisplayName returns Lia and converts fallback Kamu to Sayang', () => {
  assert.equal(getCelebrationDisplayName(DEFAULT_CONFIG.namaPenerima), 'Lia');
  assert.equal(getCelebrationDisplayName('Kamu'), 'Sayang');
  assert.equal(getCelebrationDisplayName('  '), 'Sayang');
});

test('formatAnniversaryDate formats date in Indonesian locale', () => {
  const formatted = formatAnniversaryDate(new Date('2026-02-14T12:00:00Z'));
  assert.match(formatted, /2026/);
  assert.match(formatted, /Februari/);
});

test('getDodgeButtonText cycles through playful labels', () => {
  assert.equal(getDodgeButtonText(0), 'Nggak 🙈');
  assert.equal(getDodgeButtonText(1), DEFAULT_CONFIG.teksTombolKabur[0]);
  assert.equal(getDodgeButtonText(9), DEFAULT_CONFIG.teksTombolKabur[0]);
});

test('computeSafeDodgePosition keeps button strictly inside bounds and moves away from current point', () => {
  const pos = computeSafeDodgePosition(
    {
      areaWidth: 320,
      areaHeight: 160,
      buttonWidth: 120,
      buttonHeight: 48,
      currentX: 190,
      currentY: 100,
    },
    0.9,
    0.9
  );
  assert.ok(pos.x >= 8 && pos.x <= 320 - 120 - 8);
  assert.ok(pos.y >= 8 && pos.y <= 160 - 48 - 8);
});
