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
    //这里目前是针对x是普通值的处理
    then(onFulfilled,onRejected){
        //妙啊！
        let promise2 = new Promise((resolve,reject)=>{
            if(this.status === RESOLVED){
                console.log('ok');
                let x = onFulfilled(this.value); //这个x是回调执行后的结果
                resolve(x);  //怎么把x传递到下一个then的回调用？？使用promise2的resolve。
            }
            if(this.status === REJECTED){
                let x = onRejected(this.reason); //同样的处理，这里的x是失败回调后的执行结果
                resolve(x);//这里是返回一个普通值，也是要返回到resolve里面的
            }else{
                console.log('Pending...');
                // 面向切面！！！！
                this.onFulfilled.push(()=>{
                    // todo ....
                    let x = onFulfilled(this.value);
                    resolve(x);
                });
                this.onRejected.push(()=>{
                    // todo ...
                   let x =  onRejected(this.reason);
                   resolve(x);
                });
            }
        })
        return promise2;
    }
}

module.exports = Promise;