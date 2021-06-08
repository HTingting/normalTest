#解决什么问题
+ 来源不明问题
+ 多文件引用问题,请求问题
+ import语法的问题
    - 借助webpack翻译import
    - npm install webpack webpack-cli
    - npx webpack ./index.js
+ 自带优化
    - tree-sharking: 依赖关系的解析，不用的代码不打包，只有在生产环境才会有效
    - scope-hoisting： 作用域提升，如果一个变量直接拿到结果，不会打包到代码中
+ 自己实现的优化
    - 速度优化
      多线程打包 happypack
      注意：体积小，比较慢
      
      moment:时间插件 引入 很多语言包
      IgnorePlugin 就会把不需要的语言包忽略掉
      
    - 体积优化
      
      html cdn 地址 jquery
      npm i jquery
      打包的时候 打包到压缩文件中 提及爆炸
      externals: {
        
      }
      
      modules:{
        noParse:
      }
      
      代码优雅程度
        css前缀  autopixer
        js       新语法  babel-loader
       
      - 动态链接库dllPlugin
        打包完了之后，体积过大 
        拆：公共文件 react/react-dom/vue/
        放到一个单独的文件打包，最后放到cdn上
        
#webpack出口和入口
+ npx webpack 就可以打包，自动有一个dist文件夹产生                

#module的使用

#plugins的使用
+ 为了解决自动生成index.html  
+ npm install html-webpack-plugin -D
+ 可以帮忙清空dist文件夹的插件
+ 使用url-loader打包图片
- 好处：dist 少了.jpg图片文件 -> 减少一次图片的http请求
页面加载：js加载文笔，图片->bundle.js （base64） 图片过大不适合

- 期望，1，2kb 使用bundle.js

+ webpack --watch

#webpack-dev-server

#WDS请求转发
+ npm install axios
+ 

#HMR 模块热替换

#polyfill
usage

##webpack merge
实现环境和公共的分离

## miniCssExtractPlugin

##splitChuk


## vue cli report 分析vendor.js
report : vue-cli-service build --report
