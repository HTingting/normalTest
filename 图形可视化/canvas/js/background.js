function loadBackground(bgURL,canvas,callback){
    var ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;

    var image = new Image();

    image.onload = function(){
        ctx.drawImage(this,0,0,width,height);
        ctx.drawImage(this,0,height,width,height);
        if(callback){
            callback(image);
        }
    }

    image.src = bgURL;
}