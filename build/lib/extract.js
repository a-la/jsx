const { SyncReplaceable, makeMarkers, makeCutRule } = require('restream');
const { getTagName } = require('./');

const findEnding = (string, rules = []) => {
  let stack = 0
  let contentEnd
  const preString = SyncReplaceable(string, [
    ...rules,
    {
      // once the tag is opened with <, its closing symbol > will always be even (nevermind comments & strings)
      re: /[<>]/g,
      replacement(m, i) {
        if (contentEnd) return m
        const opening = m == '<'
        const closing = !opening
        stack += opening ? 1 : -1
        if (stack == 0 && closing) {
          contentEnd = i
        }
        return m
      },
    },
  ])
  if (stack) throw new Error(1)
  return { preString, contentEnd }
}

/**
 * Returns the outer body of the tag.
 * @param {string} stringWithTag The string in which to find the closing tag. Must start with a `<`.
 */
const extract = (stringWithTag) => {
  const tagName = getTagName(stringWithTag)
  let contentEnd
  let props
  const { arrow } = makeMarkers({
    arrow: /=>/g,
  })
  let preString
  try {
    ({ preString, contentEnd } = findEnding(stringWithTag, [ makeCutRule(arrow) ]))
  } catch (err) {
    if (err === 1) throw new Error(`Could not find the matching closing > for ${tagName}.`)
  }

  const string = preString.slice(0, contentEnd + 1)
  let content = string
    .replace(/<\s*[^\s/>]+/, '')
  const selfClosing = /\/\s*>$/.test(content)
  if (selfClosing) {
    props = content.replace(/\/\s*>$/, '')
    content = ''
    return new ExtractedJSX({
      string: string.replace(arrow.regExp, '=>'),
      props: props.replace(arrow.regExp, '=>'),
      content: '',
      tagName,
    })
  }
  // now find the corresponding closing tag
  props = content.replace(/>$/, '')
  const contentStart = contentEnd + 1
  contentEnd = false
  let stack = 1
  let stringEnd
  SyncReplaceable(preString, [{
    // [\\s\\S] is to not catch the very beginning
    re: new RegExp(`[\\s\\S](?:<\\s*${tagName}(\\s+|>)|/\\s*${tagName}\\s*>)`, 'g'),
    replacement(m, opensClosing, i, s) {
      if (contentEnd) return m
      const closing = !opensClosing && m.endsWith('>')
      const opening = !closing

      if (opening) {
        const untilEnd = s.slice(i)
        const { contentEnd: ce } = findEnding(untilEnd
          .replace(/^[\s\S]/, ' ')
          // e.g., <span><a /><span></span></span>
          //                 ^
        )
        const t = untilEnd.slice(0, ce + 1)
        const tSelfClosing = /\/\s*>$/.test(t)
        if (tSelfClosing) return m
      }

      stack += opening ? 1 : -1
      if (stack == 0 && closing) {
        contentEnd = i
        stringEnd = contentEnd + m.length
      }
      return m
    },
  }])
  if (stack) throw new Error(`Could not find the matching closing </${tagName}>.`)
  content = preString.slice(contentStart, contentEnd)
  const string2 = preString.slice(0, stringEnd)
    .replace(arrow.regExp, '=>')

  return new ExtractedJSX({
    string: string2,
    props: props.replace(arrow.regExp, '=>'),
    content: content.replace(arrow.regExp, '=>'),
    tagName,
  })
}

       class ExtractedJSX {
  constructor(properties) {
    Object.assign(this, properties)
  }
}

module.exports=extract

module.exports.ExtractedJSX = ExtractedJSX