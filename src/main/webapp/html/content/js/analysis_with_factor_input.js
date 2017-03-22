/**
 * Created by duanzhengmou on 3/20/17.
 * Copyright © 2017 duanzhengmou. All rights reserved.
 */

let taxRateValue = $('#taxRate-value-in-time');
var weight_chart;
var space_chart;
init();
function init() {
    initEvent();
    initData();
    initPlugin();
}


function initEvent() {
    // 基本参数费率滑动实时变化
    $('#taxRate_input').on('input', function () {
        // 滑动条结果实时变化，如果对内存消耗太高可以改为变更确定后再显示
        taxRateValue.text($(this).val());
    });

    // 权重参数滑动实时变化
    $('#weight input').on('input', function () {
        $(this).next().text($(this).val());
    }).on('change', function () {
        refresh_weight_chart();
    });

    // 仓位参数滑动实时变化
    $('#space input').on('input', function () {
        $(this).next().text($(this).val());
    }).on('change', function () {
        refresh_space_chart();
    });

    // 提交回测事件
    $('#testBtn').on('click', function () {
        let beginDate = $('#beginDate_input').val();
        let endDate = $('#endDate_input').val();
        let baseCode = $('#base_input').val();
        let capital = $('#capital_input').val();
        let interval = $('#interval_input').val();
        let taxRate = $('#taxRate_input').val();
        let codes = _getChosenCodes();
        let factorWeight = {};
        $('#params-3 input').map(function () {
            let cur = $(this);
            factorWeight[cur.attr('name')] = cur.val();
        });
        factorWeight = JSON.stringify(factorWeight);

        let investWeight = $('#params-4 input').map(function () {
            return $(this).val();
        }).get().join(',');
        let param = {};
        param.baseCode = baseCode;
        param.capital = capital;
        param.taxRate = taxRate;
        param.codes = codes.join(',');
        param.interval = interval;
        param.start = beginDate;
        param.end = endDate;
        param.factorWeight = factorWeight;
        param.investWeight = investWeight;
        console.log(param);
        sessionStorage.setItem('factor_params', JSON.stringify(param));
        sessionStorage.setItem('factor_params_factors', JSON.stringify(param.factorWeight));
        window.location.href = '/html/content/html/analysis_result.html?type=1'
    })
}

function _getChosenCodes() {
    let codes = [];
    let result = $('#chosenStocks').DataTable().data();
    for (let x = 0; x < result.length; x++) {
        codes.push(result[x].code);
    }
    return codes;
}

function initData() {
    $.ajax({
        url: '/Stock/getStockDataList',
        type: 'get',
        success: function (data) {
            initAllStockTable(data);
        },
        error: function (data) {
            alert("ERROR");
        }

    });

}

function initPlugin() {
    //
    $('#beginDate_input').flatpickr();
    $('#endDate_input').flatpickr();

    // 初始化股票池（已选的）
    let table = $('#chosenStocks').DataTable({
        order: [[1, "asc"]],
        lengthChange: false,
        pageLength: 5,
        dom: 'lrtip',
        columns: [
            {data: 'name'},
            {data: 'code'}, // 此处不显示冗余数据，但也可以根据需要来开放相应数据列，数据是存在的，取消相应注释即可
            // {data:'open'},
            // {data:'high'},
            // {data:'low'},
            // {data:'close'}
        ]
    });
    // 股票池的鼠标高亮和点击事件
    $('#chosenStocks tbody').on('click', 'tr', function () {
        table.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        let row_self = table.row('.selected').data();
        $('#allstock_list').DataTable().row.add(row_self).draw();
        table.row('.selected').remove().draw(false);
    }).on('mouseover', 'td', function () {
        console.log('over');
        if (!table.cell(this).index()) return;
        let rowIdx = table.cell(this).index().row;
        $(table.rows().nodes()).removeClass('highlight');
        $(table.row(rowIdx).nodes()).addClass('highlight');


    }).on('mouseleave', 'td', function () {
        $(table.rows().nodes()).removeClass('highlight');
    });

    // 初始化权重示意图
    // Build the chart
    weight_chart = Highcharts.chart('weight-chart', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: '各权重比例示意图'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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
            name: '',
            colorByPoint: true,
            data: [
                ['市盈率', 0.5],
                ['市净率', 0.5],
                ['市销率', 0.5],
                ['市现率', 0.5],
                ['5日换手率', 0.5],
                ['10日换手率', 0.5],
                ['60日换手率', 0.5],
                ['120日换手率', 0.5]
            ]
        }]
    });

    // 初始化仓位示意图
    space_chart = Highcharts.chart('space-chart', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: '各仓位比例示意图'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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
            name: '',
            colorByPoint: true,
            data: [
                ['1档位', 0.5],
                ['2档位', 0.5],
                ['3档位', 0.5],
                ['4档位', 0.5],
                ['5档位', 0.5],
            ]
        }]
    });
}

function initAllStockTable(data) {
    let table = $('#allstock_list').DataTable({
        data: data,
        "order": [[1, "asc"]],
        lengthChange: false,
        pageLength: 5,
        dom: 'lrtp',
        columns: [
            {data: 'name'},
            {data: 'code'}, // 此处不显示冗余数据，但也可以根据需要来开放相应数据列，数据是存在的，取消相应注释即可
            // {data:'open'},
            // {data:'high'},
            // {data:'low'},
            // {data:'close'}
        ]
    });
    $('#allstock_list tbody').on('click', 'tr', function () {
        table.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        let selected_row = table.row('.selected').index();
        let row_self = table.row('.selected').data();
        $('#chosenStocks').DataTable().row.add(row_self).draw();
        table.row('.selected').remove().draw(false);
    }).on('mouseover', 'td', function () {
        if (table.cell(this).index() == null) return;
        let rowIdx = table.cell(this).index().row;
        $(table.rows().nodes()).removeClass('highlight');
        $(table.row(rowIdx).nodes()).addClass('highlight');
    }).on('mouseleave', 'td', function () {
        $(table.rows().nodes()).removeClass('highlight');
    });
}

function refresh_weight_chart() {
    // highchart不接受两位小数的数据，会出错
    let newData = [
        ['市盈率', $('#pb-slider').val() * 100],
        ['市净率', $('#pe-slider').val() * 100],
        ['市销率', $('#ps-slider').val() * 100],
        ['市现率', $('#pcf-slider').val() * 100],
        ['5日换手率', $('#vol5-slider').val() * 100],
        ['10日换手率', $('#vol10-slider').val() * 100],
        ['60日换手率', $('#vol60-slider').val() * 100],
        ['120日换手率', $('#vol120-slider').val() * 100]
    ];
    this.weight_chart.series[0].setData(newData);
    this.weight_chart.series[0].redraw();
}
function refresh_space_chart() {
    let newData = [
        ['1档位', $('#sp1-slider').val() * 100],
        ['2档位', $('#sp2-slider').val() * 100],
        ['3档位', $('#sp3-slider').val() * 100],
        ['4档位', $('#sp4-slider').val() * 100],
        ['5档位', $('#sp5-slider').val() * 100],
    ];
    this.space_chart.series[0].setData(newData);
    this.space_chart.series[0].redraw();
}