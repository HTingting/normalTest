## 什么是node.js
+ node.js不是一门语言
+ node.js不是库，不是框架
+ node.js是一个javascript运行环境
+ 简单点来讲就是node.js可以解析和执行js代码
+ 以前只有浏览器可以解释执行javascript代码
+ 也就是说，现在的js可以完全脱离浏览器来运行


## 浏览器中的javascript
- ecmaScript
- 基本语法
- if
- var
- function
- Object
- Array
- BOM
- DOM

## Node.js中的javascript
- 没有BOM,DOM
- ecmascrpt
- 在node这个js执行环境中为js提供了一些服务器级别的操作api，例如
- 文件读写
- 网络服务的构建
- 网络通信
- http服务器
- 。。。

## Node.js 构建与chorme 的v8引擎上
- 代码只是具有特定格式的字符串而已
- 引擎可以认识它，引擎可以帮忙去解析和执行
- 

## node.js能做什么
+ web服务器后台
+ 命令行工具
   - npm （node）
    - git(c 语言)
    - hexo (node)
+  对于前端工程师，接触node最多的是他的命令行工具
 - 自己写得少主要是使用别人第三方发的
- webpack
- gulp
- npm

## 这么可能能学到啥
+ B/S 编程模型

+ 模板化编程

+ node常用API

+ 异步编程
- 回调函数
- promise
- async
- generator

+ Express开发框架

+ Ecmascript 6


   
线程池
java 锁，上下文

js 主线程是单线程
单线程特点是节约了内存，而且不需要在切换执行上下文
而且单线程不需要管锁的问题

同步异步和阻塞非阻塞
（调用者） （被调用者）

node解决了什么问题
+ 高并发，是指在同一时间并发并房屋内服务器
+ I/O密集指的是文件操作，网络操作，数据库，相对的有CPU密集。
CPU密集指的是逻辑处理运算，压缩，解压，加密，解密。

web主要场景就是接受客户端的请求读取静态资源和渲染界面，所以node非常适合web应用的开发

//process
console.log(process.platform);
//判断当前执行的系统环境 win32 drain
console.log(process.argv);
//1.node.exe 2.node当前执行的文件（解析用户自己传递的参数）
console.log(process.env);
// 环境变量
console.log(process.nextTick);

+ process.argv的用处
/**
let args = process.argv.slice(2);
//['--port','3000','--color','red']
let obj = {};
args.forEach((item,index)=>{
    if(item.startWidth('--')){
        obj[item.slice(2)] = args[index+1];
    }
}});
console.log(obj);
*/
//(commander TJ) (yargs webpack) 用于解决参数的解析
// 在npm上的模块都需要线安装再使用
const program = require('commander');
program.option('-p,--port <v>','set your port');
let r = program.parse(process.argv);// -- 开头是key, 不带--是值
console.log(r);

//node中自己实现的微任务
console.log(process.nextTick);
node中还增加了一个微任务
queueMicrotask();

//node中setImmediate 宏任务

//常见面试题：node中的事件环和浏览器事件环的区别
+ 微任务有哪些
语言本身的
promise.then(); nextTick ,mutationObserver


+ 宏任务有哪些
script/ ui /setTimeout/ setInterval /requestFramsAnimation/
/setImmediat/ MessageChannel  异步的 click ajax

process.nextTick 并不属于事件环的一部分，在本轮代码执行后执行；
而且优先级比then高
```js
setTimeout(()=>{
    console.log(1);
    Promise.resolve().then(()=>{
        console.log('then');
    });
    process.nextTick(()=>{
        console.log('nextTick');
    });
},0);
setTimeout(()=>{
    console.log(2);
});
//输出顺序 1，nextTick，then, 2;
```

+虚拟机模块（沙箱）干净的环境，测试用例
+内部一般情况下操作的都是字符串逻辑，如何让一个字符串来运行console.log(1)

+eval默认会取当前的作用域下的变量，不干净的环境eval();
+可以使用new Function()来创建一个沙箱环境，让字符串执行
```js
const a = 100;
let fn = new Function('c','b','d',`let a = 1;console.log(a)`)
console.log(fn());
```

//模板引擎的实现原理是 with语法 + 字符串拼接
```js
const fs = require('fs');
const renderFile = (filePath,obj,cb) => {
    fs.readFile(filePath,'utf8',function(err,html){
        if(err){
            return cb(err,html);
        }
        html = html.replace(/\{\{([^}]+])\}\}//g,function(){
            let key = arguments[1].trim();
            return obj[key];
        });
        cb(err,html);
    });
}
```
如果是循环语法
1.先去掉渲染语法
2.把文档，如果是静态语法，就当字符串拼接
3.使用new Function(),执行返回
4.执行外面，加with
```js
function a(obj){
    let str = '';
    with(obj){
        str += `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Title</title>
            </head>
            <body>`
                arr.forEach(item=>{
                    str += `<li>1</li>`
                })
                str += `</body></html>';
    }
    return str;
}
console.log(a({arr:[1,2,3]}));
```

+ 再来理解一边module.exports 和 exports 的区别
```js
let a = b = {};
b = 'hello';
a.tag = 'a';
return b;
```

```js
module.exports = 'hello';
exports.a = 'hello';
return module.exports;  //输出的是hello；
```

##掌握如何在node种实现代码调试
+ 直接使用webstorm和vscode自带调试方法，直接通过launch.json进行调试

## 分析node源码
+ 1.会默认调用require语法
+ 2.Module.prototype.require 模块上的原型上有require方法







+ 1.require语法是同步的，fs.readFileSync
+ 2.最终require语法返回的是module.exports
+ 3.模块的exports 和 module.exports 引用的是同一个变量
+ 4.模块是动态加载每次require都会获取最新的到处结果，可以将require写入到条件种
+ 5.更改exports的引用，不会导致module.exports变化
+ 6.循环引用，一般不会出现，如果出现，只能加载部分数据

// 发布订阅 事件驱动 时间通知 发布订阅模式
// node种自己实现了一个发布订阅
const EventEmitter = require('events);

//实例上的属性和方法（每个人都有一份）原型上的属性和方法（所有人共同使用一个）

// 继承 常用的继承策略
// 继承父类的原型方法
// Girl.prototype.__proto__ = EventEmitter.prototype; 最早
// Object.create(EventEmitter.prototype);
// Object.stPrototypeOf(Gilr.prototype,EventEmitter.prototype) es6
// extends语法，class Girl extends EventEmitter

```js
function create(parentProtype){
    function Fn(){}
    Fn.prototype = parentProtype;
    return new Fn;
}
Girl.prototype = create(EventEmitter.prototype);
```

# event 事件的原理
+ 主要由on，off，emitter，once，addListener

# 














