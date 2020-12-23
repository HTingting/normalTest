/**
 * patch 本意是打补丁的意思，这个函数有两个功能，一个是根据 vnode 挂载 DOM，一个是根据新旧 vnode 更新 DOM。
 * @param n1  表示旧的 vnode，当 n1 为 null 的时候，表示是一次挂载的过程；
 * @param n2   n2 表示新的 vnode 节点，后续会根据这个 vnode 类型执行不同的处理逻辑
 * @param container  container 表示 DOM 容器，也就是 vnode 渲染生成 DOM 后，会挂载到 container 下面。
 * @param anchor
 * @param parentComponent
 * @param parentSuspense
 * @param isSVG
 * @param optimized
 */
const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, optimized = false) => {
    // 如果存在新旧节点, 且新旧节点类型不同，则销毁旧节点
    if (n1 && !isSameVNodeType(n1, n2)) {
        anchor = getNextHostNode(n1)
        unmount(n1, parentComponent, parentSuspense, true)
        n1 = null
    }
    const { type, shapeFlag } = n2
    switch (type) {
        case Text:
            // 处理文本节点
            break
        case Comment:
            // 处理注释节点
            break
        case Static:
            // 处理静态节点
            break
        case Fragment:
            // 处理 Fragment 元素
            break
        default:
            if (shapeFlag & 1 /* ELEMENT */) {
                // 处理普通 DOM 元素
                processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized)
            }
            else if (shapeFlag & 6 /* COMPONENT */) {
                // 处理组件
                processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized)
            }
            else if (shapeFlag & 64 /* TELEPORT */) {
                // 处理 TELEPORT
            }
            else if (shapeFlag & 128 /* SUSPENSE */) {
                // 处理 SUSPENSE
            }
    }
}

const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
    if (n1 == null) {
        // 挂载组件
        mountComponent(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized)
    }
    else {
        // 更新组件
        updateComponent(n1, n2, parentComponent, optimized)
    }
}

const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
    // 创建组件实例
    const instance = (initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense))
    // 设置组件实例
    setupComponent(instance)
    // 设置并运行带副作用的渲染函数
    setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized)
}

