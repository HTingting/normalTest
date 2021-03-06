// r,g,b范围为[0,255],转换成h范围为[0,360]
// s,l为百分比形式，范围是[0,100],可根据需求做相应调整
function rgbtohsl(r,g,b){
    r=r/255;
    g=g/255;
    b=b/255;

    var min=Math.min(r,g,b);
    var max=Math.max(r,g,b);
    var l=(min+max)/2;
    var difference = max-min;
    var h,s,l;
    if(max==min){
        h=0;
        s=0;
    }else{
        s=l>0.5?difference/(2.0-max-min):difference/(max+min);
        switch(max){
            case r: h=(g-b)/difference+(g < b ? 6 : 0);break;
            case g: h=2.0+(b-r)/difference;break;
            case b: h=4.0+(r-g)/difference;break;
        }
        h=Math.round(h*60);
    }
    s=Math.round(s*100);//转换成百分比的形式
    l=Math.round(l*100);
    return [h,s,l];
}
console.log(rgbtohsl(2,5,10));	//[218, 67, 2]

// 33 70% 87% 1
