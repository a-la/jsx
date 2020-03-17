/* eslint-disable no-unused-vars */
import { h } from 'preact'

// processes JSX
() => {
  const Component = () => {
    return (<div>Test</div>)
  }
}

/* stdout */
() => {
  const Component = () => {
    return (h('div',{},`Test`))
  }
}
/**/

// processes JSX with export as
var abc = 'test'

export { abc as test }

/* stdout */
var abc = 'test'

export { abc as test }
/**/
