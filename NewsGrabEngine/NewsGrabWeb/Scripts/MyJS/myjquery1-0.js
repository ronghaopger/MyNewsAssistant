$(document).ready(function () {
    //头条新闻行为
    $("#hupu").attr("DownFlag", false);
    $("#hupu").mouseenter(function () {
        $("#hupu").css({ "width": "300px", "height": "500px", "fontSize": "15px" });
    });
    $("#hupu").mouseleave(function () {
        $("#hupu").css({ "width": "170px", "height": "500px", "fontSize": "11px" });
        $("#hupu01").css({ "marginTop": "0px" });
        $("#hupu").attr("DownFlag", false);
    });
    $("#hupu").mousemove(function (e) {
        MoveDiv(e, "#hupu", "#hupu01");
    });

    $("#dongqiudi").attr("DownFlag", false);
    $("#dongqiudi").mouseenter(function () {
        $("#dongqiudi").css({ "width": "300px", "height": "500px", "fontSize": "15px" });
    });
    $("#dongqiudi").mouseleave(function () {
        $("#dongqiudi").css({ "width": "170px", "height": "500px", "fontSize": "11px" });
        $("#dongqiudi01").css({ "marginTop": "0px" });
        $("#dongqiudi").attr("DownFlag", false);
    });
    $("#dongqiudi").mousemove(function (e) {
        MoveDiv(e, "#dongqiudi", "#dongqiudi01");
    });

    $("#xinlang").attr("DownFlag", false);
    $("#xinlang").mouseenter(function () {
        $("#xinlang").css({ "width": "300px", "height": "500px", "fontSize": "15px" });
    });
    $("#xinlang").mouseleave(function () {
        $("#xinlang").css({ "width": "170px", "height": "500px", "fontSize": "11px" });
        $("#xinlang01").css({ "marginTop": "0px" });
        $("#xinlang").attr("DownFlag", false);
    });
    $("#xinlang").mousemove(function (e) {
        MoveDiv(e, "#xinlang", "#xinlang01");
    });

    $("#tengxun").attr("DownFlag",false);
    $("#tengxun").mouseenter(function (e) {
        $("#tengxun").css({ "width": "300px", "height": "500px", "fontSize": "15px" });
    });
    $("#tengxun").mouseleave(function () {
        $("#tengxun").css({ "width": "170px", "height": "500px", "fontSize": "11px" });
        $("#tengxun01").css({ "marginTop": "0px" });
        $("#tengxun").attr("DownFlag", false);
    });
    $("#tengxun").mousemove(function (e) {
        MoveDiv(e, "#tengxun", "#tengxun01");
    });

    $("#fenghuangwang").attr("DownFlag", false);
    $("#fenghuangwang").mouseenter(function () {
        $("#fenghuangwang").css({ "width": "300px", "height": "500px", "fontSize": "15px" });
    });
    $("#fenghuangwang").mouseleave(function () {
        $("#fenghuangwang").css({ "width": "170px", "height": "500px", "fontSize": "11px" });
        $("#fenghuangwang01").css({ "marginTop": "0px" });
        $("#fenghuangwang").attr("DownFlag", false);
    });
    $("#fenghuangwang").mousemove(function (e) {
        MoveDiv(e, "#fenghuangwang", "#fenghuangwang01");
    });
    
    //世界杯倒计时
    $("#countTime").mouseenter(function () {
        $("#countTime").css({ "display": "none" });
        $("#ggormm").css({ "display": "inline" });
    });
    $("#gg").mouseleave(function () {
        $("#gg").css({ "display": "none" });
        $("#countTime").css({ "display": "inline" });
    });
    $("#mm").mouseleave(function () {
        $("#mm").css({ "display": "none" });
        $("#countTime").css({ "display": "inline" });
    });
    $("#ggormm").mouseleave(function () {
        $("#countTime").css({ "display": "inline" });
        $("#ggormm").css({ "display": "none" });
    });

    //首页大动画
    $("#box").mousemove(function (e) {
        var xlength = e.pageX / 30;
        var ylength = e.pageY / 40;
        $("#boxOne").css("left", -80 - xlength);
        $("#boxTwo").css("left", 280 - xlength);
        $("#boxThree").css("left", 200 + xlength);
        $("#boxTwo").css("top", 125 - ylength);
        $("#boxThree").css("top", 160 + ylength);
    });
    
    //首页标题
    $("#search").mouseenter(function () {
        $("#search").removeClass().addClass('animated tada').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).removeClass();
        });
    });
    $("#hot").mouseenter(function () {
        $("#hot").removeClass().addClass('animated tada').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).removeClass();
        });
    });
    $("#inTime").mouseenter(function () {
        $("#inTime").removeClass().addClass('animated tada').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).removeClass();
        });
    });
    $("#about").mouseenter(function () {
        $("#about").removeClass().addClass('animated tada').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).removeClass();
        });
    });
});


//向下移动div
MoveDiv = function (mouse, div, div01) {
    if ($(div)[0].clientHeight < $(div)[0].scrollHeight) {
        if (mouse.pageY - $(div01)[0].offsetTop < 100) {
            $(div).attr("DownFlag", false);
            $(div01).css({ "marginTop": "0px" });
        }
        else if (mouse.pageY - $(div01)[0].offsetTop > 350) {
            if ($(div).attr("DownFlag") == "true")
                return;
            $(div).attr("DownFlag", true);
            var i = 0;
            var int = setInterval(function () {
                $(div01).css({ "marginTop": -i++ + "px" });
                if ($(div).attr("DownFlag") == "false") {
                    clearInterval(int);
                }
                if (i == $(div)[0].scrollHeight - $(div)[0].clientHeight - 2) {
                    clearInterval(int);
                    $(div).attr("DownFlag", false);
                }
            }, 100);
        }
        else {
            $(div).attr("DownFlag", false);
        }
    }
}

ggOnclick = function () {
    $("#ggormm").css({ "display": "none" });
    $("#gg").css({ "display": "inline" });
};
mmOnclick = function () {
    $("#ggormm").css({ "display": "none" });
    $("#mm").css({ "display": "inline" });
}