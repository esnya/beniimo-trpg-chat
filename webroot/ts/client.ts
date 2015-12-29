/// <reference path="jquery.d.ts"/>
/// <reference path="api.d.ts"/>
/// <reference path="common/common.d.ts"/>
'use strict';

declare var Chat;
declare var user_id;
declare var base_url;

module ChatClient {
    module Controller {
    }

    module View {
        export class Modal {
            public id: string;

            public constructor(id: string) {
                this.id = id;
            }

            public modal() {
                return <any>$('#' + this.id);
            }

            public show() {
                this.modal().modal('show');
            }

            public hide() {
                this.modal().modal('hide');
            }

            public bind(arg1: any, arg2?: any) {
                this.modal().bind(arg1, arg2);
            }
        }

        export class FormModal extends Modal {
            constructor(id: string) {
                super(id);
            }

            public form() {
                return $('#' + this.id + ' form');
            }

            public val(name: string, value?: any) {
                var control = this.modal().find('form [name=' + name + ']');
                if (value === undefined) return control.val();
                else return control.val(value);
            }
        }

        export class CreateRoomModal extends FormModal {
            public onsubmit: any;

            constructor() {
                super('CreateRoomModal');

                this.form().bind('submit', (event) => {
                    if (this.onsubmit) {
                        this.onsubmit(this.val('name'), this.val('game_type'));
                        this.hide();
                    }
                });
            }
        }

		export class InstanceModalBase extends FormModal {
            public onsubmit: any;
            public onremove: any;
            private character_instance: common.ChatCharacterInstance;

            constructor(basename: string) {
                super(basename + 'InstanceModal');
                this.form().bind('submit', (event) => {
                    if (this.onsubmit) {
                        var id = this.val('id');
                        var name = this.val('name');
                        var memo = this.val('memo');
                        var parameters = [];
                        var inputs = this.modal().find('.parameters').find('[data-id]').each((i, element) => {
                            var input = $(element);
                            parameters[+input.attr('data-id')] = input.val();
                        });
                        this.onsubmit(id, name, memo, parameters);
                        this.hide();
                    }
                });
                $('#' + basename + 'InstanceRemove').click((event) => {
                    if (this.onremove && confirm('本当に削除してもよろしいですか？')) {
                        this.onremove(+this.val('id'));
                        this.hide();
                    }
                });
			}

			public _show(character_instance: common.ChatCharacterInstance) {
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
                    var value = parameter.value === null ? '' : parameter.value
                        body.append(
                                $('<div class="form-group"></div>').append(
                                    $('<label></label>').text(parameter.name))
                                .append(
                                    $('<input class="form-control" type="text">').attr('data-id', parameter.id).val(parameter.value)
                                    )
                                );
                }

                super.show();
            }
		}

        export class CharacterInstanceModal extends InstanceModalBase {
			constructor() {
				super('Character');
			}
		}

        export class NPCInstanceModal extends InstanceModalBase {
			constructor() {
				super('NPC');
			}
		}

        export class AddCharacterModal extends FormModal {
            public onrequest: any;
            public onsubmit: any;

            constructor() {
                super('AddCharacterModal');

                $('#AddCharacter').click((event) => {
                    if (this.onrequest) {
                        this.onrequest();
                    }
                });
                this.form().bind('submit', (event) => {
                    if (this.onsubmit) {
                        this.onsubmit(+this.val('character_id'));
                        this.hide();
                    }
                });
            }

            public open(characters: any[]) {
                this.hide();
                var select = $('#AddCharacterCharacter').empty();
                for (var i = 0; i < characters.length; i++) {
                    select.append($('<option>').attr('value', characters[i].id).text(characters[i].name));
                }
                this.show();
            }
        }

        export class AddNPCModal extends FormModal {
            public onsubmit: any;

            constructor() {
                super('AddNPCModal');

                this.form().bind('submit', (event) => {
                    if (this.onsubmit) {
                        this.onsubmit(this.val('name'));
                        this.hide();
                    }
                });
            }
        }


        export class EditRoomModal extends FormModal {
            public onsubmit: any;
            public onremove: any;
            private room: common.ChatRoom;

            constructor() {
                super('EditRoomModal');

                this.modal().bind('show.bs.modal', (event) => {
                    this.val('name', this.room.name);
                });

                this.form().submit((event) => {
                    if (this.onsubmit) {
                        this.onsubmit(
                            +this.room.id,
                            this.val('name'),
                            +this.room.map_width,
                            +this.room.map_height
                            );
                        this.hide();
                    }
                });

                $('#EditRoomRemove').click((event) => {
                    if (this.onremove && confirm('本当に削除してもよろしいですか？')) {
                        this.onremove(+this.room.id);
                        this.hide();
                    }
                });
            }

            public updateRoom(room: common.ChatRoom) {
                this.room = room;
            }
        }

        export class UploadMapImageModal extends Modal {
            public onupload: any;
            private room_id: number;

            constructor() {
                super('UploadMapImageModal');

                this.modal().bind({
                    dragover: (event) => event.preventDefault(),
                    drop: (event) => this.mapImageDrop(event)
                });
            }

            private mapImageDrop(event) {
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
                        success: (data) => {
                            if (this.onupload) {
                                this.onupload(this.room_id);
                            }
                            this.hide();
                        },
                        error: function (data) {
                            console.error(data.responseXML);
                        }
                    });
                }
            }

            public updateRoom(room: common.ChatRoom) {
                this.room_id = room.id;
            }
        }

        export class EditMapModal extends FormModal {
            public onsubmit: any;
            private room: common.ChatRoom;
            public upload_map_image_modal: UploadMapImageModal;

            constructor() {
                super('EditMapModal');

                this.upload_map_image_modal = new UploadMapImageModal;

                this.modal().bind('show.bs.modal', (event) => {
                    this.val('map_width', this.room.map_width);
                    this.val('map_height', this.room.map_height);
                });

                this.form().submit((event) => {
                    if (this.onsubmit) {
                        this.onsubmit(
                            +this.room.id,
                            this.room.name,
                            +this.val('map_width'),
                            +this.val('map_height'));
                        this.hide();
                    }
                });

                $('#EditMapUpload').click((event) => {
                    this.upload_map_image_modal.show();
                    this.hide();
                });
            }

            public updateRoom(room: common.ChatRoom) {
                this.room = room;
                this.upload_map_image_modal.updateRoom(room);
            }
        }


        export class RoomList {
            private user_id: string;
            private rooms: common.ChatRoom[];
            public create_room_modal;
            public onjoin: any; 

            constructor(user_id: string) {
                this.user_id = user_id;
                this.rooms = [];
                this.create_room_modal = new CreateRoomModal;
            }
            
            public updateRooms(rooms: any[]) {
                for (var i = 0; i < rooms.length; i++) {
                    var room = new common.ChatRoom;
                    room.set(rooms[i]);
                    this.updateRoom(room);
                }
            }

            private joinButton(mode: string, label: string, color: string = 'default') {
                return $('<button class="btn btn-' + color + ' btn-xs">').attr('data-mode', mode).text(label);
            }

            private updateRoom(room: common.ChatRoom) {
                var exists = room.id in this.rooms;
                this.rooms[room.id] = room;

                var list = $('#RoomList');

                var item: JQuery;
                if (exists) {
                    item = list.find('[data-id=' + room.id + ']');
                } else {
                    item = $('<div class="col-md-4 chat-room"></div>').attr('data-id', room.id);

                    var buttons = $('<div class="btn-group pull-right"></div>');
                    buttons.append(this.joinButton('player', '参加', 'primary'));
                    if (<any>room.user_id == this.user_id) {
                        buttons.append(this.joinButton('master', 'GM', 'info'));
                    }
                    buttons.append(this.joinButton('viewer', '観戦', 'success'));

                    buttons.find('.btn').click((event) => {
                        if (this.onjoin) {
                            var button = $(event.target);
                            this.onjoin(+button.closest('[data-id]').attr('data-id'), button.attr('data-mode'));
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
            }
        }

        export class CharacterInstanceList {
            public character_instances: common.ChatCharacterInstance[];
            public character_id_table: number[];
            private user: common.User;
            private mode: string;
            private room: common.ChatRoom;
            public character_instance_modal: CharacterInstanceModal;
            public npc_instance_modal: NPCInstanceModal;
            private map: Map;
            private message_form: MessageForm;

            constructor (map: Map, message_form: MessageForm) {
                this.character_instance_modal = new CharacterInstanceModal;
                this.npc_instance_modal = new NPCInstanceModal;
                this.map = map;
                this.message_form = message_form;
            }

            public login(user: common.User, mode: string, room: common.ChatRoom) {
                $('#CharacterInstanceList thead, #CharacterInstanceList tbody').empty();
                this.character_instances = [];
                this.character_id_table = [];
                this.user = user;
                this.mode = mode;
                this.room = room;
            }

            public updateCharacterInstances(character_instances: any[]) {
                for (var i = 0; i < character_instances.length; i++) {
                    var character_instance = new common.ChatCharacterInstance;
                    character_instance.set(character_instances[i]);
                    this.updateCharacterInstance(character_instance);
                }
            }

            private updateCharacterInstance(character_instance: common.ChatCharacterInstance) {
                var list = $('#CharacterInstanceList tbody');

                if (this.character_instances.length == 0) {
                    var header = $('<tr class="chat-character_instance">')
                        .append('<th><span class="glyphicon glyphicon-chevron-down"></span><span class="glyphicon glyphicon-chevron-right"></span></th>')
                        .append('<th>キャラクター</th>');
                    for (var i = 0; i < character_instance.CharacterInstanceParameter.length; i++) {
                        var parameter = character_instance.CharacterInstanceParameter[i];
                        header.append($('<th>').text(parameter.name));
                    }
                    header.append('<th>メモ</th>')
                        .click((event) => {
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
                        buttons.append($('<a target="_blank" class="btn btn-xs btn-primary">')
                                .attr('href', url + character_instance.character_id)
                                .append('<span class="glyphicon glyphicon-eye-open"></span>'));
                    }

                    if (this.mode == 'master' || character_instance.user_id == <any>this.user.id) {
                        buttons.append($('<button class="btn btn-xs btn-success" data-action="edit"><span class="glyphicon glyphicon-pencil"></span></button>').click((event) => {
                            var button = $(event.target);
                            if (!button.attr('data-action')) button = button.closest('[data-action]');
                            var action = button.attr('data-action');
                            var line = button.closest('[data-id]');
                            var id = +line.attr('data-id');
                            switch (action) {
                                case 'edit':
                                    if (id in this.character_instances) {
										var character_instance = this.character_instances[id];
										if (character_instance.character_instance_type_id == 1) {
											this.character_instance_modal._show(character_instance);
										} else if (character_instance.character_instance_type_id == 2 && this.mode == 'master') {
											this.npc_instance_modal._show(character_instance);
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
            }

            public dropCharacterInstance(id: number) {
                $('.chat-character-instance[data-id=' + id + ']').remove();

                this.map.dropCharacterInstance(id);
                this.message_form.dropCharacterInstance(id);

                var character_instance = this.character_instances[id];
                if (character_instance) {
                    delete this.character_id_table[character_instance.character_id];
                    delete this.character_instances[id];
                }
            }
        }

        export class Map {
            public onpos: any;

            private character_instances: common.ChatCharacterInstance[];
            private map_scale: number = 8;

            constructor() {
                $('#MapToolbar .btn').click((event) => {
                    var button = $(event.target);
                    if (!button.attr('data-action')) button = button.closest('[data-action]');
                    switch (button.attr('data-action')) {
                        case 'zoom':
                            this.map_scale += (+button.attr('data-zoom'));
                            if (this.map_scale < 3) this.map_scale = 3;
                            $('#MapCharacters .map-character').each((index, element) => {
                                var chip = $(element);
                                var id = $(element).attr('data-id');
                                var character_instance = this.character_instances[id];
                                chip.css('left', character_instance.x * this.map_scale + 'px').css('top', character_instance.y * this.map_scale + 'px');
                            });
                            this.setTileScale($('#MapTiles .map-tile, #MapCharacters .map-character'));
                            break;
                        default:
                            break;
                    }
                });
                $('#Map').bind({
                    dragover: (event) => event.preventDefault(),
                    drop: (event) => {
                        event.preventDefault()

                        var dt = ('dataTransfer' in event) ? event.dataTransfer : event.originalEvent.dataTransfer;
                        var data = JSON.parse(dt.getData('text/plain'));

                        var id = +data.id;
                        var dst_x = event.pageX || event.originalEvent.pageX;
                        var dst_y = event.pageY || event.originalEvent.pageY;
                        var r_x = dst_x - data.x;
                        var r_y = dst_y - data.y;
                        this.character_instances[id].x += Math.round(r_x / this.map_scale);
                        this.character_instances[id].y += Math.round(r_y / this.map_scale);

                        if (this.onpos) {
                            this.onpos(id, this.character_instances[id].x, this.character_instances[id].y);
                        }
                    }
                });
            }

            public login(room: common.ChatRoom, character_instances: common.ChatCharacterInstance[]) {
                $('#MapTiles').css('background-image', null).empty();
                $('#MapCharacters').empty();
                this.character_instances = character_instances;
                this.updateRoom(room);
            }

            private setTileScale(tile: JQuery) {
                var size = this.map_scale * 8;
                tile.css('width', size).css('height', size);
            }

            public updateRoom(room: common.ChatRoom) {
                var tiles = $('#MapTiles').css('background-image', room.map_background_url ? ('url(' + room.map_background_url + '?' + (new Date).getTime() + ')') : null);

                tiles.find('.map-tile').remove();
                for (var y = 0; y < room.map_height; y++) {
                    var line = $('<div class="map-row">').appendTo(tiles);
                    for (var x = 0; x < room.map_width; x++) {
                        var size = 8 * this.map_scale + 'px';
                        var text = '';
                        for (var i = 0; i <= Math.floor(room.map_width/26); i++) {
                            text += String.fromCharCode(65 + x);
                        }
                        text += (y+1);
                        var tile = $('<div class="map-tile">').append($('<span>').text(text)).appendTo(line)
                    this.setTileScale(tile);
                    }
                }
            }

            private onDragstart(event) {
                var target = $(event.target);
                if (!target || !target.attr('data-id')) target = target.closest('[data-id]');

                var dt = ('dataTransfer' in event) ? event.dataTransfer : event.originalEvent.dataTransfer;
                var data = {
                    id: +target.attr('data-id'),
                    x: event.pageX || event.originalEvent.pageX,
                    y: event.pageY || event.originalEvent.pageY
                };
                dt.setData('text/plain', JSON.stringify(data));
            }

            public updateCharacterInstance(character_instance: common.ChatCharacterInstance, exists: boolean) {
                var chip;
                if (exists) {
                    chip = $('.map-character[data-id=' + (+character_instance.id) + ']');
                } else {
                    chip = $('<div draggable="true" class="map-character">')
                        .attr('data-id', +character_instance.id)
                        .append('<span data-field="name">');
                    this.setTileScale(chip);
                    chip.bind('dragstart', (event) => this.onDragstart(event));
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
                chip.css('left', character_instance.x * this.map_scale + 'px')
                    .css('top', character_instance.y * this.map_scale + 'px')
                    .find('[data-field=name]').text(name);

                var image_url = null;
                if (character_instance.character_instance_type_id == 1) {
                    image_url = 'url(/trpg/' + character_instance['game_type_id'] + '/characters/image/' + character_instance['Character']['id'] + ')';
                }
                chip.css('background-image', image_url);

                if (!exists) {
                    chip.appendTo('#MapCharacters');
                }
            }
            
            public dropCharacterInstance(id: number) {
                $('.map-character[data-id=' + (+id) + ']').remove();
            }
        }

        export class CharacterImage {
            private left_id: number;
            private right_id: number;
            private character_instances: common.ChatCharacterInstance[];
            private character_id_table: number[];

            constructor() {
            }

            public login(character_instances: common.ChatCharacterInstance[], character_id_table: number[]) {
                $('#LeftImage, #RightImage').css('background-image', null);
                this.left_id = null;
                this.right_id = null;
                this.character_instances = character_instances;
                this.character_id_table = character_id_table;
            }

            public push(character_id: number) {
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
            }
        }

        export class WritingMessage {
            private static writings: WritingMessage[] = [];

            private name: string;
            private timer: any;
            private message: JQuery;

            constructor(name: string, message_type_id: number) {
                this.name = name;
                if ((name in WritingMessage.writings) && WritingMessage.writings[name]) {
                    WritingMessage.writings[name].resetTimer();
                } else {
                    this.message = $('<div class="chat-message chat-message-writing row"></div>')
                        .append($('<div class="col-xs-3 col-sm-3 text-right" data-field="name">')
                                .text(name))
                        .append($('<div class="col-xs-9 col-sm-7" data-field="message">')
                                .append('<span class="glyphicon glyphicon-pencil">'))
                        .append('<div class="hidden-xs col-sm-2" data-field="modified"></div>')
                        .attr('data-type', message_type_id);
                    this.resetTimer();
                    WritingMessage.writings[name] = this;

                    var list = $('#ChatMessageList');
                    this.message.appendTo(list);
                    list.scrollTop(list.scrollTop() + this.message.height());
                }
            }

            private resetTimer() {
                if (this.timer) {
                    clearTimeout(this.timer);
                }
                setTimeout(() => this.remove(), 3000);
            }

            private remove() {
                delete WritingMessage.writings[this.name];
                this.message.remove();
            }
        }

        export class MessageList {
            public onrequestlog: any;
            private audio_alert: AudioAlert;
            private character_image: CharacterImage;
            private messages: common.ChatMessage[];
            private remaining: boolean;
            private max_id: number;
            private min_id: number;
            private max_character_message_id: number;
            private log_loader_timer: any;

            constructor() {
                this.audio_alert = new AudioAlert;
                this.character_image = new CharacterImage;

                this.messages = [];

                $('#ChatMessageList').scroll((event) => this.onScroll());
            }

            private onScroll() {
                if (this.onrequestlog && this.min_id && this.remaining && $('#ChatMessageList').scrollTop() == 0) {
                    this.onrequestlog(this.min_id);
                }
            }
            
            public login(character_instances: common.ChatCharacterInstance[], character_id_table: number[]) {
                $('#ChatMessageList').empty();
                this.messages = [];
                this.remaining = true;

                this.max_id = -1;
                this.min_id = -1;
                this.max_character_message_id = -1;

                this.character_image.login(character_instances, character_id_table);

                this.log_loader_timer = setInterval(() => this.onScroll(), 3000);
            }

            public updateMessages(messages: any[]) {
                if (this.max_id < 0) this.log_loader_timer = setTimeout(() => this.onScroll(), 8000);
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
            }

            private updateMessage(message: common.ChatMessage) {
                var exists = (message.id in this.messages);
                this.messages[message.id] = message;
                var list = $('#ChatMessageList');

                var o;
                if (exists) {
                    o = list.find('.chat-message[data-id=' + (+message.id) + ']');
                } else {
                    o = $('<div class="chat-message row"></div>').append('<div class="col-xs-3 col-sm-3 text-right" data-field="name"></div><div class="col-xs-9 col-sm-7" data-field="message"></div><div class="hidden-xs col-sm-2" data-field="modified"></div>').attr('data-id', message.id).attr('data-type', message.message_type_id);
                }

                var name: string;
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
                var date = new Date(<any>message.modified);
                var hours = date.getHours();
                var minutes:any = date.getMinutes();
                if (minutes < 10) minutes = '0' + minutes;
                o.find('[data-field=modified]').text(hours + ':' + minutes);

                if ((this.max_character_message_id < 0 || message.id >= this.max_character_message_id) && message.message_type_id == 4) {
                    this.max_character_message_id = message.id;
                    this.character_image.push(message.character_id);
                }

                if (!exists) {
                    if (this.min_id < 0) this.min_id = message.id;
                    if (this.max_id < 0) this.max_id = message.id;

                    if (message.id >= this.max_id) {
                        this.max_id = message.id;
                        list.append(o);
                    } else if (message.id <= this.min_id) {
                        this.min_id = message.id;
                        list.prepend(o);
                    } else {
                        var inserted = false;
                        for (var i = message.id-1; i >= 0; i--) {
                            if (i in this.messages) {
                                var target = list.find('[data-id="' + i + '"]');
                                if (target.length == 1) {
                                    list.find('[data-id=' + i + ']').after(o);
                                    inserted = true;
                                    break;
                                }
                            }
                        }
                        if (!inserted) console.error('Invalid message id:', message.id, 'max:', this.max_id, 'min:', this.min_id);
                    }
                    list.scrollTop(list.scrollTop() + o.height());
                }
            }

            public writing(name: string, message_type_id: number) {
                new WritingMessage(name, message_type_id);
            }
        }

        export class MessageForm {
            public onsubmit: any;
            public onwriting: any;
            private user: common.User;
            private mode: string;
            private prev_message: string;
            private writing_wathcer: any;

            constructor() {
                $('#ChatMessageForm').submit((event) => {
                    if (this.onsubmit) {
                        var message = $('#ChatMessageMessage').val();

                        if (message.length > 0) {
                            $('#ChatMessageMessage').val(null);

                            var character_id = (this.mode == 'player') ? $('#ChatMessageCharacter').val() : null;

                            var name = (this.mode == 'master') ? $('#ChatMessageName').val() : null;

                            this.onsubmit(name, +character_id, message);
                        }
                    }
                });

                $('#ChatMessageMessage').bind({
                    focus: (event) => {
                        this.writing_wathcer = setInterval(() => this.watchWriting(), 1000);
                        this.watchWriting();
                    },
                    blur: (event) =>{
                        if (this.writing_wathcer) {
                            clearInterval(this.writing_wathcer);
                            this.writing_wathcer = null;
                        }
                    }
                });
            }

            private watchWriting() {
                var message = $('#ChatMessageMessage').val();

                if (message != this.prev_message) {
                    if (this.onwriting) {
                        var character_id = (this.mode == 'player') ? $('#ChatMessageCharacter').val() : null;
                        var name = (this.mode == 'master') ? $('#ChatMessageName').val() : null;
                        this.onwriting(name, +character_id);
                    }
                    this.prev_message = message;
                }
            }

            public login(user: common.User, mode: string) {
                $('#ChatMessageCharacter').empty()
                    .append($('<option>').val(null).text(user.name));

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
            }

            public updateCharacterInstance(character_instance: common.ChatCharacterInstance, exists: boolean) {
                if (character_instance.user_id == <any>this.user.id) {
                    var option;
                    if (exists) {
                        option = $('#ChatMessageCharacter option[var=' + (+character_instance.id) + ']');
                    } else {
                        option = $('<option>').val(<any>character_instance.character_id).attr('data-id', character_instance.id);
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
            }

            public dropCharacterInstance(id: number) {
                    $('#ChatMessageCharacter option[data-id=' + id + ']').remove();
            }
        }

        export class RoomView {
            public character_instance_list: CharacterInstanceList;
            public map: Map;
            public message_list: MessageList;
            public message_form: MessageForm;
            public add_character_modal: AddCharacterModal;
            public add_npc_modal: AddNPCModal;
            public edit_room_modal: EditRoomModal;
            public edit_map_modal: EditMapModal;

            public room: common.ChatRoom;

            constructor() {
                this.map = new Map;
                this.message_list = new MessageList;
                this.message_form = new MessageForm;
                this.character_instance_list = new CharacterInstanceList(this.map, this.message_form);
                this.add_character_modal = new AddCharacterModal;
                this.add_npc_modal = new AddNPCModal;
                this.edit_room_modal = new EditRoomModal;
                this.edit_map_modal = new EditMapModal;
            }

            public login(user: common.User, mode: string, room: common.ChatRoom, character_instances: any[]) {
                $('body').attr('data-mode', 'room').attr('data-joinmode', mode);
                this.character_instance_list.login(user, mode, room);
                this.message_list.login(
                        this.character_instance_list.character_instances,
                        this.character_instance_list.character_id_table);
                this.message_form.login(user, mode);
                this.map.login(room, this.character_instance_list.character_instances);
                this.room = null;
                this.updateRoom(room);
            }

            public logout() {
                $('body').attr('data-mode', 'list').removeAttr('data-joinmode');
                this.room = null;
            }

            public updateRoom(room: common.ChatRoom) {
                if (!this.room || this.room.id == room.id) {
                    this.room = room;
                    this.edit_room_modal.updateRoom(room);
                    this.edit_map_modal.updateRoom(room);
                    this.map.updateRoom(room);
                }
            }
        }

        export class View {
            public room_list: RoomList;
            public room_view: RoomView;

            constructor(user_id: string) {
                this.room_list = new RoomList(user_id);
                this.room_view = new RoomView;
            }
        }
    }

    class AudioAlert {
        private context: AudioContext;
        private gain: any;

        constructor() {
            if ('AudioContext' in window) this.context = new AudioContext;
            else if ('webkitAudioContext' in window) this.context = new webkitAudioContext;

            if (this.context) {
                this.gain = this.context.createGain();
                this.gain.gain.value = 0.3; 
                this.gain.connect(this.context.destination);
            }
        }

        public alert() {
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
				osc1.stop(t+0.2);
				osc2.start(t+0.2);
				osc2.stop(t+0.4);
            }
        }
    }

    export class ChatClient {
        private view: View.View;
        private user_id: string;
        private user: common.User;
        private socket: WebSocket;
        private message_handler: any;
        private join_mode: string;
        private retrytimer: any;

        constructor(user_id: string) {
            $('body').attr('data-mode', 'list').removeAttr('data-joinmode');
            this.user_id = user_id;

            this.view = new View.View(this.user_id);
			this.view.room_list.create_room_modal.onsubmit = (name: string, game_type_id: number) => {
				this.logout();
				this.send('room.new', {name: name, game_type_id: game_type_id});
			};
            this.view.room_list.onjoin = (id: number, mode: string) => {
				this.logout();
                this.send('room.join', {room_id: id, mode: mode});
            };

            this.view.room_view.character_instance_list.character_instance_modal.onsubmit = (id: number, name: string, memo: string, parameters: any[]) => {
                this.send('character_instance.set', {
                    id: id,
                    memo: memo,
                    parameters: parameters
                });
            };
            this.view.room_view.character_instance_list.npc_instance_modal.onsubmit = (id: number, name: string, memo: string, parameters: any[]) => {
                this.send('character_instance.set', {
                    id: id,
					name: name,
                    memo: memo,
                    parameters: parameters
                });
            };
            this.view.room_view.character_instance_list.character_instance_modal.onremove = 
				this.view.room_view.character_instance_list.npc_instance_modal.onremove = (id: number) => {
                if (this.view.room_view.room) {
                    this.send('character_instance.remove', {id: (+id)});
                }
            }
			this.view.room_view.message_list.onrequestlog = (top_id: number) => this.send('message.list', {top_id: top_id});
			this.view.room_view.map.onpos = (id: number, x: number, y: number) => this.send('character_instance.pos', {id: id, x: x, y: y});
			this.view.room_view.message_form.onsubmit = (name: string, character_id: number, message: string) => {
				if (this.view.room_view.room) {
					this.send('message.new', {
                        name: name,
                        character_id: character_id,
                        message: message
                    });
				}
			};
			this.view.room_view.message_form.onwriting = (name: string, character_id: number) => {
                if (this.view.room_view.room) {
                    this.send('message.writing', {
                        name: name,
                        character_id: character_id
                    });
                }
            };
            this.view.room_view.add_character_modal.onrequest = () => this.send('character.list');
            this.view.room_view.add_character_modal.onsubmit = (character_id: number) => this.send('character_instance.new', {character_id: character_id});
            this.view.room_view.add_npc_modal.onsubmit = (name: string) => this.send('character_instance.new', {name: name});

            this.view.room_view.edit_room_modal.onsubmit = 
                this.view.room_view.edit_map_modal.onsubmit = (id: number, name: string, map_width: number, map_height: number) => {
                    this.send('room.set', {
                        id: id,
                        name: name,
                        map_width: map_width,
                        map_height: map_height
                    });
                };

            this.view.room_view.edit_room_modal.onremove = (id: number) => this.send('room.remove', {id: id});

            this.view.room_view.edit_map_modal.upload_map_image_modal.onupload = (id: number) => this.send('room.uploaded', {id: id});

            this.connect();

			$('#Logout').click((event) => this.logout());
        }

        private connect() {
            if (this.socket) this.socket.close();
            this.socket = new WebSocket('ws://chat.takiri.shy.jp');
            this.socket.onopen = (event) => this.onOpen(event);
            this.socket.onmessage = (event) => this.onMessage(event);
            this.socket.onclose = (event) => this.onClose(event);
            this.retrytimer = setTimeout(() => this.connect(), 3000);
        }

		private logout() {
            this.send('room.logout');
            $('body').attr('data-mode', 'list').removeAttr('data-joinmode');
		}

        private log(data: any) {
            console.log(data);
        }

        private send(path: string, data: any = {}) {
            this.socket.send(common.encodePacket(path, data));
        }

        private onOpen(event) {
            if (this.retrytimer) {
                clearTimeout(this.retrytimer);
                this.retrytimer = null;
            }
            this.log('open');

            this.send('auth.join', {user_id: this.user_id});
        }

		private onMessage(event: any) {
			if ('data' in event) {
				var message = common.decodePacket(event.data);
				console.debug(message);
				if (common.dispatchMessage(this, message)) return;
				console.error('Unknown message: ', message);
			}
		}

		private msgAuth(path: string, data: any) {
			if (!this.user) {
				switch (path) {
					case 'ok':
						this.user = new common.User;
						this.user.set(data);
                        setTimeout(() => this.send('room.list'), 500);
						return true;
					case 'timeout':
						alert('認証にタイムアウトしました。\nページを更新して再試行してください。');
						return true;
					case 'failed':
						alert('認証に失敗しました。\nページを更新して再試行してください。');
						return true;
				}
			}
		}

		private msgRoom(path: string, data: any) {
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
						this.send('message.list', {top_id: -1});
						this.send('character_instance.list');
						return true;
					case 'join_failed':
						alert('Join Failed');
						return true;
				}
			}
			return false;
		}

		private msgMessage(path: string, data: any) {
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
		}

		private msgCharacter(path: string, data: any) {
			if (this.view.room_view.room  && path == 'data') {
                this.view.room_view.add_character_modal.open(data);
				return true;
			}
			return false;
		}

		private msgCharacterInstance(path: string, data: any) {
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
		}

        private onClose(event) {
            if (!this.retrytimer) alert('セッションが切断されました。\n回復するにはページをリロードしてください。');
        }
    }
}
var client = new ChatClient.ChatClient(user_id);
