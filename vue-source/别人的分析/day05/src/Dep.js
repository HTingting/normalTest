
class Dep{

    constructor() {
        this.subs = [];  // 存储的是与 当前 Dep 关联的 watcher
    }

    /**
     * 添加一个watcher
     * @param sub
     */
    addSub( sub ){

    }

    removeSub( sub ){

    }

    /**
     * 将当前 Dep 与当前的 watcher（暂时渲染watcher）关联
     */
    depend(){

    }

    /**
     * 触发与之关联的watcher的update 方法，起到更新的作用
     */
    notify(){
        // 在真实的Vue 中是一次触发 this.subs 中的watcher 的update 方法
        if( Dep.target ){
            Dep.target.update();
        }
    }
}

//全局的容器存储渲染watcher
//let globalWatcher
//学 Vue 的实现
Dep.target = null; // 这就是全局的watcher
