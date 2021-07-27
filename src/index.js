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
var Discord = require("discord.js");
var client = new Discord.Client();
var Sequelize = require('sequelize');
var cp = require('child_process');
var playID, playChannel, scrapeOutput;
var MessageButton = require("discord-buttons").MessageButton;
require("discord-buttons")(client);
var fs = require('fs');
//client.prefix = "~";
client.on('ready', function () {
    console.log("Logged in as " + client.user.tag + "!");
});
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
function selectCategory(subject, message) {
    return __awaiter(this, void 0, void 0, function () {
        var write_questions, exitButton, backButton, selectButton, nextButton, buttonArray, overviewEmbed, mybuttonsmsg, embedsarray, embedArray, files, i, currentPage_1, collector;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
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
                    buttonArray = [exitButton, backButton, selectButton, nextButton];
                    overviewEmbed = new Discord.MessageEmbed().setColor('0x4286f4').setDescription("Select a Category:");
                    return [4 /*yield*/, message.channel.send({ embed: overviewEmbed, buttons: buttonArray })];
                case 1:
                    mybuttonsmsg = _a.sent();
                    embedsarray = [];
                    switch (subject) {
                        case '📐':
                            embedArray = [];
                            files = fs.readdirSync("./answers/" + subject + "/");
                            //Listens to output from write_questions.py
                            // write_questions.stdout.on('data', function (data) {
                            //     console.log("" + data);
                            // });
                            // write_questions.stderr.on('data', function (data) {
                            //     console.log("" + data);
                            // });
                            for (i = 0; i < files.length; i++) {
                                embedsarray.push(new Discord.MessageEmbed()
                                    .setColor('0x4286f4')
                                    .setTitle("" + files[0])
                                    .setDescription(i));
                            }
                            currentPage_1 = 0;
                            collector = mybuttonsmsg.createButtonCollector(function (button) { return button.clicker.user.id === message.author.id; }, { time: 60e3 });
                            collector.on("collect", function (b) {
                                b.defer();
                                if (b.id == "3") {
                                    //pass
                                }
                                else if (b.id == "2") {
                                    if (currentPage_1 !== 0) {
                                        --currentPage_1;
                                        mybuttonsmsg.edit({ embed: embedsarray[currentPage_1], buttons: buttonArray });
                                    }
                                    else {
                                        currentPage_1 = embedsarray.length - 1;
                                        mybuttonsmsg.edit({ embed: embedsarray[currentPage_1], buttons: buttonArray });
                                    }
                                }
                                else if (b.id == "4") {
                                    if (currentPage_1 < embedsarray.length - 1) {
                                        currentPage_1++;
                                        mybuttonsmsg.edit({ embed: embedsarray[currentPage_1], buttons: buttonArray });
                                    }
                                    else {
                                        currentPage_1 = 0;
                                        mybuttonsmsg.edit({ embed: embedsarray[currentPage_1], buttons: buttonArray });
                                    }
                                }
                            });
                            break;
                        case '⚛️':
                            // let PhysicsCategory = selectCategory('⚛️');
                            // question_category(PhysicsCategory);
                            break;
                        case '🌎':
                            // let GeographyCategory = selectCategory('🌎');
                            // question_category(GeographyCategory);
                            break;
                        case '🔤':
                            // let EnglishCategory = selectCategory('🔤');
                            // question_category(EnglishCategory);
                            break;
                    }
                    return [2 /*return*/, 'asdf'];
            }
        });
    });
}
client.on('message', function (msg) {
    msg.content = msg.content.toUpperCase();
    if (msg.content === '~FREERICE') {
        //var txt = "here";
        msg.reply("This free discord bot allows discord users to earn rice grains from freerice.com within the app to help people in need from around the world. You can read up on what freerice is about here: https://freerice.com/about."); // + txt.link("https://freerice.com/about").get("href");
    }
    else if (msg.content === '~RANKINGS') {
        displayRankings(msg);
    }
    else if (msg.content === '~PLAY') {
        createUser(msg); //Creates a user in the database, does nothing if player is already in database
        /*     'Here is a list of categories you can choose (by reacting) to play through the freerice bot: \n\n' +
            "Mathematics:",":triangular_ruler:"+  "\n\n" +
            "Sciences:",":atom:" +  "\n\n" +
            "Geography:",":earth_americas:"+  "\n\n" +
            "English:",":abc:" */
        var firstTitleLine = "__Here's our list of subjects you can choose from (by reacting)__";
        var secondTitleLine = "__to find a more specific category to play__";
        var amountOfSpaces = (firstTitleLine.replace('_', '').length - secondTitleLine.replace('_', '').length);
        var playEmbed = new Discord.MessageEmbed()
            .setColor('0x4286f4')
            .setTitle(firstTitleLine + "\n" + (" ".repeat(amountOfSpaces) + secondTitleLine + " ".repeat(amountOfSpaces)))
            .addFields(
        // \u200B is to add a blank field. inline being true means these two fields are on the same line
        { name: '\u200B' /* "__Subject__" */, value: "Mathematics:\n\nSciences:\n\nGeography:\n\nEnglish:", inline: true }, { name: '\u200B' /* "__Emoji__" */, value: ":triangular_ruler:\n\n:atom:\n\n:earth_americas:\n\n:abc:", inline: true });
        msg.channel.send(playEmbed).then(function (sent) {
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
        var helpEmbed = new Discord.MessageEmbed()
            .setColor('0x4286f4')
            .setTitle("__Below is a list of available commands__")
            .addFields(
        // \u200B is to add a blank field. inline being true means these two fields are on the same line
        { name: '\u200B' /* "__Subject__" */, value: "~freerice\n\n~play\n\n~rankings", inline: true }, {
            name: '\u200B' /* "__Emoji__" */, value: "|  description of the bot and its purpose\n\n" +
                "|  play with the freerice bot by answering questions to earn rice\n\n|  see the current server-wide rankings for users' rice earned", inline: true
        });
        msg.channel.send(helpEmbed);
    }
});
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
//Finds the reactions to ~play message and calls the scrape function from scrape.py
client.on('messageReactionAdd', function (reaction, user) {
    var name = reaction.emoji.name;
    var member = reaction.message.guild.members.cache.get(user.id);
    if (reaction.message.id === playID && user.tag !== 'freerice#4898') {
        reaction.message.reactions.removeAll()["catch"](function (error) { return console.error('Failed to clear reactions: ', error); });
        switch (name) {
            case '📐':
                var MathematicsCategory = selectCategory('📐', reaction.message);
                //question_category(MathematicsCategory);
                break;
            case '⚛️':
                var PhysicsCategory = selectCategory('⚛️', reaction.message);
                //question_category(PhysicsCategory);
                break;
            case '🌎':
                var GeographyCategory = selectCategory('🌎', reaction.message);
                //question_category(GeographyCategory);
                break;
            case '🔤':
                var EnglishCategory = selectCategory('🔤', reaction.message);
                //question_category(EnglishCategory);
                break;
        }
    }
});
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
