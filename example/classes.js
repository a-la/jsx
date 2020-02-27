import { readFileSync } from 'fs'
import jsx from '../src'

const code = readFileSync('example/classes.jsx', 'utf8')
const res = jsx(code, {
  prop2class: true,
  classNames: ['hello', 'world'],
  renameMap: {
    hello: 'hi',
  },
})
console.log(res)