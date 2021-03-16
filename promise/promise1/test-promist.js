const Promise = require('./promise')

const test = new Promise((resolve,reject)=>{
   // resolve('success');
   // reject('fail');
    throw new Error('脚本异常');
}).then((data)=>{
    console.log('回调',data);
},(err)=>{
    console.log(err);
})
