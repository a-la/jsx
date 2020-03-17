/**
 * @fileoverview
 * @externs
 */

/* typal types/index.xml */
/** @const */
var _alaJsx = {}
/**
 * Options for the program.
 * @typedef {{ quoteProps: (((boolean|string))|undefined), prop2class: (boolean|undefined), classNames: ((!Array<string>|!Object)|undefined), renameMap: ((!Object<string, string>)|undefined), styles: ((!Object<string, string>)|undefined), warn: ((function(string))|undefined) }}
 */
_alaJsx.Config

/* typal types/api.xml */
/**
 * Returns the transpiled JSX code into `h` pragma calls.
 * @typedef {function(string,!_alaJsx.Config=): string}
 */
_alaJsx.jsx
