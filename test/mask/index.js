import { makeTestSuite } from 'zoroaster'
import { jsx } from '../../src/lib/components'
import { replaceChunk } from '../../src/lib'

export
const Components = makeTestSuite('test/result/components.jsx', {
  getResults(input) {
    return jsx(input)
  },
})

// export
const ReplaceChunk = makeTestSuite('test/result/components/replace-chunk.json', {
  getResults(input) {
    const { input: i, index, length, chunk } = JSON.parse(input)
    return replaceChunk(i, index, length, chunk)
  },
})