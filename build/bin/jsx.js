require('../../types/externs');
const { _input, _preact } = require('./get-args');
const { readFileSync } = require('fs');
const jsx = require('../');

if (!_input) {
  console.log('Please specify the file to transpile.')
  process.exit(1)
}
const code = /** @type {string} */ (readFileSync(_input, 'utf8'))
const res = jsx(code, {
  quoteProps: _preact ? 'dom' : undefined,
})
console.log(res)