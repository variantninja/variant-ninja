jQuery(document).ready(function(t){"use strict";t(".intro"),t(".content-wrap"),t(".footer");t(".scroll").click(function(e){var o=t(this).data("offset-top");t("html").velocity("scroll",{offset:t(this.hash).offset().top-o,duration:1e3,easing:"easeOutExpo"}),e.preventDefault()}),t(".scrollup").click(function(e){e.preventDefault(),t("html").velocity("scroll",{offset:0,duration:1400,mobileHA:!1}),t(window).scrollTop()});var e,o=t("#scroll-nav"),r=o.outerHeight(),n=o.find("a"),i=n.map(function(){var e=t(t(this).attr("href"));return e.length?e:void 0});t(window).scroll(function(){var o=t(this).scrollTop()+r+200,l=i.map(function(){return t(this).offset().top<o?this:void 0});l=l[l.length-1];var a=l&&l.length?l[0].id:"";e!==a&&(e=a,n.parent().removeClass("active").end().filter("[href=#"+a+"]").parent().addClass("active"))})});