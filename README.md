# @a-la/jsx

[![npm version](https://badge.fury.io/js/%40a-la%2Fjsx.svg)](https://npmjs.org/package/@a-la/jsx)

`@a-la/jsx` is The JSX transform For ÀLamode And Other Packages.

```sh
yarn add -E @a-la/jsx
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`jsx(string: string, config: Config): string`](#jsxstring-stringconfig-config-string)
  * [`Config`](#type-config)
- [The Transform](#the-transform)
- [The Dynamic Method](#the-dynamic-method)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import jsx from '@a-la/jsx'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `jsx(`<br/>&nbsp;&nbsp;`string: string,`<br/>&nbsp;&nbsp;`config: Config,`<br/>`): string`

Returns the transpiled JSX code into `h` pragma calls.

__<a name="type-config">`Config`</a>__: Options for the program.

|    Name    |   Type    |                                      Description                                       | Default |
| ---------- | --------- | -------------------------------------------------------------------------------------- | ------- |
| quoteProps | _boolean_ | Whether to surround property names with quotes, e.g., for the Google Closure Compiler. | `false` |

```js
/* yarn example/ */
import read from '@wrote/read'
import jsx from '@a-la/jsx'

(async () => {
  const code = await read('example/Component.jsx')
  const res = jsx(code)
  console.log(res)
})()
```

*Given the component's source code:*
```jsx
const Title = <title>Example</title>

export const Component = ({ align = 'right' }) => {
  const props = {
    class: 'example',
    id: 'id',
  }
  return <div onClick={(e) => {
    e.preventDefault()
    alert('Hello World')
    return false
  }} role="aria-button">
    <Title/>
    <p {...props} align={align}>
      Hello World!
    </p>
  </div>
}
```

*The following result is achieved:*
```js
const Title = h('title',{},`Example`)

export const Component = ({ align = 'right' }) => {
  const props = {
    class: 'example',
    id: 'id',
  }
  return h('div',{onClick:(e) => {
    e.preventDefault()
    alert('Hello World')
    return false
  },role:"aria-button"},`
    `,h(Title),`
    `,h('p',{...props,align:align},`
      Hello World!
    `),`
  `)
}
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## The Transform

The transform is the Reg-Exp alternative to Babel's implementation of the JSX transform. We're not aware of any other alternatives, however this approach provides a light-weight solution for transforming `JSX` syntax for front-end and back-end rendering and static website generation. The lit-html is based on template strings, and does not provide html highlighting which is enabled in `.jsx` files. This makes JSX the standard of modern HTML templating. The service using the JSX does not have to be a react page, so that the transform can be used to server-side rendering which will always require serving HTML using a template. To achieve this in Node.js, the ÀLaMode transpiler can be used, whereas this package just exports a single function to perform the translation of the code.

The `import` and `export` statements will be temporally commented out when transpiling, otherwise V8 will throw an error when trying to detect where JSX syntax starts (see the method).

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true"></a></p>


## The Dynamic Method

This package will try to create a new Script (an import from the `vm` module) to find out where JSX syntax failed (first `<`). The location of the opening tag is therefore found out and the name of the tag extracted. With the name of the tag, the closing tag name can be found, and the contents inside parsed.

```html
/Users/zavr/a-la/jsx/test/fixture/Component.jsx:2
  <div className={className}>
  ^

SyntaxError: Unexpected token <
    at createScript (vm.js:80:10)
    at Object.runInThisContext (vm.js:139:10)
    at Module._compile (module.js:617:28)
    at Object.Module._extensions..js (module.js:664:10)
    at Module.load (module.js:566:32)
    at tryModuleLoad (module.js:506:12)
    at Function.Module._load (module.js:498:3)
    at Function.Module.runMain (module.js:694:10)
    at startup (bootstrap_node.js:204:16)
    at bootstrap_node.js:625:3
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/4.svg?sanitize=true"></a></p>

## Copyright

(c) [À La Mode][1] 2019

[1]: https://alamode.cc

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>