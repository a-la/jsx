/* yarn example/ */
import jsx from '../src'

(async () => {
  const res = await jsx({
    text: 'example',
  })
  console.log(res)
})()