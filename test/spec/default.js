import { equal, ok } from 'zoroaster/assert'
import Context from '../context'
import jsx from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof jsx, 'function')
  },
  'calls package without error'() {
    jsx()
  },
}

export default T