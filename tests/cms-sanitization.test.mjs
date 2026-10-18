import test from 'node:test';
import assert from 'node:assert/strict';
import {htmlToPlainText} from '../src/lib/cms/wordpress.ts';
test('CMS HTML gets converted to safe text for React escaping',()=>{
  assert.equal(htmlToPlainText('<p>Welcome &amp; hello</p><script>alert(1)</script>'),'Welcome & hello\nalert(1)');
  assert.equal(htmlToPlainText('<h2>Title</h2><p>Body</p>'),'Title\nBody');
});
