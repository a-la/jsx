let detectJSX = require('@a-la/detect-jsx'); if (detectJSX && detectJSX.__esModule) detectJSX = detectJSX.default;
const { parseSimpleContent } = require('./parse-content');
const { pragma, replaceChunk, getProps } = require('./');
const extract = require('./extract'); const { ExtractedJSX } = extract;


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
  const { quoteProps, warn } = config
  const position = detectJSX(input)
  if (position === null) return input

  const s = input.slice(position)
  const { props = '', content, tagName, string: { length } } = extract(s)
  const children = parseContent(content, quoteProps, warn)
  const { obj, destructuring } = getProps(props)
  const f = pragma(tagName, obj, children, destructuring, quoteProps, warn)
  const res = replaceChunk(input, position, length, f)
  // find another one one
  const newRes = transpileJSX(res, config)
  return newRes
}

module.exports=transpileJSX

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
       const parseContent = (content, quoteProps = false, warn) => {
  if (!content) return []
  // const C = content
  // .split('\n').filter(a => !/^\s*$/.test(a)).join('\n')
  const contents = parseSimpleContent(content) // split by expressions
  const jsx = contents.reduce((acc, string) => {
    if (string instanceof ExtractedJSX) {
      const { props = '', content: part, tagName } = string
      const { obj, destructuring } = getProps(props)
      const children = parseContent(part, quoteProps, warn)
      const p = pragma(tagName, obj, children, destructuring, quoteProps, warn)
      return [...acc, p]
    }
    const j = detectJSX(string)
    if (j) {
      const s = string.slice(j)
      const { string: { length }, props = '', content: part, tagName } = extract(s)
      const { obj, destructuring } = getProps(props)
      const children = parseContent(part, quoteProps, warn)
      const p = pragma(tagName, obj, children, destructuring, quoteProps, warn)
      const strBefore = string.slice(0, j)
      const strAfter = string.slice(j + length)
      return [...acc, `${strBefore}${p}${strAfter}`]
    }
    return [...acc, string]
  }, [])
  return jsx
}

module.exports.parseContent = parseContent