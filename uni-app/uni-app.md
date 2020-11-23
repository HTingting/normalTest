HBuilder打开到，微信小程序，需要配置微信开发者工具的安装路径；另外需要在微信小程序那里设置端口

安卓投屏器，

项目文件结构
pages:  用来存放页面的文件夹
static: 
unpackage: 打包后的文件存放
APP.vue: 项目的根组件，是页面的入口文件，可以调用应用项目周期函数
main.js: 项目的入口文件
manifest.jon: 配置应用打包配置文件
pages.json: 用来设置整个项目页面的存放路径，以及窗口外观
uni.scss: 常用的样式变量

开发规范（Vue和小程序的混合）
+ 页面文件遵循Vue是单页面文件组件规范
+ 组件标签：小程序规范，
+ 接口：小程序规范，但需要将wx替换成uni
+ 数据绑定及时间处理同Vue.js规范，同事补充了App及页面的生命周期
+ 为兼容多端运行，建议使用flex布局进行开发

页面外观主要是——pages.json
pages.json如果pages里面设置了样式，会覆盖globalStyle的

tableBar 的配置

condition 的配置
（在微信开发者工具-》普通编译那里可以切换）

## 组件的使用
看文档

## scss学习
@import文件引入

主要iconfont的引入方式，首先要在app.vue中引入iconfont文件。另外iconfont.css的引用
要改变路径的引用方式。

另外，如果想使用sass，less，
工具-插件安装-sass选择，安装就可以了


## 数据绑定
定义数据跟vue一样；使用也一样；

## 生命周期

### 应用生命周期
onLaunch：当uni-app初始化完成触发 （浏览器刷新）
onShow:  当uni-app启动 （浏览器隐藏，小程序打开）
onHide:  当uni-app从前台进入后台（浏览器展示，home件）
onError: 当uni-app报错时触发

### 页面生命周期
onLoad
onShow
onReady
onHide
onUnload
onResize

onPullDownRefresh：卧槽，这个都配出来了，下拉刷新，数据更新操作放在这里；数据更新也可以放在这里
当处理完数据刷新后，uni.stopPullDownRefresh 可以停止当前页面的下拉刷新
uni.startPullDownRefresh 开始下拉刷新，调用后触发下拉刷新动画，效果与用户手动下拉刷新一致。

onReachBottom：触底触发，经常用于下拉下一页数据
使用注意 可在pages.json里定义具体页面底部的触发距离onReachBottomDistance，
比如设为50，那么滚动页面到距离底部50px时，就会触发onReachBottom事件。
如使用scroll-view导致页面没有滚动，则触底事件不会被触发。scroll-view滚动到底部的事件请参考scroll-view的文档

phpstydy，不更新


## 请求
uni.request； 可以使用fastmock来做请求模拟

## 数据缓存
setStorage
getStorageSync
getStorage








