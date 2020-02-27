import transpileJSX from './lib/components'
import { SyncReplaceable,
  makeMarkers, makeCutRule, makePasteRule } from 'restream'

/**
 * Process a JSX file.
 * @param {string} input The source code with JSX to transpile.
 * @param {!_alaJsx.Config} config Options for the program.
 * @param {(boolean|string)} [config.quoteProps=false] Whether to surround property names with quotes. When the `dom` string is passed, it will only quote props for invoking html components, i.e., those that start with a lowercase letter (E.g., for the _Google Closure Compiler_). Default `false`.
 * @param {function(...string)} [config.warn] The function to receive warnings, e.g., when destructuring of properties is used on dom elements (for Closure Compiler).
 * @param {boolean} [config.prop2class=false] If a property name starts with a capital letter, the `className` of the _VNode_ will be updated. Default `false`.
 * @param {!Array<string>|!Object} [config.classNames] The list of properties to put into the `className` property.
 * @param {!Object<string, string>} [config.renameMap] How to rename classes (only applies to `prop2class` and `classNames`).
 */
const jsx = (input, config = {}) => {
  const { e, defObj, ef, i, ias, ii } = makeMarkers({
    defObj: /^ *export\s+default\s+{[\s\S]+?}/mg,
    e: /^ *export\s+(?:default\s+)?/mg,
    ef: /^ *export\s+{[^}]+}\s+from\s+(['"])(?:.+?)\1/mg,
    i: /^ *import(\s+([^\s,]+)\s*,?)?(\s*{(?:[^}]+)})?\s+from\s+['"].+['"]/gm,
    ias: /^ *import\s+(?:(.+?)\s*,\s*)?\*\s+as\s+.+?\s+from\s+['"].+['"]/gm,
    ii: /^ *import\s+['"].+['"]/gm,
  }, {
    getReplacement(name, index) {
      return `/*%%_RESTREAM_${name.toUpperCase()}_REPLACEMENT_${index}_%%*/`
    },
    getRegex(name) {
      return new RegExp(`/\\*%%_RESTREAM_${name.toUpperCase()}_REPLACEMENT_(\\d+)_%%\\*/`, 'g')
    },
  })
  const s = SyncReplaceable(input, [
    makeCutRule(ef), makeCutRule(defObj), makeCutRule(e),
    makeCutRule(i), makeCutRule(ias), makeCutRule(ii)])
  const tt = transpileJSX(s, config)
  const as = SyncReplaceable(tt, [
    makePasteRule(ef), makePasteRule(defObj), makePasteRule(e),
    makePasteRule(i), makePasteRule(ias), makePasteRule(ii)])
  return as
}

export default jsx

/* documentary types/index.xml */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_alaJsx.Config} Config Options for the program.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _alaJsx.Config Options for the program.
 * @prop {(boolean|string)} [quoteProps=false] Whether to surround property names with quotes. When the `dom` string is passed, it will only quote props for invoking html components, i.e., those that start with a lowercase letter (E.g., for the _Google Closure Compiler_). Default `false`.
 * @prop {function(...string)} [warn] The function to receive warnings, e.g., when destructuring of properties is used on dom elements (for Closure Compiler).
 * @prop {boolean} [prop2class=false] If a property name starts with a capital letter, the `className` of the _VNode_ will be updated. Default `false`.
 * @prop {!Array<string>|!Object} [classNames] The list of properties to put into the `className` property.
 * @prop {!Object<string, string>} [renameMap] How to rename classes (only applies to `prop2class` and `classNames`).
 */
