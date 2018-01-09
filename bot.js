// DiscordJS API, and Application Token.
const Discord = require("discord.js");
const token = "Mzk3MDYzOTMwMTgwMTQxMDU3.DSqwHg.Wy24nFb5GGt8pirb5f6bTDRJZ0E";
const client = new Discord.Client();

const mysql = require('mysql');
const vsprintf = require('sprintf').vsprintf;

const log4js = require('log4js');
const log4js_extend = require("log4js-extend");

log4js.configure({
    appenders: {
        out: { type: 'console' },
        app: { type: 'file', filename: 'Bot.log', category: 'Bot' }
    },
    categories: {
        default: { appenders: [ 'out', 'app' ], level: 'debug' }
    }
});

log4js_extend(log4js, {
    path: __dirname,
    format: "at @name (@file:@line:@column)"
});

let request = require("request");
let connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'discord',
    password : 'kutterbrot45Ab',
    database : 'discord_porogame'
});

//language, ID & settings objects.
const Commands = {
    "COM_HELP" : [{
        "command" : "help",
        "description" : "Zeigt alle Commands an.",
        "group" : "user",
        }],
    "COM_AHELP" : [{
        "command" : "ahelp",
        "description" : "Zeigt alle Admin Commands an.",
        "group" : "admin",
        }],
    "COM_ADD_ROLE" : [{
        "command" : "addRole",
        "description" : "Fügt Dir eine Gaming-Rolle hinzu.",
        "group" : "user",
    }],
    "COM_REMOVE_ROLE" : [{
        "command" : "removeRole",
        "description" : "Nimmt Dir eine Gaming-Rolle weg.",
        "group" : "user",
    }],
    "COM_CATCH" : [{
        "command" : "catch",
        "description" : "Fange ein Poro ein!",
        "group" : "user",
    }],
    "COM_OPEN" : [{
        "command" : "open",
        "description" : "Öffne eine Lootbox!",
        "group" : "user",
    }],
    "COM_SPAWN_PORO" : [{
        "command" : "spawn",
        "description" : "Spawnt ein Poro.",
        "group" : "admin",
    }],
    "COM_SHOW_GOLD" : [{
        "command" : "gold",
        "description" : "Zeige allen, wie viel Gold du besitzt!",
        "group" : "user",
    }],
    "COM_BUY_ITEM" : [{
        "command" : "buy",
        "description" : "Kaufe Dir mit deinem Gold eine Rolle!",
        "group" : "user",
    }],
    "COM_SHOW_RANK" : [{
        "command" : "rank",
        "description" : "Liste die Top 5 Nutzer mit dem meisten Gold auf.",
        "group" : "user",
    }],
    "COM_SPAWN_STOP" : [{
        "command" : "spawnkill",
        "description" : "Killt den Porospawner :(.",
        "group" : "admin",
    }],
    "COM_SHOW_STORE" : [{
        "command" : "store",
        "description" : "Zeige alle kaufbaren Items an.",
        "group" : "user",
    }],
    "COM_MEMEGEN" : [{
        "command" : "meme",
        "description" : "Generiere ein Meme! (!memehelp für Befehlsbeispiele)",
        "group" : "user",
    }],
    "COM_MEMEGEN_HELP" : [{
        "command" : "memehelp",
        "description" : "Zeigt eine Liste von verfügbaren Bildern inkl. Beispiel Befehlen an.",
        "group" : "user",
    }]
};
const Channel = {
    "CH_DEVELOPMENT" : "397075001637077002",
    "CH_ROLE_ASSIGNMENT" : "397120155601207307",
    "CH_LOBBY" : "397035772567617539",
    "CH_SHOP" : "398033043878576130",
    "CH_MEMETALK" : "397036094689902603"
};
const Id = {
    "USER_BOT" : "397063930180141057",
    "USER_ADMIN" : "143077528905449473",
    "GROUP_ADMIN" : "Admin"
};
//Games for addRole/removeRole Command.
const Game = {
    "LOL" : [{
        "role" : "League of Legends",
        "alias" : "LoL"
    }],
    "OVERWATCH" : [{
        "role" : "Overwatch",
        "alias" : "Overwatch"
    }]
};

const PoroGame = {
    "Settings" : {
        "TimeOut": "30000", // 30 Seconds TimeOut for PoroSpawn Message
        "MaxIntVall": 600000, // Max Interval for Spawning Time
        "MinIntVall": 300000, // Min Interval for Spawning Time
        "spawning" : {
            "poro" : false, // Poro is not spawned at the beginning, default = false
            "lootbox" : false,
        },
        "spawnedType" : "",
        "looper" : 0,
        "rmCatchNumb" : 0 // Catch Numb will be generated and saved in this obj. const.
    },
    "Lang" : {
        "bank_notEnough" : "Du hast zurzeit leider kein Gold. Du solltest Dir lieber etwas dazu verdienen! Nyo nyo nya nyo.",
        "bank_status" : "Du hast zurzeit `%s Gold`. Wenn Du nach neuen Accessoires suchst, versuche es mal im Poro-Shop! Nyo nya nya!",
        "buy_success" : "Dein gekauftes Item wurde Dir erfolgreich gutgeschrieben! Viel Spaß damit :) Non non nan nan!",
        "buy_notExist" : "Das von dir ausgesuchte Item existiert leider garnicht! Hast du Dich etwa vertippt, nya nya nyo?",
        "buy_notEnough" : "Du hast leider nicht genug Gold. Versuche es ein anderes Mal, du Gauner! NON NON NAN NON NANANAN NON "
    },
    "POROS": [{  // different Types of Poros. Maybe you wanna add some new one?
        "PORO": [{
            "appear" : "Ein wildes Poro ist erschienen!",
            "catch" : "Benutze `!%s %s` um das wilde Poro einzufangen!",
            "type" : "normal",
            "image" : "http://riverflowsinyou.de/scr/187d0fd46e07644bbcc52d1d08e0fba4.png",
            "cought" : "%s hat das Poro eingefangen und auf dem nächsten **White-Poro-Market** für **%s Gold** an einen kuriosen muskolösen bärtigen Mann verkauft."
        }],
        "TEEMORO" : [{
            "appear" : "Ein Teemoro kommt aus dem Jungle gerannt!",
            "catch" : "Benutze `!%s %s` um den Wicht zu fangen und zu zerstampfen!",
            "type" : "normal",
            "image" : "http://riverflowsinyou.de/scr/teemoro.png",
            "cought" : "%s hat das Teemoro eingefangen und auf dem nächsten Scheiterhaufen zerstampft. Übrig geblieben sind **%s Gold** und ein Pilz."
        }],
        "LOOTBOX" : [{
            "appear" : "Eine Lootbox ist vom Himmel gefallen!?!",
            "catch" : "Benutze `!%s %s` um die Lootbox zu öffnen und dein Glück herauszufordern!",
            "type" : "lootbox",
            "image" : "http://riverflowsinyou.de/scr/8.png",
            "cought_1" : "%s hat die Lootbox geöffnet und erschaudert vor dem legendären Anblick eines **__%s__** Skins. Leider war es ein Duplikat. Schade aber auch :(. ( + **%s Gold** ).",
            "cought_2" : "%s hat die Lootbox gegen die Wand geschmissen. Aus der Box fallen lauter wertlose Gegenstände. Das war wohl leider nix. Verkauft bringen sie trotzdem was! ( + **%s Gold** ).",
            "cought_3" : "Eines Tages bekam %s - nach etlichen Versuchen mit dem Zahnstocher.. - die Lootbox schließlich auf. Drinnen war aber leider nichts. Vielleicht nächstes Mal?",
            "loot" : "",
            "the_main" : {
                genji : "GENJI THE MAIN",
                tracer : "TRACER THE WILD",
                yasuo : "YASUO THE RET.. I MEAN.. GOD",
                maudado : "MAUDA.. wrong game.. sorry",
                dasgramma : "SUPERHACKA",
                yusako : "NAMI MAIN INC.",
                mercy : "GODLIKE MERCY",
                ana : "WHO THE FUCK IS ANA?",
                lucio : "LET'S BLOB THE SHIT OUT OF.. LUCIO",
                symmetra : "RIGHT CLICK SYMMETRA",
                pharah : "OP AS FUCK PHARAH",
                widow : "ONE SHOT ONE KILL WIDOWMAKER"
            }

        }]
    }],
    "STORE": [{  // Items for sell. Maybe some commands will be added.
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


class Logger {
    command(msg, msgCmd, channel) {
        logger.info("["+msg.author.username+"]"+ " User has used Command '" + msgCmd + "' in Channel " + channel);
    }
}

class BotData {

    // Standard Methods
    checkValid(msg,type,numb) {
        switch(type) {
            case "onCommand":
                return (msg.startsWith("!"));
            case "onAdmin":
                return (msg.member.roles.find("name", Id.GROUP_ADMIN));
            case "onSyntax":
                if(numb == msg.length ) {
                    return true;
                }
        }
    }
    messageSend(type, msg, stm) {
        let Settings = PoroGame.Settings;
        switch(type) {
            case "sucUser":
                return msg.channel.send(vsprintf("Congratz %s! Non nan nan %s",[msg.author, client.emojis.find("name", "poro")])).then(msg => msg.delete(3000));
            case "errUser":
                return msg.channel.send('Non nani?! :(').then(msg => msg.delete(3000));
            case "msgToAuthor":
                return msg.author.send(stm).catch(error => logger.warn(error));
            case "msgToChannel":
                return msg.channel.send(stm).then(msg => msg.delete(15000));
            case "PoroSpawn":
                let poro = this.pickRandomPoro(PoroGame.POROS[0]);
                Settings.spawnedType = poro[1][0];
                if (Settings.spawnedType.type === "lootbox") {
                    Settings.spawning.lootbox = true; // poro is spawned
                    return msg.channel.send(Settings.spawnedType.appear, {file: Settings.spawnedType.image})
                        .then(setTimeout(function () {
                            msg.channel.send(vsprintf(Settings.spawnedType.catch, [Commands.COM_OPEN[0].command, Settings.rmCatchNumb]))
                                .then(msg => msg.delete(Settings.TimeOut))
                        }, 300))
                        .then(msg => msg.delete(Settings.TimeOut)).catch(error => logger.warn(error));
                } else {
                    Settings.spawning.poro = true; // poro is spawned
                    return msg.channel.send(Settings.spawnedType.appear, {file: Settings.spawnedType.image})
                        .then(setTimeout(function () {
                            msg.channel.send(vsprintf(Settings.spawnedType.catch, [Commands.COM_CATCH[0].command, Settings.rmCatchNumb]))
                                .then(msg => msg.delete(Settings.TimeOut))
                        }, 300))
                        .then(msg => msg.delete(Settings.TimeOut)).catch(error => logger.warn(error));
                }
            case "PoroCought":
                return msg.channel.send(vsprintf(Settings.spawnedType.cought, [msg.author,stm ])).then(msg => msg.delete(Settings.TimeOut));
            case "PoroLootbox":
                let main = this.pickRandomPoro(PoroGame.POROS[0].LOOTBOX[0].the_main);
                switch(PoroGame.POROS[0].LOOTBOX[0].loot) {
                    case 1:
                        return msg.channel.send(vsprintf(Settings.spawnedType.cought_1, [msg.author,main[1],stm ])).then(msg => msg.delete(Settings.TimeOut));
                    case 2:
                        return msg.channel.send(vsprintf(Settings.spawnedType.cought_2, [msg.author,stm])).then(msg => msg.delete(Settings.TimeOut));
                    case 3:
                        return msg.channel.send(vsprintf(Settings.spawnedType.cought_3, [msg.author])).then(msg => msg.delete(Settings.TimeOut));
                    default:
                        return logger.warn("Error");
                }
            case "Bank":
                let bank = PoroGame.Lang;
                if (!stm) {
                    return msg.author.send(bank.bank_notEnough).catch(error => logger.warn(error));
                } else {
                    return msg.author.send(vsprintf(bank.bank_status,[stm.points])).catch(error => logger.warn(error));
                }
        }
    }

    // Start Commands
    help(msg, type) {
        let stm;
        if (type === "help") {
            stm = "```\nNutzerbefehle:\n----------\n"; // build stm, while iterating through object 'commands'
            for (let key in Commands) {
                if (Commands.hasOwnProperty(key)) {
                    if (Commands[key][0].group === "user") {
                        stm += "!" + Commands[key][0].command + " ---> " + Commands[key][0].description + "\n";
                    }
                }
            }
            stm += "```";
            this.messageSend("msgToChannel", msg, stm);
        } else {
            stm = "```\nAdminbefehle:\n----------\n";
            for (let key in Commands) {
                if(Commands[key][0].group === "admin" && this.checkValid(msg, "onAdmin")) {
                    stm += "!" + Commands[key][0].command + " ---> " + Commands[key][0].description + "\n";
                }
            }
            stm += "```";
            this.messageSend("msgToAuthor", msg, stm);
        }
    }

    // Assignment Channel
    addDiscordRole(msg,msgContent) {
        if (msgContent) {
            for (let key in Game) {
                if (Game[key][0].alias.toLowerCase() === msgContent.toLowerCase()) {
                    msg.member.addRole(msg.guild.roles.find("name", Game[key][0].role)).catch(error => logger.warn(error));
                    return this.messageSend("sucUser", msg);
                }
            }
            return this.messageSend("errUser", msg);
        }
    }
    removeDiscordRole(msg,msgContent) {
        if (msgContent) {
            for (let key in Game) {
                if (Game[key][0].alias.toLowerCase() === msgContent.toLowerCase()) {
                    msg.member.removeRole(msg.guild.roles.find("name", Game[key][0].role)).catch(error => logger.warn(error)
                    );
                    return this.messageSend("sucUser", msg);
                }
            }
            return this.messageSend("errUser", msg);
        }
    }

    // Poro MiniGame
    spawnPoro(msg) {
        if (this.checkValid(msg, "onAdmin")) {
            (function loop() {
                let Settings = PoroGame.Settings;
                let rand = Math.round(Math.random() * (Settings.MaxIntVall - Settings.MinIntVall) + Settings.MinIntVall); // random TimeOut for loop Intval
                Settings.rmCatchNumb = Math.floor(1000 + Math.random() * 9000); // 0000x4 - Random Number for catching the 'poroboro'
                bot.messageSend("PoroSpawn", msg);
                setTimeout(function () {
                    if (Settings.spawning.lootbox) {
                        Settings.spawning.lootbox = false;
                    } else {
                        Settings.spawned = false;
                    }
                }, Settings.TimeOut);
                Settings.looper = setTimeout(function () {
                    loop();
                }, rand);
            }());
        }
    }
    spawnStop(msg) {
        if (this.checkValid(msg, "onAdmin")) {
            clearTimeout(PoroGame.Settings.looper);
        }
    }
    pickRandomPoro(obj) {
        let objArr = Object.keys(obj);
        let rmNumb = Math.floor(Math.random() * objArr.length) + 1;
        objArr = Object.entries(obj)[rmNumb-1];
        return objArr;
    }
    catchPoro(msg, number, catchType) {
        let Settings = PoroGame.Settings;
        let gold = 0;
        if((Settings.spawning.lootbox) && (number == Settings.rmCatchNumb) && (catchType === "open")) {
            let rmNumb = Math.floor(Math.random() * 3) + 1;
            logger.info(rmNumb);
            switch(rmNumb) {
                case 1:
                    PoroGame.POROS[0].LOOTBOX[0].loot = 3;
                    break;
                case 2:
                    gold = Math.floor((Math.random() * 21) + 40);
                    PoroGame.POROS[0].LOOTBOX[0].loot = 2;
                    break;
                case 3:
                    gold = Math.floor((Math.random() * 41) + 80);
                    PoroGame.POROS[0].LOOTBOX[0].loot = 1;
                    break;
            }
            Settings.spawning.lootbox = false;
            this.messageSend("PoroLootbox",msg,gold);
            connection.query('INSERT INTO user(discordID, points) VALUES('+msg.author.id+','+gold+') ON DUPLICATE KEY UPDATE points = points + '+gold+' ;', function (error) {
                if (error) throw error;
            });
        } else if((Settings.spawning.poro) && (number == Settings.rmCatchNumb) && (catchType === "catch")) {
            gold = Math.floor((Math.random() * 30) + 40);
            Settings.spawning.poro = false;
            this.messageSend("PoroCought",msg,gold);
            connection.query('INSERT INTO user(discordID, points) VALUES('+msg.author.id+','+gold+') ON DUPLICATE KEY UPDATE points = points + '+gold+' ;', function (error) {
                if (error) throw error;
            });
        }
    }

    showGold(msg) {
        connection.query('SELECT points FROM user WHERE discordID = '+msg.author.id+';', function (error, result) {
            if(error) throw error;
            bot.messageSend("Bank", msg, result[0]);
        });
    }
    showRanking(msg) {
        connection.query('SELECT * FROM user ORDER BY points DESC;', function (error, result) {
           if(error) throw error;
           let rank = 0;
           let stm = "Ranking - ( Top 5 ) " + client.emojis.find("name", "kiste") +": \n\n";
           for (let key in result) {
               if (result.hasOwnProperty(key) && msg.guild.member(result[key].discordID) != null) {
                   rank++;
                   stm += rank + ". --> " + msg.guild.member(result[key].discordID) + " mit " + result[key].points + " Gold in der Beutetruhe.\n";
                   if (rank == 5) {
                       break;
                   }
               }
           }
           bot.messageSend("msgToChannel",msg,stm);
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
        this.messageSend("msgToChannel",msg,stm);
    }
    buyItem(msg, item) {
        for (let key in PoroGame.STORE) {
            let lang = PoroGame.Lang;
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
                            return bot.messageSend("msgToChannel",msg,lang.buy_notEnough);
                        }

                        if(result[0].points >= Store[key][0].prize) {
                            msg.member.addRole(msg.guild.roles.find("name", Store[key][0].item)).catch(error => logger.warn(error));
                            let gold = result[0].points - Store[key][0].prize;
                            connection.query('UPDATE user SET points = '+gold+' WHERE discordID = '+msg.author.id+';', function (error) {
                                if(error) throw error;
                            });
                            bot.messageSend("msgToChannel",msg,lang.buy_success);
                        } else {
                            bot.messageSend("msgToChannel",msg,lang.buy_notEnough);
                        }
                    });
                }
            }
            if(!existence) {
                msg.author.send(lang.buy_notExist);
            }
        }
    }

    //Meme Generator
    memeGen(msg, msgContent) {
        let regx = /\s\s*(?=(?:[^"]|"[^"]*")*$)/g;
        let result = [].map.call(msgContent.split(regx), function(el) { return el.replace(/^"|"$/g, '');});
        if (result.length > 2) {
            // result[0] = Command, result[1] = image or custom, result[2] = text, result[3] = text, result[4] url if custom.
            result[2] = result[2].replace(/\?/g, "~q").replace(/\//g, "~s").replace(/#/g, "~h").replace(/%/g, "~p");
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
            if ((result[1] === "custom" || result[1] === "c") && (result[3] && result[3].startsWith("http") || result[4] && result[4].startsWith("http"))) {
                result[4] = "?alt=" + result[4];
            } else {
                result[4] = "";
            }
            let memegenURL = "https://memegen.link/" + result[1] + "/" + result[2] + result[3] + ".jpg" + result[4];
            msg.channel.send("Erstellt von " + msg.author + "\n", {file: memegenURL}).catch(error => logger.warn(error));
        } else {
            this.messageSend("errUser",msg);
        }
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
                bot.messageSend("msgToAuthor",msg, stm);
            }
        });
    }
}

let bot = new BotData();
let log = new Logger();
let logger = log4js.getLogger('Bot');

client.on("ready", () => {
    logger.info("Bot has been started and is ready for usage");
});

client.on("message", (message) => {
    if(message.author.id !== Id.USER_BOT) {
        if (bot.checkValid(message.content, "onCommand")) {
            let msgCmd = message.content.substring(1).split(" ");
            log.command(message, msgCmd, message.channel.id);
            message.delete().catch(error => logger.warn(error));
            // Command Usage in Assignment Channel, Listed Commands: addRole, removeRole, help.
            if (message.channel.id === Channel.CH_ROLE_ASSIGNMENT) {
                switch (msgCmd[0].toLowerCase()) {

                    case Commands.COM_ADD_ROLE[0].command.toLowerCase():
                        return bot.addDiscordRole(message, msgCmd[1]);

                    case Commands.COM_REMOVE_ROLE[0].command.toLowerCase():
                        return bot.removeDiscordRole(message, msgCmd[1]);

                    default:
                        return bot.messageSend("errUser", message);
                }

            // Command Usage in Development Channel or Lobby Channel: help, spawn, catch, gold, rank
            } else if (message.channel.id === Channel.CH_LOBBY || message.channel.id === Channel.CH_DEVELOPMENT) {
                switch (msgCmd[0].toLowerCase()) {

                    case Commands.COM_HELP[0].command.toLowerCase():
                        return bot.help(message, "help");

                    case Commands.COM_AHELP[0].command.toLowerCase():
                        return bot.help(message, "ahelp");

                    case Commands.COM_SPAWN_PORO[0].command.toLowerCase():
                        return bot.spawnPoro(message);

                    case Commands.COM_SPAWN_STOP[0].command:
                        return bot.spawnStop(message);

                    case Commands.COM_CATCH[0].command:
                        return bot.catchPoro(message, msgCmd[1], "catch");

                    case Commands.COM_OPEN[0].command:
                        return bot.catchPoro(message, msgCmd[1], "open");

                    case Commands.COM_SHOW_GOLD[0].command:
                        return bot.showGold(message);

                    case Commands.COM_SHOW_RANK[0].command:
                        return bot.showRanking(message);

                    case Commands.COM_MEMEGEN[0].command:
                        return bot.memeGen(message, message.content.substring(1));

                    case Commands.COM_MEMEGEN_HELP[0].command:
                        return bot.memeHelp(message);

                    default:
                        return bot.messageSend("errUser", message);
                }
            // Command Usage in Memetalk Channel
            } else if (message.channel.id === Channel.CH_MEMETALK) {
                switch (msgCmd[0]) {

                    case Commands.COM_MEMEGEN[0].command:
                        return bot.memeGen(message, message.content.substring(1));

                    case Commands.COM_MEMEGEN_HELP[0].command:
                        return bot.memeHelp(message);

                    default:
                        return bot.messageSend("errUser", message);

                }

            // Command Usage in Poro-Shop
            } else if (message.channel.id === Channel.CH_SHOP) {
                switch (msgCmd[0]) {

                    case Commands.COM_SHOW_STORE[0].command:
                        return bot.storeList(message);

                    case Commands.COM_BUY_ITEM[0].command:
                        return bot.buyItem(message, msgCmd[1]);

                    default:
                        return bot.messageSend("errUser", message);
                }
            }
        } else if (message.channel.id === Channel.CH_ROLE_ASSIGNMENT || message.channel.id === Channel.CH_SHOP) {
            message.delete().catch(error => logger.warn(error));
        }
    }
});

client.login(token);