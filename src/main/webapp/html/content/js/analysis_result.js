/**
 * Created by duanzhengmou on 3/18/17.
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

var trasaction_data_all;
init();
function init() {
    initPlugin();
    initEvent();
    initData();
}

function initEvent() {

}

function initData() {
    // init params
    let params = location.search.substring(1).split("&");
    let data_obj = {};
    // parse parameters from url
    let type = params[0].split("=")[1];
    if (type == 0) {
        data_obj.name = params[1].split("=")[1];//strategy name
        data_obj.baseCode = params[2].split("=")[1];
        data_obj.capital = params[3].split("=")[1];
        data_obj.taxRate = params[4].split("=")[1];
        data_obj.vol = params[5].split("=")[1];//num of stock
        data_obj.interval = params[6].split("=")[1];
        data_obj.start = params[7].split("=")[1];
        data_obj.end = params[8].split("=")[1];

        $.ajax({
            url: '/Strategy/analyseWithSpecificStrategy',
            type: 'post',
            data: {arguments: JSON.stringify(data_obj)},
            success: function (data) {
                renderResult(data);
            },
            error: function (data) {
                alert("ERROR");
            }

        });
    } else {
        let param_obj = JSON.parse(sessionStorage.getItem('factor_params'));
        let factors = param_obj.factorWeight = JSON.parse(JSON.parse(sessionStorage.getItem('factor_params_factors')));
        for (let i in factors){
            factors[i] = parseFloat(factors[i]);
        }
        let data = JSON.stringify(param_obj);
        data_obj.capital = param_obj.capital;
        $.ajax({
            url: '/Strategy/analyseWithFactor',
            type: 'post',
            data: {arguments: data},
            success: function (data) {
                renderResult(data);
            },
            error: function (data) {
                alert("ERROR");
            }

        });
    }
    // show params on dashboard
    $('#param-base').text((data_obj.baseCode == '000001' ? '上证综指' : '深证成指'));
    $('#param-beginDate').text(data_obj.start);
    $('#param-endDate').text(data_obj.end);
    $('#param-taxRate').text(data_obj.taxRate);
    $('#param-capital').text((data_obj.capital / 10000) + '万').val((data_obj.capital));
    $('#param-interval').text(data_obj.interval);
}

function renderResult(data) {
    $('#loader').removeClass("is-active");
    trasaction_data_all = data;
    // init compare data
    let cumRtnVOList = data.cumRtnVOList;
    let baseData = [];
    let testData = [];
    for (let x of cumRtnVOList) {
        let dateStr = x.date.year + '-' + x.date.month + '-' + x.date.day;
        let date = new Date(dateStr).getTime();
        baseData.push([date, x.baseValue]);
        testData.push([date, x.testValue]);
    }
    draw_compare_chart(baseData, testData);

    // init trade detail
    let trade_data = data.tradeDataVOList;
    let trade_table_data = [];
    let trade_table_data_item;
    let total_capital = $('#param-capital').val();
    for (let i of trade_data) {
        trade_table_data_item = {};
        let trade_total = 0, trade_num = 0;
        for (let j = 0; j < i.tradeDetailVOs.length; j++) {
            trade_num += i.tradeDetailVOs[j].numofTrade;
            trade_total += (i.tradeDetailVOs[j].tradePrice * i.tradeDetailVOs[j].numofTrade);
        }
        trade_table_data_item.date = i.tradeDate.year + "-" + i.tradeDate.month + "-" + i.tradeDate.day;
        trade_table_data_item.trade_amount = (trade_total).toFixed(2);
        trade_table_data_item.trade_num = trade_num;
        trade_table_data_item.profit = (i.profit).toFixed(2);
        trade_table_data_item.profit_rate = ((i.profit / total_capital) * 100).toFixed(2) + "%";
        trade_table_data.push(trade_table_data_item);
    }
    $('#transaction_table').DataTable().rows.add(trade_table_data).draw(false);
    let lastIdx = null;
    let table = $('#transaction_table').DataTable();
    $('#transaction_table tbody')
        .on('mouseover', 'td', function () {
            console.log('over');
            let colIdx = table.cell(this).index().row;
            if (colIdx !== lastIdx) {
                $(table.rows().nodes()).removeClass('highlight');
                $(table.row(colIdx).nodes()).addClass('highlight');
            }
        }).on('mouseleave', 'td', function () {
        $(table.rows().nodes()).removeClass('highlight');
    });
}

function initPlugin() {
    let transaction_table = $('#transaction_table').DataTable({
        dom: 'rtp',
        columns: [
            {data: 'date'},
            {data: 'trade_amount'},
            {data: 'trade_num'},
            {data: 'profit'},
            {data: 'profit_rate'}
        ],
        columnDefs: [
            {
                targets: 0,
                width: '20%'
            }
        ],
        pageLength: 5,
        oLanguage: olanguage
    });
    $('#transaction_table tbody').on('click', 'tr', function () {
        $('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        let selected_row = transaction_table.row('.selected').index();
        let detail_data = trasaction_data_all.tradeDataVOList[selected_row].tradeDetailVOs;
        // alert(detail_data[0].code);
        // let current_detail_data = all_detail_data[selected_row]
        let detail_data_item;
        let detail_table_data = [];
        for (let i = 0; i < detail_data.length; i++) {
            detail_data_item = {};
            let date_data = trasaction_data_all.tradeDataVOList[selected_row].tradeDate;
            // alert(date_data.year);
            detail_data_item.date = date_data.year + "-" + date_data.month + "-" + date_data.day;
            detail_data_item.name = detail_data[i].codeName;
            if (detail_data[i].buyOrSell == false) {
                detail_data_item.statu = "卖出";
            } else {
                detail_data_item.statu = "买入";
            }
            detail_data_item.trade_num = detail_data[i].numofTrade;
            detail_data_item.trade_amount = detail_data[i].tradePrice;
            detail_table_data.push(detail_data_item);
        }
        $('#transaction_detail_table').DataTable().clear().draw();
        $('#transaction_detail_table').DataTable().rows.add(JSON.parse(JSON.stringify(detail_table_data))).draw();
    });
    $('#transaction_detail_table').DataTable({
        dom: 'rtp',
        pageLength: 5,
        columns: [
            {data: 'date'},
            {data: 'statu'},
            {data: 'trade_amount'},
            {data: 'name'},
            {data: 'trade_num'}
        ],
        oLanguage: olanguage
    });
}

function draw_compare_chart(base, test) {

    $('#compare-chart').highcharts('StockChart', {
        rangeSelector: {
            selected: 1
        },
        title: {
            text: '基准和大盘的回测结果对比'
        },
        series: [
            {
                color: '#666666',
                name: '基准',
                data: base,
                tooltip: {
                    valueDecimals: 8
                }
            },
            {
                color: '#CC0000',
                name: '回测',
                data: test,
                tooltip: {
                    valueDecimals: 8
                }
            }
        ]
    });
}