### 虚拟dom的比较处理
1.先找到不需要移动的相同节点，消耗最小
2.再找到相同的但是需要移动的节点，消耗第二小
3.最好找不到，才会去新建删除节点，保底处理

我们想要知道vnode的
1. vnode是什么东西？作用是什么？
    Vnode表示虚拟节点virtual DOM，为甚叫虚拟节点？因为不是真的DOM节点
    它只是用了js对象来描述正式dom，这么描述，把dom标签，属性，内容都变成对象的属性。
    就像js对象描述一个人一样
    {gender:'male',name:'Harry'}
    
    过程就是，把你的template模板描述成VNode，然后一些列操作之后通过vnode形成正式dom进行挂载
    
    总的来说：他是个js对象
    什么作用：
    + 兼容性强，不受执行环境的影响。vnode因为js对象，不管node还是浏览器，都可以统一操作，从而获得了服务端渲染，原生渲染，手写渲染等函数能力   
    + 减少操作dom，任何页面的变化，都只使用vnode进行操作对比，只需要在最后一步怪哉更新dom。不需要频繁操作dom。从而提高页面性能。

2. vnode 是什么时候生成的
    <div class="parent" style="height:0" href="2222">
        111111
    </div>
    
    他的作用是把上面的dom结构转换成js对象
    
    
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
    
3. vnode 是怎么生产的

    VNode 的构造函数
4. vnode 存放了什么东西？存放了什么信息？
    普通属性
    组件相关属性
    
5. vnode 存放在哪里？
