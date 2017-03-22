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
}