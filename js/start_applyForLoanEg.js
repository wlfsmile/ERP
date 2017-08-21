function load(data) {
  $('.thirdTd:eq(0)').text(data.loanType); // Type of loan
  $('.thirdTd:eq(1)').text(data.rate); // Annual interest rate
  $('.loanP1').html(data.warning); // Red warning message
  $('#loanMoney').val(''); // Clear the amount of the loan amount

  // Blue description information
  if (data.loanType === 'Long term loan') {
    $('.loanP3').html('Explanation: The enterprise repays the interest on an annual basis and repays the principal after the loan expires');
  } else if (data.loanType === 'Short-term loans') {
    $('.loanP3').html('Note: companies do not need to pay interest on each issue, after the loan expires one after another debt service');
  } else {
    $('.loanP3').html('Explanation: The enterprise repays the interest on an annual basis and repays the principal after the loan expires');
  }

  // Modify the unit
  if (data.loanType == 'Long term loan') {
    $('.unit').text('year');
  } else {
    $('.unit').text('period');
  }

  // add option，from 1 to maxYear or maxPeriod
  if (data.maxYear) {
    $('#selectPeriod').empty();
    for (var i = 2; i <= data.maxYear; i++) {
      $('#selectPeriod').append('<option>' + i + '</option>');
    }
  } else {
    $('#selectPeriod').empty();
    for (var i = 1; i <= data.maxPeriod; i++) {
      $('#selectPeriod').append('<option>' + i + '</option>');
    }
  }

	// Whether the application button is operational
  if (data.isAllow === false) {
    $('#applyBtn').attr('disabled', 'true').css('cursor', 'auto');
  } else {
    $('#applyBtn').removeAttr('disabled');
    $('#applyBtn').hover(function () {
      $(this).removeClass('btn').addClass('click');
    }, function () {
      $(this).removeClass('click').addClass('btn');
    });
  }

  window.maxMoney = data.maxMoney;
}

$(function () {
	// Enter the page to initialize the long term loan information
  $.post('loanAction!isAllowLoan.action?rnd=' + Math.random(), {
    'loanType': 'Long term loan'
  }, load, 'json');

  $('#loanBtn').hover(function () {
    $(this).removeClass('btn').addClass('click');
  }, function () {
    $(this).removeClass('click').addClass('btn');
  });

	// Click the query to load the message
  $('#loanType').on('click', function () {
    var selected = $(this).val();

    $.post('loanAction!isAllowLoan.action?rnd=' + Math.random(), {
      'loanType': selected
    }, load, 'json');
  });

  $('#applyBtn').on('click', function () {
    var loanMoney = $('#loanMoney').val(); // loan amount
    var loanTime = $('#selectPeriod option:selected').text(); // Number of loans
    var loanType = $('.thirdTd').eq(0).text(); // Type of loan

    // To determine whether the amount of the loan is reasonable, 
    // if it is unreasonable is the warning at the warning message, 
    // if a reasonable application for the success of the alert.
    if (maxMoney) {
      if (loanMoney <= 0 || loanMoney > maxMoney) {
        $('.loanP1').text('The loan amount does not meet the conditions!');
      } else if (!(/^(\d)+$/.test(loanMoney))) {
        $('.loanP1').text('Please enter an integer!');
      } else {
        $.post('loanAction!applyLoan.action?rnd=' + Math.random(), {
          'loanType': loanType,
          'loanMoney': loanMoney,
          'loanTime': loanTime
        }, load, 'json');

        alert('Loan success！\nApply to' + loanType + loanMoney + 'million, please' + loanTime + 'period to pay off');
      }
    } else if (loanMoney <= 0) {
      $('.loanP1').text('The loan amount does not meet the conditions!');
    }	else if (isNaN(loanMoney)) {
      $('.loanP1').text('Please enter the number!');
    } else {
      $.post('loanAction!applyLoan.action?rnd=' + Math.random(), {
        'loanType': loanType,
        'loanMoney': loanMoney,
        'loanTime': loanTime
      }, load, 'json');
      alert('Loan success！\nApply to' + loanType + loanMoney + 'million, please' + loanTime + 'period to pay off');
    }
  });
});
