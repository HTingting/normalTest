##前言
最近开始深究下vue的源码，发现挺有意思的。接下来可能会有一个系列，希望能坚持分析完整个源码，并且记录下来。
首先第一篇分享，就是虚拟dom——vnode。VNode 是 Vue2 渲染机制中很重要的一部分，是深入Vue 必须了解的部分。

我们以4个问题来开始我们的探索
1、vnode 是什么及其作用

2、vnode 什么时候生成

3、vnode 怎么生成

4、vnode 存放什么信息

5、vnode 存放在哪里

6、vnode 在源码中怎么使用？

还等什么，上车！

https://template-explorer.vuejs.org/#%3Cdiv%20id%3D%22app%22%3EHarry%20Potter%3C%2Fdiv%3E




## 1 VNode是什么及作用

首先，第一个问题已经很烂了，网上有很多相关的内容，为了内容的完整性，所以也放上来哈哈。
VNode 表示 虚拟节点 Virtual DOM，为什么叫虚拟节点呢，因为不是真的 DOM 节点。
他只是用 javascript 对象来描述真实 DOM，这么描述，把DOM标签，属性，内容都变成 对象的属性
过程就是，把你的 template 模板 描述成 VNode，然后一系列操作之后通过 VNode 形成真实DOM进行挂载
就比如：

插入图片！！！！！！


### 1.1 是什么？

JavaScript 对象

### 1.2 什么用？

+ 兼容性强，不受执行环境的影响。VNode 因为是 JS 对象，不管 Node 还是 浏览器，都可以统一操作， 从而获得了服务端渲染、原生渲染、手写渲染函数等能力

+ 减少操作 DOM。任何页面的变化，都只使用 VNode 进行操作对比，只需要在最后一步挂载更新DOM，不需要频繁操作DOM，从而提高页面性能


## 1 VNode怎么生成

在 Vue 源码中，vnode 是通过一个构造函数生成的，构造函数看起来挺简单的

本来以为很多内容，带着沉重的心情去探索，然后看到之后就放松了下来，看了一会，心情再次沉重了起来

其中涉及的内容还是挺多的....不然哪里来开篇的那么多问题

行了，看下 VNode 的构造函数
```
function VNode(
    tag, data, children, 
    text, elm, context, 
    componentOptions

) {    

    this.tag = tag; // 标签名

    this.data = data;    

    this.children = children; // 子元素

    this.text = text; // 文本内容

    this.elm = elm; // Dom 节点



    this.context = context;    

    this.componentOptions = componentOptions;    

    this.componentInstance = undefined;    

    this.parent = undefined;    

    this.isStatic = false; // 是否静态节点

    this.isComment = false; // 是否是注释节点

    this.isCloned = false; // 是否克隆节点

};
```

看完上面，先不要纠结都是什么东西，先来走一遍,比如我们使用 vnode 去描述这样一个template

```
<div class="parent" style="height:0" href="2222">
    111111
</div>
```

使用 VNode 构造函数就可以生成下面的 VNode

{    

    tag: 'div',    

    data: {        

        attrs:{href:"2222"}

        staticClass: "parent",        

        staticStyle: {            

            height: "0"

        }
    },    

    children: [{        

        tag: undefined,        

        text: "111111"

    }]
}
这个 JS 对象，就已经囊括了整个模板的所有信息，完全可以根据这个对象来构造真实DOM了

至于其中都是什么意思，请看下个问题



## 3 VNode存放什么信息

新建一个 vnode 的时候，包含了非常多的属性，每个属性都是节点的描述的一部分

我们只捡一些属性来探索一下，了解主体即可



1普通属性



1data

1、存储节点的属性，class，style 等

2、存储绑定的事件

3、....其他







2elm

真实DOM 节点

生成VNode 的时候，并不存在真实 DOM

elm 会在需要创建DOM 时完成赋值，具体函数在 createElm 中

赋值语句就是一句（简化了源码）



3context

渲染这个模板的上下文对象

意思就是，template 里面的动态数据要从这个 context 中获取，而 context 就是 Vue 实例

如果是页面，那么context 就是本页面的实例，如果是组件，context则是组件的实例



4 isStatic

是否是静态节点

当一个节点被标记为静态节点的时候，说明这个节点可以不用去更新它了，当数据变化的时候，可以忽略去比对他，以提高比对效率





2组件相关属性



1parent

这个parent 表示是组件的外壳节点

额，什么是外壳节点，举个栗子先吧

1、存在这样一个组件 test



2、页面中使用这个组件





诶，到这里就有意思了，组件其实应有两种 VNode

页面给

组件test 

解析成的 VNode

{

    tag:"test",

    children:undefined

}

组件内部生成的 VNode

{

    tag:" h2",

    children:[{

       tag:undefined,

       text:"我勒个去"

    }]

}



这两种VNode 名义上都是对的，都有理，谁是正牌不好说

最后尤大判定第一个 VNode 是 第二个 VNode 的爸爸，也就是外壳节点



外壳节点通常是 父组件和 子组件的 关联，用于保存一些父组件传给子组件的数据 等



2 componentInstance

这个顾名思义，就是组件生成的实例，保存在这里

上面 test 组件的外壳节点中的 componentInstance









3 componentOptions

这个就存储一些 父子组件 PY 交易的证据

比如 props，事件，slot 什么的，打印看下









其中 children 保存的就是 slot，listeners 保存 事件，propsData 保存 props






## 4.VNode怎么生成

在初始化完选项，解析完模板之后，就需要挂载 DOM了。此时就需要生成 VNode，才能根据 VNode 生成 DOM 然后挂载

挂载 DOM 第一步，就是先执行渲染函数，得到整个模板的 VNode

比如有以下渲染函数，执行会返回 VNode，就是 _c 返回的VNode

function (){ 
    with(this){  
        return _c('div',{attrs:{"href":"xxxx"}},["1111"]).
    } 
}


渲染函数会绑定上下文对象，加上 with 的作用，_c 其实就是 vm._c

现在就来看 vm._c 是什么东西

vm._c = function(a, b, c, d) {    

    return createElement(vm, a, b, c, d, false);

};
function createElement(

    context, tag, data, 

    children, normalizationType

) {    

    var vnode;    

    if (tag是正常html标签) {

        vnode = new VNode(

            tag, data, children, undefined, 

            undefined, context

        );
    } 
    else if (tag 是组件) {
        vnode = createComponent(

            Ctor, data, context, 

            children, tag

        );

    }    

    return vnode

}



我们可以看到，正常标签 和 组件会走不同流程

1正常标签

比如有这样一个正常标签模板





解析成渲染函数如下

function (){    

    with(this){  

        return _c('div',{

            attrs:{"href":"xxxx"}},

            ["1111"]

        )

    }
}
看上面_c 源码，可以知道经过 _c 把参数传导，这样去构建 VNode



new VNode(tag, data, children, undefined, undefined, context);


tag	 'div'
data	{attrs:{"href":"xxxx"}}
children	 ["1111"]
context	 页面实例


这样就保存了 tag，data，children 和 context



2组件

比如页面使用了test组件





解析成渲染函数如下

with(this){  
    return _c('div',[
        _c('test',
            {attrs:{"name":name}},
            ["1111"]
        )
    ],1)
}
看上面 _c 代码知道 ，_c 会先调用 createComponent



createComponent(Ctor, data, context, children, tag);}
tag	'test'
data	{ attrs:{"name":name} }
children	 ["1111"]
context	 页面父实例（毕竟这是外壳节点，是在父实例中解析的）
Ctor	组件的选项，然后变成组件的构造函数，这里可以先不管，后面会详细讲 Component 


createComponent 中也会调用 VNode 构造函数，生成VNode 并返回

function createComponent(

    Ctor, data, context, 

    children, tag

) {    

    // extractPropsFromVNodeData 作用是把传入data的 attr 中属于 props的筛选出来
    var propsData = extractPropsFromVNodeData(data, Ctor, tag);    

    

    var vnode = new VNode(

        ("vue-component-" + (Ctor.cid) + tag),
        data, undefined, undefined, undefined,

        context, {            

            Ctor: Ctor, 

            // 父组件给子组件绑定的props
            propsData: propsData, 

            // 父组件给子组件绑定的事件
            listeners: listeners, 

            tag: tag,            

            children: children

        });    

    return vnode

}





## 5. VNode存放在哪里

那么创建出来的 VNode 是否有被存起来，毫无疑问，肯定是要的啊

主要是三个位置存了 vnode，分别是

parent ，_vnode ，$vnode 

parent 上面已经说过，就先不提了，剩下两个全部是挂在 Vue 实例一级属性上的

打印一下组件的实例，可以很清楚看到这两个属性



下面来说说这两个东西



1_vnode



_vnode 存放表示当前节点的 VNode

什么叫当前，也就是可以通过这个VNode 直接映射成 当前真实DOM

他的作用是什么呢？

用来比对更新，比如你的数据变化了，此时会生成一个新的 VNode，然后再拿到保存的_vnode 对比，就可以得到最小区域，从而只用更新这部分

所以， _vnode 存放的可以说是当前节点，也可以说是旧节点

另外，_vnode 中保存有一个 parent，这个parent 就是外壳节点，上面说 vnode 的时候已经说过了

在哪里赋值？

我们来完整地走一遍流程，涉及源码很多，但是我已经非常精简了，大概了解个流程

function Vue() {
    ...初始化组件选项等
    mountComponent()

}



function mountComponent() {


    ....解析模板，生成渲染函数
   
    // 用于生成VNode，生成DOM，挂载DOM
    updateComponent = function() {
        vm._update(vm._render());
    };    



    // 新建 watcher，保存updateComponent为更新函数，新建的时候会立即执行一遍
    new Watcher(vm, updateComponent)
}



function Watcher(vm, expOrFn) {    

    this.getter = expOrFn ;    

    this.getter()

}



// 执行前面解析得到的渲染函数，返回生成的 VNode

Vue.prototype._render = () {}



// 根据vnode，生成DOM 挂载

Vue.prototype._update = function(vnode) {    

    var prevVnode = vm._vnode;

    vm._vnode = vnode;    

    if (不存在旧节点） { ...使用vnode创建DOM并直接挂载 }    

    else { ...存在旧节点，开始比对旧节点和新节点，然后创建DOM并挂载 }

}





2$vnode



$vnode 只有组件实例才有，因为 $vnode 存放的是外壳节点，页面实例中是不存在 $vnode 的

本来也想走下流程的，无奈兜兜转转太多，涉及源码更多

在哪里进行赋值？

我就放最后一步 updateChildComponent

updateChildComponent 会在上个 _vnode 提到的 vm._update 执行流程中调用

function updateChildComponent(
    vm, parentVnode

) {

    vm.$options._parentVnode = parentVnode;
    vm.$vnode = parentVnode; 
    if (vm._vnode) {
        vm._vnode.parent = parentVnode;
    }
}

