import { equal, ok } from 'zoroaster/assert'
import Context from '../context'
import jsx from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof jsx, 'function')
  },
  async 'calls package without error'() {
    await jsx()
  },
  async 'gets a link to the fixture'({ FIXTURE }) {
    const res = await jsx({
      text: FIXTURE,
    })
    ok(res, FIXTURE)
  },
}

export default T