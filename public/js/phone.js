 $('.menu-form').click(function(){
    $('.addList').css('display','block')
    $('.makeTrue').css('display','none')
    $('.addNew').css('display','inline-block')
 })
 $('.cancel').click(function(){
   $('.addList').css('display','none')
 })
$('.addNew').click(function(){
   var Oimg = $('#img').val()
   var Ophone = $('#phone').val()
   var Ologo = $('#logo').val()
   var Oprice = $('#price').val()
   var Orecycle = $('#recycle').val()
   var i = $('tr').length - 1
   var newI = ++i
   $('.tbodyAdd').append('<tr>'+'<td>'+newI+'</td>'+'<td>'+Oimg+'</td>'+'<td>'+Ophone+'</td>'+'<td>'+ Ologo+'</td>'+'<td>'+Oprice+'</td>'+'<td>'+Orecycle+'</td>'+'<td>'+'<input type="button" class="cicle modify" value="修改" />'+'<input type="button" class="cicle del" value="删除" />'+'</td>'+'</tr>')
   console.log($('.del'))
   $(".del").on("click",function(){
      $(this).parent("td").parent("tr").remove();
      console.log(this)
   })
   $('.modify').click(function(){
      $('.addList').css('display','block')
      $('.makeTrue').css('display','inline-block')
      $('.addNew').css('display','none')
      console.log(this.parentNode.parentNode)
   })
   $('.modify').click(function(){
      $('.addList').css('display','block')
      $('.makeTrue').css('display','inline-block')
      $('.addNew').css('display','none')
      var obj = this.parentNode.parentNode;
      $('#phone').val(obj.children[2].innerHTML)
      $('#logo').val(obj.children[3].innerHTML)
      $('#price').val(obj.children[4].innerHTML)
      $('#recycle').val(obj.children[5].innerHTML)
      $('.makeTrue').click(function(){
         obj.children[2].innerHTML = $('#phone').val();
         obj.children[3].innerHTML = $('#logo').val();
         obj.children[4].innerHTML = $('#price').val();
         obj.children[5].innerHTML = $('#recycle').val()
      }) 
   })
   limit()
})
console.log($('.del'))
$(".del").on("click",function(){
   $(this).parent("td").parent("tr").remove();
   console.log(this)
})
$('.resetNew').click(function () {
   $('.addList :input').val('')
})
$('.modify').click(function(){
   $('.addList').css('display','block')
   $('.makeTrue').css('display','inline-block')
   $('.addNew').css('display','none')
   var obj = this.parentNode.parentNode;
   $('#phone').val(obj.children[2].innerHTML)
   $('#logo').val(obj.children[3].innerHTML)
   $('#price').val(obj.children[4].innerHTML)
   $('#recycle').val(obj.children[5].innerHTML)
   $('.makeTrue').click(function(){
      obj.children[2].innerHTML = $('#phone').val();
      obj.children[3].innerHTML = $('#logo').val();
      obj.children[4].innerHTML = $('#price').val();
      obj.children[5].innerHTML = $('#recycle').val()
   })
})
function limit(){
   var fath = $('tr')
   var j = fath.length-1;
   console.log(j)
   var k = j-(j%5)
      if((j%5)!=0){
         for(var i=0;i<k;i++){
            fath[i].style.display='none';
         }
      }else{
         k = k-5
         for(var i=0;i<k;i++){
            fath[i].style.display='none';
         }
      }
}






























