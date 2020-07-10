## 生命周期的实现

### 回顾 React 生命周期

组件的生命周期可分成三个状态：

- Mounting：已插入真实 DOM
- Updating：正在被重新渲染
- Unmounting：已移出真实 DOM

#### 生命周期方法

- componentWillMount 在渲染前调用,在客户端也在服务端。
- componentDidMount : 在第一次渲染后调用，只在客户端。之后组件已经生成了对应的 DOM 结构，可以通过 this.\* getDOMNode()来进行访问。 如果你想和其他 JavaScript 框架一起使用，可以在这个方法中调用 setTimeout, setInterval 或者发送 AJAX 请求等操作(防止异步操作阻塞 UI)。
- componentWillReceiveProps 在组件接收到一个新的 prop (更新后)时被调用。这个方法在初始化 render 时不会被调用。
- shouldComponentUpdate 返回一个布尔值。在组件接收到新的 props 或者 state 时被调用。在初始化时或者使用 forceUpdate 时不被调用。
  可以在你确认不需要更新组件时使用。
- componentWillUpdate 在组件接收到新的 props 或者 state 但还没有 render 时被调用。在初始化时不会被调用。
- componentDidUpdate 在组件完成更新后立即调用。在初始化时不会被调用。
- componentWillUnmount 在组件从 DOM 中移除之前立刻被调用。

### 组件

提到生命周期，我们就需要了解组件的概念，在 React 中，定义组件有两种方式，函数和类。

### React.Component 基类实现

我们在编写 react 组件的时候，都会继承 React.Component,如下所示

```
class HelloWord extends React.Component {
    render() {
        return <h1>Hello Word</h1>;
    }
}
```

那么怎么去实现它呢，[源码地址](https://github.com/facebook/react/blob/master/packages/react/src/ReactBaseClasses.js)

#### 简单实现如下：

```
import { renderComponent } from '../react-dom'

class Component {
  constructor(props = {}) {
    this.isReactComponent = true
    this.state = {}
    this.props = props
  }
  setState(stateChange) {
    Object.assign(this.state, stateChange)
    renderComponent(this)
  }
}

```

##### state & props

通过继承 React.Component 定义的组件有自己的私有状态 state，可以通过 this.state 获取到。同时也能通过 this.props 来获取传入的数据。
所以在构造函数中，我们需要初始化 state 和 props

##### setState

组件内部的 state 和渲染结果相关，当 state 改变时通常会触发渲染，为了让 React 知道我们改变了 state，我们只能通过`setState`方法去修改数据。我们可以通过`Object.assign`来做一个简单的实现。
在每次更新 state 后，我们需要调用 `renderComponent`方法来重新渲染组件，`renderComponent` 方法的实现后文会讲到。
你可能听说过 React 的 setState 是异步的，同时它有很多优化手段，这里我们暂时不去管它，在以后会有一篇文章专门来讲 setState 方法。

##### render

在前面我们已经实现了 render 方法渲染 DOM 原色，现在我们需要修改这个方法，使其支持渲染组件

```
function renderDom ( vnode ) {

    // ...

    if ( typeof vnode.tag === 'function' ) {

        const Component = createComponent( vnode.tag, vnode.attrs );

        setComponentProps( Component, vnode.attrs );

        return Component.base;
    }

    // ...
}
```

#### 组件渲染和生命周期

在上面的方法中用到了`createComponent`和`setComponentProps`两个方法，组件的生命周期方法也会在这里面实现。

> 生命周期方法是一些在特殊时机执行的函数，例如 componentDidMount 方法会在组件挂载后执行

##### createComponent

`createComponent` 方法用来创建组件实例，并且将函数定义组件扩展为类定义组件进行处理，以免其他地方需要区分不同定义方式。

```
// 创建组件
function createComponent( component, props ) {

    let inst;
    // 如果是类定义组件，则直接返回实例
    if ( component.prototype && component.prototype.render ) {
        inst = new Component( props );
    // 如果是函数定义组件，则将其扩展为类定义组件
    } else {
        inst = new Component( props );
        inst.constructor = component;
        inst.render = function() {
            return this.constructor( props );
        }
    }

    return inst;
}
```

##### setComponentProps

`setComponentProps`方法用来更新 props，在其中可以实现 componentWillMount，componentWillReceiveProps 两个生命周期方法

```
// set props
function setComponentProps( component, props ) {

    if ( !component.base ) {
        if ( component.componentWillMount ) component.componentWillMount();
    } else if ( component.componentWillReceiveProps ) {
        component.componentWillReceiveProps( props );
    }

    component.props = props;

    renderComponent( component );

}
```

##### renderComponent

`renderComponent`方法用来渲染组件，setState 方法中会直接调用这个方法进行重新渲染，在这个方法里可以实现 componentWillUpdate，componentDidUpdate，componentDidMount 几个生命周期方法。

```
export function renderComponent( component ) {

    let base;

    const renderer = component.render();

    if ( component.base && component.componentWillUpdate ) {
        component.componentWillUpdate();
    }

    base = _render( renderer );

    if ( component.base ) {
        if ( component.componentDidUpdate ) component.componentDidUpdate();
    } else if ( component.componentDidMount ) {
        component.componentDidMount();
    }

    if ( component.base && component.base.parentNode ) {
        component.base.parentNode.replaceChild( base, component.base );
    }

    component.base = base;
    base._component = component;

}
```

### 渲染组件

现在大部分工作已经完成，我们可以用它来渲染组件了。

#### 自定义一个组件

```
class Hello extends Component {
  render() {
    return <h4>Hello, {this.props.name}</h4>
  }
}
```

然后我们再变一下如下代码

```
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

```

可以去浏览器中看下结果
