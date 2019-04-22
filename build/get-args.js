let argufy = require('argufy'); if (argufy && argufy.__esModule) argufy = argufy.default;

       const argsConfig = {
  'input': {
    description: 'The location of the file to transpile.',
    command: true,
  },
}
const args = argufy(argsConfig)

/**
 * The location of the file to transpile.
 */
       const _input = /** @type {string} */ (args['input'])

/**
 * The additional arguments passed to the program.
 */
       const _argv = /** @type {!Array<string>} */ (args._argv)

module.exports.argsConfig = argsConfig
module.exports._input = _input
module.exports._argv = _argv