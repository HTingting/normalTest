const express = require('express');
const Router = require('./router/index');
var bodyParser = require('body-parser')

const app = express();


app.engine('html',require('express-art-template'));

//静态资源处理
app.use('/public/',express.static('./public/'));

// 配置模板引擎和 body-parser 一定要在 app.use(router) 挂载路由之前
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());

app.use(Router);


app.listen(8088,function(){
    console.log('server is staring');
});