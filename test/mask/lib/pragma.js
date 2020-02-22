import makeTestSuite from '@zoroaster/mask'
import { pragma, makeObjectBody } from '../../../src/lib'

const Pragma = makeTestSuite('test/result/components/pragma.json', {
  getResults() {
    const { tagName, props, children } = this.input
    const res = pragma(tagName, props, children)
    return res
  },
  jsonProps: ['input'],
})

export const MakeObject = makeTestSuite('test/result/components/make-object', {
  getResults() {
    const res = makeObjectBody(this.input)
    if (res === null) return 'null'
    return res
  },
  jsonProps: ['input'],
})

export default Pragma