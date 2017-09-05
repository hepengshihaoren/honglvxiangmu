$(function () {
    tab();
    slide();
    sidebar();
    lianzai();
    zhuanti();
    back();
})

function slide() {
    $.ajax({
        url: url+"api/getlunbo",
        dataType: "json",
        success: function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                html += '<div class="swiper-slide">' +
                    '<a href="' + data[i].url + '"><img src="' + data[i].img + '" alt=""></a>' +
                    '<div><p>' + data[i].title + '</p></div>' +
                    '</div>'
            }
            $('.swiper-wrapper').append(html);
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                slidesPerView: 1,
                loop: true, 
                autoplay: 2000, 
                autoplayDisableOnInteraction: false, 
                simulateTouch: true
            });
        }
    });
}


function tab() {

    function getData(index) {
        $.ajax({
            url: url+"api/gethometab/" + index,
            success: function (data) {
                $('#tab .tab-content ul').html(template('temp-tab-content', data));
            }
        });
    }

    getData(1);

    $('#tab .tab-top ul').on('tap', 'a', function () {
        var index = $(this).parent().index() + 1;
        $(this).parent().siblings().find('a').removeClass('active');
        $(this).addClass('active');
        getData(index);
    });
}



function sidebar() {
    var windowWidth;
    var windowHeight;
    $(window).on('resize', function () {
        windowWidth = $('#layout').width() * 0.7;
        windowHeight = $(window).height();
    }).trigger('resize');
    $('.dropDown').tap(function () {
        $('#sidebar').css({
            'width': windowWidth + 'px',
            'left': -windowWidth + 'px'
        })
        $('#sidebar').show().animate({
            transform: 'translate(' + windowWidth + 'px)'
        }, 300);
        $('#layout').css('height', windowHeight);
        $('#layout .mast').show().animate({
            transform: 'translate(' + windowWidth + 'px)'
        }, 300);
        $('#sidebar').css('height', '100%');
        $('#wrap').animate({
            transform: 'translate(' + windowWidth + 'px)'
        }, 300)
    })
    $('.mast').tap(function () {
        mainBack();
        $('#layout').css('height', 'auto');
        $('#layout .mast').hide().animate({
            transform: 'translate(' + 0 + 'px)'
        }, 300);
        $('#wrap').animate({
            transform: 'translate(' + 0 + 'px)'
        }, 300)
    })
}


function lianzai() {

    $('.dongman').tap(function () {
        getDongManDate(url+"api/getlianzai");
    })
}

function zhuanti() {

    $('.zhuanti').tap(function () {
        getDongManDate(url+'api/gettopics');
    })
}


function getDongManDate(url) {
    $.ajax({
        url: url,
        success: function (data) {
            var datas = {
                list: data
            }
            $('#content').html(template('temp-content', datas));
            $('#content').show().animate({
                transform: 'translateX(0px)'
            }, 300, function () {
                $('#layout .mast').hide().css({
                    transform: 'translate(' + 0 + 'px)'
                });
                $('#wrap').css({
                    transform: 'translate(' + 0 + 'px)'
                })
            })
            mainBack();
            $('#layout').css({
                'height': 'auto',
                'overflow': 'visible'
            });

        }
    });
}

function mainBack() {
    $('#sidebar').animate({
        transform: 'translate(' + 0 + 'px)'
    }, 300, function () {
        $('#sidebar').css({
            'width': 0 + 'px',
            'height': 0 + 'px',
            'left': 0 + 'px'
        })
        $('#sidebar').hide();
    });
}

function back() {
    $('#content').on('tap', '.back', (function () {
        $('#content').animate({
            transform: 'translateX(100%)'
        }, 300, function () {
            $('#content').hide();
        })
        $('#layout').css({
            'overflow': 'hidden'
        });
    }))
}



function allSlide() {
    var startY = 0,
        moveY = 0,
        distanceY = 0,
        currentY = 0;
    var maxSwiper = 80;
    var minSwiper = $('#layout').height() - $('#wrap').height() - 80;
    var maxPosition = 0;
    var minPosition = $('#layout').height() - $('#wrap').height();
    $('#wrap').on('touchstart', function (event) {
        startY = event.touches[0].clientY;
    })
    $('#wrap').on('touchmove', function (event) {
        moveY = event.touches[0].clientY;
        distanceY = moveY - startY;
        // console.log(distanceY);
        if ((distanceY + currentY) < maxSwiper && (distanceY + currentY) > minSwiper) {
            $('#wrap').css({
                'transform': 'translateY(' + (distanceY + currentY) + 'px)',
                'transition': 'none'
            });
        }
    })
    $('#wrap').on('touchend', function () {
        currentY += distanceY;
        if (currentY > maxPosition) {
            $('#wrap').css({
                'transform': 'translateY(' + maxPosition + 'px)',
                'transition': 'all 0.2s'
            })
            currentY = maxPosition;
        } else if (currentY < minPosition) {
            $('#wrap').css({
                'transform': 'translateY(' + minPosition + 'px)',
                'transition': 'all 0.2s'
            })
            currentY = minPosition;
        }
    })
}