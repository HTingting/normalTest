## 高阶函数
+ 1. 一个函数的参数是一个函数（回调函数就是一个高阶函数）
+ 2. 如果一个函数返回一个函数，当前这个函数也是一个高阶函数
+ 3. 

### 应用场景
+ 为了稍后写promise做铺垫

### 写一个业务代码，扩展当前的业务代码
```js
function say(){
    console.log('say');
}
//给某个方法，添加一个方法在他执行之前调用
Function.prototype.before = function(callback){
    return (...args) => {
        callback();
        this(...args);
    }
}

let beforeSay = say.before(function(){
    console.log()
});
beforeSay('hello','world');
```

### 手写一个高阶函数
```js
let newArray = [];
for(let i = 0,len = arr.length; i< len; i++){
    arr[i] > 3 && newArray.push(arr[i];)
}
```
```js
//高阶函数实现自己的filter
Array.prototype.myFilter = function(fn){
    let newArray = [];
    for(let i = 0,len = this.length; i<leng; i++){
        fn(this[i]) && newArray.push(this[i]);
    }
    return newArray;
}

[1,2,3,4,5].myFilter((item) => {return item > 3 })
```

### 什么是闭包
函数定义的作用域和函数执行的作用域 不在同一个作用域下

### 发布订阅
发布和订阅之间没有关系

### 观察者模式
发布和订阅之间有关系

##promise 
### 为什么产生
+ 解决异步问题
 - 多个异步请求并发（希望同步最终的结果）Promise.all
 - 链式异步请求问题，
 - 缺陷：还是基于回调

### 基本信息
+ promise 就是一个类
+ 有三种状态，resolve,reject,pending
+ promise 默认执行器是立即执行
+ promise的实例都拥有一个then方法，一个参数是成功的回调，一个参数是失败的回调
+ 用户自己决定失败成功的原因，成功和失败也是用户自己定义的
+ 如果执行函数异常也会走失败回调
+ promise一旦成功就不能失败，反过来也一样


+ promise调用then方法时，可能当前的promise并没有成功，pending
+ 发布订阅模式，如果当前状态时pending，我们需要将成功的回到和失败的回调存放起来骚后调用resolve额reject的时候重新执行；

+  循环引用，自己等待自己，错误的实现
+  resolvePromise 所有的promise都要

### 面向切片的概念
用一个函数抱一下，方便扩展

