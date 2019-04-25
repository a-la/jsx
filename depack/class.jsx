import { Component, render } from 'preact'

class App extends Component {
  render({ ok }) {
    return <div>{ok}</div>
  }
}

render(<App ok/>, document.body)