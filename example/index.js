import { readFileSync } from 'fs'
import jsx from '../src'

const code = readFileSync('example/Component.jsx', 'utf8')
const res = jsx(code)
console.log(res)