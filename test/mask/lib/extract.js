import makeTestSuite from '@zoroaster/mask'
import extract from '../../../src/lib/extract'

export
const Extract = makeTestSuite('test/result/components/extract', {
  getResults() {
    const res = extract(this.input)
    return res
  },
  mapActual({ string }) {
    return string
  },
  // assertResults({ props, content }) {

  // },
})
