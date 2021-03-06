import { SyncReplaceable } from 'restream'
import { upgrade } from './upgrade'

/**
 * Returns the name of the opening tag from the string starting with <, or `undefined`.
 * @param {string} string The string where to find the tag.
 * @example
 * const s = '<div>hello world</div>'
 * const tag = getTagName(s) // div
 */
export const getTagName = (string) => {
  const [, tagName] = /<\s*(.+?)(?:\s+[\s\S]+)?\s*\/?\s*>/.exec(string) || []
  return tagName
}

// * const getClass = o => Object.keys(o).join(' ')

/**
 * Returns positions of where properties open and close.
 * @param {string} props
 */
const getPositions = (props) => {
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
  return positions
}

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
export const getProps = (props, {
  withClass = false, // when property starts with a Capital letter -> class
  classNames = [],
  renameMap = {},
} = {}) => {
  const positions = getPositions(props)
  let obj = {}
  const whitespace = {}
  const lastClose = positions.reduce((acc, { open, close }, i) => {
    const before = props.slice(acc, open)
    const val = props.slice(open + 1, close)
    const isDestructuring = /\s*\.\.\./.test(val)
    let wsBefore, propName, wsBeforeAssign, afterAssign
    if (isDestructuring) {
      [, wsBefore] = /(\s*)$/.exec(before) || []
    } else {
      [, wsBefore, propName, wsBeforeAssign, afterAssign] = /(\s*)(\S+)(\s*)=(\s*)$/.exec(before) || []
    }
    if (!propName && !isDestructuring)
      throw new Error('Could not detect prop name')

    // get plain beforehand
    const beforeOrNot = before || '' // when using destructuring
    const propOrNot = propName || ''
    const bb = beforeOrNot.slice(0, beforeOrNot.length - propOrNot.length - 1)
    const { plain, whitespace: ws } = getPlain(bb)
    Object.assign(obj, plain)
    Object.assign(whitespace, ws)

    if (!propName) {
      const tempPropName = `$%_DESTRUCTURING_PLACEHOLDER_${i}%$`
      obj = { ...obj, [tempPropName]: val }
      whitespace[tempPropName] = { before: wsBefore }
    } else {
      obj = { ...obj, [propName]: val }
      whitespace[propName] = { before: wsBefore, beforeAssign: wsBeforeAssign, afterAssign }
    }

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
  let ro = obj
  if (Array.isArray(classNames)) {
    classNames = classNames.reduce((acc, c) => { acc[c] = true; return acc }, {})
  }
  let usedClassNames = {}
  if (withClass || Object.keys(classNames).length) {
    ({ ro, usedClassNames } = upgrade(obj, classNames, withClass, renameMap))
  }
  return {
    obj: ro, whitespace, usedClassNames,
  }
}

/**
 * Returns the matches without {}, such as `id="test"`.
 * @param {string} string The string with plain attributes.
 */
const getPlain = (string) => {
  const r = []
  const whitespace = {}
  const res = string.replace(/(\s*)(\S+)(\s*)=(\s*)(["'])([\s\S]*?)\5/g, (m, wsBefore, name, wsBeforeAssign, wsAfterAssign, q, val, i) => {
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
 * @param {!Object<string, string>} pp The properties out of which to make a string object.
 * @returns {string|null} Either a JS object body string, or null if no keys were in the object.
 */
export const makeObjectBody = (pp, quoteProps = false, whitespace = {}, beforeCloseWs = '', usedClassNames = {}) => {
  const keys = Object.keys(pp)
  const { length } = keys
  if (!length) return '{}'
  const pr = `{${keys.reduce((ACC, k) => {
    const v = pp[k]
    const { before = '', beforeAssign = '', afterAssign = '' } = whitespace[k] || {}
    if (k.startsWith('$%_DESTRUCTURING_PLACEHOLDER_')) {
      return `${ACC}${before}${v},`
    }
    if (usedClassNames[k]) return `${ACC}${before}${''.repeat(k.length)}`
    const kk = quoteProps || k.indexOf('-') != -1 ? `'${k}'` : k
    return `${ACC}${before}${kk}${beforeAssign}:${afterAssign}${v},`
  }, '').replace(/,(\s*)$/, '$1')}${beforeCloseWs}}`
  return pr
}

export const isComponentName = (tagName = '') => {
  const [t] = tagName
  if (!t) throw new Error('No tag name is given')
  return t.toUpperCase() == t
}

/**
 * Creates a string invocation of the pragma function.
 * @param {string} tagName The name of the tag to create, or a reference to a component function.
 * @param {!Object<string, string>} props The properties of the element. The properties' values can be passed as strings or references as the `e` function will be called under the scope in which the JSX is written, e.g., when creating components `const C = ({ reference }) => <div id={reference} class="String"/>`.
 * @param {!Array<string>} children The array with the child nodes which are strings, but encode either a reference, a string or an invocation the the `e` function again. Thus the jsx is parsed recursively depth-first.
 * @example
 *
 * const r = pragma('div', { id: "'STATIC_ID'" }, ["'Hello, '", "test", "'!'"])
 * // =>
 * e('div',{ id: 'STATIC_ID' },['Hello, ', test, '!'])
 */
export const pragma = (tagName, props = {}, children = [],
  { quoteProps = false, warn = null, whitespace = {}, beforeCloseWs = '', usedClassNames } = {}) => {
  const cn = isComponentName(tagName)
  const tn = cn ? tagName : `'${tagName}'`
  if (!Object.keys(props).length && !children.length) {
    return `h(${tn})`
  }
  const qp = cn && quoteProps == 'dom' ? false : quoteProps
  const hasDestructuring = Object.entries(props)
    .map(([k, v]) => {
      if (k.startsWith('$%_DESTRUCTURING_PLACEHOLDER_')) return v
      return null
    }).filter(Boolean)

  if (!cn && hasDestructuring && (!quoteProps || quoteProps == 'dom')) {
    warn && warn(`JSX: destructuring ${hasDestructuring.join(', ')} is used without quoted props on HTML ${tagName}.`)
  }
  const pr = makeObjectBody(props, qp, whitespace, beforeCloseWs, usedClassNames)
  const c = children.reduce((acc, cc, i) => {
    const prev = children[i-1]
    let comma = ''
    if (prev && /^\/\*[\s\S]*\*\/$/.test(prev)) comma = ''
    else if (prev && /\S/.test(prev)) comma = ','
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
 * @param {number} index The index of the `<` found with `detect-jsx.findPosition`.
 * @param {number} length The length of the string that needs to be cut out.
 * @param {string} chunk The new string that needs to be placed back into the input.
 *
 */
export
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