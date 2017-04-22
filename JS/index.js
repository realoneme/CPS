/**
 * Created by rebec on 2017/4/22.
 */
//hoverMove -> when mouse hovers on a element, its left value changes.


// $('.xxx').hoverMove({
// target:{
//     left:200
//
// }
// });


var index = index || {};

index.indexpage = {
    init: function () {
        var that = this;
        that.swiperWords();
        that.hoverMove();
    },
    swiperWords: function () {
        var arrowL = $('.J_swiperblock').find('.J_left'),
            arrowR = $('.J_swiperblock').find('.J_right');
        var conTitle = $('.goodwords__title'),
            conPar = $('.goodwords__par'),
            conUrl = $('.J_arturl');
        var url = './data/artdata.json?=' + new Date();
        $.ajax({
            type: 'get',
            dataType: 'json',
            cache: false,
            url: url,
            success: function (result) {
                var dt = result[0].title,
                    dd = result[0].cont,
                    du = result[0].url;
                conTitle.html(dt);
                conPar.html(dd);
                conUrl.eq(0).attr('href',du);
                changeData(result);
            }
        });
        function changeData(data) {
            var len = data.length;
            var st = 0;
            var dt, dd, du;

            arrowL.on('click', function () {
                st--;
                console.log(st);
                if (st < 0) {
                    st = data.length - 1;
                }
                showData(data);
            });
            arrowR.on('click', function () {
                st++;
                if (st > len - 1) {
                    st = 0;
                }
                showData(data);
            });
            function showData(d) {
                dt = d[st].title;
                dd = d[st].cont;
                du = d[st].url;
                conTitle.html(dt);
                conPar.html(dd);
                conUrl.eq(0).attr('href',du);
            }
        }
    },
    hoverMove: function () {
        var $hoverBox = $('.rectag_inner');
        $hoverBox.on('mouseenter',function () {
            $(this).children('.cover-intro').css({left:'0px','box-shadow':'8px 8px 10px #21272f'});
            $(this).children('.cover-img').css({left:'71px','box-shadow':'0px 0px 5px #21272f'});
        }).on('mouseleave',function () {
            $(this).children('.cover-intro').css({left:'20px','box-shadow':'13px 8px 30px #313a46'});
            $(this).children('.cover-img').css({left:'40px','box-shadow':'none'});
        })
    }
};
$(function () {
    index.indexpage.init();
});