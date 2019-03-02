const { SyncReplaceable } = require('restream');

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
  if (stack) throw new Error(`Unbalanced props (level ${stack}) ${props}`)
  const obj = {}
  const destructuring = []
  const whitespace = {}
  const lastClose = positions.reduce((acc, { open, close }) => {
    const before = props.slice(acc, open)
    const [, wsBefore, propName, wsBeforeAssign, afterAssign] = /(\s*)(\S+)(\s*)=(\s*)$/.exec(before) || []
    const val = props.slice(open + 1, close)
    if (!propName && !/\s*\.\.\./.test(val))
      throw new Error('Could not detect prop name')
    if (!propName) {
      destructuring.push(val)
    } else {
      obj[propName] = val
    }
    whitespace[propName] = { before: wsBefore, beforeAssign: wsBeforeAssign, afterAssign }
    const beforeOrNot = before || '' // when using destructuring
    const propOrNot = propName || ''
    const bb = beforeOrNot.slice(0, beforeOrNot.length - propOrNot.length - 1)
    const { plain, whitespace: ws } = getPlain(bb)
    Object.assign(obj, plain)
    Object.assign(whitespace, ws)
    return close + 1
  }, 0)
  // make sure plain attrs are there when no {} are given
  if (!positions.length) {
    const { plain, whitespace: ws } = getPlain(props)
    Object.assign(obj, plain)
    Object.assign(whitespace, ws)
  } else {
    const whatsLeft = props.slice(lastClose)
    const { plain, whitespace: ws } = getPlain(whatsLeft)
    Object.assign(obj, plain)
    Object.assign(whitespace, ws)
  }
  return { obj, destructuring, whitespace }
}

/**
 * Returns the matches without {}, such as `id="test"`.
 * @param {string} string The string with plain attributes.
 */
const getPlain = (string) => {
  const r = []
  const whitespace = {}
  const res = string.replace(/(\s*)(\S+)(\s*)=(\s*)(["'])([\s\S]+?)\5/g, (m, wsBefore, name, wsBeforeAssign, wsAfterAssign, q, val, i) => {
    whitespace[name] = { before: wsBefore, beforeAssign: wsBeforeAssign, afterAssign: wsAfterAssign }
    r.push({ i, name, val: `${q}${val}${q}` })
    return '%'.repeat(m.length)
  })
  res.replace(/(\s*)([^\s%]+)/g, (m, ws, name, i) => {
    whitespace[name] = { before: ws }
    r.push({ i, name, val: 'true' }) // boolean
  })
  const obj = [...r.reduce((acc, { i, name, val }) => {
    acc[i] = [name, val]
    return acc
  }, [])].filter(Boolean).reduce((acc, [name, val]) => {
    acc[name] = val
    return acc
  }, {})
  return { plain: obj, whitespace }
}

/**
 * Accepts the parsed node properties to make a JS object string out of them.
 * @param {Object.<string, string>} pp The properties out of which to make a string object.
 * @returns {string|null} Either a JS object body string, or null if no keys were in the object.
 */

const makeObjectBody = (pp, destructuring = [], quoteProps = false, whitespace = {}, beforeCloseWs = '') => {
  const { length } = Object.keys(pp)
  if (!length && !destructuring.length) return '{}'
  const pr = `{${Object.keys(pp).reduce((a, k) => {
    const v = pp[k]
    const kk = quoteProps || k.indexOf('-') != -1 ? `'${k}'` : k
    const { before = '', beforeAssign = '', afterAssign = '' } = whitespace[k] || {}
    return [...a, `${before}${kk}${beforeAssign}:${afterAssign}${v}`]
  }, destructuring).join(',')}${beforeCloseWs}}`
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
 * @param {string[]} [destructuring] Any properties for destructuring.
 * @param {boolean} [quoteProps=false] Whether to quote the properties' keys (for Closure compiler).
 * @example
 *
 * const r = pragma('div', { id: "'STATIC_ID'" }, ["'Hello, '", "test", "'!'"])
 * // =>
 * e('div',{ id: 'STATIC_ID' },['Hello, ', test, '!'])
 */
       const pragma = (tagName, props = {}, children = [], destructuring = [], quoteProps = false, warn, whitespace, beforeCloseWs) => {
  const cn = isComponentName(tagName)
  const tn = cn ? tagName : `'${tagName}'`
  if (!Object.keys(props).length && !children.length && !destructuring.length) {
    return `h(${tn})`
  }
  const qp = cn && quoteProps == 'dom' ? false : quoteProps
  if (!cn && destructuring.length && (!quoteProps || quoteProps == 'dom')) {
    warn && warn(`JSX: destructuring ${destructuring.join(' ')} is used without quoted props on HTML ${tagName}.`)
  }
  const pr = makeObjectBody(props, destructuring, qp, whitespace, beforeCloseWs)
  const c = children.reduce((acc, cc, i) => {
    const prev = children[i-1]
    const comma = prev && /\S/.test(prev) ? ',' : ''
    return `${acc}${comma}${cc}`
  }, '')
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
  // if (ld < 0)
  // console.warn('The chunks length is more that replaced input')
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