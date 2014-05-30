/**
 *project: Relation Widgets
 *version: 1.0
 *create: 2014-04-09
 *author: zhangyun
 *Q:查询效率？？？
 */
/*global data:true, jQuery:true*/
(function(win, doc, $) {
    'use strict';

    var Config = {
        'teamInfo': data.teamGroup,
        'timeInfo': data.timeGroup,
        'detailInfo': data.detailGroup,
        'levelInfo': data.levelGroup,
        'eighth': [['1A','2B'],['1C','2D'],['1B','2A'],['1D','2C'],['1E','2F'],['1G','2H'],['1F','2E'],['1H','2G']],
        'forth': [['W49','W50'],['W53','W54'],['W51','W52'],['W55','W56']],
        'half': [['W57','W58'], ['W59','W60']],
        'third': [['L61', 'L62']],
        'final': [['W61', 'W62']]
    };

    $.fn.myDrag = function(options) {
        var mx, isMove, zy;
        var opts = $.extend({}, $.fn.myDrag.defaults, options);
        return this.each(function() {
            var $dragObj = $(this);

            $(document).mousedown(function(e) {
                if ($(e.target).is($dragObj)) {
                    isMove = true;
                    mx = e.pageY;
                    zy = parseInt($dragObj.css('top'));
                }
            }).mouseup(function(e) {
                isMove = false;
                if ($(e.target).is($dragObj)) {
                    //G = Math.floor(parseInt($dragObj.css('left')) / opts.liWidth);
                    //finishScroll(G, opts.speed);
                }
            });

            // 滚动条拖拽
            $dragObj.mousemove(function(e) {
                var dx = e.pageY - mx;
                var dragTop = parseInt($(this).css('top'));
                if(isMove && dx > 0 && dragTop < opts.maxTop) {
                    $dragObj.css('top', zy + dx);
                    Fn.rollList($dragObj, zy + dx, opts.maxTop);
                }
                if(isMove && dx < 0 && dragTop > 0) {
                    $dragObj.css('top', zy + dx);
                    Fn.rollList($dragObj, zy + dx, opts.maxTop);
                }
                if(isMove && dx > 0 && dragTop === 0) {
                    $dragObj.css('top', dx);
                }
            });

        });
    };
    $.fn.myDrag.defaults = {
        speed: 'normal',
        parentEle: null, // 父级元素
        maxTop: 100
    };

    // 主要逻辑控制对象
    var Fn = {

        /**
         * 初始化
         */
        init: function() {
            //this.getSelectedByTeam('baxi');
            this.bindEvent();
            //this.getListByTeam('baxi');
        },

        /**
         * 数组排重
         * @param arr 数组
         */
        unique: function(arr) {
            var i = 0,
                temp = [];
            if (!arr || arr.length === 0) {
                return null;
            }
            arr.sort();
            for (; i < arr.length; i++) {
                if (!arr[i] || arr[i] === arr[i + 1]) {
                    continue;
                }
                temp[temp.length] = arr[i];
            }
            return temp;
        },


        bindEvent: function() {
            this.bindTeamEvent('.box01_l'); // 球队维度
            this.bindTeamEvent('.box01_r');
            this.bindDateEvent(); // 时间维度
            this.bindSrcollBar(); // 滚动条
            this.bindListScroll(); // 赛事列表的滚动事件
            this.bindShare(); // 分享

            // 赛事详情
            $('.box_vs_pr').delegate('.box_tit02', 'click', function() {
                var num = $(this).siblings('.box_cont').length;
                if(num > 0) {
                    $(this).siblings('.box_cont').remove();
                } else {
                    var gameId = parseInt($(this).parent().attr('id').match(/\d+/)[0]);
                    $('#game' + gameId).append(Fn.getGameDetail(gameId));
                    $(this).siblings('.box_cont').toggle();
                }
                
            });

            // 初始化淘汰赛和日历
            this.bindCalendar();
            this.bindKnockOut();
            this.initDialog();

            $(win).resize(function() {
                //Fn.initDialog();
            });
        },

        /**
         * 初始化淘汰赛
         * var arr = [['1/8决赛', 1],['1/4决赛', 2],['半决赛', 3],['季军赛', 
         *  4],['决赛', 5]];
         */
        bindKnockOut: function() {
            // 1/8决赛
            this.bindOutHtml1(1);
            this.bindOutHtml1(4);
            this.bindOutHtml1(5);

            // 1/4决赛
            this.bindOutHtml2(2);

            // 半决赛
            this.bindOutHtml2(3);
        },

        /**
         * 初始化淘汰赛及绑定点击关闭事件
         */
        initDialog: function() {
            var $dialog = $('.p-dialog');
            var $cupDialog = $('.p-wCup-dialog');
            var dialogTop = ($(win).height() - $cupDialog.height())/2;
            dialogTop = dialogTop < 0 ? 50 : dialogTop;
            var dialogLeft = ($(win).width() - $cupDialog.width())/2;
            var $calendar = $('.calendar');
            var $knockOut = $('.knockOut');
            $calendar.css({'top': dialogTop, 'left':dialogLeft, 'display': 'none'});
            $knockOut.css({'top': dialogTop, 'left':dialogLeft, 'display': 'none'});

            // 淘汰赛查询
            var $knockOutBtn = $('.box_fixed01').find('.span01');
            this.bindOutBtn($knockOutBtn, 0, $calendar, $dialog);
            this.bindOutBtn($knockOutBtn, 1, $knockOut, $dialog);

            // 打开窗口的关闭按钮绑定关闭事件
            $dialog.find('.close').click(function() {
                $dialog.fadeOut();
                $knockOutBtn.removeClass('current');
            });
        },

        /**
         * 淘汰赛按钮事件绑定
         * @param   $btn    被点击按钮
         * @param   index   按钮索引
         * @param   $obj 要关闭的窗口
         */
        bindOutBtn: function($btn, index, $obj, $dialog) {
            $btn.eq(index).click(function() {
                $dialog.fadeOut(10);
                $btn.removeClass('current');
                $obj.fadeIn();
                $btn.eq(index).addClass('current');
            });
        },

        /**
         * 球员列表滚动条
         */
        bindSrcollBar: function() {
            $('.box_vs_pr').delegate('.jspDrag', 'mousedown', function() {
                var $jspContainer = $(this).parents('.jspContainer');
                var containH = $jspContainer.height();
                var childH = $jspContainer.find('.jspPane').height();

                if (childH > containH) {
                    var maxTop = parseInt($('.jspDrag').parent().height() - $('.jspDrag').height());
                    $(this).myDrag({
                        speed: 'normal',
                        parentEle: null,
                        maxTop: maxTop
                    });
                }

            });
        },

        /**
         * 赛事列表的滚动事件
         */
        bindListScroll: function() {
            $('.box_vs_pr').bind('mousewheel', function(event) {
                var inHeight = $('.box_vs_pr').height();
                var outHeight = $('.box_vs_play').height();
                var gap = inHeight - outHeight;
                var temp = Math.abs(gap) % 10 === 0 ? Math.abs(gap) : (parseInt(Math.abs(gap) / 10) + 1) * 10;
                var top = parseInt($(this).css('top'));
                event.preventDefault();
                if (event.deltaY < 0 && gap > 0 && Math.abs(top) < temp) { //往下滚
                    $('.box_vs_pr').css('top', '-=20');
                    //$('.box_vs_pr').animate({'top': '-=10'}, 10).animate({'top': '-=10'}, 100);
                } else if (event.deltaY > 0 && gap > 0 && Math.abs(top) > 0) {
                    //var top = parseInt($(this).css('top')); + ((event.deltaY * event.deltaFactor) * -1);
                    $('.box_vs_pr').css('top', '+=20');
                }
            });
        },

        /**
         * 时间维度
         */
        bindDateEvent: function() {
            $('.bg02').delegate('.ul_time li', 'mouseover', function() {
                var gameTime = (this.id).match(/\d+/)[0];
                var team = Fn.getSelectedByDate(gameTime, false);
                $('ul li').removeClass('current');
                $(this).addClass('current');
                var m = 0,
                    teamLen = team.length;
                for (; m < teamLen; m++) {
                    $('#' + team[m]).addClass('current');
                }
                var month = gameTime.charAt(2) === '0' ? gameTime.substring(3, 4) : gameTime.substring(2, 4);
                $('.box_vs_pr').css('top', '0px');
                $('.box_logo').fadeOut(300);
                Fn.setHeader(gameTime.substring(1, 2) + '月' + month + '日');
                Fn.setListByDate(gameTime);
            });
        },

        /**
         * 分享
         */
        bindShare: function() {
            $('.bds_tsina').click(function() {
                Fn.shared('sina');
            });
            $('.bds_qzone').click(function() {
                Fn.shared('qqZone');
            });
            $('.bds_tqq').click(function() {
                Fn.shared('qq');
            });
            $('.bds_twx').click(function() {
                $('.wx_box').fadeIn(1000);
            });
            $('.close_wx').click(function() {
                $('.wx_box').fadeOut();
            });
        },

        /**
         * 初始化日历控件的数据
         */
        bindCalendar: function() {
            var $schedule = $('.p-wCup-schedule').find('li');
            $schedule.each(function(index) {
                if (index > 3) {
                    var $ele = $schedule.eq(index);
                    var date = $ele.attr('data-date');
                    var gameInfo = Fn.getSelectedByDate(date,true);
                    var i = 0,
                        len = gameInfo.length,
                        htmlStr = '';

                    if(len > 0) {
                        for (; i < len; i++) {
                            //2014-06-14 03:00:00
                            var item = gameInfo[i];
                            var time = item.time.split(' ')[1].split(':');
                            htmlStr += '<p><span class="g6 time">' + time[0] + ':' + time[1] + '</span><span>' + item.team1 + ' - ' + item.team2 + '</span></p>';
                        }
                    } else {
                        htmlStr = '<p></p><p class="null">今日 <br> 无比赛</p>'; 
                    }
                    $ele.find('.group').html(htmlStr);
                }

            });
        },

        /**
         * 组装1/8决赛、季军赛和总决赛的html
         * @param  level 比赛级别
         */
        bindOutHtml1: function (level) {
            switch(level) {
                case 1:
                    var data = this.getKnockOutData(1, Config.eighth);
                    var $block = $('.p-block-8');
                    break;
                case 4:
                    var data = this.getKnockOutData(level, Config.third);
                    var $block = $('.p-block-34');
                    break;
                case 5:
                    var data = this.getKnockOutData(level, Config.final);
                    var $block = $('.p-block-1');
                    break;

            }
            $block.each(function(index) {
                var blockData = data[index];
                var emData = (blockData.goals === '') ? blockData.time : blockData.goals;
                var temp = level === 4 ? '<span class="p">三四名决赛</span>' : '';
                var str = temp + '<p><span>'+blockData.team1+'</span><em>'+emData+'</em><span>'+blockData.team2+'</span></p>';
                $block.eq(index).html(str);
            });
    
        },

        /**
         * 组装半决赛和1/4决赛的html数据
         * @param   level 比赛级别
         */
        bindOutHtml2: function(level) {
            switch(level) {
                case 2:
                    var fourData = this.getKnockOutData(2, Config.forth, 4);
                    var $block = $('.p-block-4');
                    var start = 0;
                    var end = 4;
                    break;
                case 3:
                    var fourData = this.getKnockOutData(3, Config.half);
                    var $block = $('.p-block-2');
                    var start = 4;
                    var end = 6;
                    break;
            }
                        
            var $score = $('.p-score');
            $block.each(function (index) {
                var m = parseInt(index/2);
                var n = index%2;
                var blockData = fourData[m];
                var team = n === 0 ? blockData.team1 : blockData.team2;
                var str = '<p><span>'+team+'</span></p>';
                $block.eq(index).html(str);
            });
            $score.each(function(index) {
                if(index < end && index >= start) {
                    var scoreData = fourData[index - start];
                    var emData = (scoreData.goals === '') ? scoreData.time : scoreData.goals;
                    $score.eq(index).html('<span>'+emData+'</span>');
                }       
            });
        },

        /**
         * 组装淘汰赛的数据
         */
        getKnockOutData: function(level, data, num) {
            var levelInfo = Config.levelInfo;
            var i = 0, len = levelInfo.length, gameArr = [];
            for(; i < len; i++) {
                var item = levelInfo[i];
                if(parseInt(item.level) === level) {
                    var gameList= item.gameList;

                    var j = 0, gameLen = gameList.length;
                    for(; j < gameLen; j++) {
                        
                        var gameItem = gameList[j];
                        var team1Code = gameItem.team1_code;
                        var team1Goal = gameItem.team1_goals;
                        var tema1Penal = gameItem.team1_penalties;
                        var team1 = data[j][0], 
                            team2 = data[j][1], 
                            goals = '',
                            gameDateTime = gameItem.gameDateTime;//6月13日 3:00

                        if(team1Code === 'daiding') { // 如果球队待定
                            //team1 = Config.eighth[j][0];
                            //team2 = Config.eighth[j][1];
                            //goals = '';
                        }else { // 如果球队存在
                            team1 = gameItem.team1;
                            team2 = gameItem.team2;
                            if(!!team1Goal){ // 如果比分存在
                                goals = gameItem.team1_goals + '-' + gameItem.team2_goals;
                                if(!!tema1Penal) { 
                                    // 如果点球分数存在:(4-2点)
                                    goals += '('+gameItem.team1_penalties +'-'+gameItem.team2_penalties+'点)';
                                }
                            }
                        }
                        var gameTime = gameDateTime.split(' ');
                        var time1 = gameTime[0].split('-');
                        var time2 = gameTime[1].split(':');
                        var gameData = {
                            'team1': team1,
                            'team2': team2,
                            'time':  parseInt(time1[1]) + '月' + parseInt(time1[2]) + '日&nbsp;' + parseInt(time2[0]) + ':' + time2[1],
                            'goals': goals
                        };
                        gameArr.push(gameData);
                    }
                }
            }
            return gameArr;
        },

        /**
         * 绑定球队维度鼠标事件
         * @param   name 父级class
         */
        bindTeamEvent: function(name) {
            $(name).delegate('ul li', 'mouseover', function() {
                var code = this.id,
                    data = Fn.getSelectedByTeam(code),
                    team = data.selectedTeam,
                    time = data.selectedDate;

                var i = 0,
                    j = 0,
                    len = team.length,
                    timeLen = time.length;

                // 鼠标悬浮关联球队选中状态
                $('ul li').removeClass('current');
                $(this).addClass('current');
                for (; i < len; i++) {
                    $('#' + team[i]).addClass('current');
                }

                // 鼠标悬浮关联时间选中状态
                for (; j < timeLen; j++) {
                    $('#li' + time[j]).addClass('current');
                }
                $('.box_logo').hide();
                $('.box_vs_pr').css('top', '0px');
                Fn.setHeader(data.teamName);
                Fn.setListByTeam(code); //球队列表
            });
        },

        rollList: function($el, dx, maxTop) {
            var $jspPane = $el.parents('.jspVerticalBar').siblings('.jspPane');
            var gap = parseInt($jspPane.parent().height() - $jspPane.height());
            $jspPane.css('top', gap * dx / maxTop);
        },

        /**
         * 根据球队编号获取选中的球队和日期
         * @param code 球队编号
         */
        getSelectedByTeam: function(code) {
            var teamInfo = Config.teamInfo;
            var i = 0,
                len = teamInfo.length,
                selectedTeam = [],
                selectedDate = [],
                teamName = '',
                gameList;
            for (; i < len; i++) {
                if (code === teamInfo[i].teamCode) {
                    teamName = teamInfo[i].teamName;
                    gameList = teamInfo[i].gameList;

                    var j = 0,
                        gameLen = gameList.length;
                    for (; j < gameLen; j++) {
                        var gameItem = gameList[j];
                        var teamCode1 = gameItem.team1_code;
                        var teamCode2 = gameItem.team2_code;

                        var gameTime = (gameItem.gameDateTime).split(' ')[0].split('-');
                        var time = gameTime[1] + gameTime[2];
                        if (teamCode1 !== code) {
                            selectedTeam.push(teamCode1);
                        }
                        if (teamCode2 !== code) {
                            selectedTeam.push(teamCode2);
                        }
                        selectedDate.push(time);
                    }
                }
            }
            return {
                'teamName': teamName,
                'selectedTeam': selectedTeam,
                'selectedDate': this.unique(selectedDate),
                'gameList': gameList
            };
        },

        /**
         * 根据日期获取选中球队
         * @param  date 鼠标悬浮日期(日期格式：0601)
         */
        getSelectedByDate: function(date, hasDate) {

            var timeInfo = Config.timeInfo;
            var i = 0,
                len = timeInfo.length,
                selectedTeam = [],
                selectedInfo = [];

            for (; i < len; i++) {
                if (('2014' + date) == timeInfo[i].gameTime.replace(/-/g, '')) {
                    var gameList = timeInfo[i].gameList;
                    var j = 0,
                        gameLen = gameList.length;
                    for (; j < gameLen; j++) {
                        var gameItem = gameList[j];
                        selectedTeam.push(gameItem.team1_code);
                        selectedTeam.push(gameItem.team2_code);
                        var gameObj = {
                            'team1': gameItem.team1,
                            'team2': gameItem.team2,
                            'time': gameItem.gameDateTime
                        };
                        selectedInfo.push(gameObj);
                    }
                }
            }
            return hasDate ? selectedInfo : this.unique(selectedTeam);
        },

        /**
         * 根据赛事id获取两支队伍上场球员
         * @param  id 赛事id
         */
        getActivePlayers: function(id) {
            var mainCode = $('#game' + id + ' .box03_l span').attr('class');
            var mainTeam = [],
                visitTeam = [];
            var detailInfo = Config.detailInfo;
            var i = 0,
                len = detailInfo.length;
            for (; i < len; i++) {
                var item = detailInfo[i];
                if (parseInt(item.gameId) === id) {
                    var players = item.playerList;
                    var j = 0,
                        pLen = players.length;
                    for (; j < pLen; j++) {
                        var playerItem = players[j];
                        var teamCode = playerItem.teamCode;
                        var card = (parseInt(playerItem.redCard) > 0) ? 'red' : ((!!playerItem.yellowCard) ? 'yel' : '');
                        var playerInfo = {
                            'num': playerItem.num, // 球员号码
                            'name': playerItem.playerName,
                            'goals': (!!playerItem.goals) ? parseInt(playerItem.goals) : 0,
                            'card': card
                        };
                        if (teamCode === mainCode) {
                            mainTeam.push(playerInfo);
                        } else {
                            visitTeam.push(playerInfo);
                        }
                    }
                    break;
                }
            }
            return {
                'mainTeam': mainTeam,
                'visitTeam': visitTeam
            };
        },

        setListByDate: function(d) {
            $('.box_vs_pr').html('');
            //var gameDate = d.match(/\d+/g)[0];
            var timeInfo = Config.timeInfo;
            var j = 0,
                jLen = timeInfo.length,
                gameList = [];
            for (; j < jLen; j++) {
                if (timeInfo[j].gameTime === ('2014-' + d.substring(0, 2) + '-' + d.substring(2, 4))) {
                    gameList = timeInfo[j].gameList;
                }
            }
            //var gameList = this.getSelectedByDate(gameDate);
            var i = 0,
                len = gameList.length;
            for (; i < len; i++) {
                var item = gameList[i];
                var gameTime = (item.gameDateTime).match(/\d+/g);
                var gameId = parseInt(item.id);
                var data = {
                    'gameId': 'game' + gameId, // 赛事id
                    'gameLevel': item.gameLevel,
                    'dayTime': parseInt(gameTime[1]) + '月' + parseInt(gameTime[2]) + '日',
                    'detailTime': gameTime[3] + ':' + gameTime[4],
                    'area': item.gameArea,
                    'mainCode': item.team1_code,
                    'visitCode': item.team2_code,
                    'mainTeam': item.team1,
                    'visitTeam': item.team2,
                    'mainGoal': item.team1_goals,
                    'visitGoal': item.team2_goals,
                    'mainFlag': this.getTeamInfo(item.team1_code).teamFlag,
                    'visitFlag': this.getTeamInfo(item.team2_code).teamFlag,
                    'hasActive': !item.team1_goals ? 0 : 1

                };
                var listHtml = this.getListHtml(data);
                $('.box_vs_pr').append(listHtml);
                //$('#game' + gameId).append(this.getGameDetail(gameId));
            }
        },

        /**
         * 赛事列表
         */
        setListByTeam: function(code) {
            $('.box_vs_pr').html('');
            var gameList = this.getSelectedByTeam(code).gameList;
            var i = 0,
                len = gameList.length;

            for (; i < len; i++) {
                var item = gameList[i];
                var gameId = parseInt(item.id);
                var gameTime = (item.gameDateTime).match(/\d+/g);
                //"gameDateTime": "2014-06-15 16:29:39",
                //var dayTime = parseInt(gameTime[1]) + '月' + parseInt(gameTime[2]) + '日';
                //var detailTime = gameTime[3] + ':' + gameTime[4];
                var visitCode = (item.team1_code === code) ? item.team2_code : item.team1_code;
                var mainTeam = this.getTeamInfo(code); // 主队球队信息
                var visitTeam = this.getTeamInfo(visitCode); // 模拟客队球队信息

                var data = {
                    'gameId': 'game' + gameId, // 赛事id
                    'gameLevel': item.gameLevel,
                    'dayTime': parseInt(gameTime[1]) + '月' + parseInt(gameTime[2]) + '日',
                    'detailTime': gameTime[3] + ':' + gameTime[4],
                    'area': item.gameArea,
                    'mainCode': code,
                    'visitCode': visitCode,
                    'mainTeam': mainTeam.teamName,
                    'visitTeam': visitTeam.teamName,
                    'mainGoal': (item.team1_code === code) ? item.team1_goals : item.team2_goals,
                    'visitGoal': (item.team1_code === code) ? item.team2_goals : item.team1_goals,
                    'mainFlag': mainTeam.teamFlag,
                    'visitFlag': visitTeam.teamFlag,
                    'hasActive': !item.team1_goals ? 0 : 1

                };
                var listHtml = this.getListHtml(data);
                $('.box_vs_pr').append(listHtml);
                //$('#game' + gameId).append(this.getGameDetail(gameId));
            }
        },

        /**
         * 模拟主队客队数据
         * @param   code 队伍code
         * @param   item 赛事数据
         */
        getTeamInfo: function(code) {
            var i = 0,
                teamInfo = Config.teamInfo,
                len = teamInfo.length;
            for (; i < len; i++) {
                var item = teamInfo[i];
                if (item.teamCode === code) {
                    return {
                        'teamName': item.teamName,
                        'teamFlag': item.teamFlag
                    };
                }
            }
        },

        /**
         * 获取赛事列表(不包含详情)
         * @param  data 赛事信息
         */
        getListHtml: function(data) {
            var goals = (!!data.hasActive) ? '<span class="s03">' + data.mainGoal + '</span><span class="s04">' + data.visitGoal + '</span>' : '<div class="box03_m bg_vs"></div>';
            return '<div class="box_vs" id="' + data.gameId + '">' +
                '<div class="box_tit">' +
                '<div class="box02_l"><p>' + data.gameLevel + '</p></div>' +
                '<div class="box02_m"><p><span class="s01">' + data.dayTime + '</span><span class="s02">' + data.detailTime + '</span></p></div>' +
                '<div class="box02_r"><p>' + data.area + '</p></div>' +
                '</div>' +
                '<div class="box_tit02"><div class="box03_l">' +
                '<span class="' + data.mainCode + '"></span><em>' + data.mainTeam + '</em></div><div class="box03_m">' + goals + '</div><div class="box03_r">' +
                '<span class="' + data.visitCode + '"></span><em>' + data.visitTeam + '</em></div></div></div>';
        },


        getPlayerDl: function(players, side) {
            var i = 0,
                len = players.length,
                str = '';
            for (; i < len; i++) {
                var player = players[i];
                var card = player.card === '' ? '-' : '<img src="http://y1.ifengimg.com/a/2014/0410/worldCup/' + player.card + '.jpg"/>';
                var tempStr = (side == 'left') ? ('<dt>' + player.num + '</dt><dd class="dd01">' + player.name + '</dd>' + '<dd class="dd02">' + player.goals + '</dd><dd class="dd03">' + card + '</dd>') : ('<dd class="dd03"><img src="http://y1.ifengimg.com/a/2014/0410/worldCup/red.jpg"/></dd><dd class="dd02">' + player.goals + '</dd><dd class="dd01">' + player.name + '</dd>' + '<dt>' + player.num + '</dt>');
                str += '<dl class="dl01">' + tempStr + '</dl>';
            }
            return str;

        },

        getDetailHtml: function(players, side) {
            var boxClass = side === 'left' ? 'box_holder' : 'box_holder02';
            var detailHeader = '<div class="' + boxClass + '">' +
                '<div id="pane2" class="scroll-pane jspScrollable" tabindex="0" style="overflow: hidden; padding: 0px; outline: none; width: 219px;">' +
                '<div class="jspContainer" style="width: 219px; height: 170px;"><div class="bg_y"></div>' +
                '<div class="jspPane" style="padding: 0px; top: 0px; width: 219px;">';
            var detailScroll = '</div><div class="jspVerticalBar" style=" ' + side + ':1px;"><div class="jspCap jspCapTop">' + '</div><a class="jspArrow jspArrowUp jspDisabled" style=""></a>' +
                '<div class="jspTrack" style="height: 154px;"><div class="jspDrag" style="height: 50px; top: 0px;">' +
                '<div class="jspDragTop"></div><div class="jspDragBottom"></div></div></div>' +
                '<a class="jspArrow jspArrowDown" style=""></a>' +
                '<div class="jspCap jspCapBottom"></div></div></div></div></div>';
            return detailHeader + this.getPlayerDl(players, side) + detailScroll;
        },


        /**
         * 组装赛事详情列表
         * @param   gameId 赛事id
         */
        getGameDetail: function(gameId) {
            var teams = this.getActivePlayers(gameId);
            var detailList = this.getDetailHtml(teams.mainTeam, 'left') + this.getDetailHtml(teams.visitTeam, 'right');
            var detailHeader = '<div class="box_cont">' +
                '<div class="box_tit03"><ul><li class="n01">号码</li><li class="n02">姓名</li>' +
                '<li class="n03">进球</li><li class="n04">红黄</li><li class="n05">红黄</li>' +
                '<li class="n06">进球</li><li class="n07">姓名</li><li class="n08">号码</li></ul></div>';

            return detailHeader + detailList + '</div>';
        },

        /**
         * 头部信息
         */
        setHeader: function(str) {
            $('.tit01').text(str);
        },

        shared: function(a) {
            var b = {};
            b.type = a;
            b.pic = 'http://y0.ifengimg.com/2014/05/06/16295828.jpg';
            b.title = '2014巴西世界杯交互赛程_凤凰体育';
            b.url = window.location.href;
            var c = '';
            b.title = '【' + encodeURIComponent(b.title) + '】';
            var d = {};

            if ('sina' === b.type) {
                c = 'http://v.t.sina.com.cn/share/share.php';
                d.url = b.url;
                d.title = b.title;
                d.pic = b.pic;
                d.searchPic = !1;
                //d.appkey = '2512457640';d.ralateUid = '2615417307';
                d.appkey = '2512457640';
                d.ralateUid = '2294251280';
                d.rcontent = encodeURIComponent('');
                d.source = 'ifeng';
            } else if ('qq' === b.type) {
                c = 'http://v.t.qq.com/share/share.php';
                d.url = b.url;
                d.title = b.title;
                d.pic = b.pic;
                d.site = encodeURIComponent(window.location.host);
                d.appkey = '801cf76d3cfc44ada52ec13114e84a96';
                d.rcontent = encodeURIComponent('');
            } else if ('qqZone' === b.type) {
                c = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey';
                d.title = b.title;
                d.url = b.url;
                d.pics = b.pic;
            }

            var e = [];

            var f = new Date();
            f.setHours(0), f.setMinutes(0), f.setSeconds(0), f.setMilliseconds(0), d.url += '?tp=' + f.getTime() + '&_share_' + b.type;

            for (var g in d) {
                e.push(g + '=' + d[g]);
            }
            c += '?' + e.join('&');
            var h = 600,
                i = 450,
                j = (window.screen.availHeight - 30 - i) / 2,
                k = (window.screen.availWidth - 10 - h) / 2,
                l = 'scrollbars=no,width=' + h + ',height=' + i + ',left=' + k + ',top=' + j + ',status=no,resizable=yes';
            window.open(c, '_blank', l);
        }



    };

    Fn.init();
})(window, document, jQuery);