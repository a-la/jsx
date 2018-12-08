# @a-la/jsx

[![npm version](https://badge.fury.io/js/%40a-la%2Fjsx.svg)](https://npmjs.org/package/@a-la/jsx)

`@a-la/jsx` is The JSX transform for the alamode.

```sh
yarn add -E @a-la/jsx
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`jsx(arg1: string, arg2?: boolean)`](#jsxarg1-stringarg2-boolean-void)
  * [`Config`](#type-config)
- [The Transform](#the-transform)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import jsx from '@a-la/jsx'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `jsx(`<br/>&nbsp;&nbsp;`arg1: string,`<br/>&nbsp;&nbsp;`arg2?: boolean,`<br/>`): void`

Call this function to get the result you want.

__<a name="type-config">`Config`</a>__: Options for the program.

|   Name    |   Type    |    Description    | Default |
| --------- | --------- | ----------------- | ------- |
| shouldRun | _boolean_ | A boolean option. | `true`  |
| __text*__ | _string_  | A text to return. | -       |

```js
/* yarn example/ */
import jsx from '@a-la/jsx'

(async () => {
  const res = await jsx({
    text: 'example',
  })
  console.log(res)
})()
```
```
example
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## The Transform

The transform is the Reg-Exp alternative to Babel's implementation of the JSX transform. We're not aware of any other alternatives, however this approach provides a light-weight approach for transforming `JSX` syntax for back-end rendering and static website generation. The lit-html is based on template strings, and does not provide html highlighting which is enabled in .jsx files. This makes JSX the standard of modern HTML templating. The service using the JSX does not have to be a react page, so that the transform can be used to server-side rendering which will always require serving HTML using a template.

```js
// processes a simple component
const Element = ({ test, children, id }) => <div id={ 'id' }>
  Hello, { test }! { children }
  <div class={ 'TEST' }>test</div>
</div>

/* expected */
const Element = ({ test, children, id }) =>            p('div',{id:'id'},'  Hello, ',test,'! ',children,p('div',{class:'TEST'},'test'))
/**/
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true"></a></p>


## Copyright

(c) [À La Mode][1] 2018

[1]: https://alamode.cc

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>