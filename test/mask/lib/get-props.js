import makeTestSuite from '@zoroaster/mask'
import { deepEqual } from '@zoroaster/assert'
import Context from '../../context'
import { getProps } from '../../../src/lib'

export
const GetProps = makeTestSuite('test/result/components/get-props.json', {
  getResults() {
    const { obj, whitespace } = getProps(this.input)
    return { obj, whitespace }
  },
  mapActual: ({ obj }) => {
    return Object.entries(obj).reduce((acc, [k, v]) => {
      acc[k] = v.replace(/\r\n/g, '\n')
      return acc
    }, {})
  },
  assertResults({ whitespace }, { expectedWhitespace }) {
    if (expectedWhitespace) deepEqual(whitespace, expectedWhitespace)
  },
  jsonProps: ['expected', 'expectedWhitespace'],
})
