import { deepEqual } from 'zoroaster'
import ExpressionContext from '../context/expression'
import { parseContent } from '../../src/lib/components'

/** @type {Object.<string, (c: ExpressionContext)} */
const ParseContent = {
  context: ExpressionContext,
  'parses expression'() {
    const c = parseContent('{test}')
    deepEqual(c, ['test'])
  },
  'parses expression with new lines'() {
    const c = parseContent(`
    {test}
    `)
    deepEqual(c, [`
    `, 'test', `
    `])
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