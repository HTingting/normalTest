const Promise = require('./promise5')

Promise.resolve(456).finally(()=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(123)
        },3000);
    })
}).then(data=>{
    console.log('success',data);
}).catch(err=>{
    console.log('error',err);
})



