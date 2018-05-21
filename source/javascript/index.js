window.jQuery = $ = require('jquery');

;(function ($) {

  console.log('loaded');

  var cap = $('.gb-gnb__dimmed');
  var nav = $('.gb-gnb');
  var btnToggle = nav.find('.s-gnb-toggler');
  var dropdown = nav.find('.drilldown');

  var btnScroll = $('.gb-footer__btn-top a');
  
  btnScroll.on('click', function(e){
    e.preventDefault();

    var heightScroll = 0;

    $('html,body').animate({
      scrollTop: heightScroll
    },'fast');

  });

  // cap.on('click', function(e){

  //   var $el = $('#modal-retails-content');
  //   var target = $(e.target);

  //   if ( target.is(cap) ) {
  //     dropdown.fadeOut();
  //     dropdown.removeClass('active');
  //     btnToggle.removeClass('active');
  //     $(this).fadeOut();
  //   }

  // });

  function toggleMenu(e){
    e.preventDefault();

    console.log('asd');

    if (dropdown.hasClass('active')) {
      $(this).removeClass('active');
      dropdown.removeClass('active');
      cap.fadeOut();
      dropdown.fadeOut();

    }else{
      $(this).addClass('active');
      dropdown.addClass('active');
      cap.fadeIn();
      dropdown.fadeIn();

    }
  }

  btnToggle.on('click', toggleMenu);



})(jQuery);
