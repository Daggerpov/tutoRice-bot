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

    let header:string = "Rank **|**  Username: Rice Donated";
    let table:string = `\n${header}\n`;
    let underline: string = `**${'-'.repeat(header.length + 3)}**\n`;
    table += underline;

    for(let i = 0; i<database.length;i++){
        //discord username character limit is 32 (in case this is needed in future)
        let extra:number = 2.5;
        if (i == 0){
            extra += 1;
        }
        table += `${((i+1).toString()).padEnd('Rank'.length + extra, ' ')}  **|**  ${users[i]}: ${riceAmounts[i]}\n`
        //"  " + (i+1) + "   |  " + users[i] + ": " + riceAmounts[i] + '\n';
    };

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
    const categoryInfo = (categoryName, emoji) => categoryName+emoji.padStart(100-categoryName.length, "") // change "" to " " if want to fix this
    msg.channel.send
    (
    'Here is a list of categories you can choose (by reacting) to play through the freerice bot: \n\n' +
    categoryInfo("Earth Science:",":earth_americas:")+  "\n\n" +
    categoryInfo("Current Events:",":calendar_spiral:")+  "\n\n" +
    categoryInfo("Physics:",":atom:")+  "\n\n" +
    categoryInfo("Chinese Phrases:",":man_with_chinese_cap:")+  "\n\n" +
    categoryInfo("Chemistry:",":scientist:")+  "\n\n" +
    categoryInfo("Cell biology:",":microbe:")+  "\n\n" +
    categoryInfo("Geometry:",":triangular_ruler:")+  "\n\n" +
    categoryInfo("English Spelling:",":abc:")+  "\n\n" +
    categoryInfo("Biology:",":biohazard_sign:")
    ).then(sent =>{
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