import { makeTestSuite } from 'zoroaster'
import Context from '../context'
import jsx from '../../src'

const ts = makeTestSuite('test/result', {
  async getResults(input) {
    const res = await jsx({
      text: input,
    })
    return res
  },
  context: Context,
})

export default ts