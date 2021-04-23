//const Promise = require('./promise')
const Promise = require('./promise2')

// 如果沿用promise1，就会有以下问题
// 1. then 方法不知道什么时候resolve成功
// 2. 目前的问题，then只执行了一次

/**
 * 处理方法
 * 1.因为promise调用then方法时，当时的promise并没有成功，一直处于pending状态
 * 2.所以，如果当调用then方法时，当前状态是pending，我们需要先将成功和失败的回调分别存放起来
 * 3.在executor()的一部任务被执行时，触发resolve或reject,一次调用成功或失败的回调
 * @type {Promise}
 */

const test = new Promise((resolve,reject)=>{
   setTimeout(()=>{
       resolve('成功1');
   },1000);

    setTimeout(()=>{
        resolve('成功2');
    },1000);
})

//promise的实例可以then多次，同一个对象可以then多次

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
