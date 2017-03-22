/**
 * Created by duanzhengmou on 3/22/17.
 * Copyright © 2017 duanzhengmou. All rights reserved.
 */
init();
function init() {
    initEvent();
    initData();
    initPlugin();
}

function initData() {
    $.ajax({
        type:'post',
        url:"/Optional/get",
        success:function (data){
            console.log('add');
            $('#optional_list').DataTable().rows.add(data).draw();
        },
        error:function () {
            alert("请求失败");
        }
    });
}

function initEvent() {
    // 初始化表格点击跳转事件
    $('#optional_list tbody').on('click', 'tr', function () {
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
    // 初始化高亮事件
    $('#optional_list tbody')
        .on( 'mouseover', 'td', function () {
            console.log('over');
            let colIdx = optional_list.cell(this).index().row;
            if ( colIdx !== null ) {
                $( optional_list.rows().nodes() ).removeClass( 'highlight' );
                $( optional_list.row( colIdx ).nodes() ).addClass( 'highlight' );
            }
        } )
        .on( 'mouseleave', 'td', function () {
            $( optional_list.rows().nodes() ).removeClass( 'highlight' );
        } );
}