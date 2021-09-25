require('dotenv').config();
import { spawnSync } from 'child_process';
import { GlobalVars } from './globals.js';
import * as Discord from 'discord.js';
import { WSAECONNREFUSED } from 'constants';
import { type } from 'os';
const client = new Discord.Client();
const Sequelize = require('sequelize');
const cp = require('child_process');
let playID, playChannel, scrapeOutput;
const { MessageButton } = require("discord-buttons")
require("discord-buttons")(client);
const fs = require('fs');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
    global.msg = msg;
    msg.content = msg.content.toUpperCase();
    if (msg.content === '~FREERICE') {
        //var txt = "here";
        msg.reply("This free discord bot allows discord users to earn rice grains from freerice.com within the app to help people in need from around the world. You can read up on what freerice is about here: https://freerice.com/about.");// + txt.link("https://freerice.com/about").get("href");
    }
    else if (msg.content === '~RANKINGS') {
        displayRankings(msg);
    }
    else if (msg.content === '~PLAY' || msg.content === '~P') {
        // setting global variables for the message sent by the user and currentPage must be initialized
        // here since it'd be called numerous times if it's under another event handler such as
        // messageReactionAdd or clickButton 

        GlobalVars.globularmsg = msg;
        GlobalVars.currentPage = 0;
        createUser(msg); //Creates a user in the database, does nothing if player is already in database
        let firstTitleLine: string = "__Here's our list of subjects you can choose from (by reacting)__";
        let secondTitleLine: string = "__to find a more specific category to play__";
        let amountOfSpaces: number = (firstTitleLine.replace('_', '').length - secondTitleLine.replace('_', '').length);

        const playEmbed = new Discord.MessageEmbed()
            .setColor('0x4286f4')
            .setTitle(`${firstTitleLine}\n${" ".repeat(amountOfSpaces) + secondTitleLine + " ".repeat(amountOfSpaces)}`)
            .addFields(
                // \u200B is to add a blank field. inline being true means these two fields are on the same line
                { name: '\u200B'/* "__Subject__" */, value: "Mathematics:\n\nSciences:\n\nGeography:\n\nEnglish:", inline: true },
                { name: '\u200B'/* "__Emoji__" */, value: ":triangular_ruler:\n\n:atom:\n\n:earth_americas:\n\n:abc:", inline: true }
            )

        msg.channel.send(playEmbed).then(sent => {
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
        const helpEmbed = new Discord.MessageEmbed()
            .setColor('0x4286f4')
            .setTitle(`__Below is a list of available commands__`)
            .addFields(
                // \u200B is to add a blank field. inline being true means these two fields are on the same line
                { name: '\u200B'/* "__Subject__" */, value: "~freerice\n\n~play/~p\n\n~rankings", inline: true },
                {
                    name: '\u200B'/* "__Emoji__" */, value: "|  description of the bot and its purpose\n\n" +
                        "|  play with the freerice bot by answering questions to earn rice\n\n|  see the current server-wide rankings for users' rice earned", inline: true
                }
            )
        msg.channel.send(helpEmbed)
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    GlobalVars.reactionName = reaction.emoji;
    let member = reaction.message.guild.members.cache.get(user.id);
    if (reaction.message.id === playID && user.tag !== 'tutoRice#4898') {
        reaction.message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));

        let subject = GlobalVars.reactionName.name;
        const write_questions = spawnSync('python', ['src/write_questions.py', subject], { stdio: 'inherit' })

        let exitButton = new MessageButton()
            .setStyle("blurple")
            .setID("exit")
            .setLabel("↩️")
        let backButton = new MessageButton()
            .setStyle("blurple")
            .setID("back")
            .setLabel("👈")
        let selectButton = new MessageButton()
            .setStyle("blurple")
            .setID("select")
            .setLabel("☑️")
        let nextButton = new MessageButton()
            .setStyle("blurple")
            .setID("next")
            .setLabel("👉")
        GlobalVars.buttonArray = [exitButton, backButton, selectButton, nextButton];

        // select category embed with list of categories and buttons to select them
        let overviewEmbed = new Discord.MessageEmbed().setColor('0x4286f4').setDescription("Select a Category:")
        GlobalVars.mybuttonsmsg = await global.msg.channel.send({ embed: overviewEmbed, buttons: GlobalVars.buttonArray })
        // ? maybe this could be shortened with just setting it initially in the overviewEmbed initialization
        GlobalVars.embedArray = [overviewEmbed]

        // get all files from selected category directory
        let files;
        if (subject === '📐') {
            files = fs.readdirSync('src/answers/Mathematics');
        } else if (subject === '⚛️') {
            files = fs.readdirSync('src/answers/Sciences');
        } else if (subject === '🌎') {
            files = fs.readdirSync('src/answers/Geography');
        } else if (subject === '🔤') {
            files = fs.readdirSync('src/answers/English');
        }


        files.forEach(subjectFileName => {
            // going through each file name and settings these as the description of the subjects
            // after being formatted by capitlizing them correctly and such
            let subjectName = subjectFileName.replace('.txt', '').split("_");
            for (let i = 0; i < subjectName.length; i++) {
                subjectName[i] = subjectName[i][0].toUpperCase() + subjectName[i].substr(1);
            }
            GlobalVars.embedArray.push(new Discord.MessageEmbed()
                .setColor('0x4286f4')
                .setDescription(subjectName.join(" "))
            )
        });
    }
});

client.on('clickButton', async (button) => {
    // fetching the clicking state by way of its clicker
    await button.clicker.fetch();
    // defer tells the script to not wait for the button's reply
    await button.reply.defer(true);
    GlobalVars.globularmsg.channel.send(button.id);

    switch (button.id) {
        case "exit":
            console.log('exit button pressed');
            GlobalVars.mybuttonsmsg.delete();
        case "back":
            console.log('back button pressed', GlobalVars.currentPage);
            if (GlobalVars.currentPage !== 0) {
                --GlobalVars.currentPage;
                GlobalVars.mybuttonsmsg.edit({ embed: GlobalVars.embedArray[GlobalVars.currentPage], buttons: GlobalVars.buttonArray })
            } else {
                // will go backwards if first page all the way to last
                GlobalVars.currentPage = GlobalVars.embedArray.length - 1;
                GlobalVars.mybuttonsmsg.edit({ embed: GlobalVars.embedArray[GlobalVars.currentPage], buttons: GlobalVars.buttonArray })
            }
        case "select":
            console.log('select button pressed');
            // TODO call question_category() and pass in subject selected
        case "next":
            console.log('next button pressed', GlobalVars.currentPage);
            if (GlobalVars.currentPage < GlobalVars.embedArray.length - 1) {
                GlobalVars.currentPage += 1;
                GlobalVars.mybuttonsmsg.edit({ embed: GlobalVars.embedArray[GlobalVars.currentPage], buttons: GlobalVars.buttonArray })
            } else {
                // will go forwards if last page back to first
                GlobalVars.currentPage = 0;
                GlobalVars.mybuttonsmsg.edit({ embed: GlobalVars.embedArray[GlobalVars.currentPage], buttons: GlobalVars.buttonArray })
            }
    }
});

function question_category(category: string) {
    // starts up python file and sends category arg, with stdio as well to avoid needing supplementary 
    // commands to accept input and erorrs
    const questions = spawnSync('python', ['src/questions.py', category], { stdio: 'inherit' });
}

async function createUser(msg) { 
    //Creates an entry in both the Players database and the Servers database
    try {
        const player = await Player.create({ 
            //Creates a player that holds its username and rice count as fields
            username: msg.author.tag,
            rice: 0,
        })
        console.log(`Created user ${player.username}`)
    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            console.log('That tag already exists (Players).');
        } else {
            console.log('Something went wrong with adding a tag (Players).');
        }
    }
    try {
        const user = await Servers.create({ 
            //Creates a user that holds its username and the server it was created in as fields
            username: msg.author.tag,
            serverName: msg.guild.id,
        })
    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            console.log('That tag already exists (Servers).');
        } else {
            console.log('Something went wrong with adding a tag (Servers).');
        }
    }

}

//function is needed for async capabilities
async function displayRankings(message) { 
    const players = await Servers.findAll({ 
        //Finds all players that are a part of the server that this function was called in
        where: {
            serverName: message.guild.id
        },
        attributes: ['username']
    });

    const playerList = players.map(t => t.username); 
    //Creates an array of player usernames
    let riceAmounts = []
    for (let i = 0; i < playerList.length; i++) { 
        //Finds the rice count of those players in the list
        const user = await Player.findOne({
            where: {
                username: playerList[i]
            },
            order: [['rice', 'ASC']],
            attributes: ['username', 'rice']
        });
        riceAmounts[i] = user.rice;
    }

    let arr: Array<Discord.EmbedFieldData> = [];
    let maxFields = (playerList.length < 11) ? playerList.length : 11;

    // the following is for formatting spacing and symbols
    for (let i = 0; i < maxFields; i++) {
        let extra: number = 2.5;
        if (i == 0) {
            extra += 1;
        }
        arr[i] = {
            name: `${((i + 1).toString()).padEnd('Rank'.length + extra, ' ')}    **|**  ${playerList[i]}: ${riceAmounts[i]}\n`,
            value: '\u200B',
            inline: false
        };
    }
    const embed = new Discord.MessageEmbed().setColor(0x4286f4).setTitle('__Rank |  Username: Rice Donated__').addFields(
        arr
    );

    // message.channel.send(table);

    message.channel.send(embed);
};

// initializing sqlite database 
const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const Player = sequelize.define('Player', {
    username: { 
        //Tag of the user is the unique key
        type: Sequelize.STRING,
        unique: true,
    },
    rice: { 
        //Number of rice for the user, defaults to 0
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
});

const Servers = sequelize.define('Servers', {
    username: { 
        //Tag of the user is a foreign key from the player database, composite unique key with serverName
        type: Sequelize.STRING,
        references: {
            model: 'players',
            key: 'username',
        },
        unique: 'compositeIndex',
    },
    serverName: { 
        //The server that the user was created in, composite unique key with username
        type: Sequelize.STRING,
        unique: 'compositeIndex',
    },
});

//Creates a one-to-many table relationship between Player and Servers
Player.hasMany(Servers); 

//Creates the databases
Player.sync();
Servers.sync();

// logging client in by passing in hidden bot token
client.login(process.env.BOT_TOKEN);