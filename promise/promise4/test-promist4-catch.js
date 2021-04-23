const Promise = require('./promise4-catch')

/**
 * 解释了没有成功处理的then，就是catch
 */
let p = new Promise((resolve,reject)=>{
    reject(1)
});
p.then(null,data=>{
   console.log('err',data);
})

