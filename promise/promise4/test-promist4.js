const Promise = require('./promise4')

/**
 * 解决传入then的值的类型的问题
 * 1.
 */
const promise = new Promise((resolve, reject) => {
    reject('失败');
}).then().then().then(data=>{
    console.log(data);
},err=>{
    console.log('err',err);
})

