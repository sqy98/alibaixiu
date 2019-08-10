//获取文章分类数据
$.ajax({
  type: 'get',
  url: '/categories',
  success: function (res) {
    // console.log(res);
    var html = template('categoryTpl', { data: res });
    $('#category').html(html);

  }
})
//选择文件的时候触发事件
$('#feature').on('change', function () {
  //获取到管理员选择到的文件
  var file = this.files[0];
  //创建fromData对象 
  var formData = new FormData();
  //cover文章的封面 将管理员选择的文件追加到formData中
  formData.append('cover', file)
  //实现图片上传
  $.ajax({
    type: 'post',
    url: '/upload',
    data: formData,
    processData: false,
    contentType: false,
    success: function (res) {
      $('#thumbnail').val(res[0].cover)
      $('#dataImg').attr('src',res[0].cover).show();
    }
  })
})
$('#addForm').on('click', function () {
  //获取表单内容
  var formData = $('#Form').serialize();
  console.log(formData);
  
  //实现添加文章功能
  $.ajax({
    type: 'post',
    url: '/posts',
    data: formData,
    success: function () {
      //添加成功跳转
      location.href='/admin/posts.html'

    }
  })
})

