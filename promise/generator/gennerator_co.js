const fs = require('fs').promises;

function * read(){
    let name = yield fs.readFile('./../a.txt','utf8');
    let age = yield fs.readFile('./../b.txt','utf8');
    return age;
}
let it = read();  //迭代器
/*
let {value,done} = it.next();
value.then(data=>{
    let {value,done} = it.next(data);
    value.then(data=>{
        let {value,done} = it.next(data);
        console.log(value);
    })
})*/
// 优化以上代码 tj
const co = it => {
    return new Promise((resolve,reject)=>{
        //异步迭代器靠的是 回调函数
        function next(data){
            let {value,done} = it.next(data);
            if(!done){
                Promise.resolve(value).then(next,reject);
            }else{
                resolve(value);
            }
        }
        next();
    })
}

co(read()).then(data=>{
    console.log(data);
});

// async + await = generator + co
// async + await 替换掉了generator和co 默认async函数执行后
// 返回的就是一个promise

