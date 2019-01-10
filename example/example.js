/* yarn example/ */
import read from '@wrote/read'
import jsx from '../src'

(async () => {
  const code = await read('example/Component.jsx')
  const res = jsx(code)
  console.log(res)
})()