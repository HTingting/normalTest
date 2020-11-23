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

class Observer{
    constructor(data){
        this.observe(data);
    }
    observe(data){
        if(data && typeof data === 'object'){
            console.log(Object.keys(data));
            Object.keys(data).forEach(key => {
                this.defineRective(data, key, data[key]);
            })
        }
    }

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
            //改成箭头函数，this的指向就能指向Observer了
            set:(newVal)=>{
                //新的值要重新监听。因为直接赋值会没有重新监听到get，set
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


class Watcher{
    constructor(vm, expr, cb){
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        //先保存旧值
        this.oldVal = this.getOldVal()
    }

    getOldVal(){
        Dep.target = this;  //watcher 挂载到dep上面
        let oldVal = compileUtil.getVal(this.expr, this.vm);
        Dep.target = null;
        return oldVal;
    }
    //判断新旧值有没有变化，变化就更新视图
    update(){
        let newVal = compileUtil.getVal(this.expr, this.vm);
        if(newVal !== this.oldVal){
            this.cb(newVal);
        }
    }
}
