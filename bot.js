const Discord = require("discord.js");
const mysql = require('mysql');
sprintf = require('sprintf').sprintf;
vsprintf = require('sprintf').vsprintf;
const client = new Discord.Client();
const token = "Mzk3MDYzOTMwMTgwMTQxMDU3.DSqwHg.Wy24nFb5GGt8pirb5f6bTDRJZ0E";
let request = require("request");

let connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'discord',
    password : 'kutterbrot45Ab',
    database : 'discord_porogame'
});

const Commands = {
    "COM_HELP" : [{
        "command" : "help",
        "description" : "Zeigt alle Commands an.",
        "group" : "user"
        }],
    "COM_ADD_ROLE" : [{
        "command" : "addRole",
        "description" : "Fügt Dir eine Gaming-Rolle hinzu.",
        "group" : "user",
    }],
    "COM_REMOVE_ROLE" : [{
        "command" : "removeRole",
        "description" : "Nimmt Dir eine Gaming-Rolle weg.",
        "group" : "user"
    }],
    "COM_CATCH" : [{
        "command" : "catch",
        "description" : "Fange ein Poro ein!",
        "group" : "user"
    }],
    "COM_SPAWN_PORO" : [{
        "command" : "spawn",
        "description" : "Spawnt ein Poro.",
        "group" : "admin"
    }],
    "COM_SHOW_GOLD" : [{
        "command" : "gold",
        "description" : "Zeige allen, wie viel Gold du besitzt!",
        "group" : "user"

    }],
    "COM_BUY_ITEM" : [{
        "command" : "buy",
        "description" : "Kaufe Dir mit deinem Gold eine Rolle!",
        "group" : "user"
    }],
    "COM_SHOW_RANK" : [{
        "command" : "rank",
        "description" : "Liste die Top 5 Nutzer mit dem meisten Gold auf.",
        "group" : "user"
    }],
    "COM_SPAWN_STOP" : [{
        "command" : "spawnkill",
        "description" : "Killt den Porospawner :(.",
        "group" : "admin"
    }],
    "COM_SHOW_STORE" : [{
        "command" : "store",
        "description" : "Zeige alle kaufbaren Items an.",
        "group" : "user"
    }],
    "COM_MEMEGEN" : [{
        "command" : "meme",
        "description" : "Generiere ein Meme! (!memehelp für Befehlsbeispiele)",
        "group" : "user"
    }],
    "COM_MEMEGEN_HELP" : [{
        "command" : "memehelp",
        "description" : "Zeigt eine Liste von verfügbaren Bildern inkl. Beispiel Befehlen an.",
        "group" : "user"
    }]
};

const Channel = {
    "CH_DEVELOPMENT" : "397075001637077002",
    "CH_ROLE_ASSIGNMENT" : "397120155601207307",
    "CH_LOBBY" : "397035772567617539",
    "CH_SHOP" : "398033043878576130",
    "CH_MEMETALK" : "397036094689902603"
};

// PoroGame SomeOsaVars
let spawned = false;
let rmNumb = "";
let looper;

const PoroGame = {
    "Settings" : [{
        "TimeOut": "30000", // 30 Seconds
        "MaxIntVall": "1200000", // 20 Minutes
        "MinIntVall": "600000", // 10 Minutes
    }],
    "Lang" : [{
        "cought" : "%s hat das Poro eingefangen und auf dem nächsten **White-Poro-Market** für %s Gold an einen kuriosen muskolösen bärtigen Mann verkauft.",
        "bank_notEnough" : "Du hast zurzeit leider kein Gold. Du solltest Dir lieber etwas dazu verdienen! Nyo nyo nya nyo.",
        "bank_status" : "Du hast zurzeit `%s Gold`. Wenn Du nach neuen Accessoires suchst, versuche es mal im Poro-Shop! Nyo nya nya!",
        "buy_success" : "Dein gekauftes Item wurde Dir erfolgreich gutgeschrieben! Viel Spaß damit :) Non non nan nan!",
        "buy_notExist" : "Das von dir ausgesuchte Item existiert leider garnicht! Hast du Dich etwa vertippt, nya nya nyo?",
        "buy_notEnough" : "Du hast leider nicht genug Gold. Versuche es ein anderes Mal, du Gauner! NON NON NAN NON NANANAN NON "
    }],
    "POROS": [{
        "PORO": [{
            "appear" : "Ein wildes Poro ist erschienen!",
            "catch" : "Benutze `!%s %s` um das wilde Poro einzufangen!",
            "type" : "normal",
            "image" : "http://riverflowsinyou.de/scr/187d0fd46e07644bbcc52d1d08e0fba4.png"
        }]
    }],
    "STORE": [{
        "ITEM_UNICORN": [{
            "name" : "Unicorn-of-Love",
            "item" : "Unicorn of Love",
            "description" : "Ein Rang der nur vor Liebe strotzt. Are you the Unicorn of Love?",
            "prize" : "5000",
            "type" : "Rank"
        }],
        "ITEM_CAT" : [{
            "name" : "Flying-Cat",
            "item" : "Flying Cat",
            "description" : "Flying Cats here, Flying Cats there, Flying Cats everywhere!",
            "prize" : "2500",
            "type" : "Rank"
        }],
        "ITEM_FOOD" : [{
            "name" : "Katzenfutter",
            "item" : "Katzenfutter",
            "description" : "Hast Du dich schon immer mit Katzenfutter identifizieren können?",
            "prize" : "500",
            "type" : "Rank"
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
        let stm = "```\n"; // build stm, while iterating through object 'commands'
        for(let key in Commands) {
            if (Commands.hasOwnProperty(key)) {
                if(Commands[key][0].group === "admin" && this.checkValid(msg, "onPermission")) {
                    stm += "!" + Commands[key][0].command + " ---> " + Commands[key][0].description + "\n";
                } else if (Commands[key][0].group === "user") {
                    stm += "!" + Commands[key][0].command + " ---> " + Commands[key][0].description + "\n";
                }
            }
        }
        stm += "```";
        msg.author.send(stm);
        msg.delete().catch(console.error);
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
        (function loop() {
            spawned = true;
            rmNumb = Math.floor(1000 + Math.random() * 9000); // 0000x4
            msg.channel.send(PoroGame.POROS[0].PORO[0].appear, {file: PoroGame.POROS[0].PORO[0].image})
                .then(setTimeout(function(){msg.channel.send(vsprintf(PoroGame.POROS[0].PORO[0].catch,[Commands.COM_CATCH[0].command,rmNumb]))
                    .then(msg => msg.delete(PoroGame.Settings[0].TimeOut))},300))
                .then(msg => msg.delete(PoroGame.Settings[0].TimeOut));
            setTimeout(function() { spawned = false; }, PoroGame.Settings[0].TimeOut);
            let rand = Math.round(Math.random() * (PoroGame.Settings[0].MaxIntVall - PoroGame.Settings[0].MinIntVall) + PoroGame.Settings[0].MinIntVall);
            console.log(rand);
            looper = setTimeout(function() {
                outerFunction();
                loop();
            }, rand);
        }());
    }
    spawnStop() {
        clearTimeout(looper);
    }
    catchPoro(msg, number) {
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

    storeList(msg) {
        let stm = "```\n";
        for(let key in PoroGame.STORE) {
            if(!PoroGame.STORE.hasOwnProperty(key)) continue;

            let Store = PoroGame.STORE[key];
            for(let key in Store) {
                if(!Store.hasOwnProperty(key)) continue;
                stm += "Item-Typ: "+Store[key][0].type + ": !" + Commands.COM_BUY_ITEM[0].command + " " + Store[key][0].name + " ----> Aktueller Preis: " + Store[key][0].prize + " Gold\n";
            }
        }
        stm += "```";
        msg.author.send(stm);
    }
    buyItem(msg, item) {
        for (let key in PoroGame.STORE) {
            if(!PoroGame.STORE.hasOwnProperty(key)) continue;
            let existence = false;
            let Store = PoroGame.STORE[key];
            for (let key in Store) {
                if(!Store.hasOwnProperty(key)) continue;

                if(Store[key][0].name === item) {
                    existence = true;
                    connection.query('SELECT points FROM user WHERE discordID = '+msg.author.id+';', function (error, result) {
                        if(error) throw error;

                        if (!result[0]) {
                            return msg.author.send(PoroGame.Lang[0].buy_notEnough);
                        }

                        if(result[0].points >= Store[key][0].prize) {
                            msg.member.addRole(msg.guild.roles.find("name", Store[key][0].item)).catch(console.error);
                            let gold = result[0].points - Store[key][0].prize;
                            connection.query('UPDATE user SET points = '+gold+' WHERE discordID = '+msg.author.id+';', function (error) {
                                if(error) throw error;
                            });
                            msg.author.send(PoroGame.Lang[0].buy_success);
                        } else {
                            msg.author.send(PoroGame.Lang[0].buy_notEnough);
                        }
                    });
                }
            }
            if(!existence) {
                msg.author.send(PoroGame.Lang[0].buy_notExist);
            }
        }
    }

    //Meme Generator
    memeGen(msg, msgContent) {
        let regx = /\s\s*(?=(?:[^"]|"[^"]*")*$)/g;
        let result = [].map.call(msgContent.split(regx), function(el) { return el.replace(/^"|"$/g, '');});
        // result[0] = Command, result[1] = image or custom, result[2] = text, result[3] = text, result[4] url if custom.
        result[2] = result[2].replace(/\?/g , "~q").replace(/\//g, "~s").replace(/#/g, "~h").replace(/%/g, "~p");
        if (result[3]) { //if result[3], switch result[3] with result[4] if someone only writes top_text
            if (result[3].startsWith("http")) {
                result[4] = result[3];
                result[3] = "";
            } else {
                result[3] = "/" + result[3].replace(/\?/g, "~q").replace(/\//g, "~s").replace(/#/g, "~h").replace(/%/g, "~p");
            }
        } else {
            result[3] = "";
        }
        if (result[1] === "custom" || result[1] === "c") {
            result[4] = "?alt="+result[4];
        } else {
            result[4] = "";
        }
        let memegenURL = "https://memegen.link/"+result[1]+"/"+result[2]+result[3]+".jpg"+result[4];
        msg.channel.send({file: memegenURL}).catch(O_o=>{});
    }
    memeHelp(msg){ // json request
        let url = "https://memegen.link/api/search/";

        request({
            url: url,
            json: true
        }, function (error, response, body) {

            if (!error && response.statusCode === 200) {
                let stm = "```\n Verfügbare Möglichkeiten:\n !"+Commands.COM_MEMEGEN[0].command+" Image \"Text 1\" \"Text 2\"\n\n Mit eigenem Bild: \n !"+Commands.COM_MEMEGEN[0].command+" custom \"Text1\" \"Text2\" Bild-URL\n\n Verfügbare Images:\n";
                for(let key in body) {
                    if(body.hasOwnProperty(key)) {
                        let imageURL = body[key].template.blank.split("/");
                        stm +=  imageURL[3]+", "; // Print the json response
                    }
                }
                stm += "\n```";
                msg.author.send(stm);
            }
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
                    break;

                case Commands.COM_SPAWN_PORO[0].command:
                    if(bot.checkValid(message, "onPermission")) {
                        bot.spawnPoro(message, msgCmd[1]);
                        message.delete().catch(console.error);
                    }
                    break;

                case Commands.COM_SPAWN_STOP[0].command:
                    if(bot.checkValid(message, "onPermission")) {
                        bot.spawnStop();
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
    // Command Usage in Memetalk Channel
    } else if (message.channel.id === Channel.CH_DEVELOPMENT || message.channel.id === Channel.CH_MEMETALK) {
        if (bot.checkValid(message.content, "onCommand")) {
            let msgCmd = message.content.substring(1).split(" ");

            switch (msgCmd[0]) {

                case Commands.COM_MEMEGEN[0].command:
                    bot.memeGen(message, message.content.substring(1));
                    message.delete().catch(console.error);
                    break;

                case Commands.COM_MEMEGEN_HELP[0].command:
                    bot.memeHelp(message);
                    message.delete().catch(console.error);
                    break;

                default:
                    bot.messageSend("errUser", message);
                    break;
            }
        }
    // Command Usage in Poro-Shop
    } else if(message.channel.id === Channel.CH_SHOP) {
        if(bot.checkValid(message.content,"onCommand")) {
            let msgCmd = message.content.substring(1).split(" ");

            switch (msgCmd[0]) {

                case Commands.COM_SHOW_STORE[0].command:
                    bot.storeList(message);
                    message.delete().catch(console.error);
                    break;
                case Commands.COM_BUY_ITEM[0].command:
                    bot.buyItem(message, msgCmd[1]);
                    message.delete().catch(console.error);
                    break;
                default:
                    bot.messageSend("errUser", message);
                    break;
            }
        } else {
            message.delete().catch(console.error);
        }
    }
});

client.login(token);