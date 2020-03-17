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
const abc = 'test'

export { abc as test }

/* stderr */
/**/

/* stdout */
/**/
