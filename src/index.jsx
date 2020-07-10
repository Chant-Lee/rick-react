import RReact from '../packages/index'
import RReactDOM from '../packages/react-dom'

const element = (
  <div>
    <h1>Hello, world!</h1>
    <h2>欢迎使用 React.</h2>
  </div>
)

RReactDOM.render(element, document.getElementById('root'))
