const { _jsx } = require('./jsx')

/**
 * Returns the transpiled JSX code into `h` pragma calls.
 * @param {string} string The code to transform.
 * @param {!_alaJsx.Config} [config] Options for the program.
 * @param {(boolean|string)} [config.quoteProps=false] Whether to surround property names with quotes. When the `dom` string is passed, it will only quote props for invoking html components, i.e. those that start with a lowercase letter (this is required for _Closure Compiler_ when not providing externs to elements). Default `false`.
 * @param {boolean} [config.prop2class=false] If a property name starts with a capital letter, the `className` of the _VNode_ will be updated. Default `false`.
 * @param {!Array<string>|!Object} [config.classNames] The list of properties to put into the `className` property.
 * @param {!Object<string, string>} [config.renameMap] How to rename classes (only applies to `prop2class` and `classNames`).
 * @param {!Object<string, string>} [config.styles] Rename these properties into styles, e.g., `<el border-top="1px">` will become `<el style="border-top:1px">`. The keys must be property names, and the values are either booleans, or a string that should be used for renaming of the CSS property, such as `{ borderTop: 'border-top' }`. Check out [`@a-la/styles`](https://github.com/a-la/styles) that provides such a map.
 * @param {(warning: string) => ?} [config.warn] The function to receive warnings, e.g., when destructuring of properties is used on dom elements (for Closure Compiler).
 * @return {string}
 */
function jsx(string, config) {
  return _jsx(string, config)
}

module.exports = jsx

/* typal types/index.xml namespace */
/**
 * @typedef {_alaJsx.Config} Config Options for the program.
 * @typedef {Object} _alaJsx.Config Options for the program.
 * @prop {(boolean|string)} [quoteProps=false] Whether to surround property names with quotes. When the `dom` string is passed, it will only quote props for invoking html components, i.e. those that start with a lowercase letter (this is required for _Closure Compiler_ when not providing externs to elements). Default `false`.
 * @prop {boolean} [prop2class=false] If a property name starts with a capital letter, the `className` of the _VNode_ will be updated. Default `false`.
 * @prop {!Array<string>|!Object} [classNames] The list of properties to put into the `className` property.
 * @prop {!Object<string, string>} [renameMap] How to rename classes (only applies to `prop2class` and `classNames`).
 * @prop {!Object<string, string>} [styles] Rename these properties into styles, e.g., `<el border-top="1px">` will become `<el style="border-top:1px">`. The keys must be property names, and the values are either booleans, or a string that should be used for renaming of the CSS property, such as `{ borderTop: 'border-top' }`. Check out [`@a-la/styles`](https://github.com/a-la/styles) that provides such a map.
 * @prop {(warning: string) => ?} [warn] The function to receive warnings, e.g., when destructuring of properties is used on dom elements (for Closure Compiler).
 */
