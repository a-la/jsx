import { deepEqual } from 'zoroaster'
import { parseContent } from '../../src/lib/components'

class ParseContentContext {
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

/** @type {Object.<string, (c: ParseContentContext)} */
const ParseContent = {
  context: ParseContentContext, // ,
  'parses expression'() {
    const c = parseContent('{test}')
    deepEqual(c, ['test'])
  },
  'parses content before'({ b, q }) {
    const c = parseContent(`${b}{test}`)
    deepEqual(c, [q`Hello, `, 'test'])
  },
  'parses content after'({ a, q }) {
    const c = parseContent(`{test}${a}`)
    deepEqual(c, ['test', q`!`])
  },
}

export default ParseContent