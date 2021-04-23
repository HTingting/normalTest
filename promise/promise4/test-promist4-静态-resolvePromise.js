const Promise = require('./promise4-value-promise')

/**
 * 直接promise快速创建一个成功的promise，一个失败的promise
 * Promise.resolve();
 * Promise.reject();
 *
 * 区别在于，resolv会等待里面的promise执行完毕，但是reject不会有等待效果
 */
Promise.resolve(new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve('ok');
    },1000)
})).then(data=>{
    console.log(data);
})

