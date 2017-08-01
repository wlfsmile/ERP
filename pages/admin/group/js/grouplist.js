/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun, Mars Wong
 * Date: 15-3-18
 * Time: 上午9:57
 */

window.onload = function () {
  var grouplist = {
    $table: $('#table'),

    init: function () {
      this.renderPage();
      this.bindEvent();
      this.search();
    },

    bindEvent: function () {
      var _this = this;

      this.$table.on('click', '.j_toggle', function () {
        // 是否显示分组成员
        _this.toggleSub($(this));
      });

      this.$table.on('click', '.delete', function (e) {
        // 删除分组
        e.preventDefault();
        _this.deleteItems($(this));
      });

      this.$table.on('click', '.add-history', function (e) {
        // 保存为历史数据
        e.preventDefault();
        _this.addHistory($(this));
      });

      this.$table.on('click','.contribute',function(e){
        //确认贡献度
        e.preventDefault();
        _this.contribute($(this));
      })

      this.$table.on('click','.proportion',function(e){
        //成绩比例设置
        e.preventDefault();
        _this.proportion($(this));
      })

      // 结束经营
      this.$table.on('click', '.gameover', function (e) {
        e.preventDefault();

        var the = $(this);

        DIALOG.confirm('是否结束该组经营？', function () {
          var userUnique = the.closest('tr').attr('data-mark');
          var groupName = the.closest('.sub-tr').attr('data-name');

          $.post('gameGroupManagerAction!endPlayGame.action?rnd=' + Math.random(), {
            userUnique: userUnique,
            groupName: groupName
          }, function (res) {
            if (res.code === 1) {
              TIP('经营结束成功！', 'success', 2000);
              the.parent().html('已结束');
            } else {
              TIP('经营结束失败！', 'error', 2000);
            }
          }, 'json');
        });
      });


      // 结束订单选择
      this.$table.on('click', '.chooseorder-end', function (e) {
        e.preventDefault();
        var the = $(this);
        var userUnique = the.closest('tr').attr('data-mark');
        var data = {
          userUnique: userUnique
        };
        DIALOG.confirm('是否结束该组订单选择', function () {
          $.post('gameGroupManagerAction!endChooseOrder.action?rnd=' + Math.random(), data, function (res) {
            if (res.code == 0) {
              TIP('结束订单选择成功！', 'success', 2000);
              the.parent().html('已完成订单选择');
            } else {
              TIP('结束订单选择失败！', 'error', 2000);
            }
          }, 'json');
        });
      });

      // 结束投广告
      this.$table.on('click', '.adver-end', function (e) {
        e.preventDefault();
        var the = $(this);
        var userUnique = the.closest('tr').attr('data-mark');
        var data = {
          userUnique: userUnique
        };
        DIALOG.confirm('是否结束该组广告投放', function () {
          $.post('gameGroupManagerAction!endAdvertising.action?rnd=' + Math.random(), data, function (res) {//
            if (res.code == 0) {
              TIP('结束广告投放成功！', 'success', 2000);
              the.parent().html('广告已结束');
            } else {
              TIP('结束广告投放失败！', 'error', 2000);
            }
          }, 'json');
        });
      });

      // 推进下一周期
      this.$table.on('click', '.next-period', function (e) {
        e.preventDefault();
        var the = $(this);
        var userUnique = the.closest('tr').attr('data-mark');
        var data = {
          userUnique: userUnique
        };
        DIALOG.confirm('是否推进下一周期', function () {
          $.post('gameGroupManagerAction!ForwarPeriod.action?rnd=' + Math.random(), data, function (res) { //
            if (res.code == 1) {
              TIP('推进下一周期成功！', 'success', 2000);
                    /* var tr = the.parent();
                    var current = parseInt(tr.attr('data-curyear')) + 1;
                    var per = parseInt(tr.attr('data-peryear'));
                    var year = parseInt(tr.attr('data-year'));
                    var p = current % per ;
                    var time = '';
                    if(p>0){
                        time += '当前：第'+ (parseInt(current/per)+1) +"年" + " 第"+ p +"期 ";
                    }else{
                        time += '当前：第'+ parseInt(current/per) +"年" + " 第"+ per +"期 ";
                    }
                    if(current < per*year){
                        time += '<a href="#" class="next-period">推进下一周期</a>';
                    }
                    tr.attr('data-curyear',current);
                    tr.html(time);*/
              var tr = the.closest('tr').parent().parent().parent().parent();
              var groupName = tr.attr('data-name');
              _this.setSubTable(groupName, tr);
            } else if (res.code == 2) {
              TIP('推进下一周期失败！是年初但未完成广告费投放和订单选取确认 ', 'error', 2000);
            } else if (res.code == 0) {
              TIP('推进下一周期失败！用户已经破产  ', 'error', 2000);
            } else {
              TIP('推进下一周期失败！游戏已经结束 ', 'error', 2000);
            }
          }, 'json');
        });
      });
    },
    renderPage: function () {
      this.table = new Table({
        table: this.$table,
        tableArea: $('#table-area'),
        showIndex: true,
        pageSize: 10,
        showIndexContent: '编号'
      });
      this.extendFun();
      this.table.loadData('gameGroupManagerAction!showGameGroups.action?rnd=' + Math.random(), 'GameGroups');
    },
    extendFun: function () {
      $.extend(true, Table.prototype, {
        setTableData: function () {// 设置setTableData函数
          var _this = this;
          var option = this.option;
          var res = option.res;
          var curr = option.currPage;
          option.table.find('tr:has(td)').remove();
          for (var i = curr * option.pageSize; i < res.length && i < option.pageSize + curr * option.pageSize; i++) {
            var trdata = res[i];
            var tr1 = '<tr id=\'' + trdata.groupName + '\' data-name = \'' + trdata.groupName + '\'>';
            var tr2 = $('<tr class=\'sub-tr hide\'  data-name = \'' + trdata.groupName + '\'><td colspan=' + $('#table>tbody>tr>th').length + '>' +
                      '<span class=\'icon-spin5 animate-spin\'></span>加载中...</td></tr>');
            tr1 += '<td>' +
                      '<span class="icon-plus-squared j_toggle"></span>' +
                      '</td>';
            tr1 += '<td class="groupname">' + trdata.groupName + '</td>' +
                   '<td>' + trdata.groupCreaterId + '</td>' +
                   '<td>' + trdata.userNumbers + '</td>' +
                   '<td>' + trdata.years + '</td>' +
                   /*'<td>' + trdata.periodsOfOneYear + '</td>' +*/
                   '<td>' + trdata.currentPeriod + '</td>' +
                   '<td>'+
                      '<a href="#" class="contribute">学生贡献度确认</a></br>'+
                      '<a href="#" class="proportion">成绩比例设置</a>'+
                    '</td>'+
                    '<td>' +
                      '<a href="#" class="delete"><span class="icon-trash-empty"></span>删除</a>' +
                      '<a href="#" class="add-history"><span class="icon-history"></span>保存数据</a>' +
                    '</td>'+
                    '</tr>';
            option.table.append(tr1);
            option.table.append(tr2);
          }

          _this.setPage();
        }
      });
    },
    extendFunSearch: function (txt, boo) {
      var _this = this;
      var filterArr = [];
      $.extend(true, Table.prototype, {
        setTableData: function () {
          var _this = this;
          var option = this.option;
          var curr = option.currPage;
          option.search = false || boo;
          if (option.search) {
            for (var i = 0, item; item = option.res[i++];) {
                if (item.groupName.toLowerCase().indexOf(txt) != -1) {
                    filterArr.push(item);
                  }
                this.option.searchVal = filterArr;
                curr = 0;
                boo = false;
              }
          }
          var res = this.option.searchVal;
          this.option.totalSize = res.length;

          option.table.find('tr:has(td)').remove();
          for (var i = curr * option.pageSize; i < res.length && i < option.pageSize + curr * option.pageSize; i++) {
            var trdata = res[i];
            var tr1 = '<tr id=\'' + trdata.groupName + '\' data-name = \'' + trdata.groupName + '\'>';
            var tr2 = $('<tr class=\'sub-tr hide\'  data-name = \'' + trdata.groupName + '\'><td colspan=' + $('#table>tbody>tr>th').length + '>' +
                          '<span class=\'icon-spin5 animate-spin\'></span>加载中...</td></tr>');
            tr1 += '<td>' +
                          '<span class="icon-plus-squared j_toggle"></span>' +
                          '</td>';
            tr1 += '<td class="groupname">' + trdata.groupName + '</td>' +
                       '<td>' + trdata.groupCreaterId + '</td>' +
                       '<td>' + trdata.userNumbers + '</td>' +
                       '<td>' + trdata.years + '</td>' +
                       /*'<td>' + trdata.periodsOfOneYear + '</td>' +*/
                       '<td>' + trdata.currentPeriod + '</td>' +
                          '<td>'+
                            '<a href="#" class="contribute">学生贡献度确认</a></br>'+
                            '<a href="#" class="proportion">成绩比例设置</a>'+
                          '</td>'+
                          '<td>' +
                            '<a href="#" class="delete"><span class="icon-trash-empty"></span>删除</a>' +
                            '<a href="#" class="add-history"><span class="icon-history"></span>保存数据</a>' +
                          '</td>'+
                          '</tr>';
            option.table.append(tr1);
            option.table.append(tr2);
          }
          _this.setPage();
        }
      });
    },
    search: function (res) {
      var _this = this;
      $('#search_group').change(function () {
        var txt = $.trim($(this).val()).toLowerCase();
        if ( txt != '') {
          var boo = true;
          _this.extendFunSearch(txt, boo);
          _this.table.loadData('gameGroupManagerAction!showGameGroups.action?rnd=' + Math.random(), 'GameGroups');
        } else {
          _this.extendFun();
          _this.table.loadData('gameGroupManagerAction!showGameGroups.action?rnd=' + Math.random(), 'GameGroups');
        }
      }).keyup(function () {
        $(this).change();
      });
    },
    toggleSub: function (the) {
      var tr = the.closest('tr').next('tr');
      var groupName = the.closest('tr').attr('data-name');
      if (tr.hasClass('sub-tr')) {
        if (tr.hasClass('hide')) {
          this.setSubTable(groupName, tr);
          tr.fadeIn(300, function () {
            tr.removeClass('hide');
          });

          the.removeClass('icon-plus-squared').addClass('icon-minus-squared');
        } else {
          tr.fadeOut(300, function () {
            tr.addClass('hide');
            tr.find('>td').html('<span class=\'icon-spin5 animate-spin\'></span>加载中...');
          });

          the.removeClass('icon-minus-squared').addClass('icon-plus-squared');
        }
      }
    },

    setSubTable: function (groupName, tr) {
      $.post('gameGroupManagerAction!findGameGroupMemberStatusByGroupName.action?rnd=' + Math.random(), { groupName: groupName }, function (res) {//
        if (res.code == 0) {
          var items = res.GameGroupMemberStatuss;
          if (items) {
            var table = '<table>' +
                    '<tr>' +
                    '<th>标识符</th>' +
                    '<th>时间</th>' +
                    '<th>游戏状态</th>' +
                    '<th>广告状态</th>' +
                    '<th>订单状态</th>' +
                    '</tr>';

            $(items).each(function (index) {
              var tr = items[index];

                    // 时间
              var time = '';
              var currentYear;
              var currentPeriod;

              if (tr.currentPeriod == 0) {
                time += '准备中';
              } else {
                currentYear = Math.ceil(tr.currentPeriod / tr.periodsOfOneYear);
                currentPeriod = tr.currentPeriod % tr.periodsOfOneYear;

                if (currentPeriod == 0) {
                  currentPeriod = tr.periodsOfOneYear;
                }

                time += '当前：第 ' + currentYear + ' 年第 ' + currentPeriod + ' 期';

                if (tr.currentPeriod < tr.periodsOfOneYear * tr.year && tr.status == 1) {
                  time += '<a href="#" class="next-period">推进下一周期</a>';
                }
              }

                    // 游戏状态
              var status = '';

              if (tr.status == 0) {
                status = '已破产 / 已结束';
              } else if (tr.status == 1) {
                status = '进行中/ <a href=\'#\' class=\'gameover\'>结束经营</a>';
              } else if (tr.status == 10) {
                    status = '未开始';
                  } else {
                    status = '已结束';
                  }

                    // 广告状态
              var advertisText;

              if (tr.finishAdFlag == 1) {
                advertisText = '广告已投放';
              } else if (tr.finishAdFlag == 0) {
                advertisText = '广告投放中 <a href=\'#\' class=\'adver-end\'>结束投放</a>';
              } else {
                advertisText = '未投放';
              }

                    // 订单状态
              var orderText;

              if (tr.finishOrderFlag == 1) {
                orderText = '已完成订单选择';
              } else if (tr.finishOrderFlag == 0 && tr.chooseOrderFlag == 1) {
                orderText = '订单选择中 <a href=\'#\' class=\'chooseorder-end\'>结束选择</a>';
              } else {
                orderText = '无法选单';
              }

              var opt;
              table += '<tr data-mark="' + tr.userUnique + '">' +
                    '<td>' + tr.userName + '</td>' +
                        '<td data-curyear="' + tr.currentPeriod + '" data-year="' + tr.year + '" data-peryear="' + tr.periodsOfOneYear + '">' +
                             time + '</td>' +
                        '<td>' + status + '</td>' +
                        '<td>' + advertisText + '</td>' +
                        '<td>' + orderText + '</td>' +
                        '</tr>';
            });

            table += '</table>';
            tr.find('>td').html(table);
          }
        }
      }, 'json');
    },

    addHistory: function (the) {
      var _this = this;
      var tr = the.closest('tr');
      var groupName = tr.attr('data-name');
      var groupname = tr.find('.groupname').text();
      var data = {
        groupName: groupName
      };
      DIALOG.confirm('确定将分组<b>' + groupname + '</b>的所有数据转存到历史数据中吗？', function () {
        $.post('gameGroupManagerAction!changeToHistory.action?rnd=' + Math.random(), data, function (res) {// /GameGroupManagerAction!deteleGameGroup.action
          if (res.code == 0) {
            TIP('添加成功！', 'success', 2000);
            _this.table.loadData('gameGroupManagerAction!showGameGroups.action?rnd=' + Math.random(), 'GameGroups');// /GameGroupManagerAction!showGameGroups.action
          } else {
            TIP('添加失败！(可能该游戏组中还存在正在进行游戏的小组)', 'error', 2000);
          }
        }, 'json');
      });
    },

    deleteItems: function (the) {// 删除
      var _this = this;
      var tr = the.closest('tr');
      var groupName = tr.attr('data-name');
      var groupname = tr.find('.groupname').text();
      var data = {
        groupName: groupName
      };
      DIALOG.confirm('确定删除游戏组' + groupname + '删除后将结束游戏！', function () {
        $.post('gameGroupManagerAction!deteleGameGroup.action?rnd=' + Math.random(), data, function (res) {
          if (res.code == 0) {
            TIP('删除成功！', 'success', 2000);
            _this.table.loadData('gameGroupManagerAction!showGameGroups.action?rnd=' + Math.random(), 'GameGroups');
          } else {
            TIP('删除失败(游戏组中还有小组正在游戏中)！', 'error', 2000);
          }
        }, 'json');
      });

    },

    contribute:function(the){ //确认学生贡献度
      var _this = this;
      var tr = the.closest('tr');
      var groupName = tr.attr('data-name');
      var groupname = tr.find('.groupname').text();
      var data = {
        groupName: groupName
      };
      $.post('http://rapapi.org/mockjsdata/22245/contribute',data,function(res){
        var contributeStr = '';
        var len = res.table.length;
        var resData = res.table;
        if(res.code == 1){
          for(var i=0;i<len;i++){
            contributeStr +=  '<tr>'+
                                '<td>'+resData[i].name+'</td>'+
                                '<td>'+resData[i].post+'</td>'+
                                '<td>'+resData[i].studentNo+'</td>'+
                                '<td>'+resData[i].studentName+'</td>'+
                                '<td><input type="text" class="table-contribute" value="'+resData[i].contribute+'" /></td>'+
                              '</tr>';
          }
          var tableStr ='<div>'+ 
                          '<table border="1" cellspacing="0" cellpadding="0" class="box-table" >'+
                            '<tr>'+
                              '<td>企业名称</td>'+
                              '<td>职务</td>'+
                              '<td>学号</td>'+
                              '<td>姓名</td>'+
                              '<td class="table-td-contribute">贡献度</td>'+
                            '</tr>'+
                            contributeStr+
                          '</table>'+
                        '</div>';
          //$('#box').append(tableStr);
          //如果未确认，有取消和确定按钮
          if(res.confirm == 0){
            DIALOG.confirm(tableStr,function(){
              console.log(22);
            });
            /*var buttonStr = '<button class="sure-contribute box-btn">确定</button>'+
                            '<button class="cancel-contribute box-btn">取消</button>';*/
            //$('.box-table').append(buttonStr);
          }else{  //否则不可改贡献度
            DIALOG.confirm0(tableStr);
            $('.table-contribute').attr('disabled',true);
          }
        }
      })
    },

    proportion : function(the){ //成绩比例设置
      var _this = this;
      var tr = the.closest('tr');
      var groupName = tr.attr('data-name');
      var groupname = tr.find('.groupname').text();
      var data = {
        groupName: groupName
      };
      $.post('http://rapapi.org/mockjsdata/22245/proportion',data,function(res){
        var resData = res.gameData;
        var propStr = '<div class="clearfix">'+
                        '<div class="gameInfo">'+
                          '<p>比赛名称：<input type="text" name="groupName" readonly="disable" value="'+resData.groupName+'" /></p>'+
                          '<p>企业数量：<input type="text" name="userNumbers" readonly="disable" value="'+resData.userNumbers+'" /></p>'+
                          '<p>比赛持续年数：<input type="text" name="years" readonly="disable" value="'+resData.years+'" /></p>'+
                          '<p>每年包含周期数：<input type="text" name="periodsOfOneYear" readonly="disable" value="'+resData.periods+'" /></p>'+
                        '</div>'+
                        '<div class="setProp">'+
                          '<form>'+
                            '<label>成绩比例设置</label>'+
                            '<p>优：<input type="text" name="excellent" value="'+resData.excellent+'" /></p>'+
                            '<p>良：<input type="text" name="fine" value="'+resData.fine+'" /></p>'+
                            '<p>中：<input type="text" name="middle" value="'+resData.middle+'" /></p>'+
                            '<p>及格：<input type="text" name="pass" value="'+resData.pass+'" /></p>'+
                            '<p>不及格：<input type="text" name="fail" value="'+resData.fail+'" /></p>'+
                          '</form>'+
                        '</div>'+
                      '</div>';
        DIALOG.confirm(propStr,function(){

        })
      })
    }

  };

  grouplist.init();
};