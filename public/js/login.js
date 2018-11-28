// $('.goodbey').on('click',function(){
//     const username = $('input[type=text]').val()
//     const password = $('input[type=password]').val()
//     var reg1 = /^(([1-9][0-9]+|[0-9])(\\.[0-9]+)?|\\.[0-9]+|)$/
//     var reg2 = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
//     var ii = reg1.test(username)
//     var ee = reg2.test(password)
//     console.log(ii,ee)
//     if(ii == true && ee == true){
//         $.ajax({
//             url: '/js/login',
//             method:'GET',
//             async:true,
//             data: {
//                 username: username,
//                 password: password
//             },
//             success: function(data){
//                 if(data.status === 200){
//                     window.location.href = '/index.ejs';
//                 }else{
//                     alert(data.message);
//                 }
//             },
//              fail: function(){
//                  console.log('请求失败')
//              }
//         })
//     }else{
//         alert('请输入正确的账号或密码')
//     }
// })