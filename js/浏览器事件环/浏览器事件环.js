/*

1.浏览器的进程
+ 每一个也卡都是进程，互不影响
+ 浏览器也有一个主进程，用户界面
+ 渲染进程，每个页卡里都有一个渲染进程（浏览器内核）
+ 网络进程（处理请求）
+ GPU进程 3d绘制
+ 第三方插件的进程

2.渲染进程（包含着多个线程）
+ GUI渲染线程（渲染页面的）
+ js引擎线程，他和页面渲染是互斥
+ 事件触发线程，独立的线程eventloop
+ 事件click,setTimeout,ajax也是一个独立线程

3.宏任务，微任务
+ 宏任务 宿主环境提供的异步方法，都是宏任务
    script ui渲染
+ 微任务 语言标准提供promise,mutationObserver

4.微任务和GUI渲染

 */