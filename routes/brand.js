var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://127.0.0.1:27017'
var async = require('async');
var ObjectID = require('mongodb').ObjectID;
var multer = require('multer');

var fs = require('fs');
var path = require('path');
var upload = multer({dest: 'C:/tmp'});

//分页跳转
router.get('/', function (req, res) {
    console.log(1)
    var pageSize = parseInt(req.query.pageSize) || 5;//每一页显示的条数
    var page = parseInt(req.query.page) || 1;//第几页
    var totalSize = '';//数据总条数
    MongoClient.connect(url, {
      useNewUrlParser: true
    }, function (err, client) {
      if (err) {
        console.log('数据库连接失败', err);
        res.render('error', {
          message: '数据库连接失败',
          error: err
        });
        return;
      }
      var db = client.db('user')
      async.series([
        function(cb) {
          db.collection('brand').find().count(function(err, num) {
            if (err) {
              cb(err);
            } else {
            console.log(num)
              totalSize = num;
              cb(null);
            }
          })
        },
        function(cb) {
          db.collection('brand').find().limit(pageSize).skip(page * pageSize - pageSize).toArray(function(err, data) {
            if (err) {
              cb(err)
            } else {
              cb(null, data)
            }
          })
  
        }
      ], function(err, results) {
        if (err) {
          res.render('error', {
            message: '错误',
            error: err
          })
        } else {
          var totalPage = Math.ceil(totalSize / pageSize); // 总页数
          res.render('brand', {
            list: results[1],
            totalPage: totalPage,
            pageSize: pageSize,
            currentPage: page
          })
        }
      })
    })
  })
//新增
router.post('/brandAdd', upload.single('file'),function (req, res) {
    var file = req.file
    if (!file) {
        res.render('error', {
          message: '请上传手机图片',
          error: new Error('请上传手机图片')
        })
        return;
      }
    var filename = 'phoneImg/' + new Date().getTime() + '_' + req.file.originalname;
    var newFileName = path.resolve(__dirname, '../public/', filename);
    var logo = req.body.logo;
    fs.renameSync(req.file.path,newFileName)
    if (!logo) {
      res.render('error', {
        message: '品牌名字不能为空',
        error: new Error('品牌名字不能为空')
      })
      return;
    }
    MongoClient.connect(url, {
      useNewUrlParser: true
    }, function (err, client) {
      if (err) {
        res.render('error', {
          message: '数据库连接失败',
          error: err
        });
        return;
      }
      var db = client.db('user');
      async.series([
        function (cb) {
          db.collection('brand').find({
            logo: logo
          }).count(function (err, num) {
            if (err) {
              cb(err)
            } else if (num > 0) {
              cb(new Error('该手机品牌已经新增了'))
            } else {
              cb(null)
            }
          })
        },
        function (cb) {
          db.collection('brand').insertOne({
            logo:logo ,
            fileName: filename
          }, function (err) {
            if (err) {
              cb(err)
            } else {
              cb(null)
            }
          })
        }
      ], function (err, result) {
        if (err) {
          res.render('error', {
            message: '新增手机失败',
            error: err
          })
        } else {
          res.redirect('/brand')
        }
        client.close()
      })
    })
  })
//删除
router.get('/delet', function (req, res) {
    var id = req.query.id;
    MongoClient.connect(url, {
      useNewUrlParser: true
    }, function (err, client) {
      if (err) {
        res.render('error', {
          message: '数据库连接失败',
          error: err
        });
        return;
      }
      var db = client.db('user');
  
      db.collection('brand').deleteOne({
        _id: ObjectID(id),
      }, function (err) {
        if (err) {
          res.render('error', {
            message: '未删除',
            error: err
          })
        } else {
          console.log('删除成功')
          res.redirect('/brand')
        }
      })
    })
  })
module.exports = router;