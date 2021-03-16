// 函数柯里化 函数反柯里化

// 判断变量的类型
// 蟾宫的判断类型的方法有四种
// 1.typeof 不能判断对象类型
    console.log(typeof []); //Object
    console.log(typeof {}); //Object
// 2.contructor 可以找到这个变量是通过谁构造出来的
    console.log([].constructor);
    console.log(({}).constructor);
// 3.instanceof 判断谁是谁的实例 __proto__
// 4. Object.prototype.toString.call(); 缺陷就是不能细分谁是谁的实例
    function isType(value,type){
        return Object.prototype.toString.call(value) === `[Object ${value}]`;
    }
    isType([],'Array');


    //通过一个柯里化函数，实现通用的柯里化方法
    const currying = (fn,arr=[]) => {
        let len = fn.length;   //这里获取的事函数的参数的个数
        return function (...args){
            arr = [...arr, ...args];
            if(arr.length < len){
                return currying(fn,arr);
            }else{
                return fn(...arr);
            }
        }
    }

    function sum (a,b,c,d,e,f){
        return  a+b+c+d+e+f;
    }
    let r = currying(sum)(1,2)(3,4)(5,6)(7);

