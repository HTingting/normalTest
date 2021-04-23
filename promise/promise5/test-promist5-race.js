const Promise = require('./promise5')

function wrap(promise) {
    // 在这里包装一个 promise，可以控制原来的promise是成功还是失败
    let abort;
    let newPromise = new Promise((resolve, reject) => { // defer 方法
        abort = reject;
    });
    let p = Promise.race([promise, newPromise]); // 任何一个先成功或者失败 就可以获取到结果
    p.abort = abort;
    return p;
}

const promise = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve('成功');
    },1000)
});
let newPromise = wrap(promise);

setTimeout(()=>{
    // 超过3秒 就算超时 应该让 proimise 走到失败态
    newPromise.abort('超时了');
},3000)

newPromise.then((data => {
    console.log('成功的结果' + data)
})).catch(e => {
    console.log('失败的结果' + e)
})



