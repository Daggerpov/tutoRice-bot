"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
require('dotenv').config();
var child_process_1 = require("child_process");
var globals_js_1 = require("../globals.js");
var Discord = require("discord.js");
var client = new Discord.Client();
var Sequelize = require('sequelize');
var cp = require('child_process');
var playID, playChannel, scrapeOutput;
var MessageButton = require("discord-buttons").MessageButton;
require("discord-buttons")(client);
var fs = require('fs');
client.on('ready', function () {
    console.log("Logged in as " + client.user.tag + "!");
});
client.on('message', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var firstTitleLine, secondTitleLine, amountOfSpaces, playEmbed, helpEmbed;
    return __generator(this, function (_a) {
        global.msg = msg;
        msg.content = msg.content.toUpperCase();
        if (msg.content === '~FREERICE') {
            //var txt = "here";
            msg.reply("This free discord bot allows discord users to earn rice grains from freerice.com within the app to help people in need from around the world. You can read up on what freerice is about here: https://freerice.com/about."); // + txt.link("https://freerice.com/about").get("href");
        }
        else if (msg.content === '~RANKINGS') {
            displayRankings(msg);
        }
        else if (msg.content === '~PLAY' || msg.content === '~P') {
            globals_js_1.GlobalVars.globularmsg = msg;
            globals_js_1.GlobalVars.currentPage = 0;
            createUser(msg); //Creates a user in the database, does nothing if player is already in database
            firstTitleLine = "__Here's our list of subjects you can choose from (by reacting)__";
            secondTitleLine = "__to find a more specific category to play__";
            amountOfSpaces = (firstTitleLine.replace('_', '').length - secondTitleLine.replace('_', '').length);
            playEmbed = new Discord.MessageEmbed()
                .setColor('0x4286f4')
                .setTitle(firstTitleLine + "\n" + (" ".repeat(amountOfSpaces) + secondTitleLine + " ".repeat(amountOfSpaces)))
                .addFields(
            // \u200B is to add a blank field. inline being true means these two fields are on the same line
            { name: '\u200B' /* "__Subject__" */, value: "Mathematics:\n\nSciences:\n\nGeography:\n\nEnglish:", inline: true }, { name: '\u200B' /* "__Emoji__" */, value: ":triangular_ruler:\n\n:atom:\n\n:earth_americas:\n\n:abc:", inline: true });
            msg.channel.send(playEmbed).then(function (sent) {
                global.sent = sent;
                playID = sent.id;
                playChannel = sent.channel;
                // these reactions are obtained by searching up the ones above with a \ (forward slash)
                // in front of them i.e. \:calendar_spiral:, need to use these since they're universal 
                // and you can't react with the :(emoji): formatted emojis. 
                sent.react('📐');
                sent.react('⚛️');
                sent.react('🌎');
                sent.react('🔤');
            });
        }
        else if (msg.content === '~HELP') {
            helpEmbed = new Discord.MessageEmbed()
                .setColor('0x4286f4')
                .setTitle("__Below is a list of available commands__")
                .addFields(
            // \u200B is to add a blank field. inline being true means these two fields are on the same line
            { name: '\u200B' /* "__Subject__" */, value: "~freerice\n\n~play/~p\n\n~rankings", inline: true }, {
                name: '\u200B' /* "__Emoji__" */, value: "|  description of the bot and its purpose\n\n" +
                    "|  play with the freerice bot by answering questions to earn rice\n\n|  see the current server-wide rankings for users' rice earned", inline: true
            });
            msg.channel.send(helpEmbed);
        }
        return [2 /*return*/];
    });
}); });
client.on('messageReactionAdd', function (reaction, user) { return __awaiter(void 0, void 0, void 0, function () {
    var member, subject, write_questions, exitButton, backButton, selectButton, nextButton, overviewEmbed, _a, files;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                globals_js_1.GlobalVars.reactionName = reaction.emoji;
                member = reaction.message.guild.members.cache.get(user.id);
                if (!(reaction.message.id === playID && user.tag !== 'tutoRice#4898')) return [3 /*break*/, 2];
                reaction.message.reactions.removeAll()["catch"](function (error) { return console.error('Failed to clear reactions: ', error); });
                subject = globals_js_1.GlobalVars.reactionName.name;
                write_questions = child_process_1.spawnSync('python', ['src/write_questions.py', subject], { stdio: 'inherit' });
                exitButton = new MessageButton()
                    .setStyle("blurple")
                    .setID("exit")
                    .setLabel("↩️");
                backButton = new MessageButton()
                    .setStyle("blurple")
                    .setID("back")
                    .setLabel("👈");
                selectButton = new MessageButton()
                    .setStyle("blurple")
                    .setID("select")
                    .setLabel("☑️");
                nextButton = new MessageButton()
                    .setStyle("blurple")
                    .setID("next")
                    .setLabel("👉");
                globals_js_1.GlobalVars.buttonArray = [exitButton, backButton, selectButton, nextButton];
                overviewEmbed = new Discord.MessageEmbed().setColor('0x4286f4').setDescription("Select a Category:");
                _a = globals_js_1.GlobalVars;
                return [4 /*yield*/, global.msg.channel.send({ embed: overviewEmbed, buttons: globals_js_1.GlobalVars.buttonArray })];
            case 1:
                _a.mybuttonsmsg = _b.sent();
                globals_js_1.GlobalVars.embedArray = [overviewEmbed];
                files = void 0;
                if (subject === '📐') {
                    files = fs.readdirSync('src/answers/Mathematics');
                }
                else if (subject === '⚛️') {
                    files = fs.readdirSync('src/answers/Sciences');
                }
                else if (subject === '🌎') {
                    files = fs.readdirSync('src/answers/Geography');
                }
                else if (subject === '🔤') {
                    files = fs.readdirSync('src/answers/English');
                }
                files.forEach(function (subjectFileName) {
                    var subjectName = subjectFileName.replace('.txt', '').split("_");
                    for (var i = 0; i < subjectName.length; i++) {
                        subjectName[i] = subjectName[i][0].toUpperCase() + subjectName[i].substr(1);
                    }
                    globals_js_1.GlobalVars.embedArray.push(new Discord.MessageEmbed()
                        .setColor('0x4286f4')
                        .setDescription(subjectName.join(" ")));
                });
                _b.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
client.on('clickButton', function (button) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, button.clicker.fetch()];
            case 1:
                _a.sent();
                return [4 /*yield*/, button.reply.defer(true)];
            case 2:
                _a.sent();
                user = button.clicker.user;
                globals_js_1.GlobalVars.globularmsg.channel.send(button.id);
                switch (button.id) {
                    case "exit":
                        console.log('exit button pressed');
                        globals_js_1.GlobalVars.mybuttonsmsg["delete"]();
                    case "back":
                        console.log('back button pressed');
                        if (globals_js_1.GlobalVars.currentPage !== 0) {
                            --globals_js_1.GlobalVars.currentPage;
                            globals_js_1.GlobalVars.mybuttonsmsg.edit({ embed: globals_js_1.GlobalVars.embedArray[globals_js_1.GlobalVars.currentPage], buttons: globals_js_1.GlobalVars.buttonArray });
                        }
                        else {
                            globals_js_1.GlobalVars.currentPage = globals_js_1.GlobalVars.embedArray.length - 1;
                            globals_js_1.GlobalVars.mybuttonsmsg.edit({ embed: globals_js_1.GlobalVars.embedArray[globals_js_1.GlobalVars.currentPage], buttons: globals_js_1.GlobalVars.buttonArray });
                        }
                    case "select":
                        console.log('select button pressed');
                    //select
                    case "next":
                        console.log('next button pressed', globals_js_1.GlobalVars.currentPage);
                        if (globals_js_1.GlobalVars.currentPage < globals_js_1.GlobalVars.embedArray.length - 1) {
                            globals_js_1.GlobalVars.currentPage += 1;
                            globals_js_1.GlobalVars.mybuttonsmsg.edit({ embed: globals_js_1.GlobalVars.embedArray[globals_js_1.GlobalVars.currentPage], buttons: globals_js_1.GlobalVars.buttonArray });
                        }
                        else {
                            globals_js_1.GlobalVars.currentPage = 0;
                            globals_js_1.GlobalVars.mybuttonsmsg.edit({ embed: globals_js_1.GlobalVars.embedArray[globals_js_1.GlobalVars.currentPage], buttons: globals_js_1.GlobalVars.buttonArray });
                        }
                }
                return [2 /*return*/];
        }
    });
}); });
function question_category(category) {
    //starts up python file and sends category arg
    var questions = child_process_1.spawnSync('python', ['src/questions.py', category], { stdio: 'inherit' });
    //Listens to output from questions.py
    // questions.stdout.on('data', function (data) {
    //     console.log("" + data);
    // });
    // questions.stderr.on('data', function (data) {
    //     console.log("" + data);
    // });
}
function createUser(msg) {
    return __awaiter(this, void 0, void 0, function () {
        var player, e_1, user, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Player.create({
                            username: msg.author.tag,
                            rice: 0
                        })];
                case 1:
                    player = _a.sent();
                    console.log("Created user " + player.username);
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    if (e_1.name === 'SequelizeUniqueConstraintError') {
                        console.log('That tag already exists (Players).');
                    }
                    else {
                        console.log('Something went wrong with adding a tag (Players).');
                    }
                    return [3 /*break*/, 3];
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, Servers.create({
                            username: msg.author.tag,
                            serverName: msg.guild.id
                        })];
                case 4:
                    user = _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    e_2 = _a.sent();
                    if (e_2.name === 'SequelizeUniqueConstraintError') {
                        console.log('That tag already exists (Servers).');
                    }
                    else {
                        console.log('Something went wrong with adding a tag (Servers).');
                    }
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
//Need this function because I need to be able to use await keyword
function displayRankings(message) {
    return __awaiter(this, void 0, void 0, function () {
        var players, playerList, riceAmounts, i, user, arr, maxFields, i, extra, embed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Servers.findAll({
                        where: {
                            serverName: message.guild.id
                        },
                        attributes: ['username']
                    })];
                case 1:
                    players = _a.sent();
                    playerList = players.map(function (t) { return t.username; });
                    riceAmounts = [];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < playerList.length)) return [3 /*break*/, 5];
                    return [4 /*yield*/, Player.findOne({
                            where: {
                                username: playerList[i]
                            },
                            order: [['rice', 'ASC']],
                            attributes: ['username', 'rice']
                        })];
                case 3:
                    user = _a.sent();
                    riceAmounts[i] = user.rice;
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    arr = [];
                    maxFields = (playerList.length < 11) ? playerList.length : 11;
                    for (i = 0; i < maxFields; i++) {
                        extra = 2.5;
                        if (i == 0) {
                            extra += 1;
                        }
                        arr[i] = {
                            name: ((i + 1).toString()).padEnd('Rank'.length + extra, ' ') + "    **|**  " + playerList[i] + ": " + riceAmounts[i] + "\n",
                            value: '\u200B',
                            inline: false
                        };
                    }
                    embed = new Discord.MessageEmbed().setColor(0x4286f4).setTitle('__Rank |  Username: Rice Donated__').addFields(arr);
                    // message.channel.send(table);
                    message.channel.send(embed);
                    return [2 /*return*/];
            }
        });
    });
}
;
var sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'database.sqlite'
});
var Player = sequelize.define('Player', {
    username: {
        type: Sequelize.STRING,
        unique: true
    },
    rice: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
});
var Servers = sequelize.define('Servers', {
    username: {
        type: Sequelize.STRING,
        references: {
            model: 'players',
            key: 'username'
        },
        unique: 'compositeIndex'
    },
    serverName: {
        type: Sequelize.STRING,
        unique: 'compositeIndex'
    }
});
Player.hasMany(Servers); //Creates a one-to-many table relationship between Player and Servers
//Creates the databases
Player.sync();
Servers.sync();
client.login(process.env.BOT_TOKEN);
