const Promise = require('./promise4')

/**
 * 解决传入then的值的类型的问题
 * 1.
 */
let p = new Promise((resolve,reject)=>{
    reject(1)
});
p.then(null,data=>{
    throw data;
}).then(null,data=>{
    throw data;
}).then(data=>{
    console.log(data);
},err=>{
    console.log('err',err);
})

