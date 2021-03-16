//const Promise = require('./promise')
const Promise = require('./promise2')

// 如果沿用promise1，就会有以下问题
// 1. then 方法不知道什么时候resolve成功
// 2. 目前的问题，then只执行了一次

const test = new Promise((resolve,reject)=>{
   setTimeout(()=>{
       resolve('成功1');
   },1000);

    setTimeout(()=>{
        resolve('成功2');
    },1000);
})

test.then((data)=>{
    console.log('回调',data);
},(err)=>{
    console.log(err);
})

test.then((data)=>{
    console.log('回调',data);
},(err)=>{
    console.log(err);
})
