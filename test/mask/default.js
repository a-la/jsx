import makeTestSuite from '@zoroaster/mask'
import jsx from '../../src'
import { replaceChunk } from '../../src/lib'

export
const Components = makeTestSuite('test/result/components.jsx', {
  getResults() {
    return jsx(this.input)
  },
})

export
const ComponentsClosure = makeTestSuite('test/result/components-closure.jsx', {
  getResults() {
    const res = jsx(this.input, {
      quoteProps: true,
    })
    return res.replace(/^;?\(/, '').replace(/\)$/, '')
  },
})

export
const ComponentsClosureDom = makeTestSuite('test/result/components-closure-dom.jsx', {
  getResults() {
    const res = jsx(this.input, {
      quoteProps: 'dom',
    })
    return res.replace(/^\(/, '').replace(/\)$/, '') + ';'
  },
})

export
const ReplaceChunk = makeTestSuite('test/result/components/replace-chunk.json', {
  getResults() {
    const { input: i, index, length, chunk } = this.input
    return replaceChunk(i, index, length, chunk)
  },
  jsonProps: ['input'],
})