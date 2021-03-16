const Promise = require('./promise5')

let p1 = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve('ok1');
    },1000)
})

let p2 = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        reject('ok2');
    },1000)
});

Promise.all([1,2,3,p1,p2]).then(data=>{
    console.log('resolve',data);
},err=>{
    console.log('reject',err);
})
