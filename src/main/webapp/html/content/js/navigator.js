/**
 * Created by duanzhengmou on 3/18/17.
 * Copyright © 2017 duanzhengmou. All rights reserved.
 */


$("body").prepend("<nav style='width: 100%;height: 45px;background-color: #262626'>" +
    "<a href='/html/content/html/stock_list.html'><div class='nav-brand'>" +
    "<h3 style='color: white'>Any</h3><h3 style='color: #CC5A02'>Quant</h3>" +
    "</div></a>" +
    "<ul style='float: right;list-style: none' id='nav-btns'>" +
    "<li style='float:left;height: 45px;'><a href='/html/content/html/stock_list.html' class='nav-link'>数据</li></a>" +
    "<li style='float:left;height: 45px;'><a href='/html/content/html/optional_stock_list.html' class='nav-link'>自选</li></a></li>" +
    "<li style='float:left;height: 45px;'><a href='/html/content/html/analysis_input.html' class='nav-link'>回测</li></a></li>" +
    "<li style='float:left;height: 45px;'><a href='/html/content/html/login.html' class='nav-link' id='user'>用户</li></a></li>" +
    "</nav>");

// $.ajax({
//     url:'/getUserName',
//     type:'get',
//     success: function(data){
//       if (data){
//
//       } else {
//
//       }
//     },
//     error: function(data){
//         alert("ERROR");
//     }
//
// });