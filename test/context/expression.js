export default class ExpressionContext {
  /**
   * A template literal to make an expression.
   * @example
   * e`test` // => {test}
   */
  get e() { return ({ raw: [r] }) => `{${r}}` }
  // get e({ raw: [r] }) {
  //   return `{${r}}`
  // }
  /**
   * A template literal to make quoted content.
   * @example
   * q`test` // => 'test'
   */
  get q() { return ({ raw: [r] }) => `'${r}'` }
  /** The expression to insert before the expression. */
  get b() { return 'Hello, ' }
  /** The expression to insert after the expression. */
  get a() { return '!' }
}