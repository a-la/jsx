import makeTestSuite from '@zoroaster/mask'
import { deepEqual } from 'zoroaster/assert'
import { getProps } from '../../../src/lib'

export
const GetProps = makeTestSuite('test/result/components/get-props.json', {
  getResults(input) {
    const { obj, whitespace } = getProps(input)
    return { obj, whitespace }
  },
  mapActual: ({ obj }) => obj,
  assertResults({ whitespace }, { expectedWhitespace }) {
    if (expectedWhitespace) deepEqual(whitespace, expectedWhitespace)
  },
  jsonProps: ['expected', 'expectedWhitespace'],
})
