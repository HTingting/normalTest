const fs = require('fs');

const newsPath = './Mock/news.json';

// 获取全部数据
exports.getAllNews = function(callback){
    fs.readFile(newsPath,function(err,data){
        console.log(err);
        if(err){
           return callback(err);
        }
        return callback(null,JSON.parse(data).news);
    })
};
//获取一条数据
exports.getNewById = function(id,callback){
    fs.readFile(newsPath,'utf8',function(err,data){
        if(err){
            return callback(err);
        }
        var news = JSON.parse(data).news;
        console.log(news,id);
        var ret = news.find(function (item) {
            return parseInt(item.id) === parseInt(id)
        });
        callback(null,ret);
    })
};

//更新
exports.update = function(updateData,callback){
    fs.readFile(newsPath,function(err,data){
        if(err){
            return callback(err);
        }
        
        var news = JSON.parse(data).news;
        
        var target = news.find(function(item){
            return item.id === parseInt(updateData.id)
        })
        
        for(var key in target){
            target[key] = updateData[key]
        }
        
        //把对象数据装换成字符串
        var fileData = JSON.stringify({
            news: news
        })
        
        //把字符串保留到文件中
        fs.writeFile(newsPath,fileData,function(err){
            if(err){
                return callback(err)
            }
            return callback(null);
        })
        
    })
};

// 添加
exports.add = function(addData,callback){
    fs.readFile(newsPath, 'utf8' ,function (err, data) {
        if(err){
            return callback(err);
        }
        var news = JSON.parse(data).news;

        //添加id
        addData.id = news[news.length -1 ].id + 1;

        news.push(addData);

        var fileData = JSON.stringify({
            news: news
        })

        fs.writeFile(newsPath, fileData, function(err){
            if(err){
                return callback(err)
            }
            return callback(null);
        })
    })
};

// 删除一条数据
exports.delete = function(id,callback){
    fs.readFile(newsPath, 'utf8' , function(err, data){
        if(err){
            return callback(err);
        }
        var news = JSON.parse(data).news;

        //findIndex 方法专门用来根据条件查找元素的下表
        var deleteId = news.findIndex(item=>{
            return item.id === parseInt(id);
        });

        news.splice(deleteId,1);

        var fileData = JSON.stringify({
            news: news
        })

        fs.writeFile(newsPath, fileData, function(err){
            if(err){
                return callback(err);
            }
            callback(null);
        })
    })
}

