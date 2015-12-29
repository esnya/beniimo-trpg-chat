/// <reference path="jquery.d.ts"/>
(function () {
    $.fn.flip = function (options) {
        this.find('.flip-panel').toggleClass('flip-active');
    };
})();
