import makeTestSuite from '@zoroaster/mask'
import Context from '../context'
import TempContext from 'temp-context'

export default makeTestSuite('test/result/bin', {
  context: TempContext,
  fork: {
    module: Context.BIN,
    /**
     * @param {string[]} args
     * @param {TempContext} t
     */
    async getArgs(args, { write }) {
      const path = await write('index.jsx', this.input)
      return [path]
    },
    normaliseOutputs: true,
  },
})
