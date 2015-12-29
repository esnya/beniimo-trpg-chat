$(function () {
	"use strict";

	$("#chat").find(".chat-template").each(function (index, element) {
		var template = $(element);
		var model = template.data("model");
		for (var i = 0; i < 5; ++i) {
			var item = template.clone().removeClass("chat-template");

			item.find(".chat-field").each(function (index, element) {
				var field = $(element);
				field.text(field.data('field') + '_' + i);
			});

			if (item.is(".chat-field")) {
				item.text(item.data('field') + '_' + i);
			}

			if (model == "Map") {
				var id = "chat-view-map-" + i;
				item.find("a").attr("href", "#" + id);
				console.log(item);
				if (item.is(".tab-pane")) {
					item.attr("id", id);
				}
			}

			item.insertBefore(template);
		}
	});

	$(".nav-tabs > li:first-child, .tab-contents > .tab-pane:first-child").addClass("active");

	$(".chat-button").click(function () {
		var button = $(this);
		switch (button.data("action")) {
			case "join":
			case "view":
				  $("#chat").attr("data-mode", "view");
				  break;
			case "logout":
				  $("#chat").attr("data-mode", "index");
				  break;
		}
	});

});
