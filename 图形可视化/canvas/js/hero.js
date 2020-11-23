function createHero(w,h,canvas,imageURL,callback){
    var ctx = canvas.getContext('2d');

    var timer;
    var width = canvas.width;
    var height = canvas.height;

    var x = width / 2 - w/2;   //飞机水平居中
    var y = height - h -20;   // 飞机垂直底部向上20像素

    var hero = new Hero(x,y,w,h,imageURL,callback);

    document.onkeydown = function(event){
        var event = event || window.event;
        switch(event.keyCode){
            case 37:{
                hero.left = true;
                break;
            }
            case 38:{
                hero.up = true;
                break;
            }
            case 39:{
                hero.right = true;
                break;
            }
            case 40:{
                hero.down = true;
                break;
            }

        }
    }

    document.onkeyup = function(event){
        var event = event || window.event;
        switch(event.keyCode){
            case 37:{
                hero.left = true;
                break;
            }
            case 38:{
                hero.up = true;
                break;
            }
            case 39:{
                hero.right = true;
                break;
            }
            case 40:{
                hero.down = true;
                break;
            }

        }
    }

    // ？？？ 这个为什么是要设置定时器呢？
    timer = setInterval(function(){
        if(hero.left == true) hero.x -= 2;
        if(hero.right == true) hero.x += 2;
        if(hero.up == true) hero.y -= 2;
        if(hero.down == true) hero.y += 2;
    },10);

    return hero;

}

function Hero(x,y,w,h,imageURL,callback){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.image.onload = function(){
        if(callback){
            callback(this);
        }
    }

    //添加图片源
    this.image.src = imageURL;

    //图片开关
    this.bool = true;
}

Hero.prototype.draw = function(canvas){
    var ctx = canvas.getContext('2d');
    var x = this.w * this.bool;
    var y = this.y;
    var w = this.w;
    var h = this.h;
    //前面四个参数是切割的，后面四个摆放的位置
    ctx.drawImage(this.image,x,0,w,h,this.x,this.y,w,h);

    //切换bool值
    this.bool = !this.bool;
}