// Load the production line data
function Line(data, target, lines, index, i, num) {
  for (var j = 0; j < lines[i].productLineType.length; j++) {
    num += lines[i].productLineType.charCodeAt(j);
  }
  // Calculate the production line picture
  $(target).find('.lineType img').attr('src', '../../images/factory/' + num + '.jpg');
  // Production line type
  $(target).find('.lineType span').text(lines[i].productLineType);

  // Production line status
  var status = +lines[i].status;
  var str = '';

  if (status === 0 || status === 1) {
    // The production line has completed the installation cycle
    $(target).find('.finishedPeriod').html('Completed cycle：<span>' + lines[i].finishPeriod + '</span>');
    $(target).find('.workingPro').html('Will produce the product：<span>' + lines[i].productName + '</span>');
    if (status === 0) {
      str = 'Installing';
      $(target).find('.lineStatus span').text(str);
    } else {
      str = 'Pause the installation';
      $(target).find('.lineStatus span').text(str);
    }
  } else if (status === 2 || status === 3 || status === 4) {
    // The product has a production cycle
    $(target).find('.finishedPeriod').html('Production cycle：<span>' + lines[i].productFinishPeriod + '</span>');

    if (status === 2) {
      str = 'Is producing';
      $(target).find('.lineStatus span').text(str);

      // Is producing products
      $(target).find('.workingPro').html(str + 'product：<span>' + lines[i].productName + '</span>');
    } else if (status === 3) {
      str = 'stop production';
      $(target).find('.lineStatus span').text(str);

      // Is producing products
      $(target).find('.workingPro').html(str + 'product：<span>' + lines[i].productName + '</span>');
    } else if (status === 4) {
      str = 'To be produced';
      $(target).find('.lineStatus span').text(str);

      // product
      $(target).find('.workingPro').html(str + 'product：<span>' + lines[i].productName + '</span>');

      //Can click on conversion
      $(target).find('input[name="changePro"]').css('cursor', 'pointer').removeAttr('disabled');

      // This state can be sold
      $(target).find('input[name="sell"]').css('cursor', 'pointer').removeAttr('disabled');
    }
  } else if (status === 5 || status === 6) {
    // Production line has been completed conversion cycle
    $(target).find('.finishedPeriod').html('Has been transferred to the cycle：<span>' + lines[i].finishPeriod + '</span>');

    if (status === 5) {
      str = 'Is converting';
      $(target).find('.lineStatus span').text(str);

      // product
      $(target).find('.workingPro').html(str + 'product：<span>' + lines[i].productName + '</span>');
    } else {
      str = 'Suspension of conversion';
      $(target).find('.lineStatus span').text(str);

      // product
      $(target).find('.workingPro').html(str + 'product：<span>' + lines[i].productName + '</span>');
    }
  } else return;

  //Store the production line number
  $(target).find('input[name=\'hidden\']').val(lines[i].productLineId);
  //Save the production line status
  $(target).find('input[name=\'hiddenStatus\']').val(lines[i].status);
}

// Load all plant data
function update(url, oData, backUp1, backUp3) {
  $.post(url, oData, function (data) {
    var obj = data;
    // All plant first empty after loading
    $('.workshop').empty();

    var factoryMadeNum = 0;
    var factoryRentNum = 0;
    // var factoryMakingNum=data.factoryMaking.length;
    // Load the built plant
    if (data.factoryMade) {
      factoryMadeNum = data.factoryMade.length;
      $(data.factoryMade).each(function (index) {
        $(backUp1).clone(true).appendTo('.workshop');

        var tar = $('.workshop dl').eq(index);
        var factoryEach = data.factoryMade[index];
        $(tar).find('.shop').attr('src', '../../images/factory/made.jpg');
        // status
        $(tar).find('.status span').text(factoryEach.status);
        //Plant number
        $(tar).find('.workshop_id span').text(factoryEach.factoryId);
        // Where the market
        $(tar).find('.market_area span').text(factoryEach.place);
        //Plant type
        $(tar).find('.workshop_type span').text(factoryEach.factoryType);
        // Residual value
        $(tar).find('.restvalue span').text(factoryEach.sellPrice);
        // opening hour
        $(tar).find('.buildtime span').text(factoryEach.beginTime);
        // Completion Time
        $(tar).find('.finished').text(factoryEach.finishTime);
        // Production line existing quantity
        $(tar).find('.currentLine').text(factoryEach.productLineNumber);
        // Can accommodate the production line
        $(tar).find('.totalLine').text(factoryEach.capacity);

        var backUpLine = $(tar).find('#hiddenLine').clone(true).removeAttr('id');
        $('#hiddenLine').remove();
        // The production line is backed up, cleared, and then re-created
        $(tar).find('dd').remove();

        // Load the production line data
        if (factoryEach.productLines) {
          var num = 0;
          var lines = factoryEach.productLines;

          for (var i = 0; i < lines.length; i++) {
            $(backUpLine).clone(true).appendTo(tar);

            var target = $(tar).find('dd:eq(' + i + ')');

            $('input[name=\'sell\']').css('cursor', 'auto');
            $('input[name=\'changePro\']').css('cursor', 'auto');

            //Read data according to the status of the production line
            Line(obj, target, lines, index, i, num);
            num = 0;
          }
        }

        var productLines = $(tar).children('dd'); //Get all production lines

        for (i = 0; i < productLines.length; i++) {
          var lineStatus = $(productLines[i]).children().eq(1).children().html();
          var lineCycle = +$(productLines[i]).children().eq(2).children().html();

          if (lineStatus === 'Installing' && lineCycle === 0) {
            $(productLines[i]).append('<input type=\'button\' class=\'withdraw\' value=\'Revoked\'>');
          }
        }

        $('.withdraw').on('click', function () {
          if (confirm('Are you sure to cancel?？')) {
            var _this = this;
            var productLineId = $(_this).siblings('.operateLine').children().eq(4).val();

            $.get('productLineAction!withdrawProductLine.action', { 'productLineId': productLineId }, function (res) {
              var resp = JSON.parse(res);
              alert(resp.message);
              if (+res.status === 0) {
                $(_this).parent().remove();
              }
            });
          }
        });
      });
    }

    // Load the leased plant
    if (data.factoryRent) {
      factoryRentNum = data.factoryRent.length;
      $(data.factoryRent).each(function (index) {
        $(backUp1).clone(true).appendTo('.workshop');
        var tar = $('.workshop dl').eq(index + factoryMadeNum);
        var factoryEach = data.factoryRent[index];
        $(tar).find('.shop').attr('src', '../../images/factory/rent.jpg');
        // status
        $(tar).find('.status span').text(factoryEach.status);
        // Plant number
        $(tar).find('.workshop_id span').text(factoryEach.factoryId);
        // Where the market
        $(tar).find('.market_area span').text(factoryEach.place);
        // Plant type
        $(tar).find('.workshop_type span').text(factoryEach.factoryType);
        $(tar).find('.restvalue p').text('Each need to pay the rent');
        // Each need to pay the rent
        $(tar).find('.restvalue span').text(factoryEach.rentCost);
        // 残值
        $(tar).find('.buildtime p').text('Residual value');
        $(tar).find('.buildtime span').text(factoryEach.sellPrice);
        // Wait for 0 to be available
        if (+factoryEach.needPeriod === 0) {
          $(tar).find('.finished').text('Rental plant available');
        } else {
          $(tar).find('.builttime p').text('Waiting for the use of the cycle');
          //Waiting for the use of the cycle
          $(tar).find('.finished').text(factoryEach.needPeriod);
        }
        // Production line existing quantity
        $(tar).find('.currentLine').text(factoryEach.productLineNumber);
        // Can accommodate the production line
        $(tar).find('.totalLine').text(factoryEach.capacity);
        $(tar).find('.operateFactory input').removeClass('sell').addClass('stopRent').val('Rented');

        var backUpLine = $(tar).find('#hiddenLine').clone(true).removeAttr('id');
        $('#hiddenLine').remove();
        $(tar).find('dd').remove();

        // Load the production line data
        if (factoryEach.productLines) {
          var num = 0;
          var lines = factoryEach.productLines;
          for (var i = 0; i < lines.length; i++) {
            $(backUpLine).clone(true).appendTo(tar);
            var target = $(tar).find('dd:eq(' + i + ')');

            $('input[name=\'sell\']').css('cursor', 'auto');
            $('input[name=\'changePro\']').css('cursor', 'auto');

            // Read data according to the status of the production line
            Line(obj, target, lines, index, i, num);

            num = 0;
          }
        }
      });
    }

    // Loading the building in the building
    if (data.factoryMaking) {
      $(data.factoryMaking).each(function (index) {
        $(backUp3).clone(true).appendTo('.workshop');

        var tar = $('.workshop dl').eq(index + factoryMadeNum + factoryRentNum);
        var factoryEach = data.factoryMaking[index];
        $(tar).find('.shop').attr('src', '../../images/factory/making.jpg');
        $(tar).find('.status span').text(factoryEach.status);  // status
        $(tar).find('.workshop_id span').text(factoryEach.factoryId);  //Plant number
        $(tar).find('.market_area span').text(factoryEach.place);  // Plant type
        $(tar).find('.workshop_type span').text(factoryEach.factoryType);  // type
        $(tar).find('.paytype span').text(factoryEach.payMode);  //payment method
        $(tar).find('.buildtime span').text(factoryEach.beginTime);  // opening hour
        $(tar).find('.builttime span').text(factoryEach.finishedPeriod);  // The construction cycle has been completed
        $(tar).find('.buildPerioud span').text(factoryEach.makePeriod);  //Total construction period
        $(tar).find('.lines span').text(factoryEach.capacity);  // Can accommodate the production line
        if (factoryEach.status === 'In construction') {
          $(tar).find('.operateFactory input').val('Suspension of construction');
          $(tar).find('.operateFactory input').removeClass('building').addClass('stopping');
        } else {
          $(tar).find('.operateFactory input').val('Continue to build');
          $(tar).find('.operateFactory input').removeClass('stopping').addClass('building');
        }
      });
    }
  }, 'json');
}

// Reload a production line
function updateLine(url, oData, target) {
  var zhuanchan = target[0];

  $.post(url, oData, function (data) {
    $('.changePro').css('display', 'none');

    if (!data) {
      alert('Production of raw materials is not enough! Can not produce');
      return;
    }

    // wxy
    var str;

    $(target).siblings('input[name="changePro"]').attr('disabled', 'true');
    $(target).siblings('input[name="sell"]').attr('disabled', 'true');

    switch (+(data.status)) {
    case 0: {
      str = 'Installing';
      alert('The current status can not be converted');
      break;
    }
    case 1: {
      str = 'Pause the installation';
      break;
    }
    case 2: {
      str = 'Is producing';
      break;
    }
    case 3: {
      str = 'stop production';
      break;
    }
    case 4: {
      str = 'To be produced';

      // The conversion button can be clicked
      $(zhuanchan)
        .css('cursor', 'pointer')
        .removeAttr('disabled');

      // The sale button can be clicked
      $(target).siblings('input[name="sell"]')
        .css('cursor', 'pointer')
        .removeAttr('disabled');
      break;
    }
    case 5: {
      str = 'Is converting';
      $(zhuanchan).attr('disabled', 'true');
      break;
    }
    case 6: {
      str = 'Suspension of conversion';
      break;
    }
    default: break;
    }
    $(target).parents('dd').find('.lineType span').text(data.productLineType);  // Types of
    $(target).parents('dd').find('.finishedPeriod span').text(data.productFinishPeriod);  // Completed cycle
    $(target).parents('dd').find('.lineStatus span').text(str);  // Production line status
    $(target).parents('dd').find('.workingPro').html(str + 'product：<span>' + data.productName + '</span>');  // product name
    $(target).parents('dd').find('input[name=\'hiddenStatus\']').val(data.status);  // line status
    $('.configure p:eq(' + data.status + ')').show();
    $('.configure p:lt(' + data.status + ')').hide();
    $('.configure p:gt(' + data.status + ')').hide();
  }, 'json');
}

$(function () {
  $('.workshop .bg3:first-child dt:first-child').css({'background': '#fff'});
  // Production line hidden
  $('dd').hide();
  window.backUp1 = $('#hidden1').clone(true).removeAttr('id');
  $('#hidden1').remove();
  window.backUp3 = $('#hidden2').clone(true).removeAttr('id');
  $('#hidden2').remove();

  // 加载select框内容
  /* $.post("factory.json",null,function(data){
        //each遍历添加
        $("select[name='workshopStatus']").append("<option>"+"这里是data.[]"+"</option>");
     $("select[name='marketArea']").append("<option>"+"这里是data.[]"+"</option>");
    },"json");
  */

  // According to the location of the market, the state query
  $('.choose_status, .choose_market, .search_btn').click(function () {
    var selected1 = $('select[name=\'workshopStatus\'] option:selected').val();
    var selected2 = $('select[name=\'marketArea\'] option:selected').val();
    update('factoryAction!getFactoryByWorkshopStatusAndMarketArea.action', {
      'worshopStatus': selected1,
      'marketArea': selected2
    }, backUp1);
  });

  // Select the query button
  $('.search_btn').hover(function () {
    $(this).removeClass('bg1').addClass('bg2');
    $(this).css({'font-size': '16px'});
  }, function () {
    $(this).removeClass('bg2').addClass('bg1');
    $(this).css({'font-size': '14px'});
  });

  // Click to expand the production line
  $(document).on('click', '.down', function () {
    if ($(this).find('.down_btn').attr('src') === '../../images/factory/down_btn2.gif') {
      $(this).find('.down_btn').removeAttr('src').attr('src', '../../images/factory/down_btn1.gif');
    } else {
      $(this).find('.down_btn').removeAttr('src').attr('src', '../../images/factory/down_btn2.gif');
    }
    $(this).parents('.bg3').nextAll('dd').slideToggle(500);
  });


    // 查看悬浮框
    /* $(document).on("mouseenter","input[name='examine']",function(){
         $(this).removeClass("bg1").addClass("bg4");
        }); */
  $(document).on('mouseleave', 'input[name=\'examine\']', function () {
    var timer = setTimeout(function () {
      $('.examine').hide();
      $('input[name=\'examine\']').removeClass('bg4').addClass('bg1');
    }, 100);
    // 使鼠标可以悬停而不收回，mouseover不可行
    $('.examine').mouseenter(function () {
      clearTimeout(timer);
    }).mouseleave(function () {
      $('.examine').hide(500);
      $('input[name=\'examine\']').removeClass('bg4').addClass('bg1');
    });
    // 停止还在排队的动画
    $('.examine').stop(true, true);
  });
  // 点击后才查看，并加载信息
  $(document).on('click', 'input[name=\'examine\']', function () {
    // 点击传值：生产线编号
    var lineId = $(this).siblings('input[name=\'hidden\']').val();
    $.post('productLineAction!getProductLineDetail.action', {'productLineId': lineId}, function (data) {
      $('.lineInfo1 p,.lineInfo2 p').empty();
      // 加载信息
      var status = +data.status;
      if (status === 0 || status === 1) {
        $('.lineInfo1 .p1').text('From the installation is still worse ' + (data.setupPeriod - data.finishPeriod) + ' cycle').css('font-weight', 'bold');
        $('.lineInfo1 .p2').text('Need to install the cycle：' + data.setupPeriod);
        $('.lineInfo1 .p3').text('Install the cost per installment：' + data.setupPeriodPrice);
        $('.lineInfo2 .p1').text('Productivity：' + data.producePeriod);
        $('.lineInfo2 .p2').text('Amount of residual value：' + data.sellPrice);
        $('.lineInfo2 .p3').text('The maintenance fee for each period after the start of the production line：' + data.mainCost);
        $('.lineInfo2 .p4').text('The depreciation fee for each period after the start of the production line：' + data.depreciation);
        $('.lineInfo2 .p5').text('After the sale of the production line to the account of the account period：' + data.delayTime);
      } else if (status === 2 || status === 3 || status === 4) {
        $('.lineInfo1 .p1').text('From the completion of production is still worse' + (data.producePeriod - data.productFinishPeriod) + 'cycle').css('font-weight', 'bold');
        $('.lineInfo2 .p1').text('Productivity：' + data.producePeriod);
        $('.lineInfo2 .p2').text('Amount of residual value：' + data.sellPrice);
        $('.lineInfo2 .p3').text('The maintenance fee for each period after the start of the production line：' + data.mainCost);
        $('.lineInfo2 .p4').text('The depreciation fee for each period after the start of the production line：' + data.depreciation);
        $('.lineInfo2 .p5').text('After the sale of the production line to the account of the account period：' + data.delayTime);
      } else if (status === 5 || status === 6) {
        $('.lineInfo1 .p1').text('From the turn into production ' + data.productName + ' Product production line');
        $('.lineInfo1 .p2').text('Worse' + (data.changePeriod - data.finishPeriod) + 'cycle');
        $('.lineInfo1 .p3').text('Conversion costs per period：' + data.changeCost);
        $('.lineInfo2 .p1').text('Productivity：' + data.producePeriod);
        $('.lineInfo2 .p2').text('Amount of residual value：' + data.sellPrice);
        $('.lineInfo2 .p3').text('The maintenance fee for each period after the start of the production line：' + data.mainCost);
        $('.lineInfo2 .p4').text('The depreciation fee for each period after the start of the production line：' + data.depreciation);
        $('.lineInfo2 .p5').text('After the sale of the production line to the account of the account period：' + data.delayTime);
      } else return;
    }, 'json');
    // 显示查看信息
    var w = $(this).offset().left - 60;
    var h = $(this).offset().top + 29;
    $('.examine').slideDown(500).css({
      'left': w + 'px',
      'top': h + 'px',
      'display': 'block'
    });
  });

  $(document).on('mouseleave', 'input[name=\'changePro\']', function () {
    var timer = setTimeout(function () {
      $('.changePro').hide(500);
      $('input[name=\'changePro\']').removeClass('bg4').addClass('bg1');
    }, 100);
    $('.changePro').mouseenter(function () {
      clearTimeout(timer);
    }).mouseleave(function () {
      if (window.event.toElement === null) { return; }
      $('.changePro').hide();
      $('input[name=\'changePro\']').removeClass('bg4').addClass('bg1');
    });
    $('.changePro').stop(true, true);
  });

  $(document).on('click', 'input[name="changePro"]', function () {
    _thisLine = $(this);

    // 点击传值：生产线编号并加载该组能够转产的产品
    var lineId = $(this).siblings('input[name="hidden"]').val();

    $.post('factoryAction!getDevelopedProduct.action', function (data) {
      $('select[name="choosePro"]').empty();

      for (var i = 0; i < data.length; i++) {
        $('select[name="choosePro"]').append('<option>' + data[i].productName + '</option>');
      }
    }, 'json');

    var w = $(this).offset().left - 77;
    var h = $(this).offset().top + 29;

    $('.changePro').slideDown(500).css({
      'left': w + 'px',
      'top': h + 'px',
      'display': 'block'
    });
  });

  // 点击确认转产按钮---传生产线ID、和要转产的产品
  $(document).on('click', 'input[name="confirmChange"]', function () {
    if (confirm('Do you confirm conversion? Will not be revoked after confirmation。')) {
      var product = $(this).prev().find('select[name="choosePro"] option:selected').text(); // 选择的产品
      var lineId = $(_thisLine).siblings('input[name="hidden"]').val();

      // 重新刷新该条生产线
      updateLine('productLineAction!startChangeProduct.action', {
        'productLineId': lineId,
        'productName': product
      }, _thisLine);
    }
  });

  // select延时
  $('select[name=\'choosePro\']').hover(function () {
    $('.changePro').css({'display': 'block'});
  }, function () {
    $('.changePro').css({'display': 'block'});
    var timer = setTimeout(function () {
      $('this').hide(500);
    }, 500);
    $('option').mouseenter(function () {
      clearTimeout(timer);
    });
    $('.configure').stop(true, true);
  });
	// 确认转产按钮样式
  $('.changePro input').hover(function () {
    $(this).css({'cursor': 'pointer', 'width': '135px', 'height': '35px'});
  }, function () {
    $(this).css({'width': '133px', 'height': '33px'});
  });


  $(document).on('mouseleave', 'input[name=\'configure\']', function () {
    var timer = setTimeout(function () {
	    $('.configure').hide();
	    $('input[name=\'configure\']').removeClass('bg4').addClass('bg1');
    }, 100);
    $('.configure').mouseenter(function () {
      clearTimeout(timer);
    }).mouseleave(function () {
      $('input[name=\'configure\']').removeClass('bg4').addClass('bg1');
      $('.configure').hide(500);
    });
    $('.configure').stop(true, true);
  });


  $(document).on('click', 'input[name=\'configure\']', function () {
	  _thisLine = $(this);
    $('.configure p').css('display', 'block');
		// 获得配置下可以点击的按钮
	  var status = $(_thisLine).siblings('input[name=\'hiddenStatus\']').val();   // 加载生产线时储存的status
    $('.configure p:lt(' + status + ')').hide();
    $('.configure p:gt(' + status + ')').hide();

    var w = $(this).offset().left - 77;
    var h = $(this).offset().top + 29;
    $('.configure').slideDown(500).css({
      'left': w + 'px',
      'top': h + 'px',
      'display': 'block'
    });
	  lineId = $(this).siblings('input[name=\'hidden\']').val();   // 点击配置得到该生产线的ID
  });


	// 配置下各按钮样式
  $('.configure input').hover(function () {
    $(this).css({'cursor': 'pointer', 'width': '135px', 'height': '35px'});
  }, function () {
    $(this).css({'width': '133px', 'height': '33px'});
  });


  // 点击配置下的按钮，传生产线ID、和要改变的状态
  $(document).on('click', '.configure input', function () {
    var str = $(this).val();
    updateLine('productLineAction!allConfigOperate.action', {
      'productLineId': lineId,
      'status': str
    }, _thisLine);
  });


	// 查看、转产、配置、出售生产线按钮样式
  $(document).on('mouseenter', 'input[name=\'sell\'],input[name=\'configure\'],input[name=\'changePro\'],input[name=\'examine\']', function () {
    $(this).removeClass('bg1').addClass('bg4');
  });
  $(document).on('mouseleave', 'input[name=\'sell\']', function () {
    $(this).removeClass('bg4').addClass('bg1');
  });


	// 出售生产线
  $(document).on('click', 'input[name=\'sell\']', function () {
    var lineId = $(this).siblings('input[name=\'hidden\']').val();
    var ok = confirm('Whether to confirm the sale of the production line');
    if (ok) {
      $.post('productLineAction!sellProductLine.action', {'productLineId': lineId});
      $(this).parents('dd').hide(1000);
      currentLine = $(this).parents('dl').find('.currentLine');
      $(currentLine).text($(currentLine).text() - 1);
    } else { return false; }
  });

	// 出售、停止租用、停止修建、继续修建按钮样式
  $(document).on('mouseenter', '.operateFactory input', function () {
    $(this).removeClass('bg1').addClass('bg2');
    $(this).css({'font-size': '20px'});
  });
  $(document).on('mouseleave', '.operateFactory input', function () {
    $(this).removeClass('bg2').addClass('bg1');
    $(this).css({'font-size': '18px'});
  });

	// 出售、停止租用厂房
  $(document).on('click', '.sell', function () {
    var lineCount = +$(this).parents('dl').find('.currentLine').text();  // 厂房中现有的生产线数量
    var factoryId = $(this).parents('dl').find('.workshop_id span').text();  // 厂房编号
    if (!lineCount) {
      if (confirm('Whether to confirm the sale of the plant')) {
        $.post('factoryAction!sellUsingFactory.action', {'factoryId': factoryId});  // 成功出售传--厂房ID
        $(this).parents('.workshop_info').remove();
      }
      // else { return false; }
    } else {
      alert('There are production lines that can not be sold！');
    }
  });

  $(document).on('click', '.stopRent', function () {
    var lineCount = +$(this).parents('dl').find('.currentLine').text();  // 厂房中现有的生产线数量
    var factoryId = $(this).parents('dl').find('.workshop_id span').text();  // 厂房编号
    if (!lineCount) {
      if (confirm('Whether to stop renting the plant')) {
        $.post('factoryAction!stopFactoryRent.action', {'factoryId': factoryId});  // 成功出售传--厂房ID
        $(this).parents('.workshop_info').remove();
      }
      // else { return false; }
    } else {
      alert('There is a production line, can not stop renting！');
    }
  });

	// 停止修建、继续修建
  $(document).on('click', '.building, .stopping', function () {
    var factoryId = $(this).parents('dl').find('.workshop_id span').text();  // 厂房编号
    if ($(this).val().trim() === 'Suspension of construction') {
      $(this).val('Continue to build');
		  $(this).parents('dl').find('.status span').text('Suspended');
		  $.post('factoryAction!stopFactoryMaking.action', {'factoryId': factoryId});  // 成功暂停、继续传--厂房ID
    } else if ($(this).val().trim() === 'Continue to build') {
      $(this).val('Suspension of construction');
      $(this).parents('dl').find('.status span').text('In construction');
      $.post('factoryAction!startFactoryMaking.action', {'factoryId': factoryId});  // 成功暂停、继续传--厂房ID
    }
		// else return false;
  });


  update('factoryAction!getAllFactoryAndProductLine.action', null, backUp1, backUp3);
});
