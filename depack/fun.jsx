import { render } from 'preact'

const App = ({ id, children }) => {
  return <div id={id}>{children}</div>
}

render(<App id="app">Hello World</App>, document.body)