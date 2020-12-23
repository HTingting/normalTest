/**
 * 由 HTML DOM -> VNode: 将这个函数当做compiler 函数
 * @param node
 */
function getVNode(node) {
    let nodeType = node.nodeType;
    let _vnode = null;
    if( nodeType === 1) {
        //元素
        let nodeName = node.nodeName;
        let attrs = node.attributes;
        let _attrObj = {};
        for( let i = 0 ; i < attrs.length; i++ ){
            _attrObj[ attrs[i].nodeName ] = attrs[i].nodeValue;
        }
        _vnode = new VNode(nodeName, _attrObj, undefined, nodeType);

        // 考虑 node 的子元素
        let childNodes = node.childNodes;
        for(let i = 0 ; i < childNodes.length; i++ ){
            _vnode.appendChild( getVNode(childNodes[i]) ); //递归
        }
    } else if (nodeType === 3){
        _vnode = new VNode(undefined,undefined, node.nodeValue, nodeType);
    }

    return _vnode;
}

/**
 * 将虚拟 DOM 转换成真正的 DOM
 * @param vnode
 */
function parseVNode( vnode ){
    // 创建 真实的 DOM
    let type = vnode.type;
    let _node = null;
    if( type === 3){
        return document.createTextNode(vnode.value); //创建文本节点
    }else if( type === 1){

        _node = document.createElement(vnode.tag);

        //属性
        let data = vnode.data;  //现在这个 data 是键值对
        Object.keys(data).forEach( ( key ) => {
            let attrName = key;
            let attrValue = data[key];
            _node.setAttribute(attrName, attrValue );
        });

        // 子元素
        let children = vnode.children;
        children.forEach( subvnode => {
            _node.appendChild( parseVNode(subvnode) );  //递归转换子元素（虚拟dom）
        });

        return _node;
    }
}

let rkuohao = /\{\{(.+?)\}\}/;

/**
 * 根据路径 访问对象成员
 * @param obj
 * @param path
 */
function getValueByPath(obj, path ){
    let paths = path.split('.');
    let res = obj;
    let prop;
    while( prop = paths.shift() ){
        res = res[ path ];
    }
    return res;
}

/**
 * 将 带有 坑的Vnode 与数据 data结合，得到填充数据的VNode，模拟AST ->VNode
 * @param vnode
 * @param data
 */
function combine(vnode, data ){
    let _type = vnode.type;
    let _data = vnode.data;
    let _value = vnode.value;
    let _tag = vnode.tag;
    let _children = vnode.children;

    let _vnode = null;

    if(_type === 3){  //文本节点

        // 对文本处理
        _value = _value.replace(rkuohao, function ( _, g) {
            return getValueByPath(data , g.trim());  //除了get读取器
        });

        _vnode = new VNode(_tag, _data, _value, _type);
    }else if(_type === 1){  //元素节点
        _vnode = new VNode(_tag, _data, _value, _type);
        _children.forEach(_subvnode => _vnode.appendChild(combine(_subvnode, data)));

    }
    return _vnode;
}
