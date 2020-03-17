import { resolve } from 'path'
import { debuglog } from 'util'
import { EOL } from 'os'
import getStack from './get-stack'

const LOG = debuglog('@a-la/jsx')

const FIXTURE = resolve(__dirname, '../fixture')

/**
 * A testing context for the package.
 */
export default class Context {
  async _init() {
    LOG('init context')
  }
  static preprocess(s) {
    if (process.platform != 'win32') return s
    return s.replace(/([^\r])\n/g, `$1${EOL}`)
  }
  /**
   * Example method.
   */
  example() {
    return 'OK'
  }
  /**
   * Path to the fixture file.
   */
  get FIXTURE() {
    return resolve(FIXTURE, 'test.txt')
  }
  get SNAPSHOT_DIR() {
    return resolve(__dirname, '../snapshot')
  }
  getStack(string) {
    return getStack(string)
  }
  static get BIN() {
    return BIN
  }
  // async _destroy() {
  //   LOG('destroy context')
  // }
}

const BIN = process.env.ALAMODE_ENV == 'test-compile' ? 'compile/bin/jsx' : 'src/bin'