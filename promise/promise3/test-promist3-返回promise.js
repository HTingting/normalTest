const Promise = require('./promise3')

/**
 * 解决then可以多次
 * 1. then的返回值应该是个promise
 * 2. 解决接受上一个then传值的问题
 * @type {Promise}
 */
let p1 = new Promise((resolve,reject)=>{
    resolve(100);
})
let p2 = p1.then((data)=>{
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            resolve('ok');
        },1000)
    })
},err=>{
    return  '失败'
})
p2.then((data)=>{
    console.log('p2---获取上一个then的返回值----'+ JSON.stringify(data));  //这个data应该是1
})
/*
这时候返回的是promise。这是不对的
应该返回的是promise的then方法操作后，返回的resolve，把data返回给到下一个then
 */
/*这时候就需要用到promise4.js了*/

