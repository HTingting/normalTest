/**
 * 1.promise 成功和失败的回调的返回值，可以传递到外层的下一个then
 * 2.如果返回的是普通值的话（传递到下一次的成功中），出错的而情况（一定会走到下一次失败中），可能还要promise的情况
 * （会采用promise的状态，决定下一次的成功还是失败）
 * 3. 错误处理，如果离自己最近的then没有错误处理，会向下找
 * 4. 每次执行完promise.then方法后返回的都是一个薪的promise
 * @type {string}
 *
 *
 * 2.1——then 的参数 onFulfilled 和 onRejected 可以缺省，如果 onFulfilled 或者 onRejected不是函数，将其忽略，且依旧可以在下面的 then 中获取到之前返回的值；「规范 Promise/A+ 2.2.1、2.2.1.1、2.2.1.2」
 * 2.2——promise 可以 then 多次，每次执行完 promise.then 方法后返回的都是一个“新的promise"；「规范 Promise/A+ 2.2.7」
 * 2.3——如果 then 的返回值 x 是一个普通值，那么就会把这个结果作为参数，传递给下一个 then 的成功的回调中；
 * 2.4——如果 then 中抛出了异常，那么就会把这个异常作为参数，传递给下一个 then 的失败的回调中；「规范 Promise/A+ 2.2.7.2」
 * 2.5——如果 then 的返回值 x 是一个 promise，那么会等这个 promise 执行完，promise 如果成功，就走下一个 then 的成功；如果失败，就走下一个 then 的失败；如果抛出异常，就走下一个 then 的失败；「规范 Promise/A+ 2.2.7.3、2.2.7.4」
 * 2.6——如果 then 的返回值 x 和 promise 是同一个引用对象，造成循环引用，则抛出异常，把异常传递给下一个 then 的失败的回调中；「规范 Promise/A+ 2.3.1」
 * 2.7——如果 then 的返回值 x 是一个 promise，且 x 同时调用 resolve 函数和 reject 函数，则第一次调用优先，其他所有调用被忽略；「规范 Promise/A+ 2.3.3.3.3」
 *
 * catch，finarry，all，resolved，rejected，
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
            if(value instanceof Promise){
                return value.then(resolve,reject);  //递归解析resolve，直到value是个普通值
            }
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
    then(onFulfilled,onRejected){
        // 2.1——解决onFullfilled,onRejected的参数缺省的问题
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v=>v ;
        //因为错误的值要让后面访问到，所以这里也要跑出个错误，不然会在之后 then 的 resolve 中捕获
        onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };


        let promise2 = new Promise((resolve,reject)=>{
            if(this.status === RESOLVED){
                setTimeout(() => {
                    try{
                        let x = onFulfilled(this.value);
                        resolvePromise(promise2,x,resolve,reject);
                    }catch(e){
                        reject(e)
                    }
                },0);
            }
            if(this.status === REJECTED){
                setTimeout(() => {
                    try{
                        let x = onRejected(this.reason);
                        resolvePromise(promise2,x,resolve,reject);
                    }catch(e){
                        reject(e)
                    }
                },0);

            }else{
                console.log('Pending...');
                // 面向切面
                this.onFulfilled.push(()=>{
                    // todo ....
                    setTimeout(() => {
                        try {
                            let x =  onFulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e)
                        }
                    }, 0);

                });
                this.onRejected.push(()=>{
                    // todo ...
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0);

                });
            }
        })
        return promise2;
    }
    // 可以直接catch,catch 其实就是一个then，没有onFullFilled函数
    catch(errCallback){
        return this.then(null,errCallback);
    }
    //默认产生一个成功的promise
    static resolve(data){
        return new Promise((resolve,reject)=>{
            resolve(data);
        })
    }
    //默认产生一个失败的promise
    static reject(reason){
        return new Promise((resolve,reject)=>{
            reject(reason);
        })
    }
    //finally 表示的不是最终的意思，而是无论如何都会执行的意思。
    //如果返回一个promise回等待这个promise也执行完毕
    //如果返回的是成功的promise，会接受上一次的结果。
    //如果返回的是失败的promise，会接受到这个失败的结果，传回到catch中
    finally(callback){
        return this.then((value)=>{
            return Promise.resolve(callback()).then(()=>value)
        },(reason)=>{
            return Promise.resolve(callback()).then(()=>{throw reason});
        })
    }
    //all 是处理并发问题的，多个异步并发获取最后的结果。（如果一个失败则都失败）
    all(values){
        //不是数组，返回异常
        if(!Array.isArray(values)){
            const type = typeof values;
            return new TypeError(`TypeError: ${type} ${values} is not iterable`);
        }
        //否则，返回promise
        return new Promise((resolve,reject)=>{
            let resultArr = [];
            let orderIndex = 0;

            const processResultByKey = (value, index) =>{
                resultArr[index] = value;
                if(++orderIndex === values.length){
                    resolve(resultArr);
                }
            }

            for(let i = 0; i < values.length; i++){
                let value = values[i];
                if(value && typeof value.then === 'function'){
                    value.then((value)=>{
                        processResultByKey(value,i);
                    },reject);
                }else{
                    processResultByKey(value,i);
                }
            }
        })
    }
    //race 用来处理多个请求，采用最快的，（谁先完成用谁的）
    // 特别需要注意的是：因为Promise 是没有中断方法的，xhr.abort()、ajax 有自己的中断方法，axios 是基于 ajax 实现的；fetch 基于 promise，所以他的请求是无法中断的。
    // 这也是 promise 存在的缺陷，我们可以使用 race 来自己封装中断方法：
    race(promises){
        return new Promise((resolve,reject)=>{
            for(let i = 0; i< promises.length; i++){
                let val = promises[i];
                if(val && typeof val.then === 'function'){
                    val.then(resolve,reject);
                }else{
                    resolve(val)
                }
            }
        })
    }
}

module.exports = Promise;