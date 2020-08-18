# 前言

有天网上冲浪，看到了一个大数据可视化的后台管理项目。视觉感官上特别可以。在 GitHub 上面浏览一番，发现相关组件也已经出来了。太厉害了~
我看到主流的是这个 UI 组件库 [Datav]https://github.com/DataV-Team/DataV  下载了源码看下，主要的 UI 组件都是 svg 来搞定的。我决定来拾起
svg 的知识。

## 什么是 SVG

1. 可缩放矢量图形 (SVG) 是一个基于 XML 语法的 2D 矢量图形格式。
2. W3C 于 20 世纪 90 年代末开始着手 SVG 的工作，但是当 Internet Explorer 9 推出 SVG 支持时，SVG 才变得流行起来。
   现在所有主流 browsers 都支持 SVG。
3. 基于 XML 语法，可以使用 CSS 指定 SVG 的样式，并使用 JavaScript 进行交互。 HTML5 现在允许将 SVG tags 直接嵌入到 HTML 文档中。
4. 作为一种矢量图像格式，SVG 图形可以无限地扩展，这使其在 responsive design 中非常有用，因为可以创建可缩放到任意屏幕大小的界面元素和图形。
   SVG 还提供了一组有用的工具，例如裁剪，遮罩，过滤器和动画。

##如何使用 SVG

1. 在网页中使用 SVG
   ```
   <img src="你的svg文件路径.svg" title="Cat Image" alt="Stick Figure of a Cat" />
   ```
2. 在 CSS 中包含 SVG
   ```
   div.background-cat {
     background-image: url("你的svg文件路径.svg");
     background-size: 100% 100%;
   }
   ```
3. SVG 用作应用程序
   ```
   <object data="cat.svg" type="image/svg+xml" title="Cat Object" alt="Stick Figure of a Cat">
     <!-- 文本或者栅格图像用作备用选项 -->
     <p>No SVG support! Here's a substitute:</p>
     <img src="cat.png" title="Cat Fallback" alt="A raster rendering of a Stick Figure of a Cat"/>
   </object>
   ```
4. 内联 SVG
   ```
   <svg viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
     <title>An SVG circle</title>
     <circle cx="125" cy="125" r="100"/>
     <text x="125" y="125" dy="0.5em" text-anchor="middle">
     Look Ma, Same Font!</text>
   </svg>
   ```
5. SVG 中插入 HTML
   ```
   <g transform="skewX(20)">
     <switch>
     <!-- 选择一个子元素 -->
     <foreignObject x="1em" y="25%" width="10em" height="50%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
       <body xmlns="http://www.w3.org/1999/xhtml">
         <p>This is an XHTML pragraph embedded within a SVG!
         So this text will wrap nicely around multiple lines,
         but it will still be skewed from the SVG transform.
         </p>
      </body>
     </foreignObject>
     <text x="1em" y="25%" dy="1em">
       This SVG text won't wrap, so it will get cut off...
     </text>
     </switch>
   </g>
   ```

## SVG 的坐标体系
1. 单位可以是 `em`（默认字体大小）、 `ex`（字符 x 的高度）、`px`（像素） 、`pt`（点数，1/72 英寸）、 `pc`（Picas,1/6 英寸）、 `cm`（厘米）、 `mm`（毫米） 、`in`（英寸） 默认左上角为原点，用 width 和 height 来指定大小，跟`<canvas>`一样。
2. 设置 width 和 height 相当于是实际坐标，设置 viewBox 相当于是设置虚拟坐标
   `<svg width="4cm" height="5cm" viewBox="0 0 64 80">`
   这样设置后，这个<svg>内部的坐标系统就会变成左上角（0,0），宽 64 个单位，高 80 个单位。内部其他元素都是根据这个虚拟坐标来定位。
   如果实际坐标和虚拟坐标比例不一致，此时要指定如何处理就需要设置 `preserveAspectRatio`，它的默认值为 `xMidYMid meet`。
   前一个值是指定 `x[Mid/Min/Max] y[Mid/Min/Max]`，后一个值是 `meet/slice`。
   Mid 表示中部，Min 表示前部，Max 表示后部，meet 表示缩放适配，slice 表示切割。
   [可以参考例子]http://oreillymedia.github.io/svg-essentials-examples/ch03/meet_slice_specifier.html
3. 坐标体系涉及到三个概念：viewBox,viewport，preserveAspectRatio。我简单理解是这样的——
   `SVG创建的是一个世界`

   `viewport 视口，相当于显示器屏幕`

   `viewbox 视区，相当于屏幕上截取了一小块，放大到整个屏幕，就是特写效果`

   `preserveAspectRatio  规定viewbox与viewport的对齐方式和缩放方式`
4. 如果大家想更详细了解 svg 的坐标体系，以及 viewBox,viewport 的相关信息，可以参考博客。

   > http://www.htmleaf.com/ziliaoku/qianduanjiaocheng/201506182064.html

   > https://www.w3cplus.com/html5/svg-viewport-viewbox-preserveaspectratio.html

## SVG 入门

#### SVG 的图形和属性

1. 基本图形<br/>
   `<rect>`、`<circle>`、`<ellipse>`、`<line>`、`<polyline>`、`<polygon>`
2. 基本属性<br/>
   `fill`、`stroke`、`stroke-width`、`transform`
3. 基本图形具体的操作可以查看 MDN 官网文档，比较简单，不做过多的描述。
   这里另外介绍一个都附带图片解析的基本 svg 知识点网站。http://tutorials.jenkov.com/svg/rect-element.html
   （相对 MDN 比较直观，MDN 比较详细，边边角角都讲了，容易让人看了跑偏~。看完以上网站，如果想更加详细了解，建议还是去 MDN 里面单项去熟悉了解。）
   ####SVG 基本操作 API
4. 基本操作 API

+ 创建图形<br>
  `document.createElementNS(ns,tagName)`
+ 添加图形<br>
  `element.appendChild(childElement)`
+ 设置/获取属性<br/>
  `element.setAttribute(name,value)`<br/>
  `element.getAttribute(name)`

1. 一个简单的例子（参考网上的写法）

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>SVG编辑器</title>
    <style>
        #toolbox{
            position:absolute; top:0; bottom:0; left:0; width:250px;border-right:1px solid #ccc;
        }
        #toolbox h2{
            margin:0;padding:0;background: #eee;font-size:16px; height:24px; line-height:24px;padding:5px 10px;
        }
        #toolbox form{
            padding: 10px;
        }
        #canvas{
            position:absolute;left: 260px;top:10px;bottom:10px;right:10px; border-radius: 5px;
            box-shadow: 2px 2px 10px rgba(0,0,0,.4);
        }
        label{
            display: inline-block; width: 80px; text-align: right;
        }
    </style>
</head>
<body>
    <div id="toolbox">
        <h2>创建</h2>
        <form id="create-shape">
            <button type="button" create="rect">Rect</button>
            <button type="button" create="circle">Circle</button>
            <button type="button" create="ellipse">Ellipse</button>
            <button type="button" create="line">Line</button>
        </form>
        <h2>形状</h2>
        <form id="shape-attrs">
            请先创建图形
        </form>
        <h2>外观和变换</h2>
        <form id="look-and-transform" disabled="disabled">
            <p>
                <label style="display:inline;">填充</label>
                <input type="color" id="fill" value="#ffffff">
            </p>
            <p>
                <label style="display: inline;">描边</label>
                <input id="stroke" type="color" value="#ff0000" />
                <input id="strokeWidth" type="range" value="1" />
            </p>
            <p>
                <label>translateX</label>
                <input id="translateX" type="range" min="-400" max="400" value="0" />

                <label>translateY</label>
                <input id="translateY" type="range" min="-400" max="400" value="0" />

                <label>rotate</label>
                <input id="rotate" type="range" min="-180" max="180" value="0" />

                <label>scale</label>
                <input id="scale" type="range" min="-1" max="2" step="0.01" value="1" />
            </p>
        </form>
    </div>
    <div id="canvas"></div>
</body>
<script>
    /**
     * 动态创建svg的主要API
     * 1.创建图形
     *      document.createElementNS(ns,tagName);
     * 2.添加图形
     *      element.appendChild(childElement);
     * 3.设置/获取属性
     *      element.setAttribute(name,value);
     *      element.setAttribute(name,value);
     */

    var SVG_NS = 'http://www.w3.org/2000/svg';

    //图形对应的默认属性
    var shapeInfo = {
        rect: "x:10,y:10,width:200,height:100,rx:0,ry:0",
        circle:"cx:200,cy:100,r:50",
        ellipse:"cx:200,cy:200,rx:80,ry:30",
        line:"x1:10,y1:10,x2:100,y2:100"
    }

    //默认公共属性
    var defaultAttrs = {
        fill: '#ffffff',
        stroke: '#ff0000',
    }

    //活动dom元素
    var createForm = document.getElementById('create-shape');
    var attrForm = document.getElementById('shape-attrs');
    var lookForm = document.getElementById('look-and-transform');

    var svg = createSVG();
    var selected = null;

    createForm.addEventListener('click',function(e){
        if( e.target.tagName.toLowerCase() == 'button'){
            create(e.target.getAttribute('create'));
        }
    });

    attrForm.addEventListener('input',function(e){
        if (e.target.tagName.toLowerCase() != 'input') return;
        var handle = e.target;
        selected.setAttribute(handle.name, handle.value);
    });

    lookForm.addEventListener('input',function(e){
        if(e.target.tagName.toLowerCase() != 'input') return;
        if(!selected) return;
        console.warn('-----------',fill,stroke);
        //todo 有疑问
        selected.setAttribute('fill',fill.value);
        selected.setAttribute('stroke', stroke.value);
        selected.setAttribute('stroke-width',strokeWidth.value);
        selected.setAttribute('transform', encodeTransform({
            tx : translateX.value,
            ty: translateY.value,
            scale: scale.value,
            rotate: rotate.value
        }));
    });

    function encodeTransform(transObject) {
        return ['translate(', transObject.tx, ',', transObject.ty, ') ',
            'rotate(', transObject.rotate, ') ',
            'scale(', transObject.scale, ')'].join('');
    }

    function decodeTransform(transString) {
        var match = /translate\((\d+),(\d+)\)\srotate\((\d+)\)\sscale\((\d+)\)/.exec(transString);
        return match ? {
            tx: +match[1],
            ty: +match[2],
            rotate: +match[3],
            scale: +match[4]
        } : null;
    }



    function createSVG(){
        var svg = document.createElementNS(SVG_NS, 'svg');
        var canvas = document.getElementById('canvas');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        canvas.appendChild(svg);
        return svg;
    }

    function create(name) {
        var shape = document.createElementNS(SVG_NS, name);
        svg.appendChild(shape);
        select(shape);
    }

    function select(shape){
        //获取默认的元素配置
        var attrs = shapeInfo[shape.tagName].split(',');
        var attr,name,value;

        attrForm.innerHTML = "";

        while(attrs.length){
            attr = attrs.shift().split(':');
            name = attr[0];
            value = shape.getAttribute(name) || attr[1];
            createHandle(shape, name, value);
            shape.setAttribute(name, value);
        }

        for(name in defaultAttrs){
            value = shape.getAttribute(name) || defaultAttrs[name];
            shape.setAttribute(name,value);
        }
        selected = shape;

        updateLookHandle();
    }

    function createHandle(shape, name, value) {
        var label = document.createElement('label');
        label.textContent = name;

        var handle = document.createElement('input');
        handle.setAttribute('name', name);
        handle.setAttribute('type', 'range');
        handle.setAttribute('value', value);
        handle.setAttribute('min', 0);
        handle.setAttribute('max', 800);

        attrForm.appendChild(label);
        attrForm.appendChild(handle);
    }

    function updateLookHandle() {
        fill.value = selected.getAttribute('fill');
        stroke.value = selected.getAttribute('stroke');
        var t = decodeTransform(selected.getAttribute('transform'));
        translateX.value = t ? t.tx : 0;
        translateY.value = t ? t.ty : 0;
        rotate.value = t ? t.rotate : 0;
        scale.value = t ? t.scale : 1;
    }

    function decodeTransform(transString) {
        var match = /translate\((\d+),(\d+)\)\srotate\((\d+)\)\sscale\((\d+)\)/.exec(transString);
        return match ? {
            tx: +match[1],
            ty: +match[2],
            rotate: +match[3],
            scale: +match[4]
        } : null;
    }
</script>
</html>
```

## 总结
       这一次先介绍到这里，下一次再发出来 svg 更高级一点的用法。因为以上还没有涉及到曲线，渐变，Path，引用，裁切，蒙版，动画等等。我争取早日研究完，再跟大家一起分析。敬请期待哦~~~~