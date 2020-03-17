/**
 * Updates properties into class names.
 * @param {Object} obj The object with properties.
 * @param {Object<string, string|boolean>} classNames A map of class names.
 */
export const upgrade = (obj, classNames, withClass, renameMap) => {
  let ro = obj, usedClassNames = {}
  ;({ ...ro } = obj)
  const cl = []
  Object.entries(ro).forEach(([k, v]) => {
    if (v != 'true') return
    const p = (actualClassName = k) => {
      usedClassNames[k] = true
      cl.push(actualClassName)
      // delete ro[k]
    }
    const className = classNames[k]
    if (className) p(typeof className == 'string' ? className : undefined)
    else if (withClass) {
      const l = k[0]
      if (l.toUpperCase() == l) p()
    }
  })

  if (cl.length) {
    const className = cl.map((cn) => {
      const r = cn in renameMap ? renameMap[cn] : cn
      return r
    }).join(' ')
    if (ro.className) {
      if (/[`"']$/.test(ro.className)) {
        ro.className = ro.className.replace(/([`"'])$/, ` ${className}$1`)
      } else
        ro.className += `+' ${className}'`
    } else if (ro.class) {
      if (/[`"']$/.test(ro.class)) {
        ro.class = ro.class.replace(/([`"'])$/, ` ${className}$1`)
      } else
        ro.class += `+' ${className}'`
    } else {
      ro.className = `'${className}'`
    }
  }
  return { ro, usedClassNames }
}