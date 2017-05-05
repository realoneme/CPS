/**
 * Created by rebec on 2017/5/5.
 */
var mcps = (function () {
    var gotoTop = function () {
        if ($('.totop').length) {
            $('.totop').click(function () {
                $('body').scrollTop(0);
            })
        }
    };
    var swipers = function () {
        //bannerSwiper
        var s1 = new Swiper('.banner-swiper .swiper-container', {
            direction: 'horizontal',
            loop: true,
            autoplay: 2500,
            autoplayDisableOnInteraction: false,
            lazyLoading: true,
            pagination: '.swiper-pagination'
        });
    };
    var scrollEvent = function () {
        $(window).on('scroll', function () {
            var $st = $(this).scrollTop();
            var $header = $('.head');
            if ($st > 1) {
                $header.addClass('fixhead');
            } else {
                $header.removeClass('fixhead');
            }

            if ($st > 3 * window.fSize) {
                $('.totop').css('opacity', 1);
            } else {
                $('.totop').css('opacity', 0);
            }

        })
    };
    var acCount =function () {
        countDown({
            time: '2017/5/9 15:53:51',
            dayTime: '.acri',
            hourTime: '.acshi',
            minTime: '.acfen',
            sTime: '.acmiao',
            wordspace: '.countblock',
            text: '活动已经结束了哦，下次请早~'
        });
        function countDown(o) {
            function getTime() {
                var endTime = new Date(o.time);
                var nowTime = new Date();
                var t = endTime.getTime() - nowTime.getTime();
                var d = Math.floor(t / (1000 * 60 * 60 * 24));
                var h = Math.floor(t % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
                var m = Math.floor(t % (1000 * 60 * 60) / (1000 * 60));
                var s = Math.floor(t % (1000 * 60) / 1000);
                var dTime = o.dayTime, hTime = o.hourTime, mTime = o.minTime, sTime = o.sTime, sNotice = o.wordspace, sNoticeWord = o.text;
                $(dTime).html(d);
                $(hTime).html(h);
                $(mTime).html(m);
                $(sTime).html(s);
                if (d <= 0) {
                    $(dTime).html("0" + d)
                }
                if (h <= 9 && h >= 0) {

                    $(hTime).html("0" + h)
                }
                if (m <= 9 && m >= 0) {
                    $(mTime).html("0" + m)
                }
                if (s <= 9 && s >= 0) {

                    $(sTime).html("0" + s)

                }

                if (t <= 0) {
                    clearInterval(o.timer);
                    if (sNotice) {
                        if (sNotice) {
                            $(sNotice).html(sNoticeWord);
                        }
                    } else {
                        let over = '00';
                        $(dTime).html(over);
                        $(hTime).html(over);
                        $(mTime).html(over);
                        $(sTime).html(over);
                    }
                }
            }
            o.timer = setInterval(getTime, 1000)
        }
    };
    var catMove = function () {
        var catAni = $('#J-catmove');
        window.setInterval(function () {
            if (catAni.hasClass('reversecat')) {
                catAni.removeClass('reversecat');
            } else {
                catAni.addClass('reversecat');
            }

        }, 10000)
    };


    return {
        gotoTop:gotoTop,
        swipers:swipers,
        scrollEvent:scrollEvent,
        acCount:acCount,
        catMove:catMove

    }
})();

$(function () {
    mcps.gotoTop();
    mcps.swipers();
    mcps.scrollEvent();
    mcps.acCount();
    mcps.catMove();
});