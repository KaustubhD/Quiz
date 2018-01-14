$(window).on('load', function(){
  $('.container').addClass('ready');

  let json = JSON.parse(jso), curind = 1, len = json["count"], ans = new Object(), anim = false, viewwidth = 0;

  //Slide up the overlay and remove it
  setTimeout(function(){
    $('.overlay').addClass('slide-up').on('transitionend', function(){
      $('.overlay').remove();
      $('.container').addClass('over');
      $('.modal-ans').text(`Swipe over the question to move around`).addClass('visible');
      setTimeout(function(){
        $('.container').removeClass('over');
        $('.modal-ans').removeClass('visible').text('');

      }, 2500);

    });
  }, 1500);


  //Hover animations on answer options
  $('.a').on('mouseenter', function(){
    if(!anim){
      $(this).css('animation', 'animation 1000ms linear forwards');
    }
  });
  $('.a').on('mouseleave', function(){
    if(!anim){
      $(this).css('animation', 'none');
    }
  });
  $('.a').on('click', function(){
    if(!anim){
      anim = true;
      let index = Math.floor($('.a').index(this) / 2);
      // console.log("Curind at click : " + curind);
      if(ans.hasOwnProperty(`${curind}`)){
        // console.log($('.a.visible').eq(ans[curind][0]));
        $('.a.visible').eq(ans[curind][0]).removeClass('select');
      }
      $(this).css('animation', 'none').addClass('select');
      // console.log(Math.floor($('.a').index(this) / 2));
      ans[`${curind}`] = [index, $(this).find('.a-h').text()];
      // console.log(ans);
      anim = false;
      setTimeout(function(){
        next();
      }, 900);
    }
  });

  // Little responsive
  $(window).on('resize', function(){
    size();
  });

  init();

  // Click handlers on left right buttons
  $('.prev-but>svg').on('click', prev);
  $('.next-but>svg').on('click', next);
  // $('.q').on('swipeleft', function(e){
  //   e.preventDefault();
  //     prev();
  // }).on('swiperight', function(e){
  //   e.preventDefault();
  //     next();
  // });
  // $('.new-next-but').on('click', function(){console.log("Clicked");});

  function init(){
    console.log("Init Called");
    let ans = $('.a-wrap .a, .q-wrap>.false-wrap .q'),
    ay = ans.filter('.visible'), an = ans.filter(':not(.visible)');
    $('.prev-but>svg').addClass('disabled');
    // console.log($('.prev-but>svg'));
    $(ay).find('.q-h').text(json["q"][curind]);
    for(let i = 1; i <= 4; i++){
      $(ay[i]).find('.a-h').text(json["a"][curind - 1][`${i}`]);
    }
    // For resize managing
    size();
  }
  
  function prev(){
    console.log(curind);
    // e.preventDefault();
    if(!$('.prev-but>svg').hasClass('disabled')){
      if(!anim){
        anim = true;
      }
      --curind;
      let ans = $('.a-wrap .a, .q-wrap>.false-wrap .q'),
      ay = ans.filter('.visible'), an = ans.filter(':not(.visible)');
      checkSelectedState(an);
      if(curind == 1){
        $('.prev-but>svg').addClass('disabled');
      }
      $('.next-but>svg').removeClass('disabled');
      $(an).find('.q-h').text(json["q"][curind]);
      console.log(curind-1);
      console.log(json["a"]);
      for(let i = 1; i <= 4; i++){
        $(an[i]).find('.a-h').text(json["a"][curind - 1][`${i}`]);
      }
      $(an).css({'transform': 'translate3d(140%, 0, 0)'});
      setTimeout(function(){
        $(an).addClass('move visible').css({'transform': 'translate3d(0%, 0, 0)'}).on('transitionend', function(){ $(an).removeClass('move')});
      }, 200);
      $(ay).addClass('move').removeClass('visible').css({'transform': 'translate3d(-140%, 0, 0)'}).on('transitionend', function(){
        $(ay).removeClass('move'); anim = false;});
    }
    checkOver();
  }


  function next(){
    // e.preventDefault();
    console.log(curind + "   " + len);
    
    if(!$('.next-but>svg').hasClass('disabled')){
      if(!anim){
        anim = true;
      }
      ++curind;
      let ans = $('.a-wrap .a, .q-wrap>.false-wrap .q'),
      ay = ans.filter('.visible'), an = ans.filter(':not(.visible)');
      checkSelectedState(an);
      if(curind == len){
        $('.next-but>svg').addClass('disabled');
      }
      $('.prev-but>svg').removeClass('disabled');
      $(an).find('.q-h').text(json["q"][curind]);
      for(let i = 1; i <= 4; i++){
        $(an[i]).find('.a-h').text(json["a"][curind - 1][`${i}`]);
      }
      $(an).css({'transform': 'translate3d(-140%, 0, 0)'});
      setTimeout(function(){
        $(an).addClass('move visible').css({'transform': 'translate3d(0%, 0, 0)'}).on('transitionend', function(){ $(an).removeClass('move')});
      }, 200);
      $(ay).addClass('move').removeClass('visible').css({'transform': 'translate3d(140%, 0, 0)'}).on('transitionend', function(){
        $(ay).removeClass('move'); anim = false;});
      
    }
    checkOver();
  }

  function checkSelectedState(nextels){
    // console.log(nextels);
    // console.log(ans);
    // console.log(curind);
    $(nextels).removeClass('select');
    if(ans.hasOwnProperty(curind)){
      // console.log("Answer already selected " + (ans[curind][0] + 1));
      $(nextels).eq(ans[curind][0] + 1).addClass('select'); //The  + 1 is needed because there is a .q in nextels
    }
  }

  function checkOver(){
    console.log(ans);
    if(Object.keys(ans).length == len){
      showAns();
    }
  }

  function showAns(){
    $('.container').addClass('over');
    let modal = $('.modal-ans');
    for(let i = 0; i < len; i++){
      modal.append(`<div class="ans-in-modal">${i + 1} : ${ans[i + 1][1]}</div>`);
    }
    $('.modal-ans').addClass('visible grid');
  }


  function size(){
    console.log('Size called');
    let h = $(window).height(), w = $('main').outerWidth();
    viewwidth = $(window).width();
    $('svg.svg-visible').attr('height', `${h * 0.2}px`).attr('width', `${w}px`);
    $('.heading-wrap').css('height', `${h * 0.2}px`);
    $('line').attr('x1', `${h * 0.15}px`).attr('y2', `${h * 0.15}px`);
    $('#h-back path').attr('d', `M${(h * 0.15)} 20 L${w} 20 L${w} ${h * 0.2 * 0.8} L${(20)} ${h * 0.2 * 0.8} Z`);
    $('.content-wrap').css('height', `${h * 0.7}px`);
    if(viewwidth <= 425){
      $('.q').on('swipeleft', function(e){
        e.preventDefault();
          prev();
      }).on('swiperight', function(e){
        e.preventDefault();
          next();
      });
    }
  }






});



let jso = '{"q": {"1": "Q1 The easiest question ever ", "2": "Q2 A little tougher question ", "3": "Q3 A real mindbender "}, "a": [{"1": "Of course not this option", "2": "Ah ! Got it. No need to look further", "3": "I don\'t know why i\'m still reading this", "4": "What an idiotic option"}, { "1": "Well this looks correct🤔, but lets check others", "2": "This looks correct too😓", "3": "WTH! this looks correct too😨", "4": "Maybe its more than one answer😭"}, {"1": "I don\'t think so", "2": "I don\'t know", "3": "I don\'t have a single clue", "4": "Welcome to the stupid club"}], "count": 3}';