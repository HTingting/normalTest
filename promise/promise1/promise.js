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