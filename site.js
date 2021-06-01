
$.extend($.easing,
{
    def: 'easeOutQuad',
    easeInOutExpo: function (x, t, b, c, d) {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
});

(function( $ ) {

    var settings;
    var disableScrollFn = false;
    var navItems;
    var navs = {}, sections = {};

    $.fn.navScroller = function(options) {
        settings = $.extend({
            scrollToOffset: 170,
            scrollSpeed: 800,
            activateParentNode: true,
        }, options );
        navItems = this;

        //attatch click listeners
    	navItems.on('click', function(event){
    		event.preventDefault();
            var navID = $(this).attr("href").substring(1);
            disableScrollFn = true;
            activateNav(navID);
            populateDestinations(); //recalculate these!
        	$('html,body').animate({scrollTop: sections[navID] - settings.scrollToOffset},
                settings.scrollSpeed, "easeInOutExpo", function(){
                    disableScrollFn = false;
                }
            );
    	});

        //populate lookup of clicable elements and destination sections
        populateDestinations(); //should also be run on browser resize, btw

        // setup scroll listener
        $(document).scroll(function(){
            if (disableScrollFn) { return; }
            var page_height = $(window).height();
            var pos = $(this).scrollTop();
            for (i in sections) {
                if ((pos + settings.scrollToOffset >= sections[i]) && sections[i] < pos + page_height){
                    activateNav(i);
                }
            }
        });
    };

    function populateDestinations() {
        navItems.each(function(){
            var scrollID = $(this).attr('href').substring(1);
            navs[scrollID] = (settings.activateParentNode)? this.parentNode : this;
            sections[scrollID] = $(document.getElementById(scrollID)).offset().top;
        });
    }

    function activateNav(navID) {
        for (nav in navs) { $(navs[nav]).removeClass('active'); }
        $(navs[navID]).addClass('active');
    }
})( jQuery );


$(document).ready(function (){

    $('nav li a').navScroller();

    //section divider icon click gently scrolls to reveal the section
	$(".sectiondivider").on('click', function(event) {
    	$('html,body').animate({scrollTop: $(event.target.parentNode).offset().top - 50}, 400, "linear");
	});

    //links going to other sections nicely scroll
	$(".container a").each(function(){
        if ($(this).attr("href").charAt(0) == '#'){
            $(this).on('click', function(event) {
        		event.preventDefault();
                var target = $(event.target).closest("a");
                var targetHight =  $(target.attr("href")).offset().top
            	$('html,body').animate({scrollTop: targetHight - 170}, 800, "easeInOutExpo");
            });
        }
	});

});

$("#signup").submit(function( event ) {
    event.preventDefault();
    $("#signupbutton").prop("disabled",true);
    var target = event.currentTarget.action
    var identifier = target.substring(target.lastIndexOf('/') + 1);
    $.ajax({
        method: 'POST',
        url: 'https://formsubmit.co/ajax/' + identifier,
        dataType: 'json',
        accepts: 'application/json',
        data: {
            name: $('#name').val(),
            email: $('#email').val(),
            message: $('#message').val(),
            _subject: "[Mitmachen]",
            _template: "table"
        },
        success: (data) => {
            console.log(data);
            if (true == data.success) {
                signupSuccess()
            } else {
                signupError()
            }
        },
        error: (err) => errorMessage()
    });
});

function signupSuccess() {
    $("#signuperror").fadeOut("fast");
    $("#signup").fadeTo(500, 0);
    $("#signupsuccess").css('z-index', 999).fadeTo(500, 1);
}

function signupError() {
    var error = $("#signuperror");
    error.html(atob("RmVobGVyIGJlaW0gYW5tZWxkZW4sIGJpdHRlIHZlcnN1Y2hlIGVzIHNwJmF1bWw7dGVyIG5vY2htYWwgb2RlciBzZW5kZSBlaW5lIGVtYWlsIGFuIDxhIGhyZWY9Im1haWx0bzptaXRtYWNoZW5AaWNoem9ja2UuYXQ/c3ViamVjdD1bTWl0bWFjaGVuXSI+bWl0bWFjaGVuQGljaHpvY2tlLmF0PC9hPg=="));
    error.fadeIn(500);
    $('html,body').animate({scrollTop: error.offset().top - 170}, 500, "easeInOutExpo");
    $("#signupbutton").prop("disabled",false);
}