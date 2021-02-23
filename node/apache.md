## 读取目录

- 得到wwwDir目录列表中的文件名和目录名
```js
var fs = require('fs')
fs.readdir('路径',function(err,files){
    if(err){
        
    }
})
```

## 在node中使用art-template模板引擎
+ 安装npm install art-template
+ 在需要使用的文件模板中加载art-template
+ 查文档，使用模板引擎api
    art-template的官方文档
```js
var template = require('art-template')
var ret = template.render('字符串',对象);
```

## 服务端渲染和客户端渲染的区别
+ 客户端渲染不利于seo搜索引擎优化
+ 服务端渲染是可以被爬虫抓到的，客户端异步渲染是很难被爬虫抓取到的
+ 一般网站开发两者结合
+ 例如京东的上屏列表就是服务端渲染，目的是为了SEO搜索引擎优化
+ 而他的商品评论列表是为了用户体验，而且也不需要SEO优化，所以采用客户端渲染

## 静态资源请求处理

浏览器收到html响应内容之后，就要开始从上倒下一次解析；
挡在解析的过程中，如果发现：
link
script
img
iframe
video
audio
等具有src或者href（link）等属性标签的时候，浏览器会自动对这些资源发起新的请求


```js
//public/css/main.css
//public/lib/jquery.js
//统一处理：如果请求路径是以public开头的，就直接可以吧请求路ing当作文件路径来直接进行读取
if(url.indexOf('public') !== -1){
    fs.readFile('.' + url);
}
```

+ 在服务端，文件中的路ing不要去写成相对路径因为这个时候所有的资源都是通过url标志来获取的

```js
fs.readFile('./views/index.html',function(err,data){
    if(err){
        return res.end('404 not found');
    }
    var htmlStr = template.render(data.toString(),{
        comments:comments
    })
    //comments是返回给到客户端的
    res.end(htmlStr);
})
```

## 通过服务器让客户端重定向

+ 状态码设置为302 临时重定向 
+ 在响应头中通过location告诉客户端往哪儿重定向
+ 如果客户端发现服务器的相应状态码是302，就会自动取响应头中去找location，所以就能看到客户端自动跳转了
```js
res.statusCode = 302;
res.setHeader('Location','/');
```

## 总结

+ 1. / index.html
    
+ 2. 开放public目录中的静态资源
     当请求 /public/xxx的时候，读取相应public目录中的具体资源
     
+ 3. /post post.html
    
+ 4. /plugin
     4.1 接收表单提交数据
     4.2 存储表单提交的数据
     4.3 让表单重定向到 /