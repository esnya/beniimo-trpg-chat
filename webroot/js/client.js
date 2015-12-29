/// <reference path="jquery.d.ts"/>
/// <reference path="api.d.ts"/>
/// <reference path="common/common.d.ts"/>
'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ChatClient;
(function (_ChatClient) {
    var View;
    (function (_View) {
        var Modal = (function () {
            function Modal(id) {
                this.id = id;
            }
            Modal.prototype.modal = function () {
                return $('#' + this.id);
            };

            Modal.prototype.show = function () {
                this.modal().modal('show');
            };

            Modal.prototype.hide = function () {
                this.modal().modal('hide');
            };

            Modal.prototype.bind = function (arg1, arg2) {
                this.modal().bind(arg1, arg2);
            };
            return Modal;
        })();
        _View.Modal = Modal;

        var FormModal = (function (_super) {
            __extends(FormModal, _super);
            function FormModal(id) {
                _super.call(this, id);
            }
            FormModal.prototype.form = function () {
                return $('#' + this.id + ' form');
            };

            FormModal.prototype.val = function (name, value) {
                var control = this.modal().find('form [name=' + name + ']');
                if (value === undefined)
                    return control.val();
                else
                    return control.val(value);
            };
            return FormModal;
        })(Modal);
        _View.FormModal = FormModal;

        var CreateRoomModal = (function (_super) {
            __extends(CreateRoomModal, _super);
            function CreateRoomModal() {
                var _this = this;
                _super.call(this, 'CreateRoomModal');

                this.form().bind('submit', function (event) {
                    if (_this.onsubmit) {
                        _this.onsubmit(_this.val('name'), _this.val('game_type'));
                        _this.hide();
                    }
                });
            }
            return CreateRoomModal;
        })(FormModal);
        _View.CreateRoomModal = CreateRoomModal;

        var InstanceModalBase = (function (_super) {
            __extends(InstanceModalBase, _super);
            function InstanceModalBase(basename) {
                var _this = this;
                _super.call(this, basename + 'InstanceModal');
                this.form().bind('submit', function (event) {
                    if (_this.onsubmit) {
                        var id = _this.val('id');
                        var name = _this.val('name');
                        var memo = _this.val('memo');
                        var parameters = [];
                        var inputs = _this.modal().find('.parameters').find('[data-id]').each(function (i, element) {
                            var input = $(element);
                            parameters[+input.attr('data-id')] = input.val();
                        });
                        _this.onsubmit(id, name, memo, parameters);
                        _this.hide();
                    }
                });
                $('#' + basename + 'InstanceRemove').click(function (event) {
                    if (_this.onremove && confirm('本当に削除してもよろしいですか？')) {
                        _this.onremove(+_this.val('id'));
                        _this.hide();
                    }
                });
            }
            InstanceModalBase.prototype._show = function (character_instance) {
                this.character_instance = character_instance;
                var modal = this.modal();

                var name;
                switch (+character_instance.character_instance_type_id) {
                    case 1:
                        name = character_instance['Character'].name;
                        break;
                    case 2:
                        name = character_instance.name;
                        break;
                }
                modal.find('.modal-title').text(name);

                this.val('id', character_instance.id);
                this.val('name', name);
                this.val('memo', character_instance.memo);

                var body = modal.find('.parameters');
                body.empty();

                for (var i = 0; i < character_instance.CharacterInstanceParameter.length; i++) {
                    var parameter = character_instance.CharacterInstanceParameter[i];
                    var value = parameter.value === null ? '' : parameter.value;
                    body.append($('<div class="form-group"></div>').append($('<label></label>').text(parameter.name)).append($('<input class="form-control" type="text">').attr('data-id', parameter.id).val(parameter.value)));
                }

                _super.prototype.show.call(this);
            };
            return InstanceModalBase;
        })(FormModal);
        _View.InstanceModalBase = InstanceModalBase;

        var CharacterInstanceModal = (function (_super) {
            __extends(CharacterInstanceModal, _super);
            function CharacterInstanceModal() {
                _super.call(this, 'Character');
            }
            return CharacterInstanceModal;
        })(InstanceModalBase);
        _View.CharacterInstanceModal = CharacterInstanceModal;

        var NPCInstanceModal = (function (_super) {
            __extends(NPCInstanceModal, _super);
            function NPCInstanceModal() {
                _super.call(this, 'NPC');
            }
            return NPCInstanceModal;
        })(InstanceModalBase);
        _View.NPCInstanceModal = NPCInstanceModal;

        var AddCharacterModal = (function (_super) {
            __extends(AddCharacterModal, _super);
            function AddCharacterModal() {
                var _this = this;
                _super.call(this, 'AddCharacterModal');

                $('#AddCharacter').click(function (event) {
                    if (_this.onrequest) {
                        _this.onrequest();
                    }
                });
                this.form().bind('submit', function (event) {
                    if (_this.onsubmit) {
                        _this.onsubmit(+_this.val('character_id'));
                        _this.hide();
                    }
                });
            }
            AddCharacterModal.prototype.open = function (characters) {
                this.hide();
                var select = $('#AddCharacterCharacter').empty();
                for (var i = 0; i < characters.length; i++) {
                    select.append($('<option>').attr('value', characters[i].id).text(characters[i].name));
                }
                this.show();
            };
            return AddCharacterModal;
        })(FormModal);
        _View.AddCharacterModal = AddCharacterModal;

        var AddNPCModal = (function (_super) {
            __extends(AddNPCModal, _super);
            function AddNPCModal() {
                var _this = this;
                _super.call(this, 'AddNPCModal');

                this.form().bind('submit', function (event) {
                    if (_this.onsubmit) {
                        _this.onsubmit(_this.val('name'));
                        _this.hide();
                    }
                });
            }
            return AddNPCModal;
        })(FormModal);
        _View.AddNPCModal = AddNPCModal;

        var EditRoomModal = (function (_super) {
            __extends(EditRoomModal, _super);
            function EditRoomModal() {
                var _this = this;
                _super.call(this, 'EditRoomModal');

                this.modal().bind('show.bs.modal', function (event) {
                    _this.val('name', _this.room.name);
                });

                this.form().submit(function (event) {
                    if (_this.onsubmit) {
                        _this.onsubmit(+_this.room.id, _this.val('name'), +_this.room.map_width, +_this.room.map_height);
                        _this.hide();
                    }
                });

                $('#EditRoomRemove').click(function (event) {
                    if (_this.onremove && confirm('本当に削除してもよろしいですか？')) {
                        _this.onremove(+_this.room.id);
                        _this.hide();
                    }
                });
            }
            EditRoomModal.prototype.updateRoom = function (room) {
                this.room = room;
            };
            return EditRoomModal;
        })(FormModal);
        _View.EditRoomModal = EditRoomModal;

        var UploadMapImageModal = (function (_super) {
            __extends(UploadMapImageModal, _super);
            function UploadMapImageModal() {
                var _this = this;
                _super.call(this, 'UploadMapImageModal');

                this.modal().bind({
                    dragover: function (event) {
                        return event.preventDefault();
                    },
                    drop: function (event) {
                        return _this.mapImageDrop(event);
                    }
                });
            }
            UploadMapImageModal.prototype.mapImageDrop = function (event) {
                var _this = this;
                var files = event.originalEvent.dataTransfer.files;
                if (files.length > 0) {
                    event.preventDefault();

                    var file = files[0];

                    var formData = new FormData();
                    var div = this.modal().find('.modal-body');
                    var url = div.attr('data-upload') + '/' + this.room_id;
                    formData.append('data[Room][map_background_url]', file);
                    $.ajax({
                        type: 'post',
                        url: url,
                        processData: false,
                        contentType: false,
                        data: formData,
                        dataType: 'json',
                        success: function (data) {
                            if (_this.onupload) {
                                _this.onupload(_this.room_id);
                            }
                            _this.hide();
                        },
                        error: function (data) {
                            console.error(data.responseXML);
                        }
                    });
                }
            };

            UploadMapImageModal.prototype.updateRoom = function (room) {
                this.room_id = room.id;
            };
            return UploadMapImageModal;
        })(Modal);
        _View.UploadMapImageModal = UploadMapImageModal;

        var EditMapModal = (function (_super) {
            __extends(EditMapModal, _super);
            function EditMapModal() {
                var _this = this;
                _super.call(this, 'EditMapModal');

                this.upload_map_image_modal = new UploadMapImageModal;

                this.modal().bind('show.bs.modal', function (event) {
                    _this.val('map_width', _this.room.map_width);
                    _this.val('map_height', _this.room.map_height);
                });

                this.form().submit(function (event) {
                    if (_this.onsubmit) {
                        _this.onsubmit(+_this.room.id, _this.room.name, +_this.val('map_width'), +_this.val('map_height'));
                        _this.hide();
                    }
                });

                $('#EditMapUpload').click(function (event) {
                    _this.upload_map_image_modal.show();
                    _this.hide();
                });
            }
            EditMapModal.prototype.updateRoom = function (room) {
                this.room = room;
                this.upload_map_image_modal.updateRoom(room);
            };
            return EditMapModal;
        })(FormModal);
        _View.EditMapModal = EditMapModal;

        var RoomList = (function () {
            function RoomList(user_id) {
                this.user_id = user_id;
                this.rooms = [];
                this.create_room_modal = new CreateRoomModal;
            }
            RoomList.prototype.updateRooms = function (rooms) {
                for (var i = 0; i < rooms.length; i++) {
                    var room = new common.ChatRoom;
                    room.set(rooms[i]);
                    this.updateRoom(room);
                }
            };

            RoomList.prototype.joinButton = function (mode, label, color) {
                if (typeof color === "undefined") { color = 'default'; }
                return $('<button class="btn btn-' + color + ' btn-xs">').attr('data-mode', mode).text(label);
            };

            RoomList.prototype.updateRoom = function (room) {
                var _this = this;
                var exists = room.id in this.rooms;
                this.rooms[room.id] = room;

                var list = $('#RoomList');

                var item;
                if (exists) {
                    item = list.find('[data-id=' + room.id + ']');
                } else {
                    item = $('<div class="col-md-4 chat-room"></div>').attr('data-id', room.id);

                    var buttons = $('<div class="btn-group pull-right"></div>');
                    buttons.append(this.joinButton('player', '参加', 'primary'));
                    if (room.user_id == this.user_id) {
                        buttons.append(this.joinButton('master', 'GM', 'info'));
                    }
                    buttons.append(this.joinButton('viewer', '観戦', 'success'));

                    buttons.find('.btn').click(function (event) {
                        if (_this.onjoin) {
                            var button = $(event.target);
                            _this.onjoin(+button.closest('[data-id]').attr('data-id'), button.attr('data-mode'));
                        }
                    });

                    item.append($('<div>').append(buttons).append('<h4 data-field="name">'));
                    item.append($('<div>').append('<div class="pull-right" data-field="game_type">').append('<div data-field="game_master">'));
                }

                item.find('[data-field=name]').text(room.name);
                item.find('[data-field=game_master]').text(room.User.name);
                item.find('[data-field=game_type]').text(room.GameType.name);

                if (!exists) {
                    item.prependTo(list);
                }
            };
            return RoomList;
        })();
        _View.RoomList = RoomList;

        var CharacterInstanceList = (function () {
            function CharacterInstanceList(map, message_form) {
                this.character_instance_modal = new CharacterInstanceModal;
                this.npc_instance_modal = new NPCInstanceModal;
                this.map = map;
                this.message_form = message_form;
            }
            CharacterInstanceList.prototype.login = function (user, mode, room) {
                $('#CharacterInstanceList thead, #CharacterInstanceList tbody').empty();
                this.character_instances = [];
                this.character_id_table = [];
                this.user = user;
                this.mode = mode;
                this.room = room;
            };

            CharacterInstanceList.prototype.updateCharacterInstances = function (character_instances) {
                for (var i = 0; i < character_instances.length; i++) {
                    var character_instance = new common.ChatCharacterInstance;
                    character_instance.set(character_instances[i]);
                    this.updateCharacterInstance(character_instance);
                }
            };

            CharacterInstanceList.prototype.updateCharacterInstance = function (character_instance) {
                var _this = this;
                var list = $('#CharacterInstanceList tbody');

                if (this.character_instances.length == 0) {
                    var header = $('<tr class="chat-character_instance">').append('<th><span class="glyphicon glyphicon-chevron-down"></span><span class="glyphicon glyphicon-chevron-right"></span></th>').append('<th>キャラクター</th>');
                    for (var i = 0; i < character_instance.CharacterInstanceParameter.length; i++) {
                        var parameter = character_instance.CharacterInstanceParameter[i];
                        header.append($('<th>').text(parameter.name));
                    }
                    header.append('<th>メモ</th>').click(function (event) {
                        $('#CharacterInstanceList').toggleClass('list-hidden');
                    });
                    header.appendTo('#CharacterInstanceList thead');
                }

                var exists = character_instance.id in this.character_instances;
                this.character_instances[character_instance.id] = character_instance;
                if (character_instance.character_instance_type_id == 1) {
                    this.character_id_table[character_instance.character_id] = character_instance.id;
                }

                var line;
                if (exists) {
                    line = list.find('.chat-character-instance[data-id=' + (+character_instance.id) + ']');
                } else {
                    line = $('<tr class="chat-character-instance">').attr('data-id', character_instance.id);
                    var buttons = $('<div class="btn-group">');

                    var url = base_url;
                    url += this.room.game_type_id + '/characters/view/';

                    if (character_instance.character_instance_type_id == 1 && url) {
                        buttons.append($('<a target="_blank" class="btn btn-xs btn-primary">').attr('href', url + character_instance.character_id).append('<span class="glyphicon glyphicon-eye-open"></span>'));
                    }

                    if (this.mode == 'master' || character_instance.user_id == this.user.id) {
                        buttons.append($('<button class="btn btn-xs btn-success" data-action="edit"><span class="glyphicon glyphicon-pencil"></span></button>').click(function (event) {
                            var button = $(event.target);
                            if (!button.attr('data-action'))
                                button = button.closest('[data-action]');
                            var action = button.attr('data-action');
                            var line = button.closest('[data-id]');
                            var id = +line.attr('data-id');
                            switch (action) {
                                case 'edit':
                                    if (id in _this.character_instances) {
                                        var character_instance = _this.character_instances[id];
                                        if (character_instance.character_instance_type_id == 1) {
                                            _this.character_instance_modal._show(character_instance);
                                        } else if (character_instance.character_instance_type_id == 2 && _this.mode == 'master') {
                                            _this.npc_instance_modal._show(character_instance);
                                        }
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }));
                    }

                    line.append($('<td>').append(buttons));
                    line.append($('<td data-field="name">'));

                    for (var i = 0; i < character_instance.CharacterInstanceParameter.length; i++) {
                        var parameter = character_instance.CharacterInstanceParameter[i];
                        line.append($('<td>').attr('data-field', 'parameter' + parameter.n));
                    }

                    line.append('<td data-field="memo">');
                }

                var name;
                switch (+character_instance.character_instance_type_id) {
                    case 1:
                        name = character_instance['Character']['name'];
                        break;
                    case 2:
                        name = character_instance.name;
                        break;
                }
                line.find('[data-field=name]').text(name);
                for (var i = 0; i < character_instance.CharacterInstanceParameter.length; i++) {
                    var parameter = character_instance.CharacterInstanceParameter[i];
                    line.find('[data-field="parameter' + parameter.n + '"]').text(parameter.value || '');
                }
                line.find('[data-field=memo]').text(character_instance.memo || '');

                if (!exists) {
                    list.append(line);
                }

                this.map.updateCharacterInstance(character_instance, exists);
                this.message_form.updateCharacterInstance(character_instance, exists);
            };

            CharacterInstanceList.prototype.dropCharacterInstance = function (id) {
                $('.chat-character-instance[data-id=' + id + ']').remove();

                this.map.dropCharacterInstance(id);
                this.message_form.dropCharacterInstance(id);

                var character_instance = this.character_instances[id];
                if (character_instance) {
                    delete this.character_id_table[character_instance.character_id];
                    delete this.character_instances[id];
                }
            };
            return CharacterInstanceList;
        })();
        _View.CharacterInstanceList = CharacterInstanceList;

        var Map = (function () {
            function Map() {
                var _this = this;
                this.map_scale = 8;
                $('#MapToolbar .btn').click(function (event) {
                    var button = $(event.target);
                    if (!button.attr('data-action'))
                        button = button.closest('[data-action]');
                    switch (button.attr('data-action')) {
                        case 'zoom':
                            _this.map_scale += (+button.attr('data-zoom'));
                            if (_this.map_scale < 3)
                                _this.map_scale = 3;
                            $('#MapCharacters .map-character').each(function (index, element) {
                                var chip = $(element);
                                var id = $(element).attr('data-id');
                                var character_instance = _this.character_instances[id];
                                chip.css('left', character_instance.x * _this.map_scale + 'px').css('top', character_instance.y * _this.map_scale + 'px');
                            });
                            _this.setTileScale($('#MapTiles .map-tile, #MapCharacters .map-character'));
                            break;
                        default:
                            break;
                    }
                });
                $('#Map').bind({
                    dragover: function (event) {
                        return event.preventDefault();
                    },
                    drop: function (event) {
                        event.preventDefault();

                        var dt = ('dataTransfer' in event) ? event.dataTransfer : event.originalEvent.dataTransfer;
                        var data = JSON.parse(dt.getData('text/plain'));

                        var id = +data.id;
                        var dst_x = event.pageX || event.originalEvent.pageX;
                        var dst_y = event.pageY || event.originalEvent.pageY;
                        var r_x = dst_x - data.x;
                        var r_y = dst_y - data.y;
                        _this.character_instances[id].x += Math.round(r_x / _this.map_scale);
                        _this.character_instances[id].y += Math.round(r_y / _this.map_scale);

                        if (_this.onpos) {
                            _this.onpos(id, _this.character_instances[id].x, _this.character_instances[id].y);
                        }
                    }
                });
            }
            Map.prototype.login = function (room, character_instances) {
                $('#MapTiles').css('background-image', null).empty();
                $('#MapCharacters').empty();
                this.character_instances = character_instances;
                this.updateRoom(room);
            };

            Map.prototype.setTileScale = function (tile) {
                var size = this.map_scale * 8;
                tile.css('width', size).css('height', size);
            };

            Map.prototype.updateRoom = function (room) {
                var tiles = $('#MapTiles').css('background-image', room.map_background_url ? ('url(' + room.map_background_url + '?' + (new Date).getTime() + ')') : null);

                tiles.find('.map-tile').remove();
                for (var y = 0; y < room.map_height; y++) {
                    var line = $('<div class="map-row">').appendTo(tiles);
                    for (var x = 0; x < room.map_width; x++) {
                        var size = 8 * this.map_scale + 'px';
                        var text = '';
                        for (var i = 0; i <= Math.floor(room.map_width / 26); i++) {
                            text += String.fromCharCode(65 + x);
                        }
                        text += (y + 1);
                        var tile = $('<div class="map-tile">').append($('<span>').text(text)).appendTo(line);
                        this.setTileScale(tile);
                    }
                }
            };

            Map.prototype.onDragstart = function (event) {
                var target = $(event.target);
                if (!target || !target.attr('data-id'))
                    target = target.closest('[data-id]');

                var dt = ('dataTransfer' in event) ? event.dataTransfer : event.originalEvent.dataTransfer;
                var data = {
                    id: +target.attr('data-id'),
                    x: event.pageX || event.originalEvent.pageX,
                    y: event.pageY || event.originalEvent.pageY
                };
                dt.setData('text/plain', JSON.stringify(data));
            };

            Map.prototype.updateCharacterInstance = function (character_instance, exists) {
                var _this = this;
                var chip;
                if (exists) {
                    chip = $('.map-character[data-id=' + (+character_instance.id) + ']');
                } else {
                    chip = $('<div draggable="true" class="map-character">').attr('data-id', +character_instance.id).append('<span data-field="name">');
                    this.setTileScale(chip);
                    chip.bind('dragstart', function (event) {
                        return _this.onDragstart(event);
                    });
                }

                var name;
                switch (+character_instance.character_instance_type_id) {
                    case 1:
                        name = character_instance['Character'].name;
                        break;
                    case 2:
                        name = character_instance.name;
                        break;
                }
                chip.css('left', character_instance.x * this.map_scale + 'px').css('top', character_instance.y * this.map_scale + 'px').find('[data-field=name]').text(name);

                var image_url = null;
                if (character_instance.character_instance_type_id == 1) {
                    image_url = 'url(/trpg/' + character_instance['game_type_id'] + '/characters/image/' + character_instance['Character']['id'] + ')';
                }
                chip.css('background-image', image_url);

                if (!exists) {
                    chip.appendTo('#MapCharacters');
                }
            };

            Map.prototype.dropCharacterInstance = function (id) {
                $('.map-character[data-id=' + (+id) + ']').remove();
            };
            return Map;
        })();
        _View.Map = Map;

        var CharacterImage = (function () {
            function CharacterImage() {
            }
            CharacterImage.prototype.login = function (character_instances, character_id_table) {
                $('#LeftImage, #RightImage').css('background-image', null);
                this.left_id = null;
                this.right_id = null;
                this.character_instances = character_instances;
                this.character_id_table = character_id_table;
            };

            CharacterImage.prototype.push = function (character_id) {
                if (character_id != this.left_id) {
                    this.right_id = this.left_id;
                    this.left_id = character_id;
                    var css;
                    if (character_id && (character_id in this.character_id_table)) {
                        var character_instance = this.character_instances[this.character_id_table[character_id]];
                        if (('Character' in character_instance)) {
                            css = 'url(/trpg/' + character_instance['game_type_id'] + '/characters/image/' + character_instance['Character']['id'] + ')';
                        }
                    }
                    $('#RightImage').css('background-image', $('#LeftImage').css('background-image'));
                    $('#LeftImage').css('background-image', css || 'none');
                }
            };
            return CharacterImage;
        })();
        _View.CharacterImage = CharacterImage;

        var WritingMessage = (function () {
            function WritingMessage(name, message_type_id) {
                this.name = name;
                if ((name in WritingMessage.writings) && WritingMessage.writings[name]) {
                    WritingMessage.writings[name].resetTimer();
                } else {
                    this.message = $('<div class="chat-message chat-message-writing row"></div>').append($('<div class="col-xs-3 col-sm-3 text-right" data-field="name">').text(name)).append($('<div class="col-xs-9 col-sm-7" data-field="message">').append('<span class="glyphicon glyphicon-pencil">')).append('<div class="hidden-xs col-sm-2" data-field="modified"></div>').attr('data-type', message_type_id);
                    this.resetTimer();
                    WritingMessage.writings[name] = this;

                    var list = $('#ChatMessageList');
                    this.message.appendTo(list);
                    list.scrollTop(list.scrollTop() + this.message.height());
                }
            }
            WritingMessage.prototype.resetTimer = function () {
                var _this = this;
                if (this.timer) {
                    clearTimeout(this.timer);
                }
                setTimeout(function () {
                    return _this.remove();
                }, 3000);
            };

            WritingMessage.prototype.remove = function () {
                delete WritingMessage.writings[this.name];
                this.message.remove();
            };
            WritingMessage.writings = [];
            return WritingMessage;
        })();
        _View.WritingMessage = WritingMessage;

        var MessageList = (function () {
            function MessageList() {
                var _this = this;
                this.audio_alert = new AudioAlert;
                this.character_image = new CharacterImage;

                this.messages = [];

                $('#ChatMessageList').scroll(function (event) {
                    return _this.onScroll();
                });
            }
            MessageList.prototype.onScroll = function () {
                if (this.onrequestlog && this.min_id && this.remaining && $('#ChatMessageList').scrollTop() == 0) {
                    this.onrequestlog(this.min_id);
                }
            };

            MessageList.prototype.login = function (character_instances, character_id_table) {
                var _this = this;
                $('#ChatMessageList').empty();
                this.messages = [];
                this.remaining = true;

                this.max_id = -1;
                this.min_id = -1;
                this.max_character_message_id = -1;

                this.character_image.login(character_instances, character_id_table);

                this.log_loader_timer = setInterval(function () {
                    return _this.onScroll();
                }, 3000);
            };

            MessageList.prototype.updateMessages = function (messages) {
                var _this = this;
                if (this.max_id < 0)
                    this.log_loader_timer = setTimeout(function () {
                        return _this.onScroll();
                    }, 8000);
                if (messages.length == 0) {
                    if (this.log_loader_timer) {
                        clearInterval(this.log_loader_timer);
                        this.log_loader_timer = null;
                    }
                    this.remaining = false;
                }
                for (var i = 0; i < messages.length; i++) {
                    var message = new common.ChatMessage;
                    message.set(messages[i]);
                    this.updateMessage(message);
                }
                this.audio_alert.alert();
            };

            MessageList.prototype.updateMessage = function (message) {
                var exists = (message.id in this.messages);
                this.messages[message.id] = message;
                var list = $('#ChatMessageList');

                var o;
                if (exists) {
                    o = list.find('.chat-message[data-id=' + (+message.id) + ']');
                } else {
                    o = $('<div class="chat-message row"></div>').append('<div class="col-xs-3 col-sm-3 text-right" data-field="name"></div><div class="col-xs-9 col-sm-7" data-field="message"></div><div class="hidden-xs col-sm-2" data-field="modified"></div>').attr('data-id', message.id).attr('data-type', message.message_type_id);
                }

                var name;
                switch (+message.message_type_id) {
                    case 1:
                        name = 'System';
                        o.addClass('chat-message-system');
                        break;
                    case 2:
                        name = message.name;
                        break;
                    case 3:
                        name = message.User.name;
                        break;
                    case 4:
                        name = message.name;
                        break;
                    default:
                        return;
                }
                o.find('[data-field=name]').text(name);
                o.find('[data-field=message]').text(message.message);
                var date = new Date(message.modified);
                var hours = date.getHours();
                var minutes = date.getMinutes();
                if (minutes < 10)
                    minutes = '0' + minutes;
                o.find('[data-field=modified]').text(hours + ':' + minutes);

                if ((this.max_character_message_id < 0 || message.id >= this.max_character_message_id) && message.message_type_id == 4) {
                    this.max_character_message_id = message.id;
                    this.character_image.push(message.character_id);
                }

                if (!exists) {
                    if (this.min_id < 0)
                        this.min_id = message.id;
                    if (this.max_id < 0)
                        this.max_id = message.id;

                    if (message.id >= this.max_id) {
                        this.max_id = message.id;
                        list.append(o);
                    } else if (message.id <= this.min_id) {
                        this.min_id = message.id;
                        list.prepend(o);
                    } else {
                        var inserted = false;
                        for (var i = message.id - 1; i >= 0; i--) {
                            if (i in this.messages) {
                                var target = list.find('[data-id="' + i + '"]');
                                if (target.length == 1) {
                                    list.find('[data-id=' + i + ']').after(o);
                                    inserted = true;
                                    break;
                                }
                            }
                        }
                        if (!inserted)
                            console.error('Invalid message id:', message.id, 'max:', this.max_id, 'min:', this.min_id);
                    }
                    list.scrollTop(list.scrollTop() + o.height());
                }
            };

            MessageList.prototype.writing = function (name, message_type_id) {
                new WritingMessage(name, message_type_id);
            };
            return MessageList;
        })();
        _View.MessageList = MessageList;

        var MessageForm = (function () {
            function MessageForm() {
                var _this = this;
                $('#ChatMessageForm').submit(function (event) {
                    if (_this.onsubmit) {
                        var message = $('#ChatMessageMessage').val();

                        if (message.length > 0) {
                            $('#ChatMessageMessage').val(null);

                            var character_id = (_this.mode == 'player') ? $('#ChatMessageCharacter').val() : null;

                            var name = (_this.mode == 'master') ? $('#ChatMessageName').val() : null;

                            _this.onsubmit(name, +character_id, message);
                        }
                    }
                });

                $('#ChatMessageMessage').bind({
                    focus: function (event) {
                        _this.writing_wathcer = setInterval(function () {
                            return _this.watchWriting();
                        }, 1000);
                        _this.watchWriting();
                    },
                    blur: function (event) {
                        if (_this.writing_wathcer) {
                            clearInterval(_this.writing_wathcer);
                            _this.writing_wathcer = null;
                        }
                    }
                });
            }
            MessageForm.prototype.watchWriting = function () {
                var message = $('#ChatMessageMessage').val();

                if (message != this.prev_message) {
                    if (this.onwriting) {
                        var character_id = (this.mode == 'player') ? $('#ChatMessageCharacter').val() : null;
                        var name = (this.mode == 'master') ? $('#ChatMessageName').val() : null;
                        this.onwriting(name, +character_id);
                    }
                    this.prev_message = message;
                }
            };

            MessageForm.prototype.login = function (user, mode) {
                $('#ChatMessageCharacter').empty().append($('<option>').val(null).text(user.name));

                switch (mode) {
                    case 'master':
                        $('#ChatMessageCharacter').hide();
                        $('#ChatMessageName').show();
                        $('#ChatMessageForm .form-control').prop('disabled', false);
                        break;
                    case 'player':
                        $('#ChatMessageCharacter').show();
                        $('#ChatMessageName').hide();
                        $('#ChatMessageForm .form-control').prop('disabled', false);
                        break;
                    default:
                        $('#ChatMessageName').hide();
                        $('#ChatMessageForm .form-control').prop('disabled', true);
                }
                this.user = user;
                this.mode = mode;
            };

            MessageForm.prototype.updateCharacterInstance = function (character_instance, exists) {
                if (character_instance.user_id == this.user.id) {
                    var option;
                    if (exists) {
                        option = $('#ChatMessageCharacter option[var=' + (+character_instance.id) + ']');
                    } else {
                        option = $('<option>').val(character_instance.character_id).attr('data-id', character_instance.id);
                    }

                    var name;
                    switch (+character_instance.character_instance_type_id) {
                        case 1:
                            name = character_instance['Character'].name;
                            break;
                        case 2:
                            name = character_instance.name;
                            break;
                    }
                    option.text(name);

                    if (!exists) {
                        option.appendTo('#ChatMessageCharacter');
                    }
                }
            };

            MessageForm.prototype.dropCharacterInstance = function (id) {
                $('#ChatMessageCharacter option[data-id=' + id + ']').remove();
            };
            return MessageForm;
        })();
        _View.MessageForm = MessageForm;

        var RoomView = (function () {
            function RoomView() {
                this.map = new Map;
                this.message_list = new MessageList;
                this.message_form = new MessageForm;
                this.character_instance_list = new CharacterInstanceList(this.map, this.message_form);
                this.add_character_modal = new AddCharacterModal;
                this.add_npc_modal = new AddNPCModal;
                this.edit_room_modal = new EditRoomModal;
                this.edit_map_modal = new EditMapModal;
            }
            RoomView.prototype.login = function (user, mode, room, character_instances) {
                $('body').attr('data-mode', 'room').attr('data-joinmode', mode);
                this.character_instance_list.login(user, mode, room);
                this.message_list.login(this.character_instance_list.character_instances, this.character_instance_list.character_id_table);
                this.message_form.login(user, mode);
                this.map.login(room, this.character_instance_list.character_instances);
                this.room = null;
                this.updateRoom(room);
            };

            RoomView.prototype.logout = function () {
                $('body').attr('data-mode', 'list').removeAttr('data-joinmode');
                this.room = null;
            };

            RoomView.prototype.updateRoom = function (room) {
                if (!this.room || this.room.id == room.id) {
                    this.room = room;
                    this.edit_room_modal.updateRoom(room);
                    this.edit_map_modal.updateRoom(room);
                    this.map.updateRoom(room);
                }
            };
            return RoomView;
        })();
        _View.RoomView = RoomView;

        var View = (function () {
            function View(user_id) {
                this.room_list = new RoomList(user_id);
                this.room_view = new RoomView;
            }
            return View;
        })();
        _View.View = View;
    })(View || (View = {}));

    var AudioAlert = (function () {
        function AudioAlert() {
            if ('AudioContext' in window)
                this.context = new AudioContext;
            else if ('webkitAudioContext' in window)
                this.context = new webkitAudioContext;

            if (this.context) {
                this.gain = this.context.createGain();
                this.gain.gain.value = 0.3;
                this.gain.connect(this.context.destination);
            }
        }
        AudioAlert.prototype.alert = function () {
            if (this.context) {
                var osc1 = this.context.createOscillator();
                osc1.type = "sine";
                osc1.frequency.value = 391.99543598174927;
                osc1.connect(this.gain);

                var osc2 = this.context.createOscillator();
                osc2.type = "sine";
                osc2.frequency.value = 523.25113060;
                osc2.connect(this.gain);

                var t = this.context.currentTime;
                osc1.start(t);
                osc1.stop(t + 0.2);
                osc2.start(t + 0.2);
                osc2.stop(t + 0.4);
            }
        };
        return AudioAlert;
    })();

    var ChatClient = (function () {
        function ChatClient(user_id) {
            var _this = this;
            $('body').attr('data-mode', 'list').removeAttr('data-joinmode');
            this.user_id = user_id;

            this.view = new View.View(this.user_id);
            this.view.room_list.create_room_modal.onsubmit = function (name, game_type_id) {
                _this.logout();
                _this.send('room.new', { name: name, game_type_id: game_type_id });
            };
            this.view.room_list.onjoin = function (id, mode) {
                _this.logout();
                _this.send('room.join', { room_id: id, mode: mode });
            };

            this.view.room_view.character_instance_list.character_instance_modal.onsubmit = function (id, name, memo, parameters) {
                _this.send('character_instance.set', {
                    id: id,
                    memo: memo,
                    parameters: parameters
                });
            };
            this.view.room_view.character_instance_list.npc_instance_modal.onsubmit = function (id, name, memo, parameters) {
                _this.send('character_instance.set', {
                    id: id,
                    name: name,
                    memo: memo,
                    parameters: parameters
                });
            };
            this.view.room_view.character_instance_list.character_instance_modal.onremove = this.view.room_view.character_instance_list.npc_instance_modal.onremove = function (id) {
                if (_this.view.room_view.room) {
                    _this.send('character_instance.remove', { id: (+id) });
                }
            };
            this.view.room_view.message_list.onrequestlog = function (top_id) {
                return _this.send('message.list', { top_id: top_id });
            };
            this.view.room_view.map.onpos = function (id, x, y) {
                return _this.send('character_instance.pos', { id: id, x: x, y: y });
            };
            this.view.room_view.message_form.onsubmit = function (name, character_id, message) {
                if (_this.view.room_view.room) {
                    _this.send('message.new', {
                        name: name,
                        character_id: character_id,
                        message: message
                    });
                }
            };
            this.view.room_view.message_form.onwriting = function (name, character_id) {
                if (_this.view.room_view.room) {
                    _this.send('message.writing', {
                        name: name,
                        character_id: character_id
                    });
                }
            };
            this.view.room_view.add_character_modal.onrequest = function () {
                return _this.send('character.list');
            };
            this.view.room_view.add_character_modal.onsubmit = function (character_id) {
                return _this.send('character_instance.new', { character_id: character_id });
            };
            this.view.room_view.add_npc_modal.onsubmit = function (name) {
                return _this.send('character_instance.new', { name: name });
            };

            this.view.room_view.edit_room_modal.onsubmit = this.view.room_view.edit_map_modal.onsubmit = function (id, name, map_width, map_height) {
                _this.send('room.set', {
                    id: id,
                    name: name,
                    map_width: map_width,
                    map_height: map_height
                });
            };

            this.view.room_view.edit_room_modal.onremove = function (id) {
                return _this.send('room.remove', { id: id });
            };

            this.view.room_view.edit_map_modal.upload_map_image_modal.onupload = function (id) {
                return _this.send('room.uploaded', { id: id });
            };

            this.connect();

            $('#Logout').click(function (event) {
                return _this.logout();
            });
        }
        ChatClient.prototype.connect = function () {
            var _this = this;
            if (this.socket)
                this.socket.close();
            this.socket = new WebSocket('ws://chat.takiri.shy.jp');
            this.socket.onopen = function (event) {
                return _this.onOpen(event);
            };
            this.socket.onmessage = function (event) {
                return _this.onMessage(event);
            };
            this.socket.onclose = function (event) {
                return _this.onClose(event);
            };
            this.retrytimer = setTimeout(function () {
                return _this.connect();
            }, 3000);
        };

        ChatClient.prototype.logout = function () {
            this.send('room.logout');
            $('body').attr('data-mode', 'list').removeAttr('data-joinmode');
        };

        ChatClient.prototype.log = function (data) {
            console.log(data);
        };

        ChatClient.prototype.send = function (path, data) {
            if (typeof data === "undefined") { data = {}; }
            this.socket.send(common.encodePacket(path, data));
        };

        ChatClient.prototype.onOpen = function (event) {
            if (this.retrytimer) {
                clearTimeout(this.retrytimer);
                this.retrytimer = null;
            }
            this.log('open');

            this.send('auth.join', { user_id: this.user_id });
        };

        ChatClient.prototype.onMessage = function (event) {
            if ('data' in event) {
                var message = common.decodePacket(event.data);
                console.debug(message);
                if (common.dispatchMessage(this, message))
                    return;
                console.error('Unknown message: ', message);
            }
        };

        ChatClient.prototype.msgAuth = function (path, data) {
            var _this = this;
            if (!this.user) {
                switch (path) {
                    case 'ok':
                        this.user = new common.User;
                        this.user.set(data);
                        setTimeout(function () {
                            return _this.send('room.list');
                        }, 500);
                        return true;
                    case 'timeout':
                        alert('認証にタイムアウトしました。\nページを更新して再試行してください。');
                        return true;
                    case 'failed':
                        alert('認証に失敗しました。\nページを更新して再試行してください。');
                        return true;
                }
            }
        };

        ChatClient.prototype.msgRoom = function (path, data) {
            if (this.user) {
                switch (path) {
                    case 'data':
                        this.view.room_list.updateRooms(data);
                        if (this.view.room_view.room) {
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].id == this.view.room_view.room.id) {
                                    var room = new common.ChatRoom;
                                    room.set(data[i]);
                                    this.view.room_view.updateRoom(room);
                                }
                            }
                        }
                        return true;
                    case 'join_ok':
                        $('body').attr('data-mode', 'room').attr('data-joinmode', data.mode);
                        this.view.room_view.login(this.user, data.mode, data.room, data.character_instances);
                        this.send('message.list', { top_id: -1 });
                        this.send('character_instance.list');
                        return true;
                    case 'join_failed':
                        alert('Join Failed');
                        return true;
                }
            }
            return false;
        };

        ChatClient.prototype.msgMessage = function (path, data) {
            if (this.view.room_view.room) {
                switch (path) {
                    case 'data':
                        this.view.room_view.message_list.updateMessages(data);
                        return true;
                    case 'writing':
                        this.view.room_view.message_list.writing(data.name, data.message_type_id);
                }
                return true;
            }
            return false;
        };

        ChatClient.prototype.msgCharacter = function (path, data) {
            if (this.view.room_view.room && path == 'data') {
                this.view.room_view.add_character_modal.open(data);
                return true;
            }
            return false;
        };

        ChatClient.prototype.msgCharacterInstance = function (path, data) {
            if (this.view.room_view.room) {
                switch (path) {
                    case 'data':
                        this.view.room_view.character_instance_list.updateCharacterInstances(data);
                        return true;
                    case 'drop':
                        this.view.room_view.character_instance_list.dropCharacterInstance(+data.id);
                        return true;
                }
            }
            return false;
        };

        ChatClient.prototype.onClose = function (event) {
            if (!this.retrytimer)
                alert('セッションが切断されました。\n回復するにはページをリロードしてください。');
        };
        return ChatClient;
    })();
    _ChatClient.ChatClient = ChatClient;
})(ChatClient || (ChatClient = {}));
var client = new ChatClient.ChatClient(user_id);
