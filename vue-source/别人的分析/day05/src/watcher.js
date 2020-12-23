
class Watcher{

    constructor( vm, expOrFn){
        this.vm = vm;
        this.getter = expOrfn;

        this.deps = [];
        this.depIds = {}; //是一个set类型，用于保证依赖想的唯一性（简化的代码暂时不识闲这一块）

        //一开始需要渲染：展示Vue中： this.lazy ? undefined :this.get();
        this.get();
    }
}
