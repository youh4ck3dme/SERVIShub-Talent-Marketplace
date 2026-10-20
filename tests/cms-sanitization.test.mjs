import test from 'node:test';
import assert from 'node:assert/strict';
import {htmlToPlainText} from '../src/lib/cms/wordpress.ts';

test('CMS returns untrusted markup without attempting partial sanitization', () => {
  const markup = '<p>Hello &amp; welcome</p><script>alert(1)</script>';
  assert.equal(htmlToPlainText(markup), markup);
});

test('CMS leaves nested character entities encoded for React text nodes', () => {
  const encoded = '&amp;lt;script&amp;gt;alert(1)';
  assert.equal(htmlToPlainText(encoded), encoded);
});

test('CMS handles empty editorial fields', () => {
  assert.equal(htmlToPlainText(null), '');
  assert.equal(htmlToPlainText(undefined), '');
});
