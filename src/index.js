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
var Discord = require("discord.js");
//const Discord = require('discord.js'); //Curly braces allow you to import specific things from discord class, we only need Client);
var client = new Discord.Client();
var Sequelize = require('sequelize');
var spawn = require('child_process').spawn;
var playID, playChannel, scrapeOutput;
//client.prefix = "~";
client.on('ready', function () {
    console.log("Logged in as " + client.user.tag + "!");
});
function createUser(tag) {
    return __awaiter(this, void 0, void 0, function () {
        var user, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, RiceRank.create({
                            username: tag,
                            rice: 0
                        })];
                case 1:
                    user = _a.sent();
                    console.log("Created user " + user.username);
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    if (e_1.name === 'SequelizeUniqueConstraintError') {
                        console.log('That tag already exists.');
                    }
                    else {
                        console.log('Something went wrong with adding a tag.');
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
//Need this function because I need to be able to use await keyword
function displayRankings(message) {
    return __awaiter(this, void 0, void 0, function () {
        var database, users, riceAmounts, arr, maxFields, i, extra, embed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, RiceRank.findAll({
                        order: [['rice', 'ASC']],
                        attributes: ['username', 'rice']
                    })];
                case 1:
                    database = _a.sent();
                    users = database.map(function (t) { return t.username; });
                    riceAmounts = database.map(function (t) { return t.rice; });
                    arr = [];
                    maxFields = (database.length < 11) ? database.length : 11;
                    for (i = 0; i < maxFields; i++) {
                        extra = 2.5;
                        if (i == 0) {
                            extra += 1;
                        }
                        arr[i] = { name: ((i + 1).toString()).padEnd('Rank'.length + extra, ' ') + "    **|**  " + users[i] + ": " + riceAmounts[i] + "\n",
                            value: '\u200B',
                            inline: false };
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
client.on('message', function (msg) {
    if (msg.content === '~freerice') {
        //var txt = "here";
        msg.reply("This free discord bot allows discord users to earn rice grains from freerice.com within the app to help people in need from around the world. You can read up on what freerice is about here: https://freerice.com/about."); // + txt.link("https://freerice.com/about").get("href");
    }
    else if (msg.content === '~rankings') {
        displayRankings(msg);
    }
    else if (msg.content === '~play') {
        createUser(msg.author.tag); //Creates a user in the database, does nothing if player is already in database
        var categoryInfo = function (categoryName, emoji) { return categoryName + emoji.padStart(100 - categoryName.length, " "); }; // change "" to " " if want to fix this
        msg.channel.send('Here is a list of categories you can choose (by reacting) to play through the freerice bot: \n\n' +
            categoryInfo("Mathematics:", ":triangular_ruler:") + "\n\n" +
            categoryInfo("Sciences:", ":atom:") + "\n\n" +
            categoryInfo("Geography:", ":earth_americas:") + "\n\n" +
            categoryInfo("English:", ":abc:")).then(function (sent) {
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
    else if (msg.content === '~help') {
        var command = function (commandName) { return commandName.padEnd(15, " "); };
        var helpTitle = 'Below is a list of available commands';
        msg.channel.send(helpTitle + " \n" +
            ("**" + '-'.repeat(helpTitle.length + 6) + "**\n") +
            ("1. ~" + command('freerice') + "|description of the bot and its purpose \n") +
            ("2. ~" + command('play') + "|play with the freerice bot by answering questions to earn rice \n") +
            ("3. ~" + command('rankings') + "|see the current server-wide rankings for users' rice earned")); // decide if (server or Discord)-wide
    }
});
function question_category(category) {
    //Sends url to scrape.py
    var questions = spawn('python', ['src/questions.py', category]);
    //Listens to output from scrape.py
    questions.stdout.on('data', function (data) {
        console.log("" + data);
    });
    questions.stderr.on('data', function (data) {
        console.log("" + data);
    });
}
//Finds the reactions to ~play message and calls the scrape function from scrape.py
client.on('messageReactionAdd', function (reaction, user) {
    var name = reaction.emoji.name;
    var member = reaction.message.guild.members.cache.get(user.id);
    if (reaction.message.id === playID && user.tag !== 'freerice#4898') {
        switch (name) {
            case '📐':
                question_category('📐');
                break;
            case '⚛️':
                question_category('⚛️');
                break;
            case '🌎':
                question_category('🌎');
                break;
            case '🔤':
                question_category('🔤');
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
var RiceRank = sequelize.define('Rice Rank', {
    username: {
        type: Sequelize.STRING,
        unique: true
    },
    rice: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
});
RiceRank.sync(); //Creates the database
client.login(process.env.BOT_TOKEN);
