import { makeTestSuite } from 'zoroaster'
import { jsx } from '../../src/lib/components'
import { findIndexByEvaluating, findBeforeLengthFromError, replaceChunk }
  from '../../src/lib/'
import Context from '../context'

export
const Components = makeTestSuite('test/result/components.jsx', {
  getResults(input) {
    return jsx(input)
  },
})

export
const FindLength = makeTestSuite('test/result/components/find-length.md', {
  getResults(input, { getStack }) {
    const stack = getStack(input)
    const res = findBeforeLengthFromError(stack, input)
    return res
  },
  context: Context,
  jsonProps: ['expected'],
})

export
const FindIndex = makeTestSuite('test/result/components/find-index.md', {
  getResults(input) {
    const res = findIndexByEvaluating(input)
    return res
  },
  jsonProps: ['expected'],
})


export
const ReplaceChunk = makeTestSuite('test/result/components/replace-chunk.json', {
  getResults(input) {
    const { input: i, index, length, chunk } = JSON.parse(input)
    return replaceChunk(i, index, length, chunk)
  },
})