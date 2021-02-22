# vue源码解读MVVM

##前言
    最近在b站看了一个有关手动实现MVVM的教学视频。进去全程看完，受益匪浅。特地再次记录当时的学习笔记。话不多说，我们开始吧。
    
## MVVM 原理
  Vue响应式原理最核心的是通过Object.defineProperty()来实现对属性的劫持，达到监听数据变动的目的，
  无疑这个方法是本文中最重要、最基础的内容之一
  + 实现一个数据监听器Observer，能够对数据对象的所有属性进行监听，如有变动可拿到最新值并通知订阅者
  + 实现一个指令解析器Compile，对每个元素节点的指令进行扫描和解析，根据指令模板替换数据，以及绑定相应的更新函数
  + 实现一个Watcher，作为连接Observer和Compile的桥梁，能够订阅并收到每个属性变动的通知，执行指令绑定的相应回调函数，从而更新视图
  + mvvm入口函数，整合以上三者
  
  
  【插入图片】
### 1. 先写一个实例化vue的小例子
> 说明，例子中js的引入，一个是引入MVue的类的js文件，一个是Observer观察类的js。
    
```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>自己个儿的MVVN</title>
    </head>
    <body>
        <div id="app">
            <h2>{{person.name}} --- {{person.age}}</h2>
            <h3>{{person.gender}}</h3>
            <ul>
                <li>1</li>
                <li>2</li>
                <li>3</li>
            </ul>
            <div v-text="msg"></div>
            <div v-html="htmlStr"></div>
            <input type="text" v-model="msg">
        </div>
    
        <script src="./js/MVue.js"></script>
        <script src="./js/Observer.js"></script>
        <script scr="./js/Compile.js"></script>
        <script>
            let vm = new MVue({
                el:'#app',
                data:{
                    person:{
                        name:'Harry',
                        age:18,
                        gender:'male'
                    },
                    msg:'Harry wants to learn sth about Vue MVVM',
                }
            })
        </script>
    </body>
    </html>
```
### 2. 实现一个自定义的vue

MVue这个class所做的事，不外乎就是关联Observer和Compile。在构造函数里面去新建Observer和compile的实例

```
class MVue{
    constructor(options){
        this.$el = options.el; //获取到的是挂载元素
        this.$data = options.data; //获取new Vue内定义的data对象
        this.$options = options; //整个new Vue参数对象数据对象

        //有挂载的元素才进行以下操作。
        if(this.$el){
            //1.实现一个数据观察者Observer
            //因为要观察data的变化，所以处理的data！
            new Observer(this.$data);

            //2.实现一个指令解释器
            new Compile(this.$el,this);

            //3.代理方法
            this.proxyData(this.$data);
        }
    }
}
```
    
### 3. 实现一个指令解释器Compile

   Compile实际上是一个什么样的类呢？从英文就知道，它是一个解释器，是一个指令解释器。对每个元素节点的指令进行扫描和解析，根据指令模板替换数据，以及绑定
   相应的更新函数，添加监听数据的订阅者，一旦数据发生变动，收到通知，更新视图。
   
   我们可以先简单想一下，
   1. 需要编译什么东西？
   2. 怎么编译？
   
   
   >需要编译什么东西?
   +    很明显，我们在html中，使用了 `{{}}`,`v-text`,`v-html`,`v-model` 这些语法标签；另外还有对象数据的赋值，
   `person.name`,`person.gender`等
   
   >怎么编译？
   
   + 其实分为两大类，一类是数据赋值的编译。只需要我们拿到new Vue的是里面的data，这里赋值就可以实现；
   第二类是语法糖的编译，首先需要知道是什么类型语法糖，`text` OR `html` OR `model` OR `on`
   但是实际上，在vue.js的源码里面，这个编译是通过Vnode这个类去处理的。这个是个大模块。这里先埋个坑
   后面会专门出一个Vnode的解读。
   
   下面是compile的类，主要说明下，要注意一些什么点：
   1. 这个类首先接受了两个参数，这一步是在初始化MVue组件的时候；`new Compile(this.$el,this)`;
   2. 接受到元素相关的参数后，需要获取元素的文档碎片对象。具体可以看`function node2Fragment()`；
   3. 遍历文档碎片，区分对象是`元素节点`还是`文本节点`，递归调用compile方法处理
   
### 3.1 compile 初始化和使用文档碎片
```
class Compile{
    constructor(el,vm) {
        //1.判断el是元素字符串，还是dom字符串
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
     
        this.vm = vm;
        //2.获取文档碎片对象，放入内存中会减少页面的回流和重绘
        const fragment = this.node2Fragment(this.el);
      

        //3. 编译模板
        this.compile(fragment);

        //4.编译好之后，追加子元素到根元素
        this.el.appendChild(fragment);
    }

    compile(fragment){
        //1. 获取子节点
        const childNodes = fragment.childNodes;
        //强制转成数组
        [...childNodes].forEach(child=>{
            //会拿到文本节点，元素节点
            if(this.isElementNode(child)){
                //是元素节点
                //编译元素节点
                this.compileElement(child);
            }else{
                //是文本节点
                this.compileText(child);
            }

            if(child.childNodes && child.childNodes.length){
                this.compile(child);
            }
        })
    }

   

    isEventName(attrName){
        return  attrName.startsWith('@');
    }

    isDirective(attrName){
        return attrName.startsWith('v-');
    }

    /**
     * 作用：2.DocumentFragment当请求把一个DocumentFragment节点插入文档树时，
     * 插入的不是DocumentFragment自身，
     * 而是它的所有子孙节点，即插入的是括号里的节点。
     * 这个特性使得DocumentFragment成了占位符，暂时存放那些一次插入文档的节点。
     * 它还有利于实现文档的剪切、复制和粘贴操作。
     * 另外，当需要添加多个dom元素时，如果先将这些元素添加到DocumentFragment中，
     * 再统一将DocumentFragment添加到页面，会减少页面渲染dom的次数，效率会明显提升。
     * @param el
     * @returns {DocumentFragment | ActiveX.IXMLDOMDocumentFragment}
     */
    node2Fragment(el){
        //创建文档碎片
        const f = document.createDocumentFragment();
        let firstChild;
        while( firstChild = el.firstChild ){
            f.appendChild(firstChild);
        }
        return f;
    }

    /**
     * Node.ELEMENT_NODE	1	一个 元素 节点，例如 <p> 和 <div>。
     *  Node.TEXT_NODE	3	Element 或者 Attr 中实际的  文字
     * @param node
     * @returns {boolean}
     */
    isElementNode(node){
        return node.nodeType === 1;
    }
}

```
>这时候会发现页面跟之前没有任何变化,但是经过Fragment的处理,优化页面渲染性能

### 3.2 编译文本节点
> 思考一下，文本节点不外乎是这样的表现形式 `<div>I'm Harry</div>` 或者 `<div>I'm {{person.name}}</div>`
+ 处理是不是显而易见？获取到内容，如果有 `{{` 咱就处理这个。
```
    /**
     * 编译文本节点
     * @param node
     */
    compileText(node){
        //匹配{{}}，取出里面的值，读取.号分隔符；
        console.log(node.textContent);
        const content = node.textContent;
        //正则匹配
        if(/\{\{(.+?)\}\}/.test(content)){
            console.log(content);
            compileUtil['text'](node, content, this.vm);
        }
    }
```

### 3.3 编译元素节点
> 思考元素节点该怎么处理？
+ vue里面有很多的指令，`v-text`,`v-html`,`v-on`,`v-for`,`v-if`,`v-else`等等
如果是`v-text`是不是就是获取到元素的key，设置元素的textContent就好？
如果是`v-html`是不是要设置元素的innerHTML?
如果是`v-on`是不是要给元素绑定事件？
如果是`v-for`呢？这个就有点复杂，大家可以自己想想。

```
 /**
     * 编译元素节点
     * @param node
     *
     * 例如：<div v-text="msg"></div>
     * 1.先取所有的【属性名，属性值】数组
     * 2.匹配v-开头的所有属性
     * 3.以'-'分隔，获取后面的指令类型——比如text,html,model,on:click,for等等
     * 4.根据不同的指令类型处理node——CompileUtil处理
     *  · text: 设置textContent
     *  · html: 设置innerHTML
     *  · model：处理双向绑定
     *  · on: 处理事件绑定
     */
    compileElement(node){
        //匹配<>，匹配v- 的语法糖，匹配文本——可调用compileText方法处理；
        const attributes = node.attributes;
        //强制转化成数组
        [...attributes].forEach(attr => {
            //区分原生还是v-的相关指令
            const {name , value} = attr;  //获取属性名和属性值
            console.log(name);
            if(this.isDirective(name)){  //是一个指令 v-text v-html v-model v-on:click
                const [,directive] = name.split('-');  // text,html,model, on:click
                const [dirName, eventName] = directive.split(':');  // text html model on
                //更新数据 根据驱动视图
                compileUtil[dirName](node, value, this.vm, eventName);
                //删除有指令的标签上的属性
                node.removeAttribute('v-' + directive);
            }else if(this.isEventName(name)){   //@click="handleClick"
                let [, eventName] = name.split('@');
                compileUtil['on'](node,value, this.vm, eventName);
            }
        })
    }
```

### 3.4 处理元素/处理文本/处理事件
>思考一下：怎么去处理元素，处理文本，处理事件

核心都是拿到数据渲染的key值。比如 person.name , 从data里面读到这些值。 

```
const compileUtil = {
    getVal(expr,vm){
        //[person,name]
        return expr.split('.').reduce((data,currentValue) => {
            console.log(currentValue);
            return data[currentValue];
        },vm.$data);
    },

    getContentVal(expr, vm){
        return  expr.replace(/\{\{(.+?)\}\}/g,(...args)=>{
            return this.getVal(args[1]);
        })
    },

    setVal(expr,vm,inputVal){
        return   expr.split('.').reduce((data,currentValue) => {
            console.log(currentValue);
            data[currentValue] = inputVal;
        },vm.$data);
    },

    /**
     * 传进来的参数举例有（node对象，'msg/person.nav',vm对象（里面可以拿到data））
     * 需要获取person.nav这种格式类型的具体值——getVal('msg/person.nav',vm)
     * @param node：元素对象
     * @param expr：属性值
     * @param vm：  整个vm对象
     */
    text(node, expr, vm){  // expr: msg  ,person.fav , {{}}
        //const value = vm.$data[expr];
        let value;
        if(expr.indexOf('{{') !== -1){ // {{person.name}}-{{person.age}}  watcher获取到又要重新处理
            //{{person.name}}  --- {{person.age}}
            value = expr.replace(/\{\{(.+?)\}\}/g,(...args)=>{
                //[ {{}}, person.name , 0 ,  {{person.name}} --- {{person.age}}]
                console.log(args);  //打印出来看看

                new Watcher(vm,args[1],(newVal)=>{  //注意第二个参数不是expr，是要person.age
                    this.updater.textUpdater(node,this.getContentVal(expr,vm));
                })

                return this.getVal(args[1],vm);
            })
        }else{
            value = this.getVal(expr,vm);
        }

        this.updater.textUpdater(node, value)
    },
    html(node, expr, vm){
        const value = this.getVal(expr,vm);
        //绑定观察者，将来数据发生变化，触发这里的回调，进行更新
        new Watcher(vm,expr,(newVal)=>{
            this.updater.htmlUpdater(node,newVal);
        })
        this.updater.htmlUpdater(node, value)
    },
    model(node, expr, vm){
        const value = this.getVal(expr,vm);
        // 绑定更新函数 数据->视图
        new Watcher(vm,expr,(newVal)=>{
            this.updater.modelUpdater(node,newVal);
        })

        //视图-》数据 -》 视图
        node.addEventListener('input',(e)=>{
            //设置值
            this.setVal(expr,vm,e.target.value);
        });

        this.updater.modelUpdater(node, value)
    },
    on(node, expr, vm, eventName){
        let fn = vm.$options.methods && vm.$options.methods[expr];
        //这里的绑定需要把vm传递进去，因为不这么做的话，this就是no函数所在作用域
        node.addEventListener(eventName, fn.bind(vm),false); //注意this的指向
    },
    bind(node,expr,vm, attrName){

    },
    //更新的函数
    updater: {
        textUpdater(node, value){
            node.textContent = value;
        },
        htmlUpdater(node, value){
            node.innerHTML = value;
        },
        modelUpdater(node, value){
            node.value = value;
        }
    }
}
```

以上步骤，我们实现的是这一步。
【图片】

接下来我们实现这一块
【图片】

### 4 实现一个数据监听器Observer
   模板编译好了之后，我们接下来就要做数据劫持。只有这样，我们才能去做数据变化->更新视图等操作。
   这个类的核心代码就是`Object.defineProperty()`
   
   Observer类实现主要的注意点有：
   + 通过Object.keys()获取data数据里面的keys，对keys进行遍历劫持。
   + 赋值会被Object.defineProperty()中的get()方法劫持。
   + 对数据修改会被Object.defineProperty()中的set()方法劫持。但是每次修改操作都要重新观察该数据，不然会丢失get，set()方法。

    ```js
    class Observer{
        constructor(data){
            this.observe(data);
        }
    
        /**
         * 定义一个观察对象的方法
         * 例如 {
         *        person：{
         *           name:'hhh',
         *            like:{
         *                food:'寿司',
         *            }
         *        }
         *
         *      }
         * @param data
         */
        observe(data){
            if(data && typeof data === 'object'){
                console.log(Object.keys(data));  //这里能渠道person，里面的不能,所以在defindRective里面继续调用observer遍历
                Object.keys(data).forEach(key => {
                    this.defineRective(data, key, data[key]);
                })
            }
        }
    
        /**
         * 对每个属性进行getter，setter
         * @param obj
         * @param key
         * @param value
         * @returns {*}
         */
        defineRective(obj,key, value){
            // 递归遍历
            this.observe(value);
    
            const dep = new Dep();
    
            Object.defineProperty(obj, key, {
                enumerable: true,
                configurable: false,
                //数据变化时，往dep中添加观察者
                //要创建deep，deep有个通知添加watch的方法
                get(){
                    Dep.target && dep.addSub(Dep.target);
                    return value;
                },
                //todo list 改成箭头函数，this的指向就能指向Observer了
                set:(newVal)=>{
                    //todo list 注意：新的值要重新监听。因为直接赋值会没有重新监听到get，set
                    this.observe(newVal);
                    if(newVal !== value){
                        value = newVal;
                    }
                    //告诉dep通知变化
                    dep.notify();
                }
            })
        }
    }
    ```

再来小结一下，我们这张图，已经走完这里了
【插入图片】    

> 思考：我们已经可以监听每个数据变化了，接下来要处理的是监听到变化之后，要怎么通知订阅者watcher？？
他们之前怎么能产生关系？
+ 我尝试说下自己的思路，因为我们每个数据变化都要去触发一个watcher的update方法，
很多数据的话，是不是我们得用一个容器把它存起来。作为observer和watcher的中转站，去管理整个watcher的list？

+ 举个列子，在肯德基，店员是observer，Dep相当于点餐系统，Watcher就是一个个生产线，汉堡生产线，炸鸡生产线，薯条生产线，可乐线。
店员捕获到客人要换成牛肉汉堡，Dep点餐系统就会通知 汉堡生产线watcher，客人要换牛肉汉堡了。
汉堡生产线watcher换成牛肉汉堡后，在点餐系统Dep完成更换，DONE!

>为什么需要点餐系统Dep
+ 现在明白了吗？方便统一管理收集更改指令

> 这样我们已经可以监听每个数据的变化了，那么监听到变化之后就是怎么通知订阅者了，
所以接下来我们需要实现一个消息订阅器，很简单，维护一个数组，用来收集订阅者，
数据变动触发notify，再调用订阅者的update方法，代码改善之后是这样：

### 4.1 创建Dep
    
```
/**
 * 为了收集依赖watcher
 * 作用： 1.通知 2.收集
 *
 * 思考：deep怎么和observer关联？？
 */
class Dep{
    constructor(){
        this.subs = [];
    }
    //收集观察者
    addSub(watcher){
        this.subs.push(watcher);
    }
    //通知观察者去更新
    notify(){
        //
        console.log('通知了观察者',this.subs);
        this.subs.forEach(w => {
            w.update();
        })
    }
}
```
> 怎么让Dep类和observer关联
我们留到后面回答。

### 5 实现一个Watcher
watcher和dep的关系，通过肯德基的例子，大家是不是可以更形象一点去理解了？接下来我们就是代码去处理Dep和watcher的关系。

watcher它作为连接Observer和Compile的桥梁，能够订阅并收到每个属性变动的通知，执行指令绑定的相应回调函数，从而更新视图
只要所做事情:
1. 在自身实例化时往属性订阅器(dep)里面添加自己 （这样点餐系统Dep才知道，有哪些生产线是它需要去管理的）
2. 自身必须有一个update()方法 （因为汉堡生产线才能把变更的汉堡产出）
3. 待属性变动dep.notify()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。
（生产线不会跑出去问客人，嘿，我现在闲的要死，你要吃什么汉堡吗？这些事情等着Dep系统给你派发好吧。）

> 问题：怎么把dep与observer关联
+ 还是拿肯德基来举例子……店员observer怎么和点餐系统Dep关联？肯定是Observer店员有人要变更实物来咨询他（劫持到数据变化），
Observer店员才会去（notify）点餐系统Dep，哎！汉堡生产线（watcher）要动起来了！

> 问题： 怎么把watcher和dep联系起来——汉堡生产线（watcher）怎么和 Dep(点餐系统)联系起来？

+ 用户在点餐（数据赋值）的时候， 店员Observer会把指定的商品生产线watcher添加（addDep）到Dep(点餐系统)里。
怎么拿到是哪个商品生产线？因为生产线，肯定是要对比用户点餐（数据取值）和用户变餐（数据赋值），看下需不需要再生产。
在用户点餐的时候，接下来……我编不下去了……卧槽，想不明白！这里编的有点牵强，先看完watcher什么时候绑定可能更好。

//订阅数据变化,往Dep中添加观察者
Dep.target && dep.addSub(Dep.target);
+ 看着这个代码继续来解析，为什么不在addSub直接new Watcher呢？
因为！
在点餐系统Dep需要对接多条生产线，他只有一个对接口，对接完生产线Watcher后要释放出来给对接下一条生产线。

            

+ 劫持get数据的时候，订阅数据变化，就要往dep里面添加观察者了
但是观察者从哪里来？
    获取老值的时候，把watcher挂载到dep上。操作是Dep.target = this;
    老的值获取出来后，要把原来的Dep.target = null;
这样dep里面就能拿到观察者了

>问题： watcher 是什么时候绑定的
+ 在获取到值的时候
+ 店员是怎么知道是汉堡生产线（watcher），还是薯条生产线（watcher）,还是炸鸡生产线(watcher)?
在客人点餐（赋值的时候）的时候，店员Observer就已经可以知道，客人点的套餐包括什么，有哪些生产线需要开动起来。



watcher 需要判断新值和旧值
> 问题： 怎么取到旧值？
+ 我们首先看编译模板的时候，是不是可以获取到 person.name 这些对象key；还有vm下的整个data对象。
从这里我们就可以拿到旧值了

> 问题： 怎么取到新值？
+ 跟旧值一样的判断方法
一更新，Observer就会通知Dep
通知Dep就会notify，就会找到watcher去update；然后update就会获新值的回调。

```
//Watcher.js
class Watcher{
    constructor(vm,expr,cb) {
        // 观察新值和旧值的变化,如果有变化 更新视图
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        // 先把旧值存起来  
        this.oldVal = this.getOldVal();
    }
    getOldVal(){
        Dep.target = this;
        let oldVal = compileUtil.getVal(this.expr,this.vm);
        Dep.target = null;
        return oldVal;
    }
    update(){
        // 更新操作 数据变化后 Dep会发生通知 告诉观察者更新视图
        let newVal = compileUtil.getVal(this.expr, this.vm);
        if(newVal !== this.oldVal){
            this.cb(newVal);
        }
    }
}

//Observer.js
defineReactive(obj,key,value){
    // 循环递归 对所有层的数据进行观察
    this.observe(value);//这样obj也能被观察了
    const dep = new Dep();
    Object.defineProperty(obj,key,{
        get(){
            //订阅数据变化,往Dep中添加观察者
            Dep.target && dep.addSub(Dep.target);
            return value;
        },
        //....省略
    })
}

```    
>当我们修改某个数据时,数据已经发生了变化,但是视图没有更新，我们对照图片在看看

【插入图片】

> 思考一下：怎么才能关联？compile和watcher的关联呢？

对照图来看下，要在compile数据变化的时候，
我们是在哪里进行数据设置的？是在分析到标签后，分析绑定数据的时候
数据发生变化的。

所以我们在对编译重新赋值的地方进行watch的关联。

【插入图片】







    
### 6 代理proxy
>我们在使用vue的时候,通常可以直接vm.msg来获取数据,这是因为vue源码内部做了一层代理.也就是说把数据获取操作vm上的取值操作 都代理到vm.$data上

```
 proxyData(data){
       for (const key in data) {
          Object.defineProperty(this,key,{
              get(){
                  return data[key];
              },
              set(newVal){
                  data[key] = newVal;
              }
          })
       }
    }
```

### 总结
【插入图片】
vue.js 则是采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。
MVVM作为数据绑定的入口，整合Observer、Compile和Watcher三者，通过Observer来监听自己的model数据变化，通过Compile来解析编译模板指令，最终利用Watcher搭起Observer和Compile之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据model变更的双向绑定效果



以上分享大部分参考
Vue的MVVM实现原理 <https://juejin.cn/post/6844904183938678798#heading-9>

























