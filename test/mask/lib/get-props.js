import { makeTestSuite } from 'zoroaster'
import { getProps } from '../../../src/lib'

export
const GetProps = makeTestSuite('test/result/components/get-props.json', {
  getResults(input) {
    const { obj } = getProps(input)
    return obj
  },
  jsonProps: ['expected'],
})
