## 几种实现双向绑定的做法
目前集中主流的mvc框架都实现了单项数据绑定，而我所理解的双向数据绑定无非就是在单项绑定的基础上给可输入元素（input，textare等）
添加了change，input事件，来动态修改model和view。并没有多高深。所以无需太过介怀是实现的单项或双向绑定

### 实现数据绑定的做法有大致如下几种
1. 发布者-订阅者模式（backbone.js）
    
2. 脏值检查（angular.js）
    通过脏值检测的方式对比数据是否有变更，来决定是否更新视图，最简单的方式就是通过setInterval()定时轮询检测数据变动。当然Google
    不会这么low，angular只有在制定的时间触发时进入脏值检测，大致如下
    a.DOM事件，比如用户输入文本，点击按钮。（ng-click）
    b.XHR响应事件（$http）
    c.浏览器location变更事件（$location）
    d.Timer事件（$timeout,$interval）
    e.执行$digest()或$apply()
3. 数据劫持（vue.js）
    vue.js则是采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动的时候发布
    消息给订阅者，触发相应的监听回调
    a.Observer——指令解释器(劫持监听所有属性)
    b.Compilez——指令监听器(元素，指令编译)
    c.Watcher——更新视图
    d.实现一个proxy

### 阐述一下你所理解的mvvm响应式原理
    
    vue是采用数据劫持配合发布者-订阅者模式的方式。通过Object.defineProperty()来劫持各个属性的
    setter和getter，在数据变动时，发布消息给依赖收集器，去通知观察者，作出对应的回调函数，去更新视图
    
    mvvm作为绑定的入口，整合Observer，compile和watch三者，通过Observer来监听model数据变化，
    通过compile来解析编译模板指令，最终利用watcher搭起observer，compile之间的通信桥梁
    达到数据变化=》视图更新；视图交互变化=>数据model变更的双向绑定效果


### 回忆一下
    compile——主要是
    1.处理碎片化文档获取；
    2.标签分析，双引号的表里面的内容编译。
    3.绑定更新
    
