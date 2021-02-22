## 一个简单的http创建
```js
var http = require('http')

var server = http.createServer()

//请求处理函数
server.on('request', function (request,response) {
    console.log(request.url);
    
    //response对象有一个方法，write可以用来给客户端发送响应数据
    //write可以使用多次，但是最后一次要使用end来结束，否则客户端会一直等待
    response.write('hello');
    response.write('end');
    
    //要告诉客户端结束信号，客户端才会知道
    response.end();
})

server.listen(3000, function(){
    console.log('服务器已经启动，可以通过http://127.0.0.1:3000访问')
})
```


## 根据不同的请求路径相应不同的内容

## 端口号范围从0~65536之间

## content-type
服务器默认发送的数据是utf-8编码
中文操作系统默认是gdk
所以，服务器要告知浏览器要用utf-8编码
```js
res.setHeader('Content-type','text/plain;chartset=uft-8')
```

## 一个场景，根据请求路径读取html文件返回
```js
fs.readFile('url的请求路径', function(err, data){
    if( err ){
        res.setHeader('Content-type','text/plain;charset=utf-8');
        res.end('文件读取失败，请稍后重试');
    } else {
        //res.end()支持两种数据类型，一种是二进制，一种是字符串
        res.setHeader('Content-type','text/html;charset=utf-8');
        res.end(data);
    }
})
```

## 一个场景，根据请求路径读取图片
```js
res.setHeader('Content-type','image/jpeg');
```



