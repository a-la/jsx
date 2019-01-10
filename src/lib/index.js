import mismatch from 'mismatch'

/**
 * Returns the name of the opening tag from the string starting with <, or `undefined`.
 * @param {string} string The string where to find the tag.
 * @example
 * const s = '<div>hello world</div>'
 * const tag = getTagName(s) // div
 */
export const getTagName = (string) => {
  const [, tagName] = /<\s*(.+?)(?:\s+.+)?\s*\/?\s*>/.exec(string) || []
  return tagName
}

// * const getClass = o => Object.keys(o).join(' ')

/**
 * Parses a string with attributes written in jsx, e.g., `id={id}`.
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
export
const getProps = (props) => {
  const res = mismatch(/([^\s]+)\s*=\s*{(.+?)}/g, props, ['n', 'v'])
    .reduce((acc, { n, v }) => {
      acc[n] = v
      return acc
    }, {})
  return res
}

/**
 * Accepts the parsed node properties to make a JS object string out of them.
 * @param {Object.<string, string>} pp The properties out of which to make a string object.
 * @returns {string|null} Either a JS object body string, or null if no keys were in the object.
 */
export
const makeObjectBody = pp => {
  const { length } = Object.keys(pp)
  const pr = length ? `{${Object.keys(pp).reduce((a, k) => {
    const v = pp[k].trim()
    return [...a, `${k}:${v}`]
  }, []).join(',')}}` : null
  return pr
}

export const isComponentName = (tagName) => {
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
export const pragma = (tagName, props = {}, children = []) => {
  const tn = isComponentName(tagName) ? tagName : `'${tagName}'`
  if (typeof children == 'string') {
    const pr = makeObjectBody(props)
    return    `p(${tn},${pr},${children.join(',')})`
  } else if     (typeof props == 'string') {
    return    `e(${tn},${props})`
  } else     if (Array.isArray(props)) {
    return    `e(${tn},${props.join(',')})`
  }
  const pr = makeObjectBody(props)
  const res = `p(${tn},${pr},${children.join(',')})`
  return res
}

export const newPragma = (tagName, ...args) => {
  return `e('${tagName}',${args.join(',')})`
}

// * @todo In strict mode, when the length is more, throws an error. In advanced mode, the replacement should be aligned so it is possible to debug it.

/**
 * Replaces a piece of string inside of a string with another chunk.
 * @param {string} input The string inside of which the chunk needs to be replaced.
 * @param {string} index The index of the `<` found with `detect-jsx.findPosition`.
 * @param {string} length The length of the string that needs to be cut out.
 * @param {string} chunk The new string that needs to be placed back into the input.
 *
 */
export
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