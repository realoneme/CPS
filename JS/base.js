/**
 * Created by rebec on 2017/4/14.
 */
var cps = cps || {};
cps.public = {
    init: function () {
        var that = this;
        that.headSwiper();
        that.tabAnime();
        that.tabChange();
        that.fixSideIcons.call($(window));
        that.slideFade();
        that.stickSideBar();
        that.scrollEvent();
        that.goTop();
        that.slideDownMenu('.J_navlogin', '.J_menuhover', '.J_downmenu');
        that.suggestSearch();
        // that.synchro('.J_textsearch')
    },
    stickSideBar: function () {
        var t = this;
        var $sideBar = $('.J_sidebar'),
            $header = $('.J_header');
        var screenH = $('body').outerHeight(),
            headH = $header.outerHeight();
        $sideBar.height(screenH - headH);

        if ($(window).width() < 1235) {
            $sideBar.animate({width: -35}, 'normal').hide();
        } else {
            $sideBar.animate({width: 35}, 'normal').show();

        }
        $(window).resize(function () {
            t.fixSideIcons.call($(window));
            if ($(this).width() < 1235) {
                $sideBar.css('width', 0);

            } else if ($(this).width() >= 1235) {
                $sideBar.css('width', 35);
            }
        });
    },
    slideFade: function () {
        var slideBlock = $('.J_slidefade');
        var slideList = $('.J_side-list');
        var sideListWrapper = $('.side-list_box');
        var t;
        slideList.hover(function () {
            if (t) {
                clearTimeout(t);
            }
            $(this).children(slideBlock).css({left: '-90px', opacity: 1});
            sideListWrapper.css('overflow', 'visible');
        }, function () {
            $(this).children(slideBlock).css({left: '-140px', opacity: 0});
            clearTimeout(t);
            t = setTimeout(function () {
                sideListWrapper.css('overflow', 'hidden');
            }, 300);
        })
    },
    fixSideIcons: function () {
        var $listBox = $('.J_side_userbox'),
            $listFnBox = $('.J_side_fnbox');

        var $winH = $(this).outerHeight();
        var t = ($winH - $listBox.outerHeight()) / 2;

        $listBox.css('top', t);
        $listFnBox.css('bottom', 0);

    },
    goTop: function () {
        var $toTopBtn = $('.J-totop');
        $toTopBtn.on('click', function () {
            $("html,body").animate({scrollTop: 0}, 300, 'easeInOutSine');
        })
    },
    scrollEvent: function () {
        var $fixHead = $('#J-attachedhead'),
            $head = $('.J_header'),
            $toTopBtn = $('.J-totop');
        var $headH = $head.outerHeight();
        // var beforeTop = $(window).scrollTop();
        var t = this;
        $(window).on('scroll', function () {
            var winScTop = $(this).scrollTop();
            var $this = $(this);
            fixhead.call($this);//固定头
            //隐藏显示回到顶部图标
            if (winScTop < 200) {
                $toTopBtn.fadeOut(100);
            } else if (winScTop >= 200) {
                $toTopBtn.fadeIn(100);
            }
        });
        function fixhead() {
            var winScrT = $(this).scrollTop();
            if (winScrT > $headH) {
                $head.addClass('J-attachedhead');
            } else {
                $head.removeClass('J-attachedhead');
            }
        }

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
            $('.arrow.J_left').on('click', function () {
                if (oBanner.step == 0) {
                    oBanner.step = $imgs.length - 1;
                    $bannerBox.css('left', (oBanner.step) * -bannerWidth);
                }
                oBanner.step--;
                autoMove(oBanner.step);
            });
            $('.arrow.J_right').on('click', function () {
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
        $('.J_cont-classpick').changeTab({
            title: '.J_tabtitle',
            body: '.J_tablist',
            curCls: "cur",
            duration: 200
        })
    },
    suggestSearch: function () {
        var url = 'https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su';
        var $ser = $('.J_textsearch'),
            $suggestBox = $('.searchsuggest');
        var pVal, historyData;
        $(document).on('click', function (e) {
            if (!$(e.target).hasClass('J_textsearch')) {
                $ser.siblings($suggestBox).hide();
            }
        });
        $ser.on('click', function () {
            pVal = $.trim($ser.val());
            var _this = this;
            _this.contInd = -1;
            $(this).siblings($suggestBox).show();
            if (!pVal) {
                $.ajax({
                    url: './data/history.json',
                    dataType: 'json',
                    cache: false,
                    type: 'get',
                    success: function (re) {
                        if (re) {
                            bindData(re, 'title');
                            historyData = re;
                            hoverControl.call(_this);
                        }
                    }
                })
            }
        }).on('input', function (e) {
            var _this = this;
            pVal = $.trim($ser.val());
            if (pVal) {
                $.ajax({
                    url: url,
                    type: 'get',
                    dataType: 'jsonP',
                    jsonp: 'cb',
                    cache: false,
                    data: {
                        wd: pVal, // 查询关键词
                        json: 1
                    },
                    success: function (re) {
                        if (re.g) {
                            bindData(re.g, 'q');
                            hoverControl.call(_this);
                        }
                    }
                })
            } else if (!pVal) {
                bindData(historyData, 'title');
                _this.contInd = -1;
                hoverControl.call(_this);
            }
        }).on('keydown', function (e) {
            var _this = this;
            keyControl.call(_this, e);
        });
        //绑定数据
        function bindData(data, n) {
            var $resultBox = $('.searchsuggest');
            var htmlx = '';
            $.each(data, function (i) {
                if (i <= 5) {
                    htmlx += '<li class="suggestlist">' + data[i][n] + '</li>'
                }
                $resultBox.html(htmlx);
            })
        }

        //键盘控制上下以及enter搜索
        function keyControl(e) {
            if (e.keyCode === 40) {
                this.contInd++;
                listSelect.call(this);
            } else if (e.keyCode === 38) {
                this.contInd--;
                listSelect.call(this);
            } else if (e.keyCode === 13) {
                var gourl = 'https://www.baidu.com/s?&rsv_spt=1&wd=' + $(this).val();
                window.location.href = gourl;
            }
        }

        //当前词条样式控制
        function listSelect() {
            var $suggestList = $(this).next().children('.suggestlist');
            var txt;
            if (this.contInd >= $suggestList.length - 1) {
                this.contInd = -1;
            } else if (this.contInd < -1) {
                this.contInd = $suggestList.last().index() - 1;
            }
            $suggestList.eq(this.contInd).addClass('cur').siblings('.suggestlist').removeClass('cur');
            txt = $suggestList.eq(this.contInd).text();
            $(this).val(txt);
        }

        //鼠标滑过控制选中以及搜索当前词条
        function hoverControl() {
            var $suggestList = $(this).next().children();
            var t = this;
            $suggestList.on('mouseenter', function () {
                $suggestList.eq($(this).index()).addClass('cur').siblings('.suggestlist').removeClass('cur');
                t.contInd = $(this).index();
                $(this).on('click', function (e) {
                    var gourl = 'https://www.baidu.com/s?&rsv_spt=1&wd=' + $(this).html();
                    window.location.href = gourl;
                })
            })
        }
    },
    slideDownMenu: function (hbox, curEle, downEle) {
        $(hbox).on('mouseenter', $(curEle), function () {
            $(downEle).stop().slideDown();
        }).on('mouseleave', function () {
            $(downEle).stop().slideUp();
        })
    }

};
$(function () {
    cps.public.init();
});