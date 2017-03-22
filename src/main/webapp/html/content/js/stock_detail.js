/**
 * Created by duanzhengmou on 3/18/17.
 * Copyright © 2017 duanzhengmou. All rights reserved.
 */
var myRed="#FF0000";
var myGreen="#00CD66";
var code = location.search.substring(1).split('=')[1];
init();
function init() {
    initPlugin();
    initEvent();
    initData();
}

function initEvent() {
    $('#factor-trend-type').on('change', function () {
        draw_factor_chart(code, $(this).val());
    })
}
function initPlugin() {

}
function initData() {
    // init basic info of stock

    let request_url = '/StockDetail/description/?code=' + code;
    $.ajax({
        url: request_url,
        type: 'get',
        success: function (data) {
            $('#stock-name').text(data.name);
            $('#stock-code').text(data.code);
            $('#stock-open-price').text(data.close);
            $('#stock-changerate').text(data.changeRate);
            $('#stock-officer-addr').text(data.officeAddr);
            $('#stock-total-share').text(data.totalShares)
        },
        error: function (data) {
            alert("ERROR");
        }
    });

    // init ochl data of stock
    $.ajax({
        url: '/Stock/getStockDataListByTime',
        type: 'get',
        data: {
            code: code,
            start: '2013-01-01',
            end: '2015-01-30'
        },
        success: function (data) {
            let ohlc = [],
                volume = [],
                dataLength = data.length,
                // set the allowed units for data grouping
                groupingUnits = [[
                    'week',                         // unit name
                    [1]                             // allowed multiples
                ], [
                    'month',
                    [1, 2, 3, 4, 6]
                ]],

                i = 0;

            for (i; i < dataLength; i += 1) {
                ohlc.push([
                    new Date(data[i].date).getTime(),
                    data[i].open,
                    data[i].high,
                    data[i].low,
                    data[i].close
                ]);

                volume.push([
                    new Date(data[i].date).getTime(),
                    data[i].turnoverVol
                ]);
            }
            let ohlc_chart = $('#ohlc-chart').highcharts('StockChart', {
                plotOptions: {
                    candlestick: {
                        color: "rgb(0,204,153)",
                        upColor: '#CC0033'
                    }
                },
                tooltip: {

                    xDateFormat: '%Y-%m-%d'

                },
                credits: {
                    enabled: false
                },
                rangeSelector: {
                    selected: 0
                },

                title: {
                    text: 'k线图'
                },
                xAxis: {
                    crosshair: {color: myRed}
                },
                yAxis: [{
                    crosshair: {color: myRed},
                    labels: {
                        step: 1,
                        align: 'right',
                        x: -3
                    },
                    title: {
                        text: 'k线图'
                    },
                    height: '60%',
                    lineWidth: 2
                }, {
                    labels: {
                        align: 'right',
                        x: -3
                    },
                    title: {
                        text: '成交量'
                    },
                    top: '65%',
                    height: '35%',
                    offset: 0,
                    lineWidth: 2
                }],

                series: [{
                    type: 'candlestick',
                    name: 'K线',
                    data: ohlc,
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    type: 'column',
                    name: '成交量',
                    data: volume,
                    yAxis: 1,
                    dataGrouping: {
                        units: groupingUnits
                    }
                }]
            });

        },
        error: function (data) {
            alert("ERROR");
        }

    });
    
    // init factor data of stock
    draw_factor_chart(code, "市盈率");

    // init evaluation
    $.ajax({
        url:'/StockDetail/evaluation',
        type:'post',
        data:{
            code: code
        },
        success: function(data){
            $('#analysis').text(data.analysis);
            $('#suggestion').text(data.suggestion);
            let mark = data.mark;
            let others = 100 - mark;
            let evaluation_chart = Highcharts.chart('evaluation-chart', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: 0,
                    plotShadow: false,
                    // height: '250px',
                    spacingTop: 0
                },
                title: {
                    text: '股票<br>评分',
                    align: 'center',
                    verticalAlign: 'middle',
                    y: 40
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: true,
                            distance: -50,
                            style: {
                                fontWeight: 'bold',
                                color: 'white'
                            }
                        },
                        startAngle: -90,
                        endAngle: 90,
                        center: ['50%', '75%']
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Browser share',
                    innerSize: '50%',
                    data: [
                        [mark.toString(), mark],
                        ['',   others],
                        {
                            name: 'Proprietary or Undetectable',
                            y: 0.2,
                            dataLabels: {
                                enabled: false
                            }
                        }
                    ]
                }]
            });
            $('#dash-btns').on('click', function () {
                setTimeout(function () {
                    evaluation_chart.reflow();
                },0);

            });

        },
        error: function(data){
            alert("ERROR");
        }
    });


    // init radar-chart
    $.ajax({
        url:'/StockDetail/getMostUsefulFactors',
        type:'get',
        data:{
            code: code,
            timeLen: 30
        },
        success: function(data){
            let result = [];
            let name = [];
            for(let i=data.length;i>data.length-6;i--) {
                result.push([data[i-1].name,Math.abs(data[i-1].judgeFactorValue)]);
                name.push(data[i-1].name);
            }
            let radar_chart = Highcharts.chart('radar_chart',{
                chart: {
                    polar: true,
                    type: 'line'
                },

                title: {
                    text: '最具价值因子对比',
                    x: -100
                },

                pane: {
                    size: '80%'
                },

                xAxis: {
                    categories: name,
                    tickmarkPlacement: 'on',
                    lineWidth: 0
                },

                yAxis: {
                    gridLineInterpolation: 'polygon',
                    lineWidth: 0,
                    min: 0
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    shared: true,
                    pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y}</b><br/>'
                },

                legend: {
                    align: 'right',
                    verticalAlign: 'top',
                    y: 70,
                    layout: 'vertical'
                },

                series: [{
                    name:"因子值",
                    data:[1,2,3,4,5,6]
                }]

            });
            $('#dash-btns').on('click', function () {
                setTimeout(function () {
                    radar_chart.reflow();
                },0);
            });
        },
        error: function(data){
            alert("ERROR");
        }
        
    });

    // init news
    $.ajax({
        url:'/StockDetail/news',
        type:'get',
        data:{
            code: code
        },
        success: function(data){
            for (let x in data) {
                $('#news').append(
                    '<div class="well">' +
                    '<p><strong>'+data[x].title+'</strong></p>' +
                    '<p style="font-size: 10px;color: #94a0a0;">'+data[x].publishDate+'</p>' +
                    '<p>'+data[x].summary+'</p>' +
                    '</div>');
            }
        },
        error: function(data){
            alert("ERROR");
        }

    });
}

/**
 * 根据给定的因子类型(中文)来请求数据并绘制不同的因子图标
 * @param code
 * @param factor
 */
function draw_factor_chart(code,factor) {
    $.ajax({
        url:'/StockDetail/getFactorChange',
        type:'get',
        data:{
            code: code,
            factor: factor,
            offset: 30
        },
        success: function(data){
            let result;
            let date;
            let dataset = [];
            for(let i=0;i<data.length;i++){
                result = data[i].date.year+"-"+data[i].date.month+"-"+data[i].date.day;
                date = new Date(result);
                dataset.push([date.getTime(),data[i].value]);
            }
            // Create the chart
            let factor_chart = Highcharts.stockChart('factor-chart', {
                rangeSelector : {
                    selected : 1
                },
                   title : {
                       text : '各因子走势图'
                   },
                yAxis:{
                    crosshair:{//color:myRed
                    }
                },
                credits: {
                    enabled: false
                },
                series : [{
                    name : '因子值',
                    data : dataset,
                    tooltip: {
                        valueDecimals: 2
                    }
                }]
            });
            $('#dash-btns').on('click', function () {
                setTimeout(function () {
                    factor_chart.reflow();
                },0);
            });
        },
        error: function(data){
            alert("ERROR");
        }

    });
}
