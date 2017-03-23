/**
 * Created by duanzhengmou on 3/18/17.
 * Copyright © 2017 duanzhengmou. All rights reserved.
 */
init();

function init() {
    initData();
    initEvent();
    initPlugin();
}

function initData() {

}

function initEvent() {
    $("#beginTestBtn").on('click', function () {
        let beginDate = $('#beginDate_input').val();
        let endDate = $('#endDate_input').val();
        let strategy = $('#strategy_input').val();
        let baseCode = $('#base_input').val();
        let interval = $('#interval_input').val();
        let capital = $('#capital_input').val();
        let taxRate = $('#taxRate_input').val();
        let stockNum = $('#stockNum_input').val();

        let params = "type=0&strategy="+strategy+"&baseCode="+baseCode+"&capital="+capital+
            "&taxRate="+taxRate+"&numOfStock="+stockNum+"&interval="+interval+
            "&start="+beginDate+"&end="+endDate;
        location.href = '/html/content/html/analysis_result.html?'+params;
    });
    $('#taxRate_input').on('input', function () {
        let cur = $(this);
        cur.next().text(cur.val());
    });
}

function initPlugin() {
    $('#beginDate_input').flatpickr();
    $('#endDate_input').flatpickr();
}

$("#strategy_input").change(function () {
    var strategy = $('#strategy_input').val();
    if(strategy == "Strategy_PE"){
        $("#s_pe").addClass("in");
        $("#s_vol").removeClass("in");

    }else{
        $("#s_vol").addClass("in");
        $("#s_pe").removeClass("in");
    }
})