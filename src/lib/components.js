import { pragma, newPragma, replaceChunk } from '.'
import { parseSimpleContent } from './parse-content'
import detectJSX from '@a-la/detect-jsx'
import extract from './extract'
import { getProps } from '.'


/* <div id={'id'}>
  Hello, {test}! {children}
  <div class={'TEST'} id={id}>test</div>
</div> */

/**
 * @param {string} input
 */
const t = (input) => {
  const position = detectJSX(input)
  if (!position) return input

  const s = input.slice(position)
  const { props = '', content, tagName, string: { length } } = extract(s)
  const children = parseContent(content)
  const prop = getProps(props)
  const f = pragma(tagName, prop, children)
  const res = replaceChunk(input, position, length, f)
  // find another one one
  const newRes = t(res)
  return newRes
}

const main = () => {

}

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
 */
export const parseContent = (content) => {
  if (!content) return []
  const C = content.split('\n')
    // .filter(a => !/^\s*$/.test(a))
    .join('\n')
  const bl = C.indexOf('<')
  if (bl == -1) {
    const c = parseSimpleContent(C)
    return c
  }

  const b = C.slice(0, bl)
  const before = b ? parseSimpleContent(b) : []

  const trim = C.slice(bl)
  const { string: { length }, props = '', content: jsx, tagName } = extract(trim)
  const pp = getProps(props)
  const children = parseContent(jsx)
  const p = pragma(tagName, pp, children)

  const a = C.slice(bl + length)
  const after = a ? parseContent(a) : []

  return [
    ...before,
    p,
    ...after,
  ]
}

/**
 * Process a JSX file.
 */
export const jsx = (input) => {
  const tt = t(input)

  return tt
}