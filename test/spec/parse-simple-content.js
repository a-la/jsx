import { deepEqual } from 'zoroaster'
import ExpressionContext from '../context/expression'
import { parseSimpleContent } from '../../src/lib'

/** @type {Object.<string, (c: ParseSimpleContentContext)} */
const ParseSimpleContent = {
  context: ExpressionContext,
  'parses content with expressions into an array'({ e, q, a, b }) {
    const exp = e`test`
    const res = parseSimpleContent(`${b}${exp}${a}`)
    deepEqual(res, [q`Hello, `, 'test', q`!`])
  },
  'starts with expression'({ e, q, a }) {
    const exp = e`test`
    const res = parseSimpleContent(`${exp}${a}`)
    deepEqual(res, ['test', q`!`])
  },
  'ends with expression'({ e, b, q }) {
    const exp = e`test`
    const res = parseSimpleContent(`${b}${exp}`)
    deepEqual(res, [q`Hello, `, 'test'])
  },
  'trims the expression'({ e }) {
    const exp = e`test`
    const res = parseSimpleContent(exp)
    deepEqual(res, ['test'])
  },
  'does not push the empty space at the end.'({ e }) {
    const exp = e`test`
    const res = parseSimpleContent(`${exp}   `)
    deepEqual(res, ['test'])
  },
  'returns quoted string when no expression is present'({ b, q }) {
    const res = parseSimpleContent(b)
    deepEqual(res, [q`Hello, `])
  },
}

export default ParseSimpleContent