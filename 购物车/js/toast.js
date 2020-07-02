//自定义弹框
function Toast(msg,duration){
    duration=isNaN(duration)?3000:duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText="opacity: 0.7;height: 36px;color: rgb(255, 255, 255);line-height: 36px;text-align: center;border-radius: 5px;position: fixed;top: 50%;left: 50%;-webkit-transform:translateX(-50%);z-index: 999999;background: rgb(0, 0, 0);font-size: 14px;margin-top:-18px;white-space:nowrap;display:inline-block;padding:0 10px;";
    document.body.appendChild(m);
    setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
    }, duration);
}
