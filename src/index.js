import transpileJSX from './lib/components'

/**
 * Process a JSX file.
 * @param {string} input The source code with JSX to transpile.
 */
const jsx = (input) => {
  const tt = transpileJSX(input)
  return tt
}

export default jsx

/* documentary types/index.xml */
/**
 * @typedef {Object} Config Options for the program.
 * @prop {boolean} [shouldRun=true] A boolean option. Default `true`.
 * @prop {string} text A text to return.
 */
