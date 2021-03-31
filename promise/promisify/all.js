const fs = require('fs');
const util = require('util');

// 使用promisify快速将node的api转换成promise的形式
let read = util.promisify(fs.redFile);
let write = util.promisify(fs.writeFile);

read('name.txt','utf8').then((data)=>{
    console.log(data);
})

//自己实现一个promisify
// 1. promisify 执行返回一个函数
// 2. 函数执行返回一个promise
// 3. 这个函数只能执行node的api
/*
const promisify = (fn) => {
    return (...args)=>{
        return new Promise((resolve,reject)=>{
            fn(...args,function(err,data){
                if(err) reject(err);
                resolve(data);
            });
        })
    }
}
*/
