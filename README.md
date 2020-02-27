# @a-la/jsx

[![npm version](https://badge.fury.io/js/%40a-la%2Fjsx.svg)](https://www.npmjs.com/package/@a-la/jsx)
[![Build status](https://ci.appveyor.com/api/projects/status/cyob36vkc19p1n1u?svg=true)](https://ci.appveyor.com/project/4r7d3c0/jsx)
![Node.js CI](https://github.com/a-la/jsx/workflows/Node.js%20CI/badge.svg)

`@a-la/jsx` is The JSX transform For _ÀLamode_ And Other Packages.

```sh
yarn add @a-la/jsx
npm i @a-la/jsx
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`jsx(string: string, config: Config): string`](#jsxstring-stringconfig-config-string)
  * [`Config`](#type-config)
- [The Transform](#the-transform)
- [Classes](#classes)
- [The Dynamic Method](#the-dynamic-method)
- [Limitations](#limitations)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/0.svg?sanitize=true">
</a></p>

## API

The package is available by importing its default function:

```js
import jsx from '@a-la/jsx'
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/1.svg?sanitize=true">
</a></p>

## <code><ins>jsx</ins>(</code><sub><br/>&nbsp;&nbsp;`string: string,`<br/>&nbsp;&nbsp;`config: Config,`<br/></sub><code>): <i>string</i></code>
Returns the transpiled JSX code into `h` pragma calls.

 - <kbd><strong>string*</strong></kbd> <em>`string`</em>: The code to transform.
 - <kbd><strong>config*</strong></kbd> <em><code><a href="#type-config" title="Options for the program.">Config</a></code></em>: Configuration object.

__<a name="type-config">`Config`</a>__: Options for the program.


|    Name    |                    Type                    |                                                                                                            Description                                                                                                            | Default |
| ---------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| quoteProps | <em>(boolean \| string)</em>               | Whether to surround property names with quotes. When the `dom` string is passed, it will only quote props for invoking html components, i.e., those that start with a lowercase letter (E.g., for the _Google Closure Compiler_). | `false` |
| warn       | <em>(...args: string[]) => ?</em>          | The function to receive warnings, e.g., when destructuring of properties is used on dom elements (for Closure Compiler).                                                                                                          | -       |
| prop2class | <em>boolean</em>                           | If a property name starts with a capital letter, the `className` of the _VNode_ will be updated.                                                                                                                                  | `false` |
| classNames | <em>(!Array&lt;string&gt; \| !Object)</em> | The list of properties to put into the `className` property.                                                                                                                                                                      | -       |
| renameMap  | <em>!Object&lt;string, string&gt;</em>     | How to rename classes (only applies to `prop2class` and `classNames`).                                                                                                                                                            | -       |

```js
import { readFileSync } from 'fs'
import jsx from '@a-la/jsx'

const code = readFileSync('example/Component.jsx', 'utf8')
const res = jsx(code)
console.log(res)
```

*Given the component's source code:*
```jsx
import RichTextArea from 'richtext'

const Title = <title>Example</title>

export const Component = ({
  align = 'right', tabs, img,
}) => {
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
    <RichTextArea dynamic />
    {tabs.map((tab, i) => <span key={i}>{tab}</span>)}
    <p {...props} align={align}>
      Hello World!
      {img && <img src={img}/>}
    </p>
  </div>
}
```

*The following result is achieved:*
```js
import RichTextArea from 'richtext'

const Title = h('title',{},`Example`)

export const Component = ({
  align = 'right', tabs, img,
}) => {
  const props = {
    class: 'example',
    id: 'id',
  }
  return h('div',{onClick:(e) => {
    e.preventDefault()
    alert('Hello World')
    return false
  }, role:"aria-button"},
    h(Title),
    h(RichTextArea,{dynamic:true}),
    tabs.map((tab, i) => h('span',{key:i},tab)),
    h('p',{...props,align:align},
      `Hello World!`
      ,img && h('img',{src:img}),
    ),
  )
}
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/2.svg?sanitize=true">
</a></p>

## The Transform

The transform is the Reg-Exp alternative to Babel's implementation of the JSX transform. We're not aware of any other alternatives, however this approach provides a light-weight solution for transforming `JSX` syntax for front-end and back-end rendering and static website generation. The lit-html is based on template strings, and does not provide html highlighting which is enabled in `.jsx` files. This makes JSX the standard of modern HTML templating. The service using the JSX does not have to be a react page, so that the transform can be used to server-side rendering which will always require serving HTML using a template. To achieve this in Node.js, the ÀLaMode transpiler can be used, whereas this package just exports a single function to perform the translation of the code.

The `import` and `export` statements will be temporally commented out when transpiling, otherwise V8 will throw an error when trying to detect where JSX syntax starts (see the method).

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/3.svg?sanitize=true">
</a></p>

## Classes

It's possible to make the transpiler extract property names and add them into the `className` property. If such property already exists, it will be updated. If it doesn't, it will be created. Moreover, when `prop2class` property is set, any property that starts with a capital letter will also be added to the class list. Finally, if you pass a rename map, the classes will be updated according to it.

_The component to transpile:_

```jsx
export default function Classes() {
  return (<div Example hello world />)
}
```

_The setup:_

```js
import { readFileSync } from 'fs'
import jsx from '../src'

const code = readFileSync('example/classes.jsx', 'utf8')
const res = jsx(code, {
  prop2class: true,
  classNames: ['hello', 'world'],
  renameMap: {
    hello: 'hi',
  },
})
console.log(res)
```

_The output:_

```js
export default function Classes() {
  return (h('div',{className:'Example hi world' }))
}
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/4.svg?sanitize=true">
</a></p>

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

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/5.svg?sanitize=true">
</a></p>

## Limitations

- [ ] Cannot use `<>` in functions, and `{}` in comments e.g.,
    ```js
    const C = ({ items }) => <div>
      {items.map((i, j) => {
        // stop when { 10 }:
        if (j > 10) return
        return <span>{i}</span>
      })}
    </div>
    ```
- [ ] Cannot define components in `export default { }`, or use anything with `}`, e.g.,
    ```js
    export default {
      'my-component'() {
        return <div>Hello World</div>
      },
      nested: { val: true },
    }
    </div>
    ```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/6.svg?sanitize=true">
</a></p>

## Copyright

<table>
  <tr>
    <th>
      <a href="https://www.artd.eco">
        <img width="100" src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png"
          alt="Art Deco">
      </a>
    </th>
    <th>© <a href="https://www.artd.eco">Art Deco™</a> for <a href="https://alamode.cc">À La Mode</a> 2020</th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/-1.svg?sanitize=true">
</a></p>