const Discord = require("discord.js");
const mysql      = require('mysql');
const client = new Discord.Client();
const Emoji = client.emojis.find("name", "poro");
const token = "Mzk3MDYzOTMwMTgwMTQxMDU3.DSqwHg.Wy24nFb5GGt8pirb5f6bTDRJZ0E";
let spawned = false;

let connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'discord',
    password : 'kutterbrot45Ab',
    database : 'discord_porogame'
});

const Commands = {
    "COM_HELP" : [{
        "command" : "help",
        "description" : "Zeigt alle Commands an."
        }],
    "COM_ADD_ROLE" : [{
        "command" : "addRole",
        "description" : "Fügt Dir eine Gaming-Rolle hinzu."
    }],
    "COM_REMOVE_ROLE" : [{
        "command" : "removeRole",
        "description" : "Nimmt Dir eine Gaming-Rolle weg."
    }],
    "COM_CATCH" : [{
        "command" : "catch",
        "description" : "Fange ein Poro ein!"
    }],
    "COM_SPAWN_PORO" : [{
        "command" : "spawn",
        "description" : "Spawnt ein Poro."
    }]
};

const Channel = {
    "CH_DEVELOPMENT" : "397075001637077002",
    "CH_ROLE_ASSIGNMENT" : "397120155601207307",
    "CH_LOBBY" : "397035772567617539"
};

const PoroGame = {
    "TimeOut" : "20000",
    "ImageSource" : "https://i.pinimg.com/originals/18/7d/0f/187d0fd46e07644bbcc52d1d08e0fba4.jpg"
};

const Id = {
    "USER_BOT" : "397063930180141057",
    "USER_ADMIN" : "143077528905449473",
    "GROUP_ADMIN" : "397771944415723540"
};

const Game = {
    "LOL" : "League of Legends",
    "OVERWATCH" : "Overwatch"
};

class BotData {

    checkValid(msg,type) {
        switch(type) {
            case "onCommand":
                return (msg.startsWith("!"));
            case "onPermission":
                return (msg.member.roles.find("name", "Admin"));
        }
    }

    messageSend(type, msg) {
        switch(type) {
            case "sucUser":
                msg.channel.send("Congratz " + msg.author + "! Non nan nan " + Emoji).then(msg => msg.delete(3000));
                msg.delete().catch(console.error);
                break;
            case "errUser":
                msg.channel.send('Non nani?! :(').then(msg => msg.delete(3000));
                msg.delete().catch(console.error);
                break;
        }
    }

    help(msg) {
        let stm = "```\n";
        for(let key in Commands) {
            if (Commands.hasOwnProperty(key)) {
                stm += "!"+Commands[key][0].command+" ---> "+Commands[key][0].description+"\n";
            }
        }
        stm += "```";
        msg.channel.send(stm);
    }
    addDiscordRole(msg,msgContent) {
        if (msgContent) {
            switch (msgContent.toLowerCase()) {
                case Object.getOwnPropertyNames(Game)[0].toLowerCase():
                    msg.member.addRole(msg.guild.roles.find("name", Game.LOL)).catch(console.error);
                    this.messageSend("sucUser",msg);
                    break;
                case Game.OVERWATCH.toLowerCase():
                    msg.member.addRole(msg.guild.roles.find("name", Game.OVERWATCH)).catch(console.error);
                    this.messageSend("sucUser",msg);
                    break;
                default:
                    this.messageSend("errUser",msg);
                    break;
            }
        } else {
            this.messageSend("errUser", msg);
        }
    }
    removeDiscordRole(msg,msgContent) {
        if (msgContent) {
            switch (msgContent.toLowerCase()) {
                case Object.getOwnPropertyNames(Game)[0].toLowerCase():
                    msg.member.removeRole(msg.guild.roles.find("name", Game.LOL)).catch(console.error);
                    this.messageSend("sucUser",msg);
                    break;
                case Game.OVERWATCH.toLowerCase():
                    msg.member.removeRole(msg.guild.roles.find("name", Game.OVERWATCH)).catch(console.error);
                    this.messageSend("sucUser",msg);
                    break;
                default:
                    this.messageSend("errUser",msg);
                    break;
            }
        } else {
            this.messageSend("errUser", msg);
        }
    }
    spawnPoro(msg) {
        spawned = true;
        msg.channel.send("Ein wildes Poro ist erschienen!", {file: PoroGame.ImageSource}).then(setTimeout(function(){msg.channel.send("Benutze `!"+Commands.COM_CATCH[0].command+"` um das wilde Poro einzufangen!")
            .then(msg => msg.delete(PoroGame.TimeOut))},300))
            .then(msg => msg.delete(PoroGame.TimeOut));
        setTimeout(function() { spawned = false; }, PoroGame.TimeOut);
    }
    catchPoro(msg) {
        if(spawned) {
            let gold = Math.floor((Math.random() * 30) + 40);
            msg.channel.send(msg.author+" hat das Poro eingefangen! Auf dem nächsten **Black-Poro-Market** verkauft "+msg.author+" das eingefangene Poro ( "+gold+" Gold ).").then(msg => msg.delete(8000));
            spawned = false;
            connection.query('INSERT INTO user(userID, points) VALUES('+msg.author.id+','+gold+') ON DUPLICATE KEY UPDATE points = points + '+gold+' ;', function (error, results, fields) {
                if (error) throw error;
            });
        }
    }
}

let bot = new BotData();


client.on("ready", () => {
    console.log("I am ready!");
});

client.on("message", (message) => {
    if (message.channel.id === Channel.CH_ROLE_ASSIGNMENT && message.author.id !== Id.USER_BOT) {
        if(bot.checkValid(message.content,"onCommand")) {
            let msgCmd = message.content.substring(1).split(" ");
            console.log(message.author.username);

            switch (msgCmd[0]) {
                case Commands.COM_ADD_ROLE[0].command:
                    bot.addDiscordRole(message,msgCmd[1]);
                    break;

                case Commands.COM_REMOVE_ROLE[0].command:
                    bot.removeDiscordRole(message,msgCmd[1]);
                    break;

                case Commands.COM_HELP[0].command:
                    bot.help(message);
                    message.delete().catch(console.error);
                    break;

                default:
                    bot.messageSend("errUser",message);
                    break;
            }
        } else {
            message.delete().catch(console.error);
        }
    } else if (message.channel.id === Channel.CH_DEVELOPMENT || message.channel.id === Channel.CH_LOBBY) {
        if (bot.checkValid(message.content, "onCommand")) {
            let msgCmd = message.content.substring(1).split(" ");

            switch (msgCmd[0]) {

                case Commands.COM_HELP[0].command:
                    bot.help(message);
                    message.delete().catch(console.error);
                    break;

                case Commands.COM_SPAWN_PORO[0].command:
                    if(bot.checkValid(message, "onPermission")) {
                        bot.spawnPoro(message);
                        message.delete().catch(console.error);
                    }
                    break;

                case Commands.COM_CATCH[0].command:
                    bot.catchPoro(message);
                    message.delete().catch(console.error);
                    break;

                default:
                    bot.messageSend("errUser", message);
                    break;
            }
        }
    }
});

client.login(token);