let fs = require('fs');

function read(filename){
    return new Promise((resolve,reject)=>{
        fs.readFile(filename,'utf8',(err,data)=>{
            if(err) return reject(err);
            resolve(data);
        })
    })
}
//链式调用的基本用法
//1.promise 成功和失败的回调的返回值，可以传递到外层的下一个then
//2.如果返回的是普通值,无论成功还是失败(传递到下一次的成功中，不是错误不是promise就是普通值)；
//  可能还要promise的情况（会采用promise的状态，决定走下一次的成功还是失败）；
//  出错的情况（一定会走到下一次的失败）
//3.如果离自己最近的then没有错误处理，就会向下走。
//4.每次执行完promise.then方法后返回的都是一个新的promise（promise一旦成功或者失败就不能改变状态）
read('./name.txt').then((data)=>{
    return read(data);
},(err)=>{
    return 200;
}).then((data)=>{
    console.log('...',data);
},(err)=>{
    console.log('...',err);
});

read('./name.txt').then((data)=>{
    return read(data);
}).then((data)=>{
    console.log('...',data);
},(err)=>{
    console.log('...',err);
})