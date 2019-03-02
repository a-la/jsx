const a = 'abcad'
let stack = 1
a.replace(/a(.)/g, (m, f) => {
  stack++
  if (f == 'd') stack--
  else stack++
  return 'A'
})
if (stack) {
  console.log('this is file')
}