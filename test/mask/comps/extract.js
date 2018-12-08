import { makeTestSuite } from 'zoroaster'
import extract from '../../../src/lib/components/extract'

export
const Extract = makeTestSuite('test/result/components/extract.md', {
  getResults(input) {
    const res = extract(input)
    return res
  },
  mapActual({ string }) {
    return string
  },
  // assertResults({ props, content }) {

  // },
})
