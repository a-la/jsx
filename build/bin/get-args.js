let argufy = require('argufy'); if (argufy && argufy.__esModule) argufy = argufy.default;

const argsConfig = {
  'input': {
    description: 'The location of the file to transpile.',
    command: true,
  },
  'preact': {
    description: 'Whether to quote props for _Preact_.',
    boolean: true,
    short: 'p',
  },
}

const args = argufy(argsConfig)

/**
 * The location of the file to transpile.
 */
const _input = /** @type {string} */ (args['input'])

/**
 * Whether to quote props for _Preact_.
 */
const _preact = /** @type {boolean} */ (args['preact'])

/**
 * The additional arguments passed to the program.
 */
const _argv = /** @type {!Array<string>} */ (args._argv)

module.exports.argsConfig = argsConfig
module.exports._input = _input
module.exports._preact = _preact
module.exports._argv = _argv