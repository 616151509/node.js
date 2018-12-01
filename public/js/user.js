$('.userModify').click(function(){
    $('.modifyMenu').css('display','block')
    
    var mo = $(this).parent().parent().children('td')
    console.log()
    // [0].innerHTML  = mo[0].innerHTML
    $('.userName').val(mo[0].innerHTML)
    $('.userPsd').val(mo[1].innerHTML)
    $('.userNkm').val(mo[2].innerHTML)
    // $('.userSex').val(mo[3].innerHTML)
    $('.userAge').val(mo[4].innerHTML)
    // $('.userAdmin').val(mo[5].innerHTML)
 })
 $('.modifyMenu-true').click(function(){
   $('.modifyMenu').css('display','none')
 })

 