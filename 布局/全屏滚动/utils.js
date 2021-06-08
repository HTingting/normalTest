/**
 * utils 为工具函数，对原生api做兼容性处理及提取公共方法
 * @type {{}}
 */
const utils = {
    // 鼠标滚轮事件
    /**
     * 1.firefox 是 DOMMouseScroll 事件，对应的滚轮信息（向前滚还是向后滚）存储在 detail 属性中，
     * 向前滚，这个属性值是 3 的倍数，反之，是 -3 的倍数；
     * 2.firefox 之外的其他浏览器是 mousewheel 事件，对应的滚轮信息存储在 wheelDelta 属性中，
     * 向前滚，这个属性值是 -120 的倍数，反之， 120 的倍数。
     * 所以，可以通过 detail 或 wheelDelta 的值判断鼠标的滚动方向，进而控制页面是向上还是向下滚动。
     * 在这里我们只关心正负，不关心具体值的大小，为了便于使用，下面基于这两个事件封装了一个函数：如果鼠标往前滚动，返回负数，反之，返回正数，代码如下：。
     * @param event
     */
    getWheelDelta(event){
        if(event.wheelDelta){
            //第一次调用之后惰性载入
            this.getWheelDelta = event => event.wheelDelta;

            //第一次调用使用
            return event.wheelDelta;
        }
        //兼容火狐
        this.getWheelDelta = event => -event.detail;
        return -event.detail;
    },

    //防抖函数，n秒后执行函数，如果n秒内，重新计时
    // 防抖动函数，method 回调函数，context 上下文，event 传入的时间，delay 延迟函数
    // 调用的时候直接执行，注意和 throttle 在使用的时候的区别
    debounce(method, context, event, delay ){
        clearTimeout(method.tId);
        method.tId = setTimeout(()=>{
            method.call(context,event);
        },delay)
    },

    //节流函数，这个单位时间内，只能有一次触发事件的回调函数执行
    // 截流函数，method 回调函数，context 上下文，delay 延迟函数，
    // 返回的是一个函数
    throttle(method, context, delay){
        let wait = false;
        return function(...args){
            if(!wait){
                method.apply(context,args);
                wait =  true;
                setTimeout(() => {
                    wait = false;
                },delay)
            }
        }
    },

    //删除 类名
    deleteClassName(el, className){
        if(el.classList.contains(className)){
            el.classList.remove(className);
        }
    },

    //polyfill
    polyfill() {
        if (typeof Object.assign !== 'function') {
            Object.defineProperty(Object, 'assign', {
                value: function assign(target) {
                    if (target == null) {
                        throw new TypeError('Cannot convert undefined or null to object');
                    }
                    const to = Object(target);
                    for (let index = 1; index < arguments.length; index++) {
                        const nextSource = arguments[index];
                        if (nextSource != null) {
                            for (const nextKey in nextSource) {
                                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                    to[nextKey] = nextSource[nextKey];
                                }
                            }
                        }
                    }
                    return to;
                },
                writable: true,
                configurable: true,
            });
        }
    },
}