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
          db.collection('phone').find().count(function(err, num) {
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
          db.collection('phone').find().limit(pageSize).skip(page * pageSize - pageSize).toArray(function(err, data) {
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
          res.render('phone', {
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
router.post('/phoneAdd', upload.single('file'),function (req, res) {
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
    var usm = req.body.usm;
    var logo = req.body.logo;
    var price = req.body.price;
    var recycle = req.body.recycle;
    // var phoneName = req.body.phoneName
    fs.renameSync(req.file.path,newFileName)
    if (!usm) {
      res.render('error', {
        message: '手机名不能为空',
        error: new Error('手机名不能为空')
      })
      return;
    }
    if (!logo) {
      res.render('error', {
        message: 'logo不能为空',
        error: new Error('logo不能为空')
      })
      return;
    }
    if (!price) {
      res.render('error', {
        message: '价格不能为空',
        error: new Error('价格不能为空')
      })
      return;
    }
    if (!recycle) {
      res.render('error', {
        message: '二手回收价不能为空',
        error: new Error('二手回收价不能为空')
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
          db.collection('phone').find({
            username: usm
          }).count(function (err, num) {
            if (err) {
              cb(err)
            } else if (num > 0) {
              cb(new Error('该手机已经新增了'))
            } else {
              cb(null)
            }
          })
        },
        function (cb) {
          db.collection('phone').insertOne({
            username: usm,
            logo:logo ,
            price: price,
            recycle:recycle ,
            // phoneName: phoneName,
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
          res.redirect('/phone')
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
  
      db.collection('phone').deleteOne({
        _id: ObjectID(id),
      }, function (err) {
        if (err) {
          res.render('error', {
            message: '未删除',
            error: err
          })
        } else {
          console.log('删除成功')
          res.redirect('/phone')
        }
      })
    })
  })
module.exports = router;