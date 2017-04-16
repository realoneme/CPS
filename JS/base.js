/**
 * Created by rebec on 2017/4/14.
 */

var cps = cps || {};
cps.public = {
    init: function () {
        var that = this;
        that.headSwiper();
        // that.slideSideBar();
        that.tabAnime();
        that.tabChange();
        that.stickSideBar();
        that.attachHead();
    },
    stickSideBar: function () {
        var $sideBar = $('.J_sidebar');
        var screenH = $('body').outerHeight();
        $sideBar.height(screenH);

        if ($(window).width() < 1235) {
            $sideBar.animate({width: -35}, 'normal').hide();
        } else {
            $sideBar.animate({width: 35}, 'normal').show();

        }
        $(window).resize(function () {
            if ($(this).width() < 1235) {
                $sideBar.css('width', 0);

            } else if ($(this).width() >= 1235) {
                $sideBar.css('width', 35);
            }
        })
    },
    attachHead: function () {
        var $fixHead = $('#J-attachedhead');
        var $head = $('.header');
        var $headOpa = $head.css('opacity');
        var $headH = $head.outerHeight();
        var beforeTop = $(window).scrollTop();
        $(window).on('scroll', function () {
            var $this = $(this);
            var winScrT = $this.scrollTop();
            if (winScrT > $headH) {
                $fixHead.css('top', 0);
                // $fixHead.animate({top:0,easing:'normal',duration:200});

            } else {
                $fixHead.css('top', -50);
                // $fixHead.animate({top:-50,easing:'normal',duration:200});
            }
            if(beforeTop<winScrT){
                console.log('down');
                $headH.css('rotateX')
            }else{
                console.log('up');
            }
            beforeTop = winScrT;
        })
    },
    headSwiper: function () {
        //get doms
        var $bannerBox = $('.bannerimgs'),
            $focusBox = $('.focus'),
            $bannerswiper = $('.cont-bannerswiper'),
            oBanner = $bannerswiper[0],
            $arrow = $('.arrow');
        var $imgs,
            $focus;
        var bannerWidth = $bannerswiper.width();
        var url = './data/data.json?=';
        $.ajax({
            type: 'get',
            dataType: 'json',
            cache: false,
            url: url + new Date(),
            success: function (result) {
                bindData(result);
            },
            timeout: 5000,
            error: {}
        });

        function bindData(data) {
            $.each(data, function () {
                $imgs = $('<img src="" data-src="' + this.img + '" alt="" class="cont-imgs">');
                $focus = $('<li class="pointer"></li>');
                $bannerBox.append($imgs);
                $focusBox.append($focus);
            });
            $focusBox.children($focus).eq(0).addClass('cur');
            $bannerBox.children($imgs).eq(0).clone().appendTo($bannerBox);
            $imgs = $('.cont-imgs');
            $focus = $('.pointer');
            $bannerBox.width(($imgs.length + 1) * bannerWidth);


            loadImg();
            arrowControl();
            pointFocus();
        }

        function loadImg() {
            $imgs.each(function () {
                var imgSrc = $(this).data('src');
                var $that = $(this);
                var tempImg = new Image;
                $(tempImg).prop('src', imgSrc);
                $(tempImg).load(function () {
                    $that.prop('src', imgSrc);
                    $that.index() == 0 ? $that.fadeIn() : null;
                    tempImg = null;
                });
            });
            oBanner.step = 0;
            oBanner.timer = setInterval(autoMove, 2000);
        }

        function autoMove(n) {
            !isNaN(n) ? oBanner.step = n : oBanner.step++;
            if (oBanner.step > $imgs.length - 1) {

                $bannerBox.css('left', 0);
                oBanner.step = 1;
            }
            var sleft = oBanner.step * -bannerWidth;
            $bannerBox.stop().animate({left: sleft}, "slow");

            autoFocus(oBanner.step)

        }

        function autoFocus(n) {
            oBanner.step === $imgs.length - 1 ? n = 0 : null;
            $focus.eq(n).addClass('cur').siblings().removeClass('cur');
        }

        function pointFocus() {
            $focus.each(function () {
                $(this).hover(function () {
                    autoMove($(this).index());
                })
            })
        }

        $bannerswiper.on('mouseenter', function () {
            clearInterval(oBanner.timer);
            $arrow.animate({opacity: .6}, 'normal');
            $arrow.on('mouseenter', function () {
                $(this).animate({opacity: 1}, 'normal');
            }).on('mouseleave', function () {
                $(this).animate({opacity: .6}, 'normal');
            })
        }).on('mouseleave', function () {
            oBanner.timer = setInterval(autoMove, 2000);
            $arrow.animate({opacity: 0.3}, 'normal');
        });
        function arrowControl() {
            $('.J_left').on('click', function () {
                if (oBanner.step == 0) {
                    oBanner.step = $imgs.length - 1;
                    $bannerBox.css('left', (oBanner.step) * -bannerWidth);
                }
                oBanner.step--;
                autoMove(oBanner.step);
            });
            $('.J_right').on('click', function () {
                autoMove();
            })
        }

    },
    tabAnime: function () {
        $('.cont-classcontlist').each(function () {
            fn($(this));//$(this)是遍历出来的当前jq对象
        });
        function fn($box) {
            var $mask = $box.find('.J-mask');
            var res;
            var boxW = $box.outerWidth(),
                boxH = $box.outerHeight();

            //    鼠标滑入
            $box.on('mouseenter', function (e) {
                var $t = $(this);
                var x = e.clientX - $t.offset().left - $t.outerWidth() / 2;
                var y = $t.outerHeight() / 2 - (e.clientY + $(window).scrollTop()) + $t.offset().top;
                //计算方向
                res = getLocation(x, y);
                switch (res) {
                    case 0: // 左边
                        $mask.css({left: -boxW, top: 0});
                        break;
                    case 1: // 下边
                        $mask.css({left: 0, top: boxH});
                        break;
                    case 2: // 右边
                        $mask.css({left: boxW, top: 0});
                        break;
                    case 3: // 上边
                        $mask.css({left: 0, top: -boxH});
                        break;
                }
                $mask.stop().animate({left: 0, top: 0}, 400, 'easeInOutCirc');
            });
            $box.on('mouseleave', function (e) {
                var $t = $(this);
                var x = e.clientX - $t.offset().left - $t.outerWidth() / 2;
                var y = $t.outerHeight() / 2 - (e.clientY + $(window).scrollTop()) + $t.offset().top;
                res = getLocation(x, y);
                console.log(res);
                var target = null;
                switch (res) {
                    case 0: // 左边
                        target = {left: -boxW, top: 0};
                        break;
                    case 1: // 下边
                        target = {left: 0, top: boxH};
                        break;
                    case 2: // 右边
                        target = {left: boxW, top: 0};
                        break;
                    case 3: // 上边
                        target = {left: 0, top: -boxH};
                        break;
                }
                $mask.stop().animate(target, 400, 'easeInOutCirc');
            });

            //计算弧度，最终计算结果为方向
            function getLocation(x, y) {
                var rad = Math.atan2(y, x);
                var deg = 180 / Math.PI * rad;
                res = Math.round((deg + 180) / 90) % 4;
                return res;
            }

        }
    },
    tabChange: function () {
        var $tabTitle = $('.J_tabtitle'),
            $tabList = $('.J_tablist');
        $tabList.first().show();
        // $tabTitle.eq(0).show().siblings('.J_tablist').hide();
        $tabTitle.each(function () {
            $tabTitle.on('click', function () {
                var ind = $(this).index();
                $(this).addClass('cur').siblings().removeClass('cur');
                $tabList.eq(ind).show(200).siblings('.J_tablist').hide(200);
            });

        })
    }
};
$(function () {
    cps.public.init();
});