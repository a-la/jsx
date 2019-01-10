const transpileJSX = require('./lib/components');
const { SyncReplaceable,
  makeMarkers, makeCutRule, makePasteRule } = require('restream');

/**
 * Process a JSX file.
 * @param {string} input The source code with JSX to transpile.
 */
const jsx = (input) => {
  const { e } = makeMarkers({
    e: /^( *)(export\s+)(default\s+)?/mg,
  }, {
    getReplacement(name, index) {
      return `/*%%_RESTREAM_${name.toUpperCase()}_REPLACEMENT_${index}_%%*/`
    },
    getRegex(name) {
      return new RegExp(`/\\*%%_RESTREAM_${name.toUpperCase()}_REPLACEMENT_(\\d+)_%%\\*/`, 'g')
    },
  })
  const s = SyncReplaceable(input, [makeCutRule(e)])
  const tt = transpileJSX(s)
  const as = SyncReplaceable(tt, [makePasteRule(e)])
  return as
}

module.exports=jsx

/* documentary types/index.xml */
/**
 * @typedef {Object} Config Options for the program.
 * @prop {boolean} [shouldRun=true] A boolean option. Default `true`.
 * @prop {string} text A text to return.
 */
