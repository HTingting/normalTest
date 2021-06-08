## 模块化规范
- node中模块化规范 commonjs规范（node自己实现的），es6Module(import,export)，umd统一模块规范
（如果浏览器不支持commonjs,requirejs，直接将变量放到window上），amd规范requirejs cmd规范seajs

## commonjs规范（模块的概念）
- 可以把复杂的代码拆分为小的模块，方便管理代码和维护
- 每个模块之间的内容都是相互独立的，互补影响（解决变量冲突的问题）
单例模式不能完全解决，使用自执行函数来解决

规范的定义:
- 每个文件都是一个模块
- 如果你希望模块中的变量被别人使用，可以使用module.exports 导出这个变量
- 如果另一个模块想使用这个模块到处的结果，需要使用require语法来引用（同步）

## require
在node中，没有全局作用域，只有模块作用域

## export
模块间数据共享


