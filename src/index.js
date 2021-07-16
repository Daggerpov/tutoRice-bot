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
        var database, users, riceAmounts, header, table, underline, i, extra;
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
                    header = "Rank **|**  Username: Rice Donated";
                    table = "\n" + header + "\n";
                    underline = "**" + '-'.repeat(header.length + 3) + "**\n";
                    table += underline;
                    for (i = 0; i < database.length; i++) {
                        extra = 2.5;
                        if (i == 0) {
                            extra += 1;
                        }
                        table += ((i + 1).toString()).padEnd('Rank'.length + extra, ' ') + "  **|**  " + users[i] + ": " + riceAmounts[i] + "\n";
                        //"  " + (i+1) + "   |  " + users[i] + ": " + riceAmounts[i] + '\n';
                    }
                    ;
                    // Possible avenue for formatting
                    // const exampleEmbed = new Discord.MessageEmbed()
                    //     .setColor('#0099ff')
                    //     .setTitle('Rice Rank Leaderboard')
                    //     .setURL('https://discord.js.org/')
                    //     .addFields(
                    //         { name: 'Inline field title', value: 'Some value here', inline: true },
                    //         { name: 'Inline field title', value: 'Some value here', inline: true },
                    //     )
                    message.channel.send(table);
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
        /*msg.channel.send('Here is a list of categories you can play with:\n'
+('Earth Science:'+ ':earth_americas:\n').padStart(24, ' ')
+'Current Events:'.padEnd(24, ' ') + ':calendar_spiral:\n'
+'Physics:'.padEnd(24, ' ') + ':atom:\n'
+'Chinese Phrases:'.padEnd(24, ' ') + ':man_with_chinese_cap:\n'
+'Chemistry:'.padEnd(24, ' ') + ':scientist:\n'
+'Cell biology:'.padEnd(24, ' ') + ':microbe:\n'
+'Geometry:'.padEnd(24, ' ') + ':triangular_ruler:\n'
+'English Spelling:'.padEnd(24, ' ') + ':abc:\n'
+'Biology:'.padEnd(24, ' ') + ':biohazard:').then(sent =>{
            playID = sent.id;
            playChannel = sent.channel;
        }); */
        //sent.react('🌎', '🗓️', '⚛️', '👲', '🧑‍🔬', '🦠', '📐', '🔤', '☣️');
        createUser(msg.author.tag); //Creates a user in the database, does nothing if player is already in database
        var categoryInfo = function (categoryName, emoji) { return categoryName + emoji.padStart(100 - categoryName.length, ""); }; // change "" to " " if want to fix this
        msg.channel.send('Here is a list of categories you can choose (by reacting) to play through the freerice bot: \n\n' +
            categoryInfo("Earth Science:", ":earth_americas:") + "\n\n" +
            categoryInfo("Current Events:", ":calendar_spiral:") + "\n\n" +
            categoryInfo("Physics:", ":atom:") + "\n\n" +
            categoryInfo("Chinese Phrases:", ":man_with_chinese_cap:") + "\n\n" +
            categoryInfo("Chemistry:", ":scientist:") + "\n\n" +
            categoryInfo("Cell biology:", ":microbe:") + "\n\n" +
            categoryInfo("Geometry:", ":triangular_ruler:") + "\n\n" +
            categoryInfo("English Spelling:", ":abc:") + "\n\n" +
            categoryInfo("Biology:", ":biohazard_sign:")).then(function (sent) {
            playID = sent.id;
            playChannel = sent.channel;
            // these reactions are obtained by searching up the ones above with a \ (forward slash)
            // in front of them i.e. \:calendar_spiral:, need to use these since they're universal 
            // and you can't react with the :(emoji): formatted emojis. 
            sent.react('🌎');
            sent.react('🗓️');
            sent.react('⚛️');
            sent.react('👲');
            sent.react('🧑‍🔬');
            sent.react('🦠');
            sent.react('📐');
            sent.react('🔤');
            sent.react('☣️');
        });
    }
    else if (msg.content === '~help') {
        msg.channel.send("Here's a list of the commands: 1. ~freerice 2. ~play 3. ~rankings");
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
            case '🌎':
                //scrapeURL('https://freerice.com/categories/earth-science');
                question_category('🌎');
                break;
            case '🗓️':
                //scrapeURL('https://freerice.com/categories/currentevents');
                break;
            case '⚛️':
                //scrapeURL('https://freerice.com/categories/physics');
                break;
            case '👲':
                //scrapeURL('https://freerice.com/categories/chinesephrases');
                break;
            case '🧑‍🔬':
                //scrapeURL('https://freerice.com/categories/chemistry');
                break;
            case '🦠':
                //scrapeURL('https://freerice.com/categories/cellbiology');
                break;
            case '📐':
                //scrapeURL('https://freerice.com/categories/geometry');
                break;
            case '🔤':
                //scrapeURL('https://freerice.com/categories/englishspelling');
                break;
            case '☣️':
                //scrapeURL('https://freerice.com/categories/biology');
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
