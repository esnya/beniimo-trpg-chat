var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common;
(function (common) {
    (function (Inflector) {
        function underscore(str) {
            return str.replace(/^[A-Z]/, function (m) {
                return m.toLowerCase();
            }).replace(/[A-Z]/g, function (m) {
                return '_' + m.toLowerCase();
            });
        }
        Inflector.underscore = underscore;

        function camelize(str) {
            return str.replace(/(^[a-z])|(_[a-z])/g, function (m) {
                return ((m.charAt(0) == '_') ? m.charAt(1) : m).toUpperCase();
            });
        }
        Inflector.camelize = camelize;
    })(common.Inflector || (common.Inflector = {}));
    var Inflector = common.Inflector;

    function diceReplace(str) {
        return str.replace(/([0-9\+-\/**\.\(\)]|([1-9]*d[1-9]*))+(=|([<>]=?[0-9\+-\/**\.\(\)]+))/g, function (matched) {
            var all_min = true;
            var all_max = true;
            var all = true;
            var all_eyes;

            var m = matched.match(/^([^<>=]+)([<>=]+)([^<>=]*)$/);
            var left = m[1];
            var op = m[2];
            var right = m[3];

            var diced = left.replace(/([0-9]*)d([0-9]*)/g, function (dice) {
                var i;
                for (i = 0; i < dice.length; i++) {
                    if (dice[i] == 'd')
                        break;
                }
                var number = +dice.slice(0, i) || 1;
                var eyes = +dice.slice(i + 1) || 6;
                if (all_eyes === undefined)
                    all_eyes = eyes;
                else
                    all = false;

                var results = [];
                var sum;
                if (number == 1 && eyes == 66) {
                    all = false;
                    results.length = 2;
                    for (i = 0; i < results.length; i++) {
                        var eye = Math.floor(Math.random() * 6) + 1;
                        sum += eye;
                        results[i] = eye;
                    }
                    results.sort();
                    sum = results.join('');
                } else {
                    sum = 0;
                    results.length = number;
                    for (i = 0; i < results.length; i++) {
                        var eye = Math.floor(Math.random() * eyes) + 1;
                        if (eye != 1)
                            all_min = false;
                        if (eye != eyes)
                            all_max = false;
                        sum += eye;
                        results[i] = eye;
                    }
                }

                return sum + '[' + results.join(', ') + ']';
            });
            var jsexpr = diced.replace(/\[[0-9, ]+\]/g, '');
            var left_value = eval(diced.replace(/\[[0-9, ]*\]/g, ''));

            var result = ' ';

            if (op[0] == '=') {
                result += left + ' -> ' + diced + '=' + left_value;
            } else {
                result += matched + ' -> ' + diced + '=' + left_value;
                var right_value = eval(right);
                result += op;
                result += right_value;

                if (eval('' + left_value + op + right_value)) {
                    result += ' 成功';
                } else {
                    result += ' 失敗';
                }
            }

            if (all) {
                if (all_min)
                    result += ' (1ゾロ)';
                else if (all_max)
                    result += ' (' + all_eyes + 'ゾロ)';
            }

            return result + ' ';
        });
    }
    common.diceReplace = diceReplace;

    function dispatchMessage(o, message) {
        if (('path' in message) && ('data' in message)) {
            var path = message.path.split('.');
            if (path.length >= 2) {
                var handler = 'msg' + Inflector.camelize(path[0]);
                if (handler in o) {
                    if (o[handler](path.slice(1).join('.'), message.data))
                        return true;
                }
            }
        }
        return false;
    }
    common.dispatchMessage = dispatchMessage;

    function encodePacket(path, data) {
        return JSON.stringify({ path: path, data: data });
    }
    common.encodePacket = encodePacket;

    function decodePacket(data) {
        return JSON.parse(data);
    }
    common.decodePacket = decodePacket;

    function getModels() {
        return {
            'User': User,
            'ChatRoom': ChatRoom,
            'ChatCharacterInstance': ChatCharacterInstance,
            'ChatCharacterInstanceParameter': ChatCharacterInstanceParameter,
            'ChatMessage': ChatMessage,
            'GameType': GameType,
            'Character': Character,
            'SW2Character': SW2Character,
            'KancolleCharacter': KancolleCharacter
        };
    }
    common.getModels = getModels;

    var ModelBase = (function () {
        function ModelBase() {
            this.model = null;
            this.id = null;
        }
        ModelBase.prototype.set = function (data) {
            for (var key in data) {
                var path = key.split('.');
                if (path.length == 1) {
                    this[key] = data[key];
                } else {
                    if (path[0] == this.model) {
                        this[path[1]] = data[key];
                    } else if (this.belongsTo) {
                        var flag = false;
                        for (var i = 0; !flag && i < this.belongsTo.length; i++) {
                            if (this.belongsTo[i] == path[0]) {
                                flag = true;
                                break;
                            }
                        }
                        if (flag) {
                            var model = path[0];
                            var models = getModels();
                            if (model in models) {
                                if (!this[model])
                                    this[model] = new (models[model]);
                                this[model][path[1]] = data[key];
                            }
                        }
                    }
                }
            }
        };

        ModelBase.prototype.get = function () {
            var data = {};
            var fields = this.fields();
            for (var i = 0; i < fields.length; i++) {
                data[fields[i]] = this[fields[i]];
            }

            var belongsTo = this.belongsTo;
            for (var i = 0; i < belongsTo.length; i++) {
                var parentData = this[belongsTo[i]];
                for (var key in parentData) {
                    data[belongsTo[i] + '.' + key] = parentData[data];
                }
            }

            return data;
        };

        ModelBase.prototype.fields = function () {
            var fields = [];
            for (var key in this) {
                switch (key) {
                    case 'model':
                    case 'belongsTo':
                    case 'hasMany':
                    case 'fields':
                    case 'set':
                    case 'get':
                    case 'constructor':
                        break;
                    default:
                        var flag = true;
                        if (this.belongsTo) {
                            for (var i = 0; i < this.belongsTo.length; i++) {
                                if (this.belongsTo[i] == key) {
                                    flag = false;
                                    break;
                                }
                            }
                        }

                        if (flag && this.hasMany) {
                            for (var i = 0; i < this.hasMany.length; i++) {
                                if (this.hasMany[i] == key) {
                                    flag = false;
                                    break;
                                }
                            }
                        }

                        if (flag)
                            fields.push(key);
                }
            }
            return fields;
        };
        return ModelBase;
    })();
    common.ModelBase = ModelBase;

    var User = (function (_super) {
        __extends(User, _super);
        function User() {
            _super.apply(this, arguments);
            this.model = 'User';
            this.name = null;
        }
        return User;
    })(ModelBase);
    common.User = User;

    var ChatRoom = (function (_super) {
        __extends(ChatRoom, _super);
        function ChatRoom() {
            _super.apply(this, arguments);
            this.model = 'ChatRoom';
            this.name = null;
            this.game_type_id = null;
            this.user_id = null;
            this.map_width = null;
            this.map_height = null;
            this.map_background_url = null;
            this.created = null;
            this.modified = null;
            this.User = null;
            this.GameType = null;
            this.belongsTo = ['User', 'GameType'];
        }
        return ChatRoom;
    })(ModelBase);
    common.ChatRoom = ChatRoom;

    var ChatMessage = (function (_super) {
        __extends(ChatMessage, _super);
        function ChatMessage() {
            _super.apply(this, arguments);
            this.model = 'ChatMessage';
            this.room_id = null;
            this.message_type_id = null;
            this.game_type_id = null;
            this.user_id = null;
            this.character_id = null;
            this.name = null;
            this.message = null;
            this.created = null;
            this.modified = null;
            this.belongsTo = ['User', 'GameType'];
        }
        return ChatMessage;
    })(ModelBase);
    common.ChatMessage = ChatMessage;

    var ChatCharacterInstance = (function (_super) {
        __extends(ChatCharacterInstance, _super);
        function ChatCharacterInstance() {
            _super.apply(this, arguments);
            this.model = 'ChatCharacterInstance';
            this.user_id = null;
            this.room_id = null;
            this.character_instance_type_id = null;
            this.name = null;
            this.game_type_id = null;
            this.character_id = null;
            this.memo = null;
            this.x = null;
            this.y = null;
            this.created = null;
            this.modified = null;
            this.belongsTo = ['User', 'GameType'];
            this.hasMany = [
                {
                    name: 'CharacterInstanceParameter',
                    model: 'ChatCharacterInstanceParameter',
                    foreign_key: 'character_instance_id'
                }
            ];
        }
        return ChatCharacterInstance;
    })(ModelBase);
    common.ChatCharacterInstance = ChatCharacterInstance;

    var ChatCharacterInstanceParameter = (function (_super) {
        __extends(ChatCharacterInstanceParameter, _super);
        function ChatCharacterInstanceParameter() {
            _super.apply(this, arguments);
            this.model = 'ChatCharacterInstanceParameter';
            this.character_instance_id = null;
            this.n = null;
            this.name = null;
            this.value = null;
            this.created = null;
            this.modified = null;
        }
        return ChatCharacterInstanceParameter;
    })(ModelBase);
    common.ChatCharacterInstanceParameter = ChatCharacterInstanceParameter;

    var GameType = (function (_super) {
        __extends(GameType, _super);
        function GameType() {
            _super.apply(this, arguments);
            this.model = 'GameType';
            this.name = null;
        }
        return GameType;
    })(ModelBase);
    common.GameType = GameType;

    var Character = (function (_super) {
        __extends(Character, _super);
        function Character() {
            _super.apply(this, arguments);
            this.model = 'Character';
            this.name = null;
            this.user_id = null;
            this.belongsTo = ['User'];
        }
        return Character;
    })(ModelBase);
    common.Character = Character;

    var SW2Character = (function (_super) {
        __extends(SW2Character, _super);
        function SW2Character() {
            _super.apply(this, arguments);
            this.model = 'SW2Character';
        }
        return SW2Character;
    })(Character);
    common.SW2Character = SW2Character;

    var KancolleCharacter = (function (_super) {
        __extends(KancolleCharacter, _super);
        function KancolleCharacter() {
            _super.apply(this, arguments);
            this.model = 'KancolleCharacter';
        }
        return KancolleCharacter;
    })(Character);
    common.KancolleCharacter = KancolleCharacter;
})(common || (common = {}));

if (!module)
    var module = {};
module.exports = common;
