const compileUtil = {
    getVal(expr,vm){
        //[person,name]
        return expr.split('.').reduce((data,currentValue) => {
            console.log(currentValue);
            return data[currentValue];
        },vm.$data);
    },

    //或者也可以使用这种方法
    getValuesByPath( obj, path){
        let paths = path.split('.');  // [xxx,yyy,zzz]
        let res = obj;
        let prop;
        while(prop = paths.shift()){
            res = res[ prop ];
        }
        return res;
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

class Compile{
    constructor(el,vm) {
        //1.判断el是元素字符串，还是dom字符串
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        //console.log(this.el);

        this.vm = vm;
        //2.获取文档碎片对象，放入内存中会减少页面的回流和重绘
        const fragment = this.node2Fragment(this.el);
        console.log('获取文档碎片对象----',fragment);

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
                //删除有指令的表情上的属性
                node.removeAttribute('v-' + directive);
            }else if(this.isEventName(name)){   //@click="handleClick"
                let [, eventName] = name.split('@');
                compileUtil['on'](node,value, this.vm, eventName);
            }
        })
    }

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

    isEventName(attrName){
        return  attrName.startsWith('@');
    }

    isDirective(attrName){
        return attrName.startsWith('v-');
    }

    /**
     * 作用：2.DocumentFra当请求把一个DocumentFragment节点插入文档树时，插入的不是DocumentFragment自身，
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


class MVue{
    constructor(options){
        this.$el = options.el;
        this.$data = options.data;
        this.$options = options;

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

    proxyData(data){
        for(const key in data){
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
}
