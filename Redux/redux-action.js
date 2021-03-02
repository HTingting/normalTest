const createStore = (reducer) => {
    let state;
    let listeners = [];

    const getState = () => state;

    const dispatch = (action) => {
        state = reducer(state,action);
        listeners.forEach(listener => listener());
    };

    const subscribe = (listener) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        }
    };

    dispatch({});

    return {getState, dispatch, subscribe};
}

let next = store.dispatch;
store.dispatch = function dispatchAndLog(action){
    console.log('dispatching',action);
    next(action);
    console.log('next state',store.getState());
}

import {applyMiddleware, createStore} from 'redux'
import createLogger from 'redux-logger'
const logger = createLogger();
//第一种方法
const store = createStore(
    reducer,
    applyMiddleware(logger)
)


//一个小实验
const INCREMENT = 'INCREMENT'; // 为增量 action 类型定义一个常量
const DECREMENT = 'DECREMENT'; // 为减量 action 类型定义一个常量
let defaultState = {
    count:0
}

const Counter = ({value,incAction,decAction}) => (
    <div>
        <h1>{value}</h1>
        <button onClick={incAction}> + </button>
        <button onClick={decAction}> - </button>
    </div>
);

const counterReducer = (state = defaultState,action) => {
    switch(action.type){
        case INCREMENT:
            return defaultState+1
        case DECREMENT:
            return defaultState-1
        default:
            return 0
    }

}; // 定义计数器，它将根据收到的action增加或减少状态

const incAction = () => {
    return {
        type: INCREMENT
    }
}; // 定义一个用于递增的 action creator

const decAction = () => {
    return {
        type: DECREMENT
    }
}; // 定义一个用于递减的 action creator

const store = createStore(counterReducer); // 在这里定义一个 Redux store，传递你的 reducer

const render = () => {
    ReactDOM.render(
        <Counter
            value={defaultState.count}
            incAction={store.dispatch(incAction())}
            decAction={store.dispatch(decAction())}
        />,
        document.getElementById('root')
    )
}
render()


export default function applyMiddleware(...middlewares) {
    return (createStore) => (reducer, preloadedState, enhancer) => {
        var store = createStore(reducer, preloadedState, enhancer);
        var dispatch = store.dispatch;
        var chain = [];

        var middlewareAPI = {
            getState: store.getState,
            dispatch: (action) => dispatch(action)
        };
        chain = middlewares.map(middleware => middleware(middlewareAPI));
        dispatch = compose(...chain)(store.dispatch);

        return {...store, dispatch}
    }
}



## redux-thunk 中间件

class AsyncApp extends Component {
    componentDidMount() {
        const { dispatch, selectedPost } = this.props;
        dispatch(fetchPosts(selectedPost))
    }
}


const fetchPosts = postTitle => (dispatch, getState) => {
    dispatch(requestPosts(postTitle));
    return fetch(`/some/API/${postTitle}.json`)
        .then(response => response.json())
        .then(json => dispatch(receivePosts(postTitle, json)))
}



import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducer'

const store = createStore(
    reducer,
    applyMiddleware(thunk)
);


import {createStore, applyMiddleware} from 'redux'
import promiseMiddleware from 'redux-promise'
import reducer from './reducers';

const store = createStore(
    reducer,
    applyMiddleware(promiseMiddleware)
)

const fetchPosts =
    (dispatch, postTitle) => new Promise(function (resolve, reject) {
        dispatch(requestPosts(postTitle));
        return fetch(`/some/API/${postTitle}.json`)
            .then(response => ({
                type:'FETCH_POSTS',
                payload:response.json()
            }))
    })


import { createAction } from 'redux-actions';

class AsyncApp extends Component {
    componentDidMount() {
        const {dispatch, selectedPost} = this.props
        // 发出同步 Action
        dispatch(requestPosts(selectedPost));
        // 发出异步 Action
        dispatch(createAction(
            'FETCH_POSTS',
            fetch(`/some/API/${postTitle}.json`)
                .then(response => response.json())
        ));
    }
}

/*复习*/
const ADD = 'ADD';
const addMessage = (message) => {
    return {
        type: ADD,
        message: message
    }
}
const reducer = (previousState = [], action) => {
    switch(action.type){
        case ADD:
            return [...previousState,action.message];
            break;
        default:
            return previousState
    }
}

const store = Redux.createStore(reducer);











/*测试*/
import {Privider} from 'react-redux'
import {createStore} from 'redux'
import todoApp from './reducers'
import App from './components/App'

let store = createStore(todoApp);

render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
)

/*
* 上面代码中，Provider在根组件外面包了一层，这样一来，
* App的所有子组件就默认都可以拿到state了。
* 它的原理是React组件的context属性，请看源码。
* */
class Provider extends Component{
    getChildContext() {
        return {
            store: this.props.store
        };
    }
    render() {
        return this.props.children;
    }
}
Provider.childContextTypes = {
    store: React.PropTypes.object
}
/*上面代码中，store放在了上下文对象context上面。
然后，子组件就可以从context拿到store，代码大致如下。*/
class VisibleTodoList extends Component {
    componentDidMount(){
        const {store} = this.context;
        this.unsubscribe = store.subscribe(() => {
            this.forceUpdate();
        })
    };

    render(){
        const props = this.props;
        const {store} = this.context;
        const state = store.getState();
    }
}

VisibleTodoList.contextTypes = {
    store: React.PropTypes.object
}


