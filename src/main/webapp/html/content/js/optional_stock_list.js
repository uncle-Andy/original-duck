/**
 * Created by duanzhengmou on 3/22/17.
 * Copyright © 2017 duanzhengmou. All rights reserved.
 */

var olanguage = {
    "sLengthMenu": "每页显示 _MENU_ 条记录",
    "sZeroRecords": "对不起，查询不到任何相关数据",
    "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
    "sInfoEmtpy": "找不到相关数据",
    "sInfoFiltered": "数据表中共为 _MAX_ 条记录)",
    "sProcessing": "正在加载中...",
    "sSearch": "搜索",
    "sUrl": "", //多语言配置文件，可将oLanguage的设置放在一个txt文件中，例：Javascript/datatable/dtCH.txt
    "oPaginate": {
        "sFirst":    "第一页",
        "sPrevious": " 上一页 ",
        "sNext":     " 下一页 ",
        "sLast":     " 最后一页 "
    }
}//多语言配置

init();
function init() {
    initEvent();
    initData();
    initPlugin();
}

function initData() {
    $.ajax({
        type: 'post',
        url: "/Optional/get",
        success: function (data) {
            console.log('add');
            $('#optional_list').DataTable().rows.add(data).draw();
        },
        error: function () {
            //alert("请求失败");
        }
    });
}

function initEvent() {
    // 初始化表格点击跳转事件
    // 手动改造一下处理事件委托
    $('#optional_list tbody').on('click', 'tr', function (e) {
        let srcElem = e.srcElement || e.target;
        if(srcElem.tagName == "BUTTON"){
            // console.log($(this).find('td')[1].innerText);
            let code = $(this).find('td')[1].innerText;
            $.ajax({
                url:'/Optional/del',
                type:'post',
                data:{code: code},
                success: function(data){
                    if(data) {
                        window.location.reload();
                    }
                },
                error: function(data){
                    //alert("ERROR");
                }
                
            });
            
            return ;
        }
        let table = $('#optional_list').DataTable();
        $('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        let selected_row = table.row('.selected').index();
        let value = table.cell(selected_row, 1).data();
        window.location.href = "/html/content/html/stock_detail.html" + "?code=" + value;
    });
}

function initPlugin() {
    let optional_list = $('#optional_list').DataTable({
        data: null,
        "order": [[1, "asc"]],
        // lengthChange:false,
        // pageLength:10,
        dom: 'ftip',
        columns: [
            {data: 'name'},
            {data: 'code'},
            {data: 'open'},
            {data: 'high'},
            {data: 'low'},
            {data: 'close'},
            {data: 'turnoverVol'},
            {data: 'changeRate'}
        ],
        "aoColumnDefs": [
            {
                "aTargets": 7,
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    if (sData < "0") {
                        ifHigher = 0;
                        $(nTd).css('color', 'green')
                    } else {
                        ifHigher = 1;
                        $(nTd).css('color', 'red')
                    }
                }
            },
            {
                targets: 8,
                render: function (data, type, row, meta) {
                    return "<button class='btn btn-danger btn-xs' style='width: 100%' stock-code='" + row.code + "'>删除</button>";
                }

            }
        ],
//            "bProcessing":true,
//            "iDisplayLength" : 40,
        "autoWidth": false,
        "oLanguage": olanguage
    });
    // 初始化高亮事件
    $('#optional_list tbody')
        .on('mouseover', 'td', function () {
            console.log('over');
            let colIdx = optional_list.cell(this).index().row;
            if (colIdx !== null) {
                $(optional_list.rows().nodes()).removeClass('highlight');
                $(optional_list.row(colIdx).nodes()).addClass('highlight');
            }
        })
        .on('mouseleave', 'td', function () {
            $(optional_list.rows().nodes()).removeClass('highlight');
        });

    // init region distribution
    $.ajax({
        url:'/Optional/getRegionDistribution',
        type:'post',
        success: function(data){
            let region_data = [];
            for (let x in data){
                region_data.push({
                    name: x==""?"未知":x,
                    y:data[x]
                })
            }
            console.log(region_data);
            // Build the region-dis-chart
            let region_chart = Highcharts.chart('region-dis-chart', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: '自选股地域分布示意图'
                },
                tooltip: {
                    pointFormat: '{series.name}:{point.y}</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    name: '数量',
                    colorByPoint: true,
                    data: region_data
                }]
            });
            $('.distribution-charts').on('click', function () {
                setTimeout(function () {
                    region_chart.reflow();
                },300);
            });
        },
        error: function(data){
            //alert("ERROR");
        }
    });

    // init board distribution
    $.ajax({
        url:'/Optional/getBoardDistribution',
        type:'post',
        success: function(data){
            let board_data = [];
            for (let x in data){
                board_data.push({
                    name: x==""?"未知板块":x,
                    y:data[x]
                })
            }
            // Build the board-dis-chart
            let board_chart = Highcharts.chart('board-dis-chart', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: '自选股行业分布示意图'
                },
                tooltip: {
                    pointFormat: '{series.name}:{point.y}</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    name: '数量',
                    colorByPoint: true,
                    data: board_data
                }]
            });
            $('.distribution-charts').on('click', function () {
                setTimeout(function () {
                    board_chart.reflow();
                    console.log('reflow');
                },300);
            });
        },
        error: function(data){
            //alert("ERROR");
        }

    });

}

function logout() {
    $.ajax({
        url:'/user/logout',
        type:'post',
        success: function(data){
            location.href ='/html/content/html/stock_list.html';
        },
        error: function(data){
            //alert("ERROR");
        }
        
    });
}