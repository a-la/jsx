/**
 * Make a quoted string to interpret by JS.
 * @example
 *
 * getQuoted('The mind always seeks to equilibrium.')
 * // => 'The mind always seeks to equilibrium.'
 */
       const getQuoted = (s) => `\`${s}\``

/**
 * Returns the array of children for an element by extracting the parts in `{}`.
 * @param {string} string
 * @example
 * parseSimpleContent('Hello, {test}!') // ['Hello, ', test, '!']
 */
       const parseSimpleContent = (string) => {
  const temps = []
  // let prev = 0
  string.replace(/{\s*(.*?)\s*}/g, ({ length }, expression, i) => {
    const a = { from: i, to: i + length, expression }
    temps.push(a)
  })
  const res = temps.length ? getTemps(string, temps) : [getQuoted(string)]
  return res
}

/**
 * Returns the array with broken down string parts either as other strings or expressions.
 * @param {string} string The initial string.
 * @param {{from: number, to: number, expression: string }[]} temps
 * @return {string[]}
 * @private This is called by parseSimpleContent.
 */
const getTemps = (string, temps) => {
  let lastTo = 0
  const ar = temps.reduce((acc, { from, to, expression }) => {
    const b = string.slice(lastTo, from)
    if (b) acc.push(getQuoted(b))
    lastTo = to
    acc.push(expression)
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