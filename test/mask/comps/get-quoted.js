import { makeTestSuite } from 'zoroaster'
import { getQuoted } from '../../../src/lib/components/'

export
const GetTagName = makeTestSuite('test/result/components/get-quoted.md', {
  getResults(input) {
    const tagName = getQuoted(input)
    return tagName
  },
})
