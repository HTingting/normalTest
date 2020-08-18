# 前言
（有天网上冲浪，看到了一个大数据可视化的后台管理项目。视觉感官上特别可以。在github上面浏览一番，发现相关组件也已经出来了。太厉害了~
我看到主流的是这个UI组件库 [Datav]https://github.com/DataV-Team/DataV  下载了源码看下，主要的UI组件都是svg来搞定的。我决定来拾起
svg的知识。）各位小可爱，我又来了~上一篇已经介绍了基础篇的整理，这次争取把SVG高阶的用法也一并整理给各位小可爱参考。
曲线，渐变，Path，引用，裁切，蒙版，动画

# 曲线

# 渐变

# 基本图形
`<linearGradient>`、`<radialGradient>`
https://zhuanlan.zhihu.com/p/69553595
https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/linearGradient
https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/radialGradient
### 3.  文字描述内容，比较多，自己语言总结，应该比较好嚼<br/>
    
> 线性渐变：
+ `<linearGradient>`标签必须嵌套在<defs>的内部。线性渐变可被定义为水平，垂直或角形渐变：
+ 当y1 = y2, x1 != x2;水平渐变；
   当x1 = x2, y1 != y2;垂直渐变；
   当x1 != x2,y1 != y2;角形渐变；
+ <linearGradient>标签的id属性可为渐变定义一个唯一的名称
+ fill：url(#)属性把rect元素链接到此渐变
+ 渐变的颜色范围可有两种或多种颜色组成。每种颜色通过一个<stop>标签来规定。offset属性用来定义渐变开始和结束的位置。
+ 渐变还有一个属性gradientUnits：userSpaceOnUse | objectBoundingBox
（其中）userSpaceOnUse是以整个SVG元素视窗区域（viewPort）为参考坐标的。就是svg元素的左上角为渐变的0% 0%位置，右下角100%，100%位置
默认值是objectBoundingBox,它会定义渐变色的渐变区间为svg中引用linearGradientde 区域参考坐标系。例如rect元素的右上角为渐变色的0% 0%位置，右下角为100% 100%位置
+ gradientTransform="rotate(45)"可以使用该属性改变线性渐变方向
   
### 4.  通过例子说明

>   线性渐变例子

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>svg-渐变</title>
    </head>
    <body>
        <svg width="120" height="240" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="Gradient1">
                    <stop class="stop1" offset="0%"/>
                    <stop class="stop2" offset="50%"/>
                    <stop class="stop3" offset="100%"/>
                </linearGradient>
                <linearGradient id="horizontal" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stop-color="red"/>
                    <stop offset="50%" stop-color="black" stop-opacity="0"/>
                    <stop offset="100%" stop-color="blue"/>
                </linearGradient>
                <style type="text/css">
                #rect1 { fill: url(#Gradient1); }
                .stop1 { stop-color: red; }
                .stop2 { stop-color: black; stop-opacity: 0; }
                .stop3 { stop-color: blue; }
                </style>
                <linearGradient id="vertical" x1="0" x2="0" y1="0" y2="1"></linearGradient>
            </defs>
    
            <rect id="rect1" x="10" y="10" rx="15" ry="15" width="100" height="100"/>
            <rect x="10" y="120" rx="15" ry="15" width="100" height="100" fill="url(#horizontal)"/>
            <rect x="100" y="220" rx="15" ry="15" width="100" height="100" fill="url(#vertical)"/>
           
        </svg>
    
    </body>
    </html>
    ``` 

    >   通过d3的写法（更加便捷，更加容易明白语法）
    ```html
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Title</title>
        </head>
        <script src="./d3.min.js"></script>
        <body>
        
        </body>
        </html>
        <script>
            const svg = d3.select("body").append("svg");
            const defs = svg.append('defs');
        
            const linearGradient = defs.append('linearGradient')
                .attr('id', 'linear-gradient');
        
            // 设置水平颜色渐变效果
            linearGradient.append('stop')
                .attr("offset", '0%')
                .attr("stop-color", '#ffa474');
        
            linearGradient.append('stop')
                .attr("offset", '100%')
                .attr("stop-color", '#8b0000'); 
        
            svg.append('rect')
                .attr('width', 320)
                .attr('height', 20)
                .attr('fill', 'url(#linear-gradient)')
        </script>
    ```
    
> 径向渐变
    
    径向渐变的用法跟线性渐变的用法差不多，
    id——用于在图形上引用该渐变的唯一标识符
    cx,cy——径向渐变的中心点X和Y坐标。它的值使用用填充的百分比值。如果没有定义则默认值为50%
    fx, fy	径向渐变的焦点X和Y值。它的值使用用填充的百分比值。如果没有定义则默认值为50%。
    注意：在Firefox 3.05中如果值低于5%可能会发生问题。
    r	径向渐变的半径
    spreadMethod	定义径向渐变的传播方式。可取值有3个：pad，repeat和reflect。pad是指开始和结束颜色平铺填充整个渐变。repeat是指渐变在整个图形中不断重复。reflect是指渐变在图形中会镜像显示。这个参数只有在渐变没有填充满整个图形时才有效果。
    gradientTransform	可以使用该参数在应用一个渐变之前对其进行转换（如旋转）
    gradientUnits	设置计算 x1, y1 和 x2,y2的方式
    xlink:href	设置这个渐变继承自另一个渐变，取值为另一个渐变的ID号。换句话说，如果这个渐变没有设置其它属性值，它将使用ID指向的那个渐变作为默认的渐变
    径向渐变的聚焦点是颜色辐射的角度。你可以将径向渐变想象为一盏灯，那么聚焦点决定灯光从什么方向“照射”在图形上。50%,50%表示在图形的正上方，5%,5%表示在图形的左上角位置。
    
    
|  属性    | 用法  |
|  ----              | ----  |
| id                 | 用于在图形上引用该渐变的唯一标识符 |
| cx,cy              | 径向渐变的中心点X和Y坐标。它的值使用用填充的百分比值。如果没有定义则默认值为50% |
| fx, fy             | 径向渐变的焦点X和Y值。它的值使用用填充的百分比值。如果没有定义则默认值为50%。 |
| r                  | 径向渐变的半径 |
| spreadMethod       | 定义径向渐变的传播方式。可取值有3个：pad，repeat和reflect。pad是指开始和结束颜色平铺填充整个渐变。repeat是指渐变在整个图形中不断重复。reflect是指渐变在图形中会镜像显示。这个参数只有在渐变没有填充满整个图形时才有效果。 |
| gradientTransform  | 可以使用该参数在应用一个渐变之前对其进行转换（如旋转） |
| gradientUnits      | 设置计算 x1, y1 和 x2,y2的方式 |
| xlink:href         | 径向渐变的聚焦点是颜色辐射的角度。你可以将径向渐变想象为一盏灯，那么聚焦点决定灯光从什么方向“照射”在图形上。50%,50%表示在图形的正上方，5%,5%表示在图形的左上角位置。 |

##动画
https://zhuanlan.zhihu.com/p/88117124
+ 基本属性
from to duration timing-function frame
+ 动画标签
`<set>`,`<animate>`, `<animateTransform>`, `<animateMotion>`（元素可以让SVG各种图形沿着特定的path路径运动~）
+ 动画元素
`attributeName`，`attributeType（要去理解）`,
`from` ,`to` ,`dur` ,`repeatCount`（indefinite-循环） ,`fill（要去理解,freeze-终点停留；remove-回到起点）`
`calcMode`,
`begin（要去理解）`

+ 定位（谁要用动画，xlink:href="url"）
```
   <animate xlink:href=></animate> 
```
+ 被包含在目标元素里
```
    <rect>
        <animate></animate>
    </rect>
```

+ 基本动画

animate标签可以多个
animateTransofrm 会发生覆盖

> 这是我看过中文博客最详细的了

https://www.zhangxinxu.com/wordpress/2014/08/so-powerful-svg-smil-animation/?shrink=1

+ 弹簧模型
    

##Path

> 关于贝塞尔曲线，还是张鑫旭的博客比较详细

https://www.zhangxinxu.com/wordpress/2014/06/deep-understand-svg-path-bezier-curves-command/

主要指标

|  属性   | 用法  | 参数    |
|  ----  | ---- |  ----   |
| M      |moveTo 移动到| （x y）+ |
| Z      |closepath 关闭路径| (none) |
| L      |lineTo 画线到| （x y）+ |
| H      |horizontal lineto 水平线到| x+ |
| V      |vertical lineto  垂直线到| y+ |
| C      |curveto 三次贝塞尔曲线到| (x1 y1 x2 y2 x y)+ |
| S      |smooth curveto 光滑三次贝塞尔曲线到| (x2 y2 x y)+ |
| Q      |quadratic Bezier curveto 二次贝塞尔曲线到| (x1 y1 x y)+ |
| T      |smooth quadratic Bezier curveto 光滑二次贝塞尔曲线到 | (x y)+ |
| A      |elliptical arc 椭圆弧 | (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+ |

最后四个CSQT涉及贝塞尔曲线统称(“厕所切图”)，哈哈哈哈哈哈

##文本

## g
svg元素用于将svg形状组合在一起。分组后，您可以将整组形状装换为单个形状。与本身不能成为转换目标的嵌套<svg>元素相比，这是一个优势
。您还可以设置分组元素的样式，并像重用单个元素一样重用他们。

可以添加整体动画；

g元素的样式可以被子元素继承

g元素没有属性X和属性Y，但也是他的缺点，因为如果想整体移动g元素，只能通过transform=translate(x,y)

##引用  defs use

 +  svg元素用于嵌入可在svg图像中重用的定义。比如，可以将svg形状组合在一起，并将其作为单个形状重用。
    `<defs>`一般和`<g>`组合使用。id一般设置在`<g>`元素上
    可以放进 `<defs>`里面的有 
        -   Any shape element (rect, line etc.)
        -   g
        -   symbol(svg元素用于定义可重用的符号。除非被<use>元素引用，否则不会显示嵌套在<symbol>中的形状)
 +  在<defs>元素中定义的形状不会显示在svg图像中，在显示他们之前，他们必须被<use>元素引用。
    `<use>`元素上使用 `xlink:href`里面引用的id是`<g>`元素上定义的id
 +  例子
 ```
<svg xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink">

    <g transform="rotate(45 50 50)">
      <line x1="10" y1="10" x2="85" y2="10"
          style="stroke: #006600;"/>

      <rect x="10" y="20" height="50" width="75"
          style="stroke: #006600; fill: #006600"/>

      <text x="10" y="90" style="stroke: #660000; fill: #660000">
        Text grouped with shapes</text>
    </g>

</svg>
```


##裁切
svg剪辑路径，又称svg剪辑。用于根据特定路径剪辑svg形状。路径内的形状部分可见，路径外的部分不可见
```
    <svg id="svg">
        <defs>
            <clipPath id="clipPath">
                <rect x="15" y="15" width="40" height="40" />
            </clipPath>
        </defs>

        <circle cx="25" cy="25" r="20"
                style="fill: #0000ff;" />
        <!--看不懂时，可以换出同样的矩形查看结果-->
        <!--<rect x="15" y="15" width="40" height="40" style="fill:yellow;"/>-->
    </svg>
```

也可以使用文本作为剪辑路径
```
<defs>
    <clipPath id="clipPath5">
        <text x="10" y="20" style="font-size: 20px; ">我爱我家</text>
    </clipPath>
</defs>

<g style="clip-path: url(#clipPath5);">
    <rect x="5" y="5" width="190" height="90"
          style="stroke: none; fill:#00ff00;"/>
    <circle cx="20" cy="20" r="20" style="stroke: none; fill: #ff0000;" />
</g>
```



##蒙版

svg遮罩功能可以对svg形状应用遮罩，遮罩决定了svg形状的那些部分是可见的。以及具有什么透明度，您可以将svg遮罩视为剪辑路径的更高级版本。

蒙版就是选框的外部（选框的内部就是选区）
蒙版一词本身即来自生活应用，也就是“蒙在上面的板子”的含义。想对图像的某一特定区域运用颜色变化、滤镜和其它效果时，
没有被选的区域（也就是黑色区域）就会受到保护和隔离而不被编辑。

蒙版，其实就是ps运用黑、白和不同程度的灰色来控制画面显示的程度，
就好像拿一块板子蒙着你的眼睛一样，黑色是完全不透光的木板，白色是一块玻璃板，灰色是一块半透明的玻璃板，
黑色你完全看不到后面的情况，白色你会完全看到后面，而半透明玻璃你能看到后面，但是是不清晰的





##一个综合的小例子

##总结
    这一次就介绍到这里了，希望有小可爱对DataV这套UI感兴趣的，可以一起来研究~~
    补充：上一次提到了viewBox的概念，如果要更加了解，可以参考这个文章https://www.zhangxinxu.com/wordpress/2014/08/svg-viewport-viewbox-preserveaspectratio/
    





