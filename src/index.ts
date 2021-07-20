require('dotenv').config();
import * as Discord from 'discord.js';
//const Discord = require('discord.js'); //Curly braces allow you to import specific things from discord class, we only need Client);
const client = new Discord.Client();
const Sequelize = require('sequelize');
const { spawn } = require('child_process');
let playID, playChannel, scrapeOutput;

//client.prefix = "~";

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});


async function createUser(tag:String){ //Creates an entry in the RiceRank database
    try{
        const user = await RiceRank.create({
            username: tag,
            rice: 0, 
        })
        console.log(`Created user ${user.username}`)
    }catch(e){
        if (e.name === 'SequelizeUniqueConstraintError') {
            console.log('That tag already exists.');
        }else{
            console.log('Something went wrong with adding a tag.');
        }
    }
}

//Need this function because I need to be able to use await keyword
async function displayRankings(message){ //Not formatted properly yet
    const database = await RiceRank.findAll({
        order: [['rice','ASC']],
        attributes: ['username','rice']
    });
    let users = database.map(t => t.username);
    let riceAmounts = database.map(t => t.rice);

    // let header:string = "Rank **|**  Username: Rice Donated";
    // let table:string = `\n${header}\n`;
    // let underline: string = `**${'-'.repeat(header.length + 3)}**\n`;
    // table += underline;

    // for(let i = 0; i<database.length;i++){
    //     //discord username character limit is 32 (in case this is needed in future)
    //     let extra:number = 2.5;
    //     if (i == 0){
    //         extra += 1;
    //     }
    //     table += `${((i+1).toString()).padEnd('Rank'.length + extra, ' ')}  **|**  ${users[i]}: ${riceAmounts[i]}\n`
    //     //"  " + (i+1) + "   |  " + users[i] + ": " + riceAmounts[i] + '\n';
    // };

    let arr:Array<Discord.EmbedFieldData> = [];
    let maxFields = (database.length<11) ? database.length:11;
    for(let i = 0; i<maxFields; i++){
        let extra:number = 2.5;
        if (i == 0){
            extra += 1;
        }
        arr[i] = {name: `${((i+1).toString()).padEnd('Rank'.length + extra, ' ')}    **|**  ${users[i]}: ${riceAmounts[i]}\n`,
                  value: '\u200B',
                  inline: false};
    }
    const embed = new Discord.MessageEmbed().setColor(0x4286f4).setTitle('__Rank |  Username: Rice Donated__').addFields(
        arr
    );    

    // message.channel.send(table);
    
    message.channel.send(embed);
};

client.on('message', msg => {
    if (msg.content === '~freerice') {
        //var txt = "here";
        msg.reply("This free discord bot allows discord users to earn rice grains from freerice.com within the app to help people in need from around the world. You can read up on what freerice is about here: https://freerice.com/about.");// + txt.link("https://freerice.com/about").get("href");
    } 
    else if(msg.content === '~rankings'){
        displayRankings(msg);
    }
    else if (msg.content === '~play') {

        createUser(msg.author.tag); //Creates a user in the database, does nothing if player is already in database
    /*     'Here is a list of categories you can choose (by reacting) to play through the freerice bot: \n\n' +
        "Mathematics:",":triangular_ruler:"+  "\n\n" +
        "Sciences:",":atom:" +  "\n\n" +
        "Geography:",":earth_americas:"+  "\n\n" +
        "English:",":abc:" */
        
        let firstTitleLine:string = "Here's our list of subjects you can choose from (by reacting) to find a";
        let secondTitleLine:string = "more specific category to play:";
        let amountOfSpaces:number = (firstTitleLine.length - secondTitleLine.length - 2);
        
        const playEmbed = new Discord.MessageEmbed()
        .setColor('0x4286f4')
        .setTitle(`${firstTitleLine}\n${" ".repeat(amountOfSpaces) + secondTitleLine + " ".repeat(amountOfSpaces)}`)
        .addFields(    
            { name: "__Subject__", value: "\nMathematics\n\nSciences\n\nGeography\n\nEnglish", inline: true},
            { name: "__Emoji__", value: "\n:triangular_ruler:\n\n:atom:\n\n:earth_americas:\n\n:abc:", inline: true}
        )

        msg.channel.send(playEmbed).then(sent =>{
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
        const command = (commandName:string) => commandName.padEnd(15, " ")
        let helpTitle:string = 'Below is a list of available commands';
        msg.channel.send(`${helpTitle} \n` +
        `**${'-'.repeat(helpTitle.length + 6)}**\n` +
        `1. ~${command('freerice')}|description of the bot and its purpose \n` +
        `2. ~${command('play')}|play with the freerice bot by answering questions to earn rice \n` +
        `3. ~${command('rankings')}|see the current server-wide rankings for users' rice earned`); // decide if (server or Discord)-wide
    }
});

function question_category(category:string){
    //Sends url to scrape.py
    const questions = spawn('python', ['src/questions.py', category]);

    //Listens to output from scrape.py
    questions.stdout.on('data', function (data) {
        console.log("" + data);
    });
    questions.stderr.on('data', function (data) {
        console.log("" + data);
    });
}

//Finds the reactions to ~play message and calls the scrape function from scrape.py
client.on('messageReactionAdd', (reaction, user) =>{
    let {name} = reaction.emoji;
    let member = reaction.message.guild.members.cache.get(user.id);
    if(reaction.message.id === playID && user.tag!== 'freerice#4898'){
        switch (name){
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

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

const RiceRank = sequelize.define('Rice Rank' ,{
    username: { //Tag of the user is the unique key
        type: Sequelize.STRING,
        unique: true,
    },
    rice: { //Number of rice for the user, defaults to 0
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
});

RiceRank.sync(); //Creates the database

client.login(process.env.BOT_TOKEN);