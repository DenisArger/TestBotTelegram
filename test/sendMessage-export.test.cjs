const test = require('node:test');
const assert = require('node:assert/strict');
const sendMessage = require('../sendMessage');

test('sendMessage module exports function', () => {
  assert.equal(typeof sendMessage, 'function');
});
