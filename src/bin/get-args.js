import argufy from 'argufy'

export const argsConfig = {
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
export const _input = /** @type {string} */ (args['input'])

/**
 * Whether to quote props for _Preact_.
 */
export const _preact = /** @type {boolean} */ (args['preact'])

/**
 * The additional arguments passed to the program.
 */
export const _argv = /** @type {!Array<string>} */ (args._argv)