//给修改密码表单控件添加点击事件
$('#modifyForm').on('click',function(){
  //获取用户在表单上输入的内容
  var formData = $('#qwer').serialize();
  console.log(formData);
  
  //调用接口实现密码修改功能
  $.ajax({
      url:'/users/password',
      type:'put',
      data:formData,
      success:function(){
          location.href='/admin/login.html'
      }
  })
})