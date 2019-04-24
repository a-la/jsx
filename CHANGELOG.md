## 24 April 2019

### [1.5.0](https://github.com/a-la/jsx/compare/v1.4.7...v1.5.0)

- [externs] Add externs.
- [types] Annotate all types correctly.

## 16 April 2019

### [1.4.7](https://github.com/a-la/jsx/compare/v1.4.6...v1.4.7)

- [fix] Fix export default object support.
- [deps] Update and unfix dependencies.

## 3 April 2019

### [1.4.6](https://github.com/a-la/jsx/compare/v1.4.5...v1.4.6)

- [deps] Update `restream`.

## 19 March 2019

### 1.4.5

- [fix] A bugfix for incorrect detection of the closing tag.

```jsx
<span>
  <a href="/signout">Sign out</a><span> </span>
  {/*                           ^*/}
</span>
```

## 2 March 2019

### 1.4.4

- [fix] Pass `true` to boolean attributes.

## 25 February 2019

### 1.4.3

- [feature] Preserve new lines in attributes.

## 15 February 2019

### 1.4.2

- [fix] Extract multiple boolean attributes.

### 1.4.1

- [fix] Empty values for boolean attributes.

## 11 February 2019

### 1.4.0

- [feature] Parse boolean attributes, e.g., `<Component required />`.
- [fix] Trim blank lines but preserve line order.

## 7 February 2019

### 1.3.1

- [feature] Pass `warn` function to correctly warn of destructuring on dom elements for GCC.

## 6 February 2019

### 1.3.0

- [feature] `dom` value for the `quoteProps` option.

## 31 January 2019

### 1.2.5

- [fix] Rewrite `extract` to parse inner self-closing properly.

## 30 January 2019

### 1.2.4

- [fix] Add missing `mismatch` dependency.

## 28 January 2019

### 1.2.3

- [fix] Fix parsing when tag's children start with an expression.

## 24 January 2019

### 1.2.2

- [fix] Ignore `export from` statements.
- [doc] Add [Tech Nation Visa](https://www.technation.sucks) footer.

### 1.2.1

- [fix] Pass the options to recursive calls.

## 22 January 2019

### 1.2.0

- [feature] Implement iterators in JSX.

## 15 January 2019

### 1.1.4

- [package] Add the "module" field.

## 12 January 2019

### 1.1.3

- [fix] Do ignore simple imports.

### 1.1.2

- [fix] Ignore simple imports like `import '/style.css'`.

### 1.1.1

- [fix] Process self-closing with a space before `/`.
- [fix] Disable length warning.

## 11 January 2019

### 1.1.0

- [feature] `quoteProps` to enable better _Google Closure_ compilation.
- [fix] Correctly parse code with self-closing tag inside elements with the same name.

## 10 January 2019

### 1.0.0

- [feature] Transpile JSX.

## 8 December 2018

### 0.0.0

- Create `@a-la/jsx` with [`mnp`][https://mnpjs.org]
- [repository]: `src`, `test`
