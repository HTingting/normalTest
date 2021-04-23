/**
 * 1.promise 成功和失败的回调的返回值，可以传递到外层的下一个then
 * 2.如果返回的是普通值的话（传递到下一次的成功中），出错的而情况（一定会走到下一次失败中），可能还要promise的情况
 * （会采用promise的状态，决定下一次的成功还是失败）
 * 3. 错误处理，如果离自己最近的then没有错误处理，会向下找
 * 4. 每次执行完promise.then方法后返回的都是一个薪的promise
 * @type {string}
 */
const RESOLVED = 'RESOLVED';
const REJECTED = 'REJECTED';
const PENDING = 'PENDING';

const resolvePromise = (promise2, x, resolve, reject) => {
    // 自己等待自己完成是错误的实现，用一个类型错误，结束掉 promise  Promise/A+ 2.3.1
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    // Promise/A+ 2.3.3.3.3 只能调用一次
    let called;
    // 后续的条件要严格判断 保证代码能和别的库一起使用
    if ((typeof x === 'object' && x != null) || typeof x === 'function') {
        try {
            // 为了判断 resolve 过的就不用再 reject 了（比如 reject 和 resolve 同时调用的时候）  Promise/A+ 2.3.3.1
            let then = x.then;
            if (typeof then === 'function') {
                // 不要写成 x.then，直接 then.call 就可以了 因为 x.then 会再次取值，Object.defineProperty  Promise/A+ 2.3.3.3
                then.call(x, y => { // 根据 promise 的状态决定是成功还是失败
                    if (called) return;
                    called = true;
                    // 递归解析的过程（因为可能 promise 中还有 promise） Promise/A+ 2.3.3.3.1
                    resolvePromise(promise2, y, resolve, reject);
                }, r => {
                    // 只要失败就失败 Promise/A+ 2.3.3.3.2
                    if (called) return;
                    called = true;
                    reject(r);
                });
            } else {
                // 如果 x.then 是个普通值就直接返回 resolve 作为结果  Promise/A+ 2.3.3.4
                resolve(x);
            }
        } catch (e) {
            // Promise/A+ 2.3.3.2
            if (called) return;
            called = true;
            reject(e)
        }
    } else {
        // 如果 x 是个普通值就直接返回 resolve 作为结果  Promise/A+ 2.3.4
        resolve(x)
    }
}

class Promise {
    //默认是立即执行
    constructor(executor) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onFulfilled = []; //成功的回调
        this.onRejected = [];  //失败的回调

        //箭头函数，保证this永远指向外层
        let resolve = (value) =>{
            if(this.status === PENDING){
                this.value = value;
                this.status = RESOLVED;
                this.onFulfilled.forEach(fn=>{
                    fn(value);
                })
            }
        }
        let reject = (reason) =>{
            if(this.status === PENDING){
                this.reason = reason;
                this.status = REJECTED;
                this.onRejected.forEach(fn=>{
                    fn(reason);
                })
            }
        }
        try{
            executor(resolve, reject);  //立即执行
        }catch(e){
            reject(e);  // 错误也进入到reject
        }

    }
    // then 方法因该返回一个promise实例
    // 这个实例可以接受上一个promise的resolve的返回值
    // 推导过程： p1.resolve(100) => p1.then(data=>{})
    //           p2.resolve(1)   => p2.then(data=>{})
    //处理x的所有情况-------
    then(onFulfilled,onRejected){
        //妙啊！
        let promise2 = new Promise((resolve,reject)=>{
            if(this.status === RESOLVED){
                console.log('ok');
                //todo list 问题，一定要等promise执行完之后才能把promise2当参数传进去
                //todo list 另外，外围的try/catch无法捕获到这里面的promise2的异常
                setTimeout(()=>{
                    try{
                        let x = onFulfilled(this.value); //这个x是回调执行后的结果
                        resolvePromise(promise2,x,resolve,reject);  //怎么把x传递到下一个then的回调用？？使用promise2的resolve。
                    }catch(err){
                        reject(err);
                    }

                },0)

            }
            if(this.status === REJECTED){
                setTimeout(()=>{
                    try{
                        let x = onRejected(this.reason); //同样的处理，这里的x是失败回调后的执行结果
                        resolvePromise(promise2,x,resolve,reject);//这里是返回一个普通值，也是要返回到resolve里面的
                    }catch(err){
                        reject(err);
                    }
                },0);
            }else{
                console.log('Pending...');
                // 面向切面！！！！
                this.onFulfilled.push(()=>{
                    setTimeout(()=>{
                        try{
                            // todo ....
                            let x = onFulfilled(this.value);
                            resolvePromise(promise2,x,resolve,reject);
                        }catch(err){
                            reject(err);
                        }

                    },0);
                });
                this.onRejected.push(()=>{
                    setTimeout(()=>{
                        try{
                            // todo ...
                            let x =  onRejected(this.reason);
                            resolvePromise(promise2,x,resolve,reject);
                        }catch(err){
                            reject(err);
                        }

                    },0);
                });
            }
        })
        return promise2;
    }
}

module.exports = Promise;