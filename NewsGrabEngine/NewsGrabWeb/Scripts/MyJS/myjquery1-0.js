$(document).ready(function () {
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
});