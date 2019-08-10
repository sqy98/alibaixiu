// 主要是用于操作用户的 
var userArr = new Array();
// 将用户列表展示出来 
$.ajax({
    type: 'get',
    url: '/categories',
    success: function (res) {
        userArr = res;
        render(userArr);
    }
})

// 用于调用template方法 
function render(arr) {
    var str = template('cTpl', {
        list: arr
    });
    $('tbody').html(str);
}
// 添加用户功能 
$('#userAdd').on('click', function () {
    $.ajax({
      url: '/categories',
        type: 'post',
        data: $('#cForm').serialize(),
        success: function (res) {
            console.log(res);
            userArr.push(res);
            render(userArr);
            //添加后清空元素
            $('#title').val('');
            $('#className').val('');
        }
    })
})
//编辑用户功能
var userId;
$('tbody').on('click ', '.edit', function () {
    userId = $(this).parent().attr('data-id')
    $(' h2').text('修改分类')
    //先获取 当前被点击这个元素的祖先 叫tr
    var trObj = $(this).parents('tr');

    //将对应的内容写到左边的输入框中
    var emailvalue = trObj.children().eq(2).text();
    $('#className').val(emailvalue);
    $('#title').val(trObj.children().eq(1).text());
   $('#userAdd').hide();
    $('#userEdit').show();
})
//完成修改功能
$('#userEdit').on('click', function () {
    $.ajax({
        type: 'put',
        url: '/categories/' + userId,
        data: $('#cForm').serialize(),
        success: function (res) {
            //我们要从user这个数据中将要修改的元素找出来
            var index = userArr.findIndex(item => item._id == userId);
            //根据这个index找到数组的这个元素 让他数据更新
            // console.log(userArr);
            userArr[index] = res;
            //调用render方法 重新渲染页面
            render(userArr);
            //修改用户以后清空表单中的数据还原
            $(' h2').text('新增用户');
            $('#title').val('');
            $('#className').val('');
            $('#userAdd').show();
            $('#userEdit').hide();
        }
    })
});
//删除单个用户功能
//找到删除按钮给其添加
$('tbody').on('click', '.del', function () {
  if (window.confirm("真的要删除吗？")) {
      var id = $(this).parent().attr('data-id');
      $.ajax({
          type: 'delete',
          url: '/categories/' + id,
          success: function (res) {
              var index = userArr.findIndex(item => item._id == res._id);
              //调用splice();
              userArr.splice(index, 1);
              render(userArr);
          }
      })
  }
})

//实现全选功能
$('thead input').on('click', function () {
//他的选中状态就直接决定下面的复选框的选中状态
//获取上面chencked复选框的属性值
    let flag = $(this).prop('checked');
    //设置下面的复选框  下面的复选框的checked属性值 就是由flag变量的值来决定的
    $('tbody input').prop('checked', flag)
    //如果上面的全选按钮打钩 我们就打钩
    if( flag){
        $('.btn-sm').show();
    }else{
        $('.btn-sm').hide();

    }
})
//下面的复选框注册点击事件
$('tbody').on('click', 'input',function () {
    //如果下面的复选框选中的个数等于他下面复选框的个数，就表示所有的都选中了
    //上面那个复选框就要打钩 反之只要有一个没有选中 那么上面的复选框就不打钩
    if ($('tbody input').length == $('tbody input:checked').length){
    $('thead input').prop('checked', true)
    }else{
    $('thead input').prop('checked', false)
    }
    //如果选中的长度大于一，就显示否则隐藏
    if( $('tbody input:checked').length>1){
        $('.btn-sm').show();
    }else{
        $('.btn-sm').hide();

    }
})
//给批量删除按钮注册点击事件
$('.btn-sm').on('click',function(){
    var ids =[];
    //想要获取被选中的元素的Id属性值
    var checkUser = $('tbody input:checked');
    //console.log(checkUser);
    //对checkUser进行遍历
    checkUser.each(function(k,v){
        var id = v.parentNode.parentNode.children[3].getAttribute('data-id');
        ids.push(id);
    })
  // 发送ajax
  $.ajax({
    type: 'delete',
    url: '/categories/' + ids.join('-'),
    success: function (res) {
       res.forEach(e => {
         var index = userArr.findIndex(item => item._id == e._id);
        // 调用splice()
        userArr.splice(index, 1);
         render(userArr);
       })
    }
})
})
