var express = require('express');
var router = express.Router();
/* GET home page. */


router.get('/', function(req, res, next) {
  res.render('index');
  
});
router.get('/brand', function(req, res, next) {
  res.render('brand');
});
router.get('/phone', function(req, res, next) {
  res.render('phone');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});
router.get('/register', function(req, res, next) {
  res.render('register');
});
module.exports = router;


