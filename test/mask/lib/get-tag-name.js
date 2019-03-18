import makeTestSuite from '@zoroaster/mask'
import { getTagName } from '../../../src/lib'

export
const GetTagName = makeTestSuite('test/result/components/get-tag-name.md', {
  getResults(input) {
    const tagName = getTagName(input)
    return tagName
  },
})
