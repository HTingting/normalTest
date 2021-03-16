const Promise = require('./promise5')

Promise.resolve(456).finally(()=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(123)
        },3000);
    })
}).then(data=>{
    console.log(data,'success');
}).catch(err=>{
    console.log(err,'err');
})
