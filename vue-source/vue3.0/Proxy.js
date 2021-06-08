//定义一个对象
let data = {
    name: 'Harry Potter',
    age: 24,
};
// 创建一个Proxy,将data作为目标对象
let p = new Proxy(data, {
    set(target, prop, value) {
        //target = 目标对象
        //prop = 设置得属性
        //value = 修改后的值
        //console.log(target,prop,value)
        // 使用Reflect.set 方法设置target对象的属性
        return Reflect.set(...arguments)
    },
    get(target, prop) {
        return Reflect.get(...arguments)
    }
});

// 直接修改p就可以了
p.age = 18;
console.log(data);
//输出：{ name: 'Harry Potter', age: 24 }
//使用Reflect.set之后输出 ：{ name: 'Harry Potter', age: 18 }

/*
Proxy 和 Object.defineProperty 的区别
① 对于vue2，对于给定的data,是需要根据具体的key也就是count，去对他的赋值取值进行拦截
必须预先知道要拦截的key是什么。而vue3所使用的proxy，根本不需要关心具体的key，它去拦截的是 「修改 data 上的任意 key」 和 「读取 data 上的任意 key」。
② vue3拦截更多的操作符
//响应式数据
const data = reactive({
    count: 1
})
//观测变化
effect(() => console.log('count changed',data.count))
//触发console.log('count changed',data.count) 的再次执行
data.count = 2
③
④
 */
