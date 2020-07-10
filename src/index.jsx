import RReact, { Component } from '../packages/react/index'
import RReactDOM from '../packages/react-dom'
class Hello extends Component {
  render() {
    return <h4>Hello, {this.props.name}</h4>
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>欢迎使用 React.</h2>
        <Hello name="zhangsan" />
        <Hello name="lisi" />
        <Hello name="wanger" />
      </div>
    )
  }
}

RReactDOM.render(<App />, document.getElementById('root'))
