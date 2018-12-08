import { SyncReplaceable } from 'restream'
import { getTagName } from './'

/**
 * Returns the outer body of the tag.
 * @param {string} stringWithTag The string in which to find the closing tag. Must start with a `<`.
 */
const extract = (stringWithTag) => {
  const tagName = getTagName(stringWithTag)
  const re = new RegExp(`<\\s*(/)?\\s*${tagName}(\\s+.+?)?\\s*(/\\s*>|>)`, 'g')
  let stack = 0
  let end
  let e
  let start
  let props
  SyncReplaceable(stringWithTag, [
    {
      re,
      replacement(m, closing = false, p, selfClosing, i) {
        const isSelfClosing = selfClosing.trimLeft().startsWith('/')
        if (!start) {
          start = i + m.length
          props = p
        }
        if (!stack && closing)
          throw new Error('The tag closed before opening.')
        stack += closing ? -1 : 1
        if (stack == 0) {
          e = i
          end = i + m.length
        }
      },
    },
  ])
  if (!end)
    throw new Error('Could not find the matching closing tag.')
  const string = stringWithTag.slice(0, end)
  const content = string.slice(start, e)
  /**
   * The string with the
   * @type {string }
   */
  const s = string
  return { string: s, props, content, tagName }
}


export default extract