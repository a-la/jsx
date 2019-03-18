import makeTestSuite from '@zoroaster/mask'
import { pragma, makeObjectBody } from '../../../src/lib'

const Pragma = makeTestSuite('test/result/components/pragma.json', {
  getResults(input) {
    const { tagName, props, children } = JSON.parse(input)
    const res = pragma(tagName, props, children)
    return res
  },
})

export const MakeObject = makeTestSuite('test/result/components/make-object.md', {
  getResults(input) {
    const props = JSON.parse(input)
    const res = makeObjectBody(props)
    if (res === null) return 'null'
    return res
  },
})

export default Pragma