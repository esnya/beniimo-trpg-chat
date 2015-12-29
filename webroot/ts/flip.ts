/// <reference path="jquery.d.ts"/>

(function() {
	$.fn.flip = function(options: any){
		this.find('.flip-panel').toggleClass('flip-active');
	};
})();
