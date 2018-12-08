import { deepEqual } from 'zoroaster'
import { parseSimpleContent } from '../../src/lib'

class ParseSimpleContentContext {
  // get EXP() { return 'test' }
  // get exp() { return this.e }
  /**
   * A template literal to make an expression.
   * @example
   * e`test` // => {test}
   */
  get e() { return ({ raw: [r] }) => `{${r}}` }
  // get e({ raw: [r] }) {
  //   return `{${r}}`
  // }
  /**
   * A template literal to make quoted content.
   * @example
   * q`test` // => 'test'
   */
  get q() { return ({ raw: [r] }) => `'${r}'` }
  /** The expression to insert before the expression. */
  get b() { return 'Hello, ' }
  /** The expression to insert after the expression. */
  get a() { return '!' }
}

/** @type {Object.<string, (c: ParseSimpleContentContext)} */
const ParseSimpleContent = {
  context: ParseSimpleContentContext,
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