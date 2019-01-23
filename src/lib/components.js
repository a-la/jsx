import detectJSX from '@a-la/detect-jsx'
import { SyncReplaceable } from 'restream'
import { parseSimpleContent } from './parse-content'
import { pragma, replaceChunk, getProps } from './'
import extract, { ExtractedJSX } from './extract'


/* <div id={'id'}>
  Hello, {test}! {children}
  <div class={'TEST'} id={id}>test</div>
</div> */

/**
 * The entry point to transpiling a file.
 * @param {string} input The string to transpile.
 * @returns {string} The transpiled source code with `h` pragma for hyperscript invocations.
 */
const transpileJSX = (input, config = {}) => {
  const { quoteProps } = config
  const position = detectJSX(input)
  if (position === null) return input

  const s = input.slice(position)
  const { props = '', content, tagName, string: { length } } = extract(s)
  const children = parseContent(content, quoteProps)
  const { obj, destructuring } = getProps(props)
  const f = pragma(tagName, obj, children, destructuring, quoteProps)
  const res = replaceChunk(input, position, length, f)
  // find another one one
  const newRes = transpileJSX(res, config)
  return newRes
}

export default transpileJSX

// let f
// if (props) {
//   f = pragma(tagName, prop, children) // `p(tag, { ...props }, children)`
// } else if (children.length == 1) {
//   f = pragma(tagName, children[0]) // `e(tag, child)`
// } else if (children.length) {
//   f = newPragma(tagName, ...children) // `e(tag, child, child2)`
// }

// parse the content bro parse it
/**
 * This function will return an array with content of a jsx tag, and the content can be a function to create an element (pragma), a string, or an expression.
 * @param {string} content
 * @param {boolean} [quoteProps=false] Whether to quote properties.
 */
export const parseContent = (content, quoteProps = false) => {
  if (!content) return []
  // const C = content
  // .split('\n').filter(a => !/^\s*$/.test(a)).join('\n')
  const contents = parseSimpleContent(content) // split by expressions
  const jsx = contents.reduce((acc, string) => {
    if (string instanceof ExtractedJSX) {
      const { props = '', content: part, tagName } = string
      const { obj, destructuring } = getProps(props)
      const children = parseContent(part, quoteProps)
      const p = pragma(tagName, obj, children, destructuring, quoteProps)
      return [...acc, p]
    }
    const j = detectJSX(string)
    if (j) {
      const s = string.slice(j)
      const { string: { length }, props = '', content: part, tagName } = extract(s)
      const { obj, destructuring } = getProps(props)
      const children = parseContent(part, quoteProps)
      const p = pragma(tagName, obj, children, destructuring, quoteProps)
      const strBefore = string.slice(0, j)
      const strAfter = string.slice(j + length)
      return [...acc, `${strBefore}${p}${strAfter}`]
    }
    return [...acc, string]
  }, [])
  return jsx
}