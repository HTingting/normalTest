const Promise = require('./promise4-catch')

/**
 * 直接promise快速创建一个成功的promise，一个失败的promise
 * Promise.resolve();
 * Promise.reject();
 */
new Promise((resolve,reject)=>{
    resolve(111)
}).then(data=>{
    console.log(data);
})

