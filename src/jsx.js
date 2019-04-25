import { _input, _preact } from './get-args'
import { readFileSync } from 'fs'
import jsx from './'

if (!_input) {
  console.log('Please specify the file to transpile.')
  process.exit(1)
}
const code = `${readFileSync(_input)}`
const res = jsx(code, {
  quoteProps: _preact ? 'dom' : undefined,
})
console.log(res)