// 主要是用于操作用户的 
var userArr = new Array();
// 将用户列表展示出来 
$.ajax({
    type: 'get',
    url: '/users',
    success: function (res) {
        userArr = res;
        render(userArr);
    }
})

// 用于调用template方法 
function render(arr) {
    var str = template('userTpl', {
        list: arr
    });
    // console.log(str);
    $('tbody').html(str);
}

// 添加用户功能 
$('#userAdd').on('click', function () {
    // console.log($('#userForm').serialize());
    $.ajax({
        url: '/users',
        type: 'post',
        data: $('#userForm').serialize(),
        success: function (res) {
            console.log(res);
            userArr.push(res);
            render(userArr);
            //添加后清空元素
            $('#userFrom > h2').text('新增用户');
            $('#hiddenAvatar').val('');
            $('#preview').attr('src', ' ../assets/img/default.png')
            $('#userAdd').show();
            $('#userEdit').hide();
            $('#email').val('');
            $('#nickName').val('');
            $('#password').val('');
            $('#admin').prop('checked', false);
            $('#normal').prop('checked', false);
            $('#wjh').prop('checked', false);
            $('#jh').prop('checked', false);
        }
    })
})

//当用户选择的时候
$('#avatar').on('change', function () {
    //用户选择到的文件
    //this.files[0]
    var formData = new FormData();
    formData.append('avatar', this.files[0]);
    //发送ajax请求
    $.ajax({
        type: 'post',
        url: '/upload',
        data: formData,
        //告诉ajax方法不要解析请求参数
        processData: false,
        //告诉ajax方法不要设置请求参数的类型
        contentType: false,
        success: function (res) {
            //实现头像预览功能
            $('#preview').attr('src', res[0].avatar)
            //将图片的地址添加到表单里面隐藏域
            $("#hiddenAvatar").val(res[0].avatar)
        }
    })
})
//编辑用户功能
var userId;
$('tbody').on('click ', '.edit', function () {
    userId = $(this).parent().attr('data-id')
    $('#userFrom > h2').text('修改用户')
    //先获取 当前被点击这个元素的祖先 叫tr
    var trObj = $(this).parents('tr');
    //获取图片的地址
    var imgsrc = trObj.children(1).children('img').attr('src')
    //将图片地址写到隐藏域中
    $('#hiddenAvatar').val(imgsrc);

    if (imgsrc) {
        $('#preview').attr('src', imgsrc);
    } else {
        $('#preview').attr('src', ' ../assets/img/default.png');
    }

    //将对应的内容写到左边的输入框中
    var emailvalue = trObj.children().eq(2).text();

    $('#email').val(emailvalue);
    $('#nickName').val(trObj.children().eq(3).text());
    var status = trObj.children().eq(4).text();
    var gly = trObj.children().eq(5).text();


    if (status == '激活') {
        $('#jh').prop('checked', true)
    } else {
        $('#wjh').prop('checked', true)
    }
    if (gly == '超级管理员') {
        $('#admin').prop('checked', true)
    } else {
        $('#normal').prop('checked', true)
    }
    $('#userAdd').hide();
    $('#userEdit').show();
})
//完成修改功能
$('#userEdit').on('click', function () {
    $.ajax({
        type: 'put',
        url: '/users/' + userId,
        data: $('#userForm').serialize(),
        success: function (res) {
           
            //我们要从user这个数据中将要修改的元素找出来
            var index = userArr.findIndex(item => item._id == userId);
            //根据这个index找到数组的这个元素 让他数据更新
            // console.log(userArr);

            userArr[index] = res;
            //调用render方法 重新渲染页面
            render(userArr);

            //修改用户以后清空表单中的数据还原
            $('#userFrom > h2').text('新增用户');
            $('#hiddenAvatar').val('');
            $('#preview').attr('src', ' ../assets/img/default.png')
            $('#userAdd').show();
            $('#userEdit').hide();
            $('#email').val('');
            $('#nickName').val('');
            $('#password').val('');
            $('#admin').prop('checked', false);
            $('#normal').prop('checked', false);
            $('#wjh').prop('checked', false);
            $('#jh').prop('checked', false);
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
            url: '/users/' + id,
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
        var id = v.parentNode.parentNode.children[6].getAttribute('data-id');
        ids.push(id);
    })
  // 发送ajax
  $.ajax({
    type: 'delete',
    url: '/users/' + ids.join('-'),
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
