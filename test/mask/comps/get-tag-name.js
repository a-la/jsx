import { makeTestSuite } from 'zoroaster'
import { getTagName } from '../../../src/lib/components/'

export
const GetTagName = makeTestSuite('test/result/components/get-tag-name.md', {
  getResults(input) {
    const tagName = getTagName(input)
    return tagName
  },
})
