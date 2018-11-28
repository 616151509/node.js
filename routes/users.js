var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27018'
var async = require('async');
var ObjectID = require('mongodb').ObjectID;
/* GET users listing. */
router.get('/', function (req, res, next) {
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
    db.collection('user').find().toArray(function (err, data) {
      if (err) {
        console.log('查询数据库失败', err);
        res.render('error', {
          message: '查询失败',
          error: err
        })
      } else {
        res.render('user', {
          list: data
        });
      }
      client.close()
    })
  })
});
router.post('/login', function (req, res) {
  var username = req.body.usm;
  var password = req.body.psd;
  if (!username) {
    res.render('error', {
      message: '用户名不能为空',
      error: new Error('用户名不能为空')
    })
    return;
  }
  if (!password) {
    res.render('error', {
      message: '密码不能为空',
      error: new Error('密码不能为空')
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
    db.collection('user').find({
      username: username,
      password: password
    }).toArray(function (err, data) {
      if (err) {
        res.render('error', {
          message: '查询失败',
          error: err
        })
      } else if (data.length <= 0) {
        res.render('error', {
          message: '登录失败',
          error: new Error('登录失败')
        })
      } else {
        res.cookie('nickname', data[0].nickname, {
          maxAge: 10 * 60 * 1000
        })
        console.log('登录成功')
        res.redirect('/')
      }
      client.close();
    })
  })
})

router.post('/register', function (req, res) {
  var usm = req.body.usm;
  var psd = req.body.psd;
  var nickname = req.body.nickname;
  var sex = req.body.sex;
  var age = parseInt(req.body.age);
  var isAdmin = req.body.isAdmin == '是' ? true : false;
  if (!usm) {
    res.render('error', {
      message: '用户名不能为空',
      error: new Error('用户名不能为空')
    })
    return;
  }
  if (!psd) {
    res.render('error', {
      message: '密码不能为空',
      error: new Error('密码不能为空')
    })
    return;
  }
  if (!nickname) {
    res.render('error', {
      message: '昵称不能为空',
      error: new Error('用户名不能为空')
    })
    return;
  }
  if (!age) {
    res.render('error', {
      message: '必须填写年龄',
      error: new Error('必须填写年龄')
    })
    return;
  }
  MongoClient.connect(url, {useNewUrlParser: true},function(err,client){
    if (err) {
          res.render('error', {
            message: '数据库连接失败',
            error: err
          });
          return;
        }
    var db = client.db('user');
    async.series([
       function(cb){
         db.collection('user').find({
           username:usm
         }).count(function(err,num){
           if(err){
             cb(err)
           }else if( num > 0){
             cb(new Error('已经注册过了'))
           }else{
             cb(null)
           }
         })
       },
       function(cb){
        db.collection('user').insertOne({
          username:usm,
          password:psd,
          nickname:nickname,
          sex:sex,
          age:age,
          isAdmin:isAdmin
        },function(err){
          if(err){
            cb(err)
          }else{
            cb(null)
          }
        })
       }
    ],function(err,result){
       if(err){
         res.render('error',{
           message:'错误',
           error:err
         })
       }else{
         res.redirect('/login')
       }
       client.close()
    }) 
  })
})

router.get('/delet',function(req,res){
  var id = req.query.id;
  MongoClient.connect(url, {useNewUrlParser: true},function(err,client){
    if (err) {
      res.render('error', {
        message: '数据库连接失败',
        error: err
      });
      return;
    }
    var db = client.db('user');
    
      db.collection('user').deleteOne({
        _id : ObjectID(id),
      },function(err){
        if(err){
          res.render('error',{
            message:'未删除',
            error:err
          })
        }else{
          console.log('删除成功')
          res.redirect('/users')
        }
      })
  })
})

module.exports = router;