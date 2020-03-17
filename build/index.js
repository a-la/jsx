const transpileJSX = require('./lib/components');
const { SyncReplaceable,
  makeMarkers, makeCutRule, makePasteRule } = require('restream');

/**
 * @type {_alaJsx.jsx}
 */
const jsx = (input, config = {}) => {
  const { e, defObj, ef, i, ias, ii } = makeMarkers({
    defObj: /^ *export\s+default\s+{[\s\S]+?}/mg,
    e: /^ *export\s+(?:default\s+)?/mg,
    ef: /^ *export\s+{[^}]+}(?:\s+from\s+(['"])(?:.+?)\1)?/mg,
    i: /^ *import(\s+([^\s,]+)\s*,?)?(\s*{(?:[^}]+)})?\s+from\s+['"].+['"]/gm,
    ias: /^ *import\s+(?:(.+?)\s*,\s*)?\*\s+as\s+.+?\s+from\s+['"].+['"]/gm,
    ii: /^ *import\s+(['"]).+\1/gm,
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

module.exports=jsx

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../compile')} _alaJsx.jsx
 */