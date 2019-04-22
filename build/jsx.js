const { _input } = require('./get-args');
let read = require('@wrote/read'); if (read && read.__esModule) read = read.default;
const jsx = require('./');

(async () => {
  const code = await read(_input)
  const res = jsx(code)
  console.log(res)
})()