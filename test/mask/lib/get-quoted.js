import makeTestSuite from '@zoroaster/mask'
import { getQuoted } from '../../../src/lib/parse-content'

export
const GetTagName = makeTestSuite('test/result/components/get-quoted', {
  getResults() {
    const tagName = getQuoted(this.input)
    return tagName
  },
})
