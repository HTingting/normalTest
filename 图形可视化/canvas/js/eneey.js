function getRandForNum(min,max){
    return Math.round(Math.random() * (max - min) + min);
}

function createEnemy(w,h,imageURL,canvas){
    var width = canvas.width;
    var height = canvas.height;
    var x = getRandForNum(0,width - w);

    var enemy = new Enemy(w,h,imageURL,canvas);

    return enemy;
}

function Enemy(w,h,imageURL,canvas){
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var x = getRandForNum(0,canvasWidth-w);
    this.x = x;
    this.y = -h;
    this.w = w;
    this.h = h;
    this.speed = getRandForNum(3,19);

    this.image = new Image();
    this.image.src = imageURL;
}

Enemy.prototype.draw = function(canvas){
    var context = canvas.getContext('2d');
    context.drawImage(this.image,0,0,this.w,this.h,this.x,this.y,this.w,this.h);
}

Enemy.prototype.move = function(){
    this.y += this.speed;
}

function isOutOfScreen(canvas){
    if(this.y > canvas.height){
        return true;
    }else{
        return false;
    }
}

//碰撞检测
function isEnemyHitHero(obj1,obj2){
    var minX1 = obj1.x;
    var minY1 = obj1.y;
    var maxX1 = obj1.x + obj1.w;
    var maxY1 = obj1.y + obj1.h;

    var minX2 = obj2.x;
    var minY2 = obj2.y;
    var maxX2 = obj2.x + obj2.w;
    var maxY2 = obj2.y + obj2.h;

    var minX = Math.max(minX1,minX2);
    var minY = Math.max(minY1,minY2);

    var maxX = Math.max(maxX1,maxX2);
    var maxY = Math.max(maxY1,maxY2);

    if(minX < maxX && minY < maxY){
        return true;
    }else{
        return false;
    }
}


function isRectHit(rect1,rect2){
    var min1 = rect1.x;
    var min2 = rect2.x;

    var max1 = rect.x + rect1.width;
    var max2 = rect2.x + rect2.width;

    var min3 = Math.max(min1,min2);  //一开始没有碰撞的时候，rect2的minX肯定最大
    var max3 = Math.min(max1,max2);  //一开始的时候,

    if(min3 < max3){
        return true;
    }else{
        return false;
    }
}

