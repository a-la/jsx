import { SyncReplaceable, makeMarkers, makeCutRule } from 'restream'
import { getTagName } from './'

/**
 * Returns the outer body of the tag.
 * @param {string} stringWithTag The string in which to find the closing tag. Must start with a `<`.
 */
const extract = (stringWithTag) => {
  const tagName = getTagName(stringWithTag)
  const re = new RegExp(`<\\s*(/)?\\s*${tagName}(\\s+[\\s\\S]+?)?\\s*(/\\s*>|>)`, 'g')
  let stack = 0
  let end
  let contentEnd
  let contentStart
  let props
  const { arrow } = makeMarkers({
    arrow: /=>/g,
  })
  const preString = SyncReplaceable(stringWithTag, [
    makeCutRule(arrow),
    {
      re,
      replacement(m, closing = false, p = '', selfClosing, i) {
        const isSelfClosing = selfClosing.startsWith('/')
        // const realMatch = m.replace(arrow.regExp, '=>')
        // const realProps = p.replace(arrow.regExp, '=>')
        if (!contentStart) {
          contentStart = m.length
          props = p
        }
        if (!stack && closing)
          throw new Error('The tag closed before opening.')
        stack += closing ? -1 : 1
        if (stack == 0) {
          contentEnd = i
          end = i + m.length
        }
        return m
      },
    },
  ])
  if (!end)
    throw new Error('Could not find the matching closing tag.')
  const string = preString.slice(0, end)
  const content = preString.slice(contentStart, contentEnd)
  /**
   * The string with the
   * @type {string}
   */
  const s = string.replace(arrow.regExp, '=>')
  const pp = props.replace(arrow.regExp, '=>')
  return { string: s, props: pp, content, tagName }
}


export default extract