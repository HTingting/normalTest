const RESOLVED = 'RESOLVED';
const REJECTED = 'REJECTED';
const PENDING = 'PENDING';

class Promise{
    constructor(executor){
        this.states = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onFulfilled = [];
        this.onRejected = [];

        let resolve = (value) => {
            if(this.states === PENDING){
                this.value = value;
                this.states = RESOLVED;
                this.onFulfilled.forEach(fn=>{
                    fn(value);
                })
            }
        }

        let reject = (reason) => {
            if(this.states === PENDING){
                this.reason = reason;
                this.states = REJECTED;
                this.onRejected.forEach(fn=>{
                    fn(reason);
                })
            }
        }
        try{
            executor(resolve,reject);
        }catch(err){
            reject(err);
        }
    }
    then(onFullfilled, onRejected){
        if(this.status === RESOLVED){
            onFullfilled(this.value);
        }
        if(this.status === REJECTED){
            onRejected(this.reason);
        }else{
            this.onFulfilled.push(onFullfilled);
            this.onRejected.push(onRejected);
        }
    }
}