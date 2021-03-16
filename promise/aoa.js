//实现一个业务，在该函数执行前调用


var myFunc = function(a){
    console.log(a);
}

Function.prototype.before = function(fn){
    //用来保存调用这个函数的引用，如myFunc调用此函数，则_this指向myFunc
    var _this = this;
    //返回一个函数，相当于一个代理函数，也就是说，这里包含了原函数和新函数，原函数指的是myFunc，新函数指的是fn
    return function(){
        //修正this的指向，将this指针指向fn，将myFunc接收的参数传给fn处理。
        fn.apply(this,arguments);
        //执行原函数
        return _this.apply(this,arguments);
    }
}

myFunc = myFunc.before(function(){
    console.log('2');
});

myFunc(1);  // 先输出2，在输出1

Function.prototype.after = function(fn){
    var _this = this;
    return function(){
        var r = _this.apply(this,arguments);
        fn.apply(this,arguments);
        return r;
    }
}

myFunc = myFunc.after(function(){
    console.log('3');
});
myFunc(1);