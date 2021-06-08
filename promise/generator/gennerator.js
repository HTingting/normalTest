// generator 生成器 =》 遍历器(需要有一个next方法，需要返回参数value，done【完成条件】) =》 数组 =》 类数组长得像数组
const likeArray = {0:'a', 1: 'b', 2: 'c', 3:'d',length:4};

/*likeArray[Symbol.iterator] = function(){
    let i = 0;
    return {  //遍历器
        next:()=>{
            return {value:this[i],done: i++ === this.length}  // 这里this，值得是likeArray
        }
    }
}*/

// 原理就是遍历这个对象，将结果放到数组中，这个数据必须得有个遍历器。
// [...new Set()] for of
// [...likeArray]  / Array.from(likeArray)

//第二种写法
/*likeArray[Symbol.iterator] = function * (){  //generator 函数可以生成遍历器
    let i = 0;
    while(i !== this.length){  // generator 固定语法 yield必须要配合着*来使用
        yield this[i++];
    }
}*/

// 普通函数默认会从头到尾执行没有暂停的功能
// generator函数是es6提供的语法，如果遇到yield就会暂停执行（redux-sage,koa1中）
function * read(){
    yield 1;
    yield 2;
    yield 3;
    return undefined;
}
let it = read();  //it就是一个迭代起，迭代器上有个next函数
/*console.dir(it.next());  // {value:1,done:false}
console.dir(it.next());  // {value:2,done:false}
console.dir(it.next());  // {value:3,done:false}
console.dir(it.next());  // {value:undefined,done:true}*/
let flag = false;
do{
    let {value,done} = it.next();
    console.log(value,done);
    flag = done;
}while(!flag);


console.log('**************yield这东西还有返回值***********');

function * read2(){
    let a = yield 1;
    console.log(a);
    let b = yield 2;
    console.log(b);
    let c = yield 3;
    console.log(c);
    return c;
}
//蛇形执行，除了第一次之外的next方法，都是把next中的参数传递给上一次yield的返回结果
let it = read2();
it.next();  //第一次next的传递参数没有任何意义
it.next(2);
it.next(3);





















