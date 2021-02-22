function isIPhoneX(fn){
    var u = navigator.userAgent;
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isIOS) {
        if (screen.height == 812 && screen.width == 375){
            //是iphoneX
        }else{
            //不是iphoneX
        }
    }
}