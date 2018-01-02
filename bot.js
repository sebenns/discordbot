const Discord = require("discord.js");
const mysql = require('mysql');
sprintf = require('sprintf').sprintf;
vsprintf = require('sprintf').vsprintf;
const client = new Discord.Client();
const token = "Mzk3MDYzOTMwMTgwMTQxMDU3.DSqwHg.Wy24nFb5GGt8pirb5f6bTDRJZ0E";

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
    }],
    "COM_SHOW_GOLD" : [{
        "command" : "gold",
        "description" : "Zeige allen, wie viel Gold du besitzt!"
    }],
    "COM_BUY_ITEM" : [{
        "command" : "buy",
        "description" : "Kaufe Dir mit deinem Gold eine Rolle!"
    }],
    "COM_SHOW_RANK" : [{
        "command" : "rank",
        "description" : "Liste die Top 5 Nutzer mit dem meisten Gold auf."
    }]
};

const Channel = {
    "CH_DEVELOPMENT" : "397075001637077002",
    "CH_ROLE_ASSIGNMENT" : "397120155601207307",
    "CH_LOBBY" : "397035772567617539"
};

// PoroGame SomeOsaVars
let spawned = false;
let rmNumb = "";

const PoroGame = {
    "Settings" : [{
        "TimeOut": "60000", // 60 Seconds
        "MaxIntVall": "600000", // 10 Minutes
        "MinIntVall": "600000", // 10 Minutes
    }],
    "Lang" : [{
        "cought" : "%s hat das Poro eingefangen und auf dem nächsten **White-Poro-Market** für %s Gold an einen kuriosen muskolösen bärtigen Mann verkauft.",
        "bank_notEnough" : "Du hast zurzeit leider kein Gold. Du solltest Dir lieber etwas dazu verdienen! Nyo nyo nya nyo.",
        "bank_status" : "Du hast zurzeit `%s Gold`. Wenn Du nach neuen Accessoires suchst, versuche es mal im Poro-Shop! Nyo nya nya!"
    }],
    "POROS": [{
        "PORO": [{
            "appear" : "Ein wildes Poro ist erschienen!",
            "catch" : "Benutze `!%s %s` um das wilde Poro einzufangen!",
            "type" : "normal",
            "image" : "https://i.pinimg.com/originals/18/7d/0f/187d0fd46e07644bbcc52d1d08e0fba4.jpg"
        }]
    }]
};

const Id = {
    "USER_BOT" : "397063930180141057",
    "USER_ADMIN" : "143077528905449473",
    "GROUP_ADMIN" : "Admin"
};

const Game = {
    "LOL" : "League of Legends",
    "OVERWATCH" : "Overwatch"
};

class BotData {

    // Standard Methods
    checkValid(msg,type) {
        switch(type) {
            case "onCommand":
                return (msg.startsWith("!"));
            case "onPermission":
                return (msg.member.roles.find("name", Id.GROUP_ADMIN));
        }
    }
    messageSend(type, msg) {
        switch(type) {
            case "sucUser":
                msg.channel.send(vsprintf("Congratz %s! Non nan nan %s",[msg.author, client.emojis.find("name", "poro")])).then(msg => msg.delete(3000));
                msg.delete().catch(console.error);
                break;
            case "errUser":
                msg.channel.send('Non nani?! :(').then(msg => msg.delete(3000));
                msg.delete().catch(console.error);
                break;
        }
    }

    // Start Commands
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
    // Assignment Channel
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

    // Poro MiniGame
    spawnPoro(msg) {
        function outerFunction() {}
            spawned = true;
            rmNumb = Math.floor(1000 + Math.random() * 9000); // 0000x4
            msg.channel.send(PoroGame.POROS[0].PORO[0].appear, {file: PoroGame.POROS[0].PORO[0].image})
                .then(setTimeout(function(){msg.channel.send(vprintf(PoroGame.POROS[0].PORO[0].catch,[Commands.COM_CATCH[0].command,rmNumb]))
                    .then(msg => msg.delete(PoroGame.Settings[0].TimeOut))},300))
                        .then(msg => msg.delete(PoroGame.Settings[0].TimeOut));
            setTimeout(function() { spawned = false; }, PoroGame.Settings[0].TimeOut);
        (function loop() {
            let rand = Math.round(Math.random() * (PoroGame.Settings[0].MaxIntVall - PoroGame.Settings[0].MinIntVall)) + PoroGame.Settings[0].MinIntVall;
            if(arg === "stop") { return false }
            setTimeout(function() {
                outerFunction();
                loop();
            }, rand);
        }());
    }
    catchPoro(msg, number) {
        console.log(rmNumb);
        if((spawned) && (number == rmNumb)) {
            let gold = Math.floor((Math.random() * 30) + 40);
            msg.channel.send(vsprintf(PoroGame.Lang[0].cought, [msg.author,gold ])).then(msg => msg.delete(PoroGame.Settings[0].TimeOut));
            spawned = false;
            connection.query('INSERT INTO user(discordID, points) VALUES('+msg.author.id+','+gold+') ON DUPLICATE KEY UPDATE points = points + '+gold+' ;', function (error) {
                if (error) throw error;
            });
        }
    }

    showGold(msg) {
        connection.query('SELECT points FROM user WHERE discordID = '+msg.author.id+';', function (error, result) {
            if(error) throw error;

            if (!result[0]) {
                return msg.author.send(PoroGame.Lang[0].bank_notEnough);
            } else {
                return msg.author.send(vsprintf(PoroGame.Lang[0].bank_status,[result[0].points]));
            }
        });
    }
    showRanking(msg) {
        connection.query('SELECT * FROM user ORDER BY points DESC LIMIT 5;', function (error, result) {
           if(error) throw error;
           let stm = "Ranking - ( Top 5 ) " + client.emojis.find("name", "kiste") +": \n\n";
           for (let key in result) {
               if (result.hasOwnProperty(key)) {
                   stm += (parseInt(key)+1) + ". --> " + msg.guild.member(result[key].discordID) + " mit " + result[key].points + " Gold in der Beutetruhe.\n";
               }
           }

           msg.channel.send(stm).then(msg => msg.delete(10000));
        });
    }
}

let bot = new BotData();

client.on("ready", () => {
    console.log("I am ready!");
});

client.on("message", (message) => {
    // Command Usage in Assignment Channel, Listed Commands: addRole, removeRole, help.
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
    // Command Usage in Development Channel or Lobby Channel: help, spawn, catch, gold, rank
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
                    bot.catchPoro(message, msgCmd[1]);
                    message.delete().catch(console.error);
                    break;

                case Commands.COM_SHOW_GOLD[0].command:
                    bot.showGold(message);
                    message.delete().catch(console.error);
                    break;

                case Commands.COM_SHOW_RANK[0].command:
                    bot.showRanking(message);
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