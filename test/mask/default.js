import makeTestSuite from '@zoroaster/mask'
import jsx from '../../src'
import { replaceChunk } from '../../src/lib'

export
const Components = makeTestSuite('test/result/components.jsx', {
  getResults(input) {
    return jsx(input)
  },
})

export
const ComponentsClosure = makeTestSuite('test/result/components-closure.jsx', {
  getResults(input) {
    const res = jsx(input, {
      quoteProps: true,
    })
    return res
  },
})

export
const ComponentsClosureDom = makeTestSuite('test/result/components-closure-dom.jsx', {
  getResults(input) {
    const res = jsx(input, {
      quoteProps: 'dom',
    })
    return res.replace(/^\(/, '').replace(/\)$/, '') + ';'
  },
})

export
const ReplaceChunk = makeTestSuite('test/result/components/replace-chunk.json', {
  getResults(input) {
    const { input: i, index, length, chunk } = JSON.parse(input)
    return replaceChunk(i, index, length, chunk)
  },
})