// 规定一个单位时间，在这个单位时间内，只能有一次触发事件的回调函数执行，
// 如果在同一个单位时间内某事件被触发多次，只有一次能生效
// 1.为什么要return一个匿名函数
// ——为了解决绑定就执行的问题。函数里面返回函数，是一个高阶函数
// 2.为什么要再匿名函数再返回需要执行的函数
function throttle (fn,delay) {
    var preTime = Date.now();
    return function() {
        var context = this;
        var args = arguments;
        var nowTime = Date.now();
        if(nowTime - preTime > delay) {
            preTime = Date.now();
            fn.call(context,args);
        }
    }

}

function debounce(fn, wait) {
    var timer = null;

    return function () {
        var context = this,args = arguments;

        if(timer){
            clearTimeout(timer);
            timer = null;
        }

        timer = setTimeout(() => {
            fn.apply(context,args);
        },wait)
    }
}
