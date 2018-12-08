import { makeTestSuite } from 'zoroaster'
import { getProps } from '../../../src/lib'

export
const GetProps = makeTestSuite('test/result/components/get-props.md', {
  getResults(input) {
    const res = getProps(input)
    return res
  },
  jsonProps: ['expected'],
})
