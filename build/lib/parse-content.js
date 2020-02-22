const { SyncReplaceable } = require('restream');
const extract = require('./extract');

/**
 * Make a quoted string to interpret by JS.
 * @param {string} s
 * @example
 *
 * getQuoted('The mind always seeks to equilibrium.')
 * // result:
 * `The mind always seeks to equilibrium.`
 */
const getQuoted = (s) => {
  let _b = '', _a = ''
  const r = s
    .replace(/^(\r?\n\s*)([\s\S]+)?/, (m, b, v = '') => {
      _b = b
      return v
    })
    .replace(/([\s\S]+?)?(\r?\n\s*)$/, (m, v = '', a = '') => {
      _a = a
      return v
    })
  const rr = r ? `\`${r}\`` : ''
  return `${_b}${rr}${_a}`
}

/**
 * Returns the array of children for an element by extracting the parts in `{}`.
 * @param {string} string
 * @example
 * parseSimpleContent('Hello, {test}!')
 * // result:
 * [`Hello, `, test, `!`]
 */
const parseSimpleContent = (string) => {
  const temps = []
  // let prev = 0
  let current = {}
  let expressionStack = 0
  let jsxStack = 0
  SyncReplaceable(string, [{
    re: /[<{}]/g,
    replacement(m, i) {
      if (i < jsxStack) return // blocked by jsx
      const isExpression = /[{}]/.test(m)
      let opening
      if (isExpression) {
        opening = m == '{'
        expressionStack += opening ? 1 : -1
        if (expressionStack == 1 && current.from == undefined) current.from = i
        else if (expressionStack == 0) {
          current.to = i + 1
          current.expression = string.slice(current.from + 1, i)
          temps.push(current)
          current = {}
        }
      } else {
        if (expressionStack) return m
        const extractedJsx = extract(string.slice(i))
        jsxStack = i + extractedJsx.string.length
        current.extractedJsx = extractedJsx
        current.to = jsxStack
        current.from = i
        temps.push(current)
        current = {}
      }
    },
  }, {
  }])
  const res = temps.length ? getTemps(string, temps) : [getQuoted(string)]
  return res
}

/**
 * Returns the array with broken down string parts either as other strings or expressions.
 * @param {string} string The initial string.
 * @param {Array<!{from: number, to: number, expression: string }>} temps
 * @return {!Array<string>}
 * @private This is called by parseSimpleContent.
 */
const getTemps = (string, temps) => {
  let lastTo = 0
  const ar = temps.reduce((acc, { from, to, expression, extractedJsx }) => {
    const b = string.slice(lastTo, from)
    if (b) acc.push(getQuoted(b))
    lastTo = to
    if (expression) acc.push(expression)
    else if (extractedJsx) acc.push(extractedJsx)
    return acc
  }, [])
  if (lastTo < string.length) {
    const a = string.slice(lastTo, string.length)
    // .trim()
    if (a) ar.push(getQuoted(a))
  }
  return ar
}

module.exports.getQuoted = getQuoted
module.exports.parseSimpleContent = parseSimpleContent