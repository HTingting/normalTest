const express = require('express');
var router = express.Router();
var News = require('./../module/News');

router.get('/',function(req,res){
    News.getAllNews(function(err,data){
        if(err){
            return res.status(500).send('Server error');
        }
        res.render('index.html',{
            news:data
        })
    })
});

//编辑页面
router.get('/edit',function(req,res){
    News.getNewById(req.query.id,function(err,data){
        if(err){
            res.status(500).send('Server error');
        }
        console.log('编辑',data);
        res.render('edit.html',{
            info: data
        })
    })
});
//编辑提交
router.post('/edit',function(req,res){
    News.update(req.body,function(err){
        if(err){
            res.status(500).send('Server error');
        }
        res.redirect('/')
    })
});
//添加页面
router.get('/news/add',function(req,res){
    res.render('add.html');
});
//添加提交
router.post('/news/add',function(req,res){
    console.log(req.body);
    News.add(req.body,function(err,data){
        if(err){
            return res.status(500).send('Server error');
        }
        res.redirect('/');
    })
});
//删除
router.get('/delete',function(req,res){
    News.delete(req.query.id, function(err){
        if(err){
            res.status(500).send('Server error');
        }
        res.redirect('/');
    })
});

module.exports = router;

