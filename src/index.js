import transpileJSX from './lib/components'
import { SyncReplaceable,
  makeMarkers, makeCutRule, makePasteRule } from 'restream'

/**
 * Process a JSX file.
 * @param {string} input The source code with JSX to transpile.
 * @param {Config} config Options for the program.
 * @param {boolean} [config.quoteProps=false] Whether to surround property names with quotes, e.g., for the Google Closure Compiler. Default `false`.
 */
const jsx = (input, config = {}) => {
  const { e, i, ias, ii } = makeMarkers({
    e: /^ *export\s+(?:default\s+)?/mg,
    i: /^ *import(\s+([^\s,]+)\s*,?)?(\s*{(?:[^}]+)})?\s+from\s+['"].+['"]/gm,
    ias: /^ *import\s+(?:(.+?)\s*,\s*)?\*\s+as\s+.+?\s+from\s+['"].+['"]/gm,
    ii: /^ *import\s+['"].+['"]/,
  }, {
    getReplacement(name, index) {
      return `/*%%_RESTREAM_${name.toUpperCase()}_REPLACEMENT_${index}_%%*/`
    },
    getRegex(name) {
      return new RegExp(`/\\*%%_RESTREAM_${name.toUpperCase()}_REPLACEMENT_(\\d+)_%%\\*/`, 'g')
    },
  })
  const s = SyncReplaceable(input, [makeCutRule(e),
    makeCutRule(i), makeCutRule(ias), makeCutRule(ii)])
  const tt = transpileJSX(s, config)
  const as = SyncReplaceable(tt, [makePasteRule(e),
    makePasteRule(i), makePasteRule(ias), makePasteRule(ii)])
  return as
}

export default jsx

/* documentary types/index.xml */
/**
 * @typedef {Object} Config Options for the program.
 * @prop {boolean} [quoteProps=false] Whether to surround property names with quotes, e.g., for the Google Closure Compiler. Default `false`.
 */
