/**
 * Created by duanzhengmou on 3/22/17.
 * Copyright © 2017 duanzhengmou. All rights reserved.
 */

init();

function init() {
    initEvent();
}

function initEvent() {
    $('#loginBtn').on('click', function () {
        let username = $('#username_input').val();
        let password = $('#password_input').val();
        if(!username || !password) {
            // 警告
            return ;
        }
        $.ajax({
            url:'/user/login',
            type:'post',
            data:{
                username: username,
                password: password
            },
            success: function(data){
                if(data) {
                    window.location.href = '/html/content/html/stock_list.html';
                }else {
                    $('#login_tip').text('').text('用户名/密码错误');
                }
            },
            error: function(data){
                //alert("ERROR");
            }
            
        });
    });
    $('#registerBtn').on('click', function () {
        let username = $('#register_username_input').val();
        let password = $('#register_password_input').val();
        let repassword = $('#register_repassword_input').val();
        if(!username || !password || ! repassword){
            // unfullfill
            register_tip('信息尚未填写完整');
            return ;
        }
        if( password != repassword ){
            //
            register_tip('两次输入密码不相同');
            return ;
        }
        $.ajax({
            url:'/user/register',
            type:'post',
            data:{
                userName: username,
                password: password
            },
            success: function(data){

                if (data) {
                    register_tip('注册成功');
                    $('#tab-register').find('input').val('');
                }else{
                    register_tip('用户已存在');
                }
            },
            error: function(data){
                //alert("ERROR");
            }
            
        });

    });
}

function register_tip(msg) {
    $('#tip').text('').text(msg);
}