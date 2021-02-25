const Counter = (value) => {
    <h1>{value}</h1>
};

const render = () => {
    ReactDOM.render(
        <Counter value={store.getState()}/>,
        document.getElementById('root')
    )
}

store.subscribe(render);
render();

/*以上代码做的事情如下：
* 简单的计数器，唯一的作用就是把参数value的值，显示在网页上。
* Store的监听函数设置为render
* 那么，每次State的变化都会导致网页重新渲染
* */

//接下来加上变化，为Counter 添加递增和递减的Action
const Counter = ({value,onIncrement,onDecrement}) => (
    <div>
        <h1>{value}</h1>
        <button onClick={onIncrement}> + </button>
        <button onClick={onDecrement}> - </button>
    </div>
);

const reducer = (state = 0, action) =>{
    switch(action.type){
        case 'INCREMENT': return state + 1;
        case 'DECREMENT': return state - 1;
        default: return state;
    }
}

const store = createStore(reducer);

const render = () => {
    ReactDOM.render(
        <Counter
            value={store.getState()}
            onIncrement={()=>store.dispatch({type:'INCREMENT'})}
            onDecrement={()=>store.dispatch({type:'DECREMENT'})}
        />,
        document.getElementById('root')
    )
}

render();
store.subscribe(render);