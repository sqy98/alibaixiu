$.ajax({
    type: 'get',
    url: '/posts',
    success: function (res) {
        var html = template('postsTpl', res)
        //console.log(res);
        $('#postsBox').html(html)
    }
})
//处理日期时间格式
function formateDate(date) {
    date = new Date(date);
  return  date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()

}