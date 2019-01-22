import { deepEqual } from 'zoroaster'
import ExpressionContext from '../context/expression'
import { parseSimpleContent } from '../../src/lib/parse-content'

/** @type {Object.<string, (c: ExpressionContext)} */
const ParseSimpleContent = {
  context: ExpressionContext,
  'parses content with expressions into an array'({ e, q, a, b }) {
    const exp = e`test`
    const res = parseSimpleContent(`${b}${exp}${a}`)
    deepEqual(res, [q`Hello, `, 'test', q`!`])
  },
  'parses content with new lines'({ q }) {
    const res = parseSimpleContent(`
    {test}
    `)
    deepEqual(res, [q`
    `, 'test', q`
    `])
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
  // 'does not push the empty space at the end.'({ e }) {
  //   const exp = e`test`
  //   const res = parseSimpleContent(`${exp}   `)
  //   deepEqual(res, ['test'])
  // },
  'returns quoted string when no expression is present'({ b, q }) {
    const res = parseSimpleContent(b)
    deepEqual(res, [q`Hello, `])
  },
  'parses the expression with curly brackets'({ b, q }) {
    const res = parseSimpleContent(`${b}{test.map(({ t }) => t)}`)
    deepEqual(res, [q`Hello, `, 'test.map(({ t }) => t)'])
  },
}

export default ParseSimpleContent