/**
 * 1.promise有三个状态：pending,fullfilled,or rejected；
 * 2.new Promise时，需要传递一个executor()执行器，执行器立即执行；
 * 3.executor接受两个参数，分别是resolve和reject
 * 4.promise默认状态是pending
 * 5.promise有一个value保存成功的状态值；
 * 6.promise有一个reason保存失败状态的值
 * 7.promise只能从pending到rejected,或者从pending到fullfilled，状态一旦确定，就不会再改变
 * 8.promise必须有一个then方法，then接受两个参数，分别是promise成功的回调
 * 9.如果调用 then 时，promise 已经成功，则执行onFulfilled，参数是promise的value；
 * 10.如果调用 then 时，promise 已经失败，那么执行onRejected, 参数是promise的reason；
 * 11.如果 then 中抛出了异常，那么就会把这个异常作为参数，传递给下一个 then 的失败的回调onRejected；
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
        //箭头函数，保证this永远指向外层
        let resolve = (value) =>{
            if(this.status === PENDING){
                this.value = value;
                this.status = RESOLVED;
            }
        }
        let reject = (reason) =>{
            if(this.status === PENDING){
                this.reason = reason;
                this.status = REJECTED;
            }
        }
        try{
            executor(resolve, reject);  //立即执行
        }catch(e){
            reject(e);  // 错误也进入到reject
        }

    }
    then(onFulfilled,onRejected){
        if(this.status === RESOLVED){
            onFulfilled(this.value);
        }
        if(this.status === REJECTED){
            onRejected(this.reason);
        }
    }
}

module.exports = Promise;