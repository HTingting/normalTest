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
    then(onFulfilled,onRejected){
        if(this.status === RESOLVED){
            onFulfilled(this.value);
        }
        if(this.status === REJECTED){
            onRejected(this.reason);
        }else{
            console.log('Pending...');
            this.onFulfilled.push(onFulfilled);
            this.onRejected.push(onRejected);
            console.log(this.onFulfilled.length);
        }
    }
}

module.exports = Promise;