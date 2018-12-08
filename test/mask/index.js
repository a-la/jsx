import { makeTestSuite } from 'zoroaster'
import { Script } from 'vm'
import { jsx } from '../../src/lib/components'
import { findIndexByEvaluating, findBeforeLengthFromError, replaceChunk }
  from '../../src/lib/'

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
  context: { getStack },
  jsonProps: ['expected'],
})

/**
 * Returns the error when trying to create a script.
 */
const getStack = (input) => {
  let s
  try {
    new Script(input)
  } catch ({ stack }) {
    s = stack
  }
  if (!s) throw new Error('Could not get the stack.')
  return s
}

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