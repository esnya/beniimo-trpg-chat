QUnit.config.autostart = false;

var TestData = {};
var initTestData = function () {
    TestData = 
    {Room: [
        {
            id: 1,
            name: "Room1",
            user_id: user_id,
            game_type_id: "sword_world2",
            players: 1
        },
        {
            id: 2,
            name: "Room2",
            user_id: "user2",
            game_type_id: "kancolle",
            players: 10
        },
        {
            id: 4,
            name: "Room4",
            user_id: "user4",
            game_type_id: "kancolle",
            players: 0
        }],
        GameType: [
        {
            id: "sword_world2",
            name: "Sword World 2.0"
        },
        {
            id: "kancolle",
            name: "Kancolle RPG"
        }],
        User: [
        {
            id: user_id,
            name: "Current User"
        },
        {
            id: "user2",
            name: "User 2"
        },
        {
            id: "user4",
            name: "User 4"
        }],
        Client: [
        {
            id: user_id,
            user_id: user_id,
            name: "Current User",
            room_id: 1,
			message_type: 1,
            mode: "master"
        },
        {
            id: "user4",
            user_id: "user4",
            name: "PC3",
			message_type: 2,
            room_id: 1,
            mode: "player"
        },
        {
            id: "user2",
            user_id: "user2",
            name: "User 2",
			message_type: null,
            room_id: null,
            mode: null
        }],
        CharacterInstance: [
        {
            id: 1,
            name: "PC1",
            type: 1,
            room_id: 1,
            user_id: user_id, 
            parameters: "10/20"
        },
        {
            id: 2,
            name: "NPC2",
            type: 0,
            room_id: 1,
            user_id: user_id, 
            parameters: "20/20"
        },
        {
            id: 3,
            name: "PC3",
            type: 1,
            room_id: 1,
            user_id: "user4", 
            parameters: "20/10"
        }],
        Message: [
        {
            id: 1,
            room_id: 1,
            user_id: user_id,
            name: "Current User",
            type: 2,
            message: "Message 1 of Room1",
            created: "00:00",
            modified: "00:00"
        },
        {
            id: 2,
            room_id: 1,
            user_id: user_id,
            name: "Current User",
            type: 2,
            message: "Message 2 of Room1",
            created: "00:00",
            modified: "00:00"
        },
        {
            id: 3,
            room_id: 1,
            user_id: user_id,
            name: "Current User",
            type: 2,
            message: "Message 3 of Room1",
            created: "00:00",
            modified: "00:00"
        },
        {
            id: 4,
            room_id: 1,
            user_id: null,
            name: "System",
            type: 0,
            message: "Message 4 of Room1",
            created: "00:00",
            modified: "00:00"
        },
        {
            id: 5,
            room_id: 1,
            user_id: user_id,
            type: 1,
            name: "GM",
            message: "Message 5 of Room1",
            created: "00:00",
            modified: "00:00"
        },
        {
            id: 6,
            room_id: 1,
            user_id: "user2",
            type: 2,
            name: "User 2",
            message: "Message 6 of Room1",
            created: "00:00",
            modified: "00:00"
        },
        {
            id: 7,
            room_id: 1,
            user_id: user_id,
            type: 2,
            name: "Current User",
            message: "Message 7 of Room1",
            created: "00:00",
            modified: "00:00"
        },
        {
            id: 8,
            room_id: 1,
            user_id: user_id,
            type: 2,
            name: "Current User",
            message: "Message 8 of Room1",
            created: "00:00",
            modified: "00:00"
        },
        {
            id: 9,
            room_id: 1,
            user_id: "user2",
            type: 2,
            name: "User 2",
            message: "Message 9 of Room1",
            created: "00:00",
            modified: "00:00"
        },
        {
            id: 10,
            room_id: 1,
            user_id: "user4",
            type: 2,
            name: "User 4",
            message: "Message 10 of Room1",
            created: "00:00",
            modified: "00:00"
        },
        {
            id: 11,
            room_id: 2,
            user_id: user_id,
            type: 2,
            message: "Message 11 of Room2",
            created: "00:00",
            modified: "00:00"
        }],
    };

};
initTestData();

QUnit.module("chat", {
    setup: function (assert) {
        initTestData();
    }
});

var debug = {};
var Weight = 0.5;

window.WebSocket = function () {
    var mock = {
        onopen: null,
        onmessage: null
    };

    var room_id = null;
    mock.send = function (message) {
        var data = JSON.parse(message);
        console.debug("Send:", data);

        var callbacks = {
            hello: function (model) {
                callbacks.requestall("Room");
            },
            requestall: function (model) {
                var result = [];
                switch (model) {
                    case "Message":
                    case "Room":
                    case "CharacterInstance":
                    case "Client":
                        for (var i = TestData[model].length - 1; i >= 0; --i) {
                            if (TestData[model][i].room_id == room_id) {
                                result.push(TestData[model][i]);
                            }
                        }
                        break;
                    default:
                        result = TestData[model];
                }
                send("data", {
                    model: model,
                    data: result
                })
            },
            requestbyid: function (data) {
                var array = TestData[data.model];
                if (array) {
                    for (var i = 0; i < array.length; ++i) {
                        if (array[i].id == data.id) {
                            send("data", {
                                model: data.model,
                                data: [array[i]]
                            });
                        }
                    }
                }
            },
            join: function (id) {
                if (id == 1 || id == 4) {
                    room_id = id;
                    send("joinok", {
                        id: room_id,
                        mode: (id == 1) ? "master" : "player"
                    });
                    callbacks.requestall("Message");
                    callbacks.requestall("CharacterInstance");
                    callbacks.requestall("Client");
                }
            },
            set: function (data) {
                for (var i = 0; i < TestData[data.model].length; ++i) {
                    if (data.id == TestData[data.model][i].id) {
                        TestData[data.model][i][data.field] = data.value;

						switch (data.model) {
							case "Client":
								if (TestData.Client[0].message_type == 1) {
									TestData.Client[0].name = "Current User";
								} else if (TestData.Client[0].message_type == 2) {
									for (var i = 0; i < 3; ++i) {
										if (TestData.CharacterInstance[i].user_id == user_id && TestData.CharacterInstance[i].id == TestData.Client[0].character_instance_id) {
											TestData.Client[0].name = TestData.CharacterInstance[i].name;
											break;
										}
									}
								}
								break;
						}

                        callbacks.requestbyid({
                            model: data.model,
                            id: data.id
                        });
                        return;
                    }
                }
            },
            add: function (data) {
                switch (data.model) {
                    case "Message":
                        if (!room_id) {
                            return;
                        }
                        data.data.room_id = room_id;
                        data.data.user_id = user_id;
                        data.data.type = 2;
                        var date = new Date;
                        data.data.created = data.data.modified = date.getHours() + ":" + date.getMinutes();
                        for (var i = 0; i < TestData.Client.length; ++i) {
                            if (TestData.Client[i].user_id == user_id) {
                                data.data.name = TestData.Client[i].name;
                                break;
                            }
                        }
                        break;
                    default:
                        return;
                }

                data.data.id = TestData[data.model][TestData[data.model].length-1].id + 1;

                TestData[data.model].push(data.data);

                callbacks.requestbyid({
                    model: data.model,
                    id: data.data.id
                });
            }
        };

        if (data.type in callbacks) {
            callbacks[data.type](data.data);
        }
    };

    var send = function (type, data) {
        var packet = {
            type: type,
            data: data
        };

        console.debug("Receive:", packet);
        mock.onmessage({
            data: JSON.stringify(packet)
        });
    };
    debug.send = send;

    setTimeout(function () {
        if (mock.onopen) {
            mock.onopen({});
            send("hello");
        }
    }, 0);

    return mock;
};

$(function () {
    $("#chat-modal-test").modal("show");
});

$(function () {
    setTimeout(function () {
        QUnit.start();
    }, 1000);
});

QUnit.test("connected", function (assert) {
    assert.ok(Chat.connected);
});

QUnit.test("authorized", function (assert) {
    assert.ok(Chat.authorized);
});

QUnit.test("connecting dialog", function (assert) {
    assert.equal($("#chat-modal-connecting").css("display"), "none");
});

QUnit.asyncTest("room list", function (assert) {
    expect(1 + 3 * 4);
    setTimeout(function () {
        var rooms = $("#chat-index .chat-room:not(.chat-template)");
        assert.equal(rooms.length, 3);

        rooms.each(function (index, element) {
            var i = 3 - index - 1;
            var room = $(element);
            assert.equal(room.find(".chat-field[data-model=Room][data-field=name]").text(), TestData.Room[i].name);
            assert.equal(room.find(".chat-field[data-model=User][data-field=name]").text(), ["User 4", "User 2", "Current User"][index]);
            assert.equal(room.find(".chat-field[data-model=GameType][data-field=name]").text(), ["Kancolle RPG", "Kancolle RPG", "Sword World 2.0"][index]);
            assert.equal(room.find(".chat-field[data-model=Room][data-field=players]").text(), TestData.Room[i].players);
        });

        QUnit.start();
    }, Weight);
});

QUnit.asyncTest("room update", function (assert) {
    expect(2);

    setTimeout(function () {
        TestData.Room[1].players = 5;
        debug.send("data", {
            model: "Room",
            data: [TestData.Room[1]]
        });
        setTimeout(function () {
            assert.equal($("#chat-index .chat-room:not(.chat-template)").length, 3);
            assert.equal($("#chat-index .chat-room[data-id=2] .chat-field[data-model=Room][data-field=players]").text(), "5");
            QUnit.start();
        }, Weight);
    }, Weight);
});

QUnit.asyncTest("join logout", function (assert) {
    expect(6);

    setTimeout(function () {
        assert.equal($("#chat").attr("data-mode"), "index");
        $("#chat-index .chat-room[data-id=4] .chat-button[data-action=join]").trigger("click");
        setTimeout(function () {
            assert.equal($("#chat").attr("data-mode"), "view");
            assert.equal(Chat.room_id, 4);
            assert.equal($("#chat-room-name").text(), "Room4");
            $(".chat-button[data-action=logout]").trigger("click");
            setTimeout(function () {
                assert.equal($("#chat").attr("data-mode"), "index");
                assert.equal(Chat.room_id, null);
                QUnit.start();
            }, Weight);
        }, Weight);
    }, Weight);
});

QUnit.asyncTest("message list", function (assert) {
    expect(2 + 10 * 4);

    setTimeout(function () {
        $("#chat-index .chat-room[data-id=1] .chat-button[data-action=join]").trigger("click");
        setTimeout(function () {
            var messages = $("#chat-view .chat-message:not(.chat-template)");
            assert.equal(messages.length, 10);

            messages.each(function (index, element) {
                var i = index;
                var message = $(element);
                assert.equal(message.attr("data-type"), TestData.Message[i].type);
                assert.equal(message.find(".chat-field[data-field=name]").text(), TestData.Message[i].name);
                assert.equal(message.find(".chat-field[data-field=message]").text(), TestData.Message[i].message);
                assert.equal(message.find(".chat-field[data-field=modified]").text(), TestData.Message[i].modified);
            });

            $(".chat-button[data-action=logout]").trigger("click");
            setTimeout(function () {
                $("#chat-index .chat-room[data-id=4] .chat-button[data-action=join]").trigger("click");
                setTimeout(function () {
                    var messages = $("#chat-view .chat-message:not(.chat-template)");
                    assert.equal(messages.length, 0);
                    $(".chat-button[data-action=logout]").trigger("click");
                    setTimeout(function () {
                        QUnit.start();
                    }, Weight);
                }, Weight);
            }, Weight);
        }, Weight);
    }, Weight);
});

QUnit.asyncTest("character list", function (assert) {
    expect(2 + 3 * 3);

    setTimeout(function () {
        $("#chat-index .chat-room[data-id=1] .chat-button[data-action=join]").trigger("click");
        setTimeout(function () {
            var characters = $("#chat-view .chat-character:not(.chat-template)");
            assert.equal(characters.length, 3);

            characters.each(function (index, element) {
                var i = index;
                var character = $(element);
                assert.equal(character.attr("data-type"), TestData.CharacterInstance[i].type);
                assert.equal(character.find(".chat-field[data-model=CharacterInstance][data-field=name]").text(), TestData.CharacterInstance[i].name);
                assert.equal(character.find(".chat-field[data-model=User][data-field=name]").text(), ["Current User", "Current User", "User 4"][i]);
            });

            $(".chat-button[data-action=logout]").trigger("click");
            setTimeout(function () {
                $("#chat-index .chat-room[data-id=4] .chat-button[data-action=join]").trigger("click");
                setTimeout(function () {
                    var characters = $("#chat-view .chat-character:not(.chat-template)");
                    assert.equal(characters.length, 0);
                    $(".chat-button[data-action=logout]").trigger("click");
                    setTimeout(function () {
                        QUnit.start();
                    }, Weight);
                }, Weight);
            }, Weight);
        }, Weight);
    }, Weight);
});

QUnit.asyncTest("client list", function (assert) {
    expect(2 + 2 * 3);

    setTimeout(function () {
        $("#chat-index .chat-room[data-id=1] .chat-button[data-action=join]").trigger("click");
        setTimeout(function () {
            var clients = $("#chat-view .chat-client:not(.chat-template)");
            assert.equal(clients.length, 2);

            clients.each(function (index, element) {
                var client = $(element);
                for (var i = 0; i < TestData.Client.length; ++i) {
                    if (client.data("id") == TestData.Client[i].id) {
                        assert.equal(client.attr("data-mode"), TestData.Client[i].mode);
                        var table = {user4: "User 4"};
                        table[user_id] = "Current User";
                        assert.equal(client.find(".chat-field[data-model=User][data-field=name]").text(), table[TestData.Client[i].user_id]);
                        assert.equal(client.find(".chat-field[data-model=Client][data-field=name]").text(), TestData.Client[i].name);
                        break;
                    }
                }
            });

            $(".chat-button[data-action=logout]").trigger("click");
            setTimeout(function () {
                $("#chat-index .chat-room[data-id=4] .chat-button[data-action=join]").trigger("click");
                setTimeout(function () {
                    var clients = $("#chat-view .chat-client:not(.chat-template)");
                    assert.equal(clients.length, 0);
                    $(".chat-button[data-action=logout]").trigger("click");
                    setTimeout(function () {
                        QUnit.start();
                    }, Weight);
                }, Weight);
            }, Weight);
        }, Weight);
    }, Weight);
});

QUnit.asyncTest("master", function (assert) {
    expect(2);

    setTimeout(function () {
        $("#chat-index .chat-room[data-id=1] .chat-button[data-action=join]").trigger("click");
        setTimeout(function () {
            assert.equal($("#chat").attr("data-master"), "true");
            $(".chat-button[data-action=logout]").trigger("click");
            setTimeout(function () {
                $("#chat-index .chat-room[data-id=4] .chat-button[data-action=join]").trigger("click");
                setTimeout(function () {
                    var clients = $("#chat-view .chat-client:not(.chat-template)");
                    assert.equal($("#chat").attr("data-master"), undefined);
                    $(".chat-button[data-action=logout]").trigger("click");
                    setTimeout(function () {
                        QUnit.start();
                    }, Weight);
                }, Weight);
            }, Weight);
        }, Weight);
    }, Weight);
});

QUnit.asyncTest("modify room name", function (assert) {
    expect(3);

    setTimeout(function () {
        $("#chat-index .chat-room[data-id=1] .chat-button[data-action=join]").trigger("click");
        setTimeout(function () {
            var input = $("#chat-view-setting-room-name");
            var original = input.val();
            assert.equal(original, TestData.Room[0].name);
            var modified = original + "modified";
            input.val(modified).trigger("blur");

            setTimeout(function () {
                assert.equal(TestData.Room[0].name, modified);

                input.val(original).trigger("blur");

                setTimeout(function () {
                    assert.equal(TestData.Room[0].name, original);

                    $(".chat-button[data-action=logout]").trigger("click");
                    setTimeout(function () {
                        QUnit.start();
                    }, Weight);
                }, Weight);
            }, Weight);
        }, Weight);
    }, Weight);
});

QUnit.asyncTest("don't modify room name", function (assert) {
    expect(2);

    setTimeout(function () {
        $("#chat-index .chat-room[data-id=4] .chat-button[data-action=join]").trigger("click");
        setTimeout(function () {
            var input = $("#chat-view-setting-room-name");
            var original = input.val();
            assert.equal(original, TestData.Room[2].name);
            var modified = original + "modified";
            input.val(modified).trigger("blur");

            setTimeout(function () {
                assert.equal(TestData.Room[2].name, original);

                $(".chat-button[data-action=logout]").trigger("click");

                setTimeout(function () {
                    QUnit.start();
                }, Weight);
            }, Weight);
        }, Weight);
    }, Weight);
});

QUnit.asyncTest("send message", function (assert) {
    expect(5);

    setTimeout(function () {
        $("#chat-index .chat-room[data-id=1] .chat-button[data-action=join]").trigger("click");
        setTimeout(function () {
           $("#chat-view-message-form-message").val("New Message");
           $("#chat-view-message-form-submit").trigger("click");
           setTimeout(function () {
               var last = TestData.Message[TestData.Message.length - 1];
               assert.equal(last.room_id, 1);
               assert.equal(last.user_id, user_id);
               assert.equal(last.message, "New Message");
               assert.equal(last.name, "Current User");
               assert.equal($("#chat-view .chat-message:not(.chat-template)").last().data("id"), last.id);

                $(".chat-button[data-action=logout]").trigger("click");
                setTimeout(function () {
                    QUnit.start();
                }, Weight);
            }, Weight);
        }, Weight);
    }, Weight);
});

QUnit.asyncTest("message settings : message type", function (assert) {
    expect(2);

    setTimeout(function () {
		$("#chat-index .chat-room[data-id=1] .chat-button[data-action=join]").trigger("click");
		setTimeout(function () {
			$("#chat-view-message-form-setting").trigger("click");
			setTimeout(function () {
				var target = $("#chat-view-message-setting input[name=message_type]:checked");
				assert.equal(target.val(), TestData.Client[0].message_type);

				$("#chat-view-message-setting-type-characterinstance").trigger("click");
				setTimeout(function () {
					assert.equal(TestData.Client[0].message_type, 2);

					$("#chat-view-modal-message-setting").modal("hide");
					$(".chat-button[data-action=logout]").trigger("click");
					setTimeout(function () {
						QUnit.start();
					}, Weight);
				}, Weight);
			}, Weight);
        }, Weight);
    }, Weight);
});

QUnit.asyncTest("message settings : name", function (assert) {
    expect(6);

    setTimeout(function () {
		$("#chat-index .chat-room[data-id=1] .chat-button[data-action=join]").trigger("click");
		setTimeout(function () {
			$("#chat-view-message-form-setting").trigger("click");
			setTimeout(function () {
				assert.equal($("#chat-view-message-setting-name").prop("disabled"), true);
				assert.equal($("#chat-view-message-setting-name").val(), TestData.Client[0].name);
				assert.equal($("#chat-view-message-form-setting span:last-child").text(), TestData.Client[0].name);

				$("#chat-view-message-setting-type-free").trigger("click");
				setTimeout(function () {
					assert.equal($("#chat-view-message-setting-name").prop("disabled"), false);

					$("#chat-view-message-setting-name").val("Name of Test Test");
					$("#chat-view-message-setting-name").trigger("blur");
					setTimeout(function () {
						assert.equal(TestData.Client[0].name, "Name of Test Test");
						assert.equal($("#chat-view-message-form-setting span:last-child").text(), "Name of Test Test");

						$("#chat-view-modal-message-setting").modal("hide");
						$(".chat-button[data-action=logout]").trigger("click");
						setTimeout(function () {
							QUnit.start();
						}, Weight);
					}, Weight);
				}, Weight);
			}, Weight);
        }, Weight);
    }, Weight);
});

QUnit.asyncTest("message settings : character", function (assert) {
    expect(9);

    setTimeout(function () {
		$("#chat-index .chat-room[data-id=1] .chat-button[data-action=join]").trigger("click");
		setTimeout(function () {
			$("#chat-view-message-form-setting").trigger("click");
			setTimeout(function () {
				var select = $("#chat-view-message-setting-characterinstance");
				assert.equal(select.find("option:not(.chat-template)").length, 2);
				assert.equal($(select.find("option:not(.chat-template)")[0]).val(), 1);
				assert.equal($(select.find("option:not(.chat-template)")[1]).val(), 2);
				assert.equal($(select.find("option:not(.chat-template)")[0]).text(), "PC1");
				assert.equal($(select.find("option:not(.chat-template)")[1]).text(), "NPC2");
				assert.equal($("#chat-view-message-setting-characterinstance").prop("disabled"), true);

				$("#chat-view-message-setting-type-characterinstance").trigger("click");
				setTimeout(function () {
					assert.equal($("#chat-view-message-setting-characterinstance").prop("disabled"), false);

					$("#chat-view-message-setting-characterinstance").val(1);
					$("#chat-view-message-setting-characterinstance").trigger("blur");
					setTimeout(function () {
						assert.equal(TestData.Client[0].character_instance_id, 1);
						assert.equal(TestData.Client[0].name, "PC1");

						$("#chat-view-modal-message-setting").modal("hide");
						$(".chat-button[data-action=logout]").trigger("click");
						setTimeout(function () {
							QUnit.start();
						}, Weight);
					}, Weight);
				}, Weight);
			}, Weight);
        }, Weight);
    }, Weight);
});

/*
QUnit.asyncTest("drop character", function (assert) {
    expect(9);

    setTimeout(function () {
		$("#chat-index .chat-room[data-id=1] .chat-button[data-action=join]").trigger("click");
		setTimeout(function () {
			$("#chat-view-message-form-setting").trigger("click");
			setTimeout(function () {
				var select = $("#chat-view-message-setting-characterinstance");
				assert.equal(select.find("option:not(.chat-template)").length, 2);
				assert.equal($(select.find("option:not(.chat-template)")[0]).val(), 1);
				assert.equal($(select.find("option:not(.chat-template)")[1]).val(), 2);
				assert.equal($(select.find("option:not(.chat-template)")[0]).text(), "PC1");
				assert.equal($(select.find("option:not(.chat-template)")[1]).text(), "NPC2");
				assert.equal($("#chat-view-message-setting-characterinstance").prop("disabled"), true);

				$("#chat-view-message-setting-type-characterinstance").trigger("click");
				setTimeout(function () {
					assert.equal($("#chat-view-message-setting-characterinstance").prop("disabled"), false);

					$("#chat-view-message-setting-characterinstance").val(1);
					$("#chat-view-message-setting-characterinstance").trigger("blur");
					setTimeout(function () {
						assert.equal(TestData.Client[0].character_instance_id, 1);
						assert.equal(TestData.Client[0].name, "PC1");

						$("#chat-view-modal-message-setting").modal("hide");
						$(".chat-button[data-action=logout]").trigger("click");
						setTimeout(function () {
							QUnit.start();
						}, Weight);
					}, Weight);
				}, Weight);
			}, Weight);
        }, Weight);
    }, Weight);
});
*/

