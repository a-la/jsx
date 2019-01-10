let mismatch = require('mismatch'); if (mismatch && mismatch.__esModule) mismatch = mismatch.default;
const { SyncReplaceable } = require('restream');

const UNDEFINED = Symbol()

/**
 * Returns the name of the opening tag from the string starting with <, or `undefined`.
 * @param {string} string The string where to find the tag.
 * @example
 * const s = '<div>hello world</div>'
 * const tag = getTagName(s) // div
 */
       const getTagName = (string) => {
  const [, tagName] = /<\s*(.+?)(?:\s+[\s\S]+)?\s*\/?\s*>/.exec(string) || []
  return tagName
}

// * const getClass = o => Object.keys(o).join(' ')

/**
 * Parses a string with attributes written in jsx, e.g., `id={id}` into an object.
 * @param {string} props The string with properties in the tag
 * @example
 *
 * const El = getProps("class={'hello world'} id={id}")
 * // =>
   {
     class: "'hello world'",
     id: 'id'
    }
 *
 */

const getProps = (props) => {
  let stack = 0
  const positions = []
  let current
  SyncReplaceable(props, [
    {
      re: /[{}]/g,
      replacement(m, i) {
        const closing = m == '}'
        const opening = !closing
        if (!stack && closing)
          throw new Error('A closing } is found without opening one.')
        stack += opening ? 1 : -1
        if (stack == 1 && opening) {
          current = {
            open: i,
          }
        } else if (stack == 0 && closing) {
          current.close = i
          positions.push(current)
          current = {}
        }
      },
    },
  ])
  if (stack) throw new Error(`Unbalanced props (level ${stack})`)
  const obj = {}
  const destructuring = []
  const lastClose = positions.reduce((acc, { open, close }) => {
    const before =props.slice(acc, open)
    const [, propName] = /(\S+)\s*=\s*$/.exec(before) || []
    const val = props.slice(open + 1, close)
    if (!propName && !/\s*\.\.\./.test(val))
      throw new Error('Could not detect prop name')
    if (!propName) {
      destructuring.push(val)
    } else {
      obj[propName] = val
    }
    const beforeOrNot = before || '' // when using destructuring
    const propOrNot = propName || ''
    const bb = beforeOrNot.slice(0, beforeOrNot.length - propOrNot.length - 1)
    const plain = getPlain(bb)
    Object.assign(obj, plain)
    return close + 1
  }, 0)
  // make sure plain attrs are there when no {} are given
  if (!positions.length) {
    const plain = getPlain(props)
    Object.assign(obj, plain)
  } else {
    const whatsLeft = props.slice(lastClose)
    const plain = getPlain(whatsLeft)
    Object.assign(obj, plain)
  }
  return { obj, destructuring }
}

/**
 * Returns the matches without {}, such as `id="test"`.
 * @param {string} string The string with plain attributes.
 */
const getPlain = (string) => {
  const res = mismatch(/(\S+)\s*=\s*(["'])([\s\S]+?)\2/g, string, ['n', 'q', 'v'])
    .reduce((acc, { n, v, q }) => {
      acc[n] = `${q}${v}${q}`
      return acc
    }, {})
  return res
}

/**
 * Accepts the parsed node properties to make a JS object string out of them.
 * @param {Object.<string, string>} pp The properties out of which to make a string object.
 * @returns {string|null} Either a JS object body string, or null if no keys were in the object.
 */

const makeObjectBody = (pp, destructuring = []) => {
  const { length } = Object.keys(pp)
  if (!length && !destructuring.length) return '{}'
  const pr = `{${Object.keys(pp).reduce((a, k) => {
    const v = pp[k]
    return [...a, `${k}:${v}`]
  }, destructuring).join(',')}}`
  return pr
}

       const isComponentName = (tagName = '') => {
  const [t] = tagName
  if (!t) throw new Error('No tag name is given')
  return t.toUpperCase() == t
}

/**
 * Creates a string invocation of the pragma function.
 * @param {string} tagName The name of the tag to create, or a reference to a component function.
 * @param {Object.<string, string>} props The properties of the element. The properties' values can be passed as strings or references as the `e` function will be called under the scope in which the JSX is written, e.g., when creating components `const C = ({ reference }) => <div id={reference} class="String"/>`.
 * @param {string[]} children The array with the child nodes which are strings, but encode either a reference, a string or an invocation the the `e` function again. Thus the jsx is parsed recursively depth-first.
 * @example
 *
 * const r = pragma('div', { id: "'STATIC_ID'" }, ["'Hello, '", "test", "'!'"])
 * // =>
 * e('div',{ id: 'STATIC_ID' },['Hello, ', test, '!'])
 */
       const pragma = (tagName, props = {}, children = [], destructuring = []) => {
  const tn = isComponentName(tagName) ? tagName : `'${tagName}'`
  // if (typeof children == 'string') {
  //   const pr = makeObjectBody(props)
  //   return    `p(${tn},${pr},${children.join(',')})`
  // } else if     (typeof props == 'string') {
  //   return    `e(${tn},${props})`
  // } else     if (Array.isArray(props)) {
  //   return    `e(${tn},${props.join(',')})`
  // }
  if (!Object.keys(props).length && !children.length && !destructuring.length) {
    return `h(${tn})`
  }
  const pr = makeObjectBody(props, destructuring)
  const c = children.join(',')
  const res = `h(${tn},${pr}${c ? `,${c}` : ''})`
  return res
}

// export const newPragma = (tagName, ...args) => {
//   return `e('${tagName}',${args.join(',')})`
// }

// * @todo In strict mode, when the length is more, throws an error. In advanced mode, the replacement should be aligned so it is possible to debug it.

/**
 * Replaces a piece of string inside of a string with another chunk.
 * @param {string} input The string inside of which the chunk needs to be replaced.
 * @param {string} index The index of the `<` found with `detect-jsx.findPosition`.
 * @param {string} length The length of the string that needs to be cut out.
 * @param {string} chunk The new string that needs to be placed back into the input.
 *
 */

const replaceChunk = (input, index, length, chunk) => {
  const before = input.slice(0, index)
  const after = input.slice(index + length)
  const ld = length - chunk.length
  if (ld < 0)
    console.warn('The chunks length is more that replaced input')
    // throw new Error('The length of the chunk cannot be more than of the replaced value.')
  let p = chunk
  if (ld > 0) {
    p = `${' '.repeat(ld)}${p}`
  }
  const res = `${before}${p}${after}`
  return res
}

module.exports.getTagName = getTagName
module.exports.getProps = getProps
module.exports.makeObjectBody = makeObjectBody
module.exports.isComponentName = isComponentName
module.exports.pragma = pragma
module.exports.replaceChunk = replaceChunk