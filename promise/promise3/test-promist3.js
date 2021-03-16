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
let promise2 = p1.then((data)=>{
    return 1;
})
promise2.then((data)=>{
    console.log('p2---获取上一个then的返回值----'+data);
})

