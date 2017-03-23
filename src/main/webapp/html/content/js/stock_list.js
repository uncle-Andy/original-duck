/**
 * Created by duanzhengmou on 3/18/17.
 * Copyright © 2017 duanzhengmou. All rights reserved.
 */
init();

function init() {
    initPlugin();
    initEvent();
    initData();
}

function initEvent() {
    // 事件委托，
    $('#stock_list tbody').on('click', 'tr', function () {
        let table = $('#stock_list').DataTable();
        $('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        let selected_row = table.row('.selected').index();
        let value = table.cell(selected_row, 1).data();

        window.location.href = "/html/content/html/stock_detail.html" + "?code=" + value;
    });

    $('#hot_stock_list tbody').on('click', 'tr', function () {
        let table = $('#hot_stock_list').DataTable();
        $('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        let selected_row = table.row('.selected').index();
        let value = table.cell(selected_row, 1).data();

        window.location.href = "/html/content/html/stock_detail.html" + "?code=" + value;
    });

}

function initPlugin() {
    // init table
    let stock_table = $('#stock_list').DataTable({
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
        "aoColumnDefs": [{
            "aTargets": [7],
            "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                if (sData < "0") {
                    ifHigher = 0;
                    $(nTd).css('color', 'green')
                } else {
                    ifHigher = 1;
                    $(nTd).css('color', 'red')
                }
            }
        }],
//            "bProcessing":true,
//            "iDisplayLength" : 40,
        "autoWidth": false
    });

    let bench_table = $('#benchmark_list').DataTable({
        // lengthChange:false,
        // pageLength:10,
        // dom: 'lrtip',
        data: null,
        columns: [
            {data: 'name'},
            {data: 'code'},
            {data: 'open'},
            {data: 'high'},
            {data: 'low'},
            {data: 'close'},
            {data: 'turnoverVol'}
        ],

        "autoWidth": false,
    });

    let hot_stock_table = $('#hot_stock_list').DataTable({
        data: null,
        "order": [[7, "desc"]],
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
        "aoColumnDefs": [{
            "aTargets": [7],
            "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                if (sData < "0") {
                    ifHigher = 0;
                    $(nTd).css('color', 'green')
                } else {
                    ifHigher = 1;
                    $(nTd).css('color', 'red')
                }
            }
        }],
//            "bProcessing":true,
//            "iDisplayLength" : 40,
        "autoWidth": false
    });
}

function initData() {
    // init stock data
    $.ajax({
        type: 'post',
        url: '/Stock/getStockDataList',
        contentType: 'application/json;charset=utf-8',
        success: function (data) {

            $('#stock_list').DataTable().rows.add(data).draw(false);

            let lastIdx = null;
            let table = $('#stock_list').DataTable();
            $('#stock_list tbody')
                .on( 'mouseover', 'td', function () {
                    console.log('over');
                    let colIdx = table.cell(this).index().row;
                    if ( colIdx !== lastIdx ) {
                        $( table.rows().nodes() ).removeClass( 'highlight' );
                        $( table.row( colIdx ).nodes() ).addClass( 'highlight' );
                    }
                } )
                .on( 'mouseleave', 'td', function () {
                    $( table.rows().nodes() ).removeClass( 'highlight' );
                } );

        },
        error: function () {
            alert("请求失败");
        }
    });

    // init bench data
    $.ajax({
        type: 'get',
        url: '/BenchMark/getBenchDataList',
        contentType: 'application/json;charset=utf-8',
        success: function (data) {
            $('#benchmark_list').DataTable().rows.add(data).draw(false);
        },
        error: function () {
            alert("请求失败");
        }
    });

    // init hot_stock data
    var hot_stock = [{"code":"sh600029","date":"2017-03-03","name":"南方航空","high":7.73,"low":7.6,"open":7.68,"close":7.71,"preClose":7.73,"turnoverVol":45158991,"turnoverValue":3.45273993E8,"turnoverRate":0.0064,"pb":1.707,"pe":13.4303,"accAdjFactor":1.0,"cirMarketValue":5.41446315E10,"totalMarketValue":7.569344157E10,"amplitude":0.0168,"changeRate":0.0025},
        {"code":"sh600028","date":"2017-03-03","name":"中国石化","high":5.72,"low":5.61,"open":5.72,"close":5.66,"preClose":5.74,"turnoverVol":147628612,"turnoverValue":8.34013829E8,"turnoverRate":0.0015,"pb":0.9892,"pe":19.2896,"accAdjFactor":1.0,"cirMarketValue":5.4085698386E11,"totalMarketValue":6.85263046336E11,"amplitude":0.0191,"changeRate":0.0139},
        {"code":"sh600149","date":"2017-03-03","name":"廊坊发展","high":21.0,"low":20.63,"open":20.95,"close":20.83,"preClose":21.05,"turnoverVol":9716841,"turnoverValue":2.02222893E8,"turnoverRate":0.0256,"pb":40.9504,"pe":-102.2405,"accAdjFactor":1.0,"cirMarketValue":7.9187328E9,"totalMarketValue":7.9187328E9,"amplitude":0.0175,"changeRate":0.0104},
        {"code":"sh600027","date":"2017-03-03","name":"华电国际","high":5.26,"low":5.17,"open":5.2,"close":5.23,"preClose":5.21,"turnoverVol":30577645,"turnoverValue":1.5983549E8,"turnoverRate":0.0045,"pb":1.1999,"pe":9.6531,"accAdjFactor":1.0,"cirMarketValue":3.5483487811E10,"totalMarketValue":5.1583368141E10,"amplitude":0.0172,"changeRate":0.0038},
        {"code":"sh600148","date":"2017-03-03","name":"长春一东","high":36.36,"low":35.72,"open":36.0,"close":35.89,"preClose":36.36,"turnoverVol":4667970,"turnoverValue":1.68014606E8,"turnoverRate":0.033,"pb":13.5822,"pe":646.7817,"accAdjFactor":1.0,"cirMarketValue":5.079027185E9,"totalMarketValue":5.079027185E9,"amplitude":0.0176,"changeRate":0.0129},
        {"code":"sh600026","date":"2017-03-03","name":"中远海能","high":7.16,"low":7.05,"open":7.13,"close":7.07,"preClose":7.19,"turnoverVol":28812118,"turnoverValue":2.04193896E8,"turnoverRate":0.0105,"pb":1.0471,"pe":14.8229,"accAdjFactor":1.0,"cirMarketValue":1.9343752603E10,"totalMarketValue":2.8506472603E10,"amplitude":0.0152,"changeRate":0.0166},
        {"code":"sh600023","date":"2017-03-03","name":"浙能电力","high":5.74,"low":5.69,"open":5.71,"close":5.73,"preClose":5.72,"turnoverVol":23553924,"turnoverValue":1.34704672E8,"turnoverRate":0.0017,"pb":1.3459,"pe":10.8371,"accAdjFactor":1.0,"cirMarketValue":7.79319537E10,"totalMarketValue":7.79319537E10,"amplitude":0.0087,"changeRate":0.0017},
        {"code":"sh600033","date":"2017-03-03","name":"福建高速","high":3.64,"low":3.6,"open":3.62,"close":3.62,"preClose":3.63,"turnoverVol":11239505,"turnoverValue":4.0654225E7,"turnoverRate":0.0041,"pb":1.195,"pe":16.1912,"accAdjFactor":1.0,"cirMarketValue":9.934728E9,"totalMarketValue":9.934728E9,"amplitude":0.011,"changeRate":-0.0027},
        {"code":"sh600153","date":"2017-03-03","name":"建发股份","high":11.01,"low":10.82,"open":10.86,"close":10.91,"preClose":10.89,"turnoverVol":21904432,"turnoverValue":2.39138892E8,"turnoverRate":0.0077,"pb":1.5454,"pe":13.1826,"accAdjFactor":1.0,"cirMarketValue":3.0932037455E10,"totalMarketValue":3.0932037455E10,"amplitude":0.0174,"changeRate":0.0018},
        {"code":"sh600031","date":"2017-03-03","name":"三一重工","high":7.22,"low":7.08,"open":7.21,"close":7.11,"preClose":7.27,"turnoverVol":44759230,"turnoverValue":3.1900944E8,"turnoverRate":0.0059,"pb":2.3308,"pe":198.2075,"accAdjFactor":1.0,"cirMarketValue":5.3991405369E10,"totalMarketValue":5.4447998904E10,"amplitude":0.0192,"changeRate":0.022}];
    $('#hot_stock_list').DataTable().rows.add(hot_stock).draw(false);

    let lastIdx = null;
    let table = $('#hot_stock_list').DataTable();
    $('#hot_stock_list tbody')
        .on( 'mouseover', 'td', function () {
            console.log('over');
            let colIdx = table.cell(this).index().row;
            if ( colIdx !== lastIdx ) {
                $( table.rows().nodes() ).removeClass( 'highlight' );
                $( table.row( colIdx ).nodes() ).addClass( 'highlight' );
            }
        } )
        .on( 'mouseleave', 'td', function () {
            $( table.rows().nodes() ).removeClass( 'highlight' );
        } );
}