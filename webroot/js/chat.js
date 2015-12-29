var Inflector;
(function (Inflector) {
    Inflector.underscore = function (str) {
        return str.replace(/^[A-Z]/, function (m) {
            return m.toLowerCase();
        }).replace(/[A-Z]/g, function (m) {
            return '_' + m.toLowerCase();
        });
    };

    Inflector.camelize = function (str) {
        return str.replace(/(^[a-z])|(_[a-z])/g, function (m) {
            return ((m.charAt(0) == '_') ? m.charAt(1) : m).toUpperCase();
        });
    };
})(Inflector || (Inflector = {}));


var Chat;
$(function () {
    "use strict";

    (function (Chat) {
        Chat.init = function () {

            Chat.connected = false;
            Chat.authorized = false;

            var error = function () {
                $("#chat-modal-failed").modal("show");
            };

            Chat.forgetMessageHistory = function () {
                $("#chat-view-message-form-message").attr("message", "message" + (new Date).getTime());
            };
            Chat.forgetMessageHistory();

            var url = "ws://chat-dev.takiri.shy.jp/";
            var socket;
            if ("WebSocket" in window) {
                socket = new WebSocket(url);
            } else {
                error();
                return;
            }

            var send = function (type, data) {
                socket.send(JSON.stringify({
                    type: type,
                    data: data
                }));
            };

            socket.onopen = function (event) {
                console.log("Connected");
                Chat.connected = true;
                send("hello", user_id);
            };

            var onButton = {
                join: function () {
                    var id = $(this).closest(".chat-room").data("id");
                    $("#chat-view .chat-list .chat-item:not(.chat-teamplate)").remove();
                    send("join", id);
                },
                logout: function () {
                    Chat.room_id = null;
                    $("#chat").attr("data-mode", "index");
                }
            };
            var initButtons = function (target) {
                var buttons;
                if (target === undefined) {
                    buttons = $(".chat-button");
                } else {
                    buttons = target.find(".chat-button");
                }
                buttons.click(function (event) {
                    var action = $(this).data("action");
                    if (action in onButton) {
                        onButton[action].bind(this)(event);
                    }
                });
                return target;
            }
            initButtons();
			var initInputs = function (target) {
				var inputs;
				if (target === undefined) {
					inputs = $(".chat-form .chat-input");
				} else {
					inputs = target.find(".chat-input");
				}
				inputs.focus(function (event) {
					var input = $(this);
					input.data("oldvalue", input.val());
				});
				inputs.click(function (event) {
					var input = $(this);
					if (input.is("[type=radio], [type=checkbox]")) {
						var value = input.val();
						var form = input.closest(".chat-form");
						Chat.set(form.data("model"), user_id, input.attr("name"), value);
					}
				});
				inputs.blur(function (event) {
					var input = $(this);
					var value = input.val();
					if (value != input.data("oldvalue")) {
						var form = input.closest(".chat-form");
						Chat.set(form.data("model"), user_id, input.attr("name"), value);
					}
				});
				return target;
			}
			initInputs();

            var cache = {};
            var models = {
                Room: {
                    belongsTo: ["User", "GameType"]
                },
                Client: {
                    belongsTo: ["User"]
                },
                CharacterInstance: {
                    belongsTo: ["User"]
                }
            };
            var onData = {
                Room: function (list) {
                    for (var i in list) {
                        var data = list[i];
                        if (data.id == Chat.room_id) {
                            $("#chat-room-name").text(data.name);
                            $("#chat-view-setting-room-name").val(data.name);
                        }
                    }
                },
                Message: function (list) {
                    for (var i in list) {
                        var data = list[i];
                        $("#chat-view .chat-message[data-id=" + data.id + "]").attr("data-type", data.type);
                    }
                },
                Client: function (list) {
                    for (var i in list) {
                        var data = list[i];
                        $("#chat-view .chat-client[data-id=" + data.id + "]").attr("data-mode", data.mode);

						if (data.id == user_id && data.room_id) {
							var form = $("#chat-view-message-setting");
							form.find("#chat-view-message-setting-characterinstance").prop("disabled", data.message_type != 2);
							form.find("#chat-view-message-setting-name").prop("disabled", data.message_type != 3);
						}
                    }
                },
                CharacterInstance: function (list) {
                    for (var i in list) {
                        var data = list[i];
                        $("#chat-view .chat-character[data-id=" + data.id + "]").attr("data-type", data.type);
                    }
                },
            };

			var insertFilter = {
				CharacterInstance: function (data) {
					return this.attr("id") != "chat-view-message-setting-characterinstance" || data.user_id == user_id;
				},
			};

            var onMessage = {
                hello: function () {
                    Chat.authorized = true;
                    $("#chat-modal-connecting").modal("hide");
                },
                joinok: function (data) {
                    Chat.room_id = data.id;
                    Chat.mode = data.mode;
                    findById("Room", data.id);
                    $("#chat").attr("data-mode", "view");
                    if (data.mode == "master") {
                        $("#chat").attr("data-master", true);
                    } else {
                        $("#chat").removeAttr("data-master");
                    }
                },
                data: function (data) {
                    var model = data.model;
                    var list = {};

                    if (!(model in cache)) {
                        cache[model] = {};
                    }

                    for (var i in data.data) {
                        cache[model][data.data[i].id] = data.data[i];
                        list[data.data[i].id] = data.data[i];
                    }

                    $(".chat-list[data-model=" + model + "]").each(function (index, element) {
                        var target = $(element);

                        for (var id in list) {
                            var data = list[id];
							if (!(model in insertFilter) || insertFilter[model].bind(target)(data)) {
								if (target.find(".chat-item[data-id=" + data.id + "]").length == 0) {
									var template = target.find(".chat-template");
									var item = initInputs(initButtons(template.clone().removeClass("chat-template").addClass("chat-item").attr("data-id", data.id)));
									if (item.val() == "%%id%%") {
										item.val(data.id);
									}
									if (target.attr("data-reverse")) {
										item.insertAfter(template);
									} else {
										item.insertBefore(template);
									}
								}

								if (model in models) {
									for (var j = 0; j < models[model].belongsTo.length; ++j) {
										var parent = models[model].belongsTo[j];
										findById(parent, data[Inflector.underscore(parent) + "_id"]);
									}
								}
							}
                        }
                    });

                    $(".chat-field[data-model=" + model + "]").each(function (index, element) {
                        var target = $(element);
                        var field = target.data("field");

                        var item = target.closest(".chat-item");
                        var item_model = item.data("model");
                        var id;

                        if (item_model == model) {
                            id = item.data("id");
                        } else if (item_model in cache) {
                            id = cache[item_model][item.data("id")][Inflector.underscore(model) + "_id"];
                        }

                        if ((id in list) && (field in list[id])) {
                            target.text(list[id][field]);
                        }
                    });

					for (var i in list) {
						for (var field in list[i]) {
							var target = $(".chat-form[data-model=" + model + "][data-id=" + list[i].id + "] .chat-input[name=" + field + "]")
							target.val([list[i][field]]);
						}
					}

                    if (model in onData) {
                        onData[model](list);
                    }
                }
            };
            var findAll = function (model) {
                send("requestall", model);
            }
            var findById = function (model, id) {
                if ((model in cache) && (id in cache[model])) {
                    onMessage.data({
                        model: model,
                        data: {
                            0: cache[model][id]
                        }
                    });
                } else {
                    send("requestbyid", {
                        model: model,
                        id: id
                    });
                }
            }

            socket.onmessage = function (event) {
                var data = JSON.parse(event.data);

                console.log(data);
                if (data.type in onMessage) {
                    onMessage[data.type](data.data);
                }
            };

            socket.onclose = function (event) {
                console.log("Socket closed");
                Chat.failed = true;
                $("#chat-modal-connecting").modal("hide");
                $("#chat-modal-closed").modal("show");
            };

            Chat.set = function (model, id, field, value) {
                switch (model) {
                    case "Room":
                        if (Chat.mode != "master" || Chat.room_id != id) {
                            return;
                        }
                    break;
                }

                send("set", {
                    model: model,
                    id: id,
                    field: field,
                    value: value
                });
            };

            Chat.add = function (model, data) {
                if (Chat.room_id) {
                    send("add", {
                        model: model,
                        data: data
                    });
                }
            }
        };

        Chat.init();
    })(Chat || (Chat = {}));

    $("#chat-modal-connecting").bind("hide.bs.modal", function () {
        return Chat.connected || Chat.failed;
    });
    if (!Chat.connected) {
        $("#chat-modal-connecting").modal("show");
    }
    $("#chat-modal-failed").bind("hide.bs.modal", function () {
        return false;
    });

    $("#chat-index .chat-room").click(function () {
        $(this).closest(".chat-room")[0].focus();
    });
    
    $("#chat-view-setting-room-name").blur(function () {
        Chat.set("Room", Chat.room_id, "name", $(this).val());
    });

    $("#chat-view-message-form").submit(function () {
        var message = $("#chat-view-message-form-message");
        Chat.add("Message", {
            message: message.val()
        });
        message.val("");
        Chat.forgetMessageHistory();
    });

	$("#chat-view-message-setting").submit(function () {
		$("#chat-view-modal-message-setting").modal("hide");
	});
});
