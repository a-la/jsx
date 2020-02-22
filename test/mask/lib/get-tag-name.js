import makeTestSuite from '@zoroaster/mask'
import { getTagName } from '../../../src/lib'

export
const GetTagName = makeTestSuite('test/result/components/get-tag-name', {
  getResults() {
    const tagName = getTagName(this.input)
    return tagName
  },
})
