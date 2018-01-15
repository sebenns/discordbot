// DiscordJS API, and Application Token.
const Discord = require("discord.js");
const token = "Mzk3MDYzOTMwMTgwMTQxMDU3.DSqwHg.Wy24nFb5GGt8pirb5f6bTDRJZ0E";
const client = new Discord.Client();
// NodeJS modules, incl. configurations
const mysql = require('mysql');
let connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'discord',
    password : 'kutterbrot45Ab',
    database : 'discord_porogame'
});

const vsprintf = require('sprintf').vsprintf;
const request = require("request");

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

// Import const/ files.
const Commands = require("./const/commands.js");
const Channel = require("./const/channels.js");
const Id = require("./const/ids.js");
const PoroGame = require("./const/porogame.js");
const cV = require("./const/checkValid.js");
const mS = require("./const/messageSend.js");

//Games for addRole/removeRole Command. Rewrite for Database
const Game = {
    "LOL" : {
        "role" : "League of Legends",
        "alias" : "LoL"
    },
    "OVERWATCH" : {
        "role" : "Overwatch",
        "alias" : "Overwatch"
    }
};

class BotData {

    // Standard Methods
    checkValid(msg,type,numb) {
        switch(type) {
            case cV.onCommand:
                return (msg.startsWith("!"));
            case cV.onAdmin:
                return (msg.member.roles.find("name", Id.GROUP_ADMIN));
            default:
                logger.warn("No fitting type when calling checkValid(%s, %s, %s).", msg, type, numb);
        }
    }
    messageSend(type, msg, stm) {
        let Settings = PoroGame.Settings;
        switch(type) {
            case mS.sucUser:
                return msg.channel.send(vsprintf("Congratz %s! Non nan nan %s",[msg.author, client.emojis.find("name", "poro")])).then(msg => msg.delete(3000));
            case mS.errUser:
                return msg.channel.send('Non nani?! :(').then(msg => msg.delete(3000));
            case mS.msgToAuthor:
                return msg.author.send(stm).catch(logger.warn);
            case mS.msgToChannel:
                return msg.channel.send(stm).then(msg => msg.delete(15000));
            case mS.PoroSpawn:
                let poro = this.chooseRandomAttribute(PoroGame.POROS);
                Settings.spawnedType = poro[1];
                return this.doSpawning(msg, Settings.spawnedType.type);
            case mS.PoroCaught:
                return msg.channel.send(vsprintf(Settings.spawnedType.caught, [msg.author,stm ])).then(msg => msg.delete(Settings.TimeOut));
            case mS.PoroLootbox:
                let main = this.chooseRandomAttribute(PoroGame.POROS.LOOTBOX.the_main);
                switch(PoroGame.POROS.LOOTBOX.loot) {
                    case 1: // legendary lootbox
                        return msg.channel.send(vsprintf(Settings.spawnedType.caught_1, [msg.author,main[1],stm ])).then(msg => msg.delete(Settings.TimeOut));
                    case 2: // normal lootbox
                        return msg.channel.send(vsprintf(Settings.spawnedType.caught_2, [msg.author,stm])).then(msg => msg.delete(Settings.TimeOut));
                    case 3: // useless lootbox
                        return msg.channel.send(vsprintf(Settings.spawnedType.caught_3, [msg.author])).then(msg => msg.delete(Settings.TimeOut));
                    default:
                        return logger.warn("Error");
                }
            case mS.Bank:
                let bank = PoroGame.Lang;
                if (!stm) {
                    return msg.author.send(bank.bank_notEnough).catch(error => logger.warn(error));
                } else {
                    return msg.author.send(vsprintf(bank.bank_status,[stm.points])).catch(error => logger.warn(error));
                }
            default:
                logger.warn("No fitting type when calling messageSend(%s, %s, %s).", msg, type, stm);
        }
    }

    doSpawning(msg, type) {
        let commandToUse = 0;
        let Settings = PoroGame.Settings;
        if(type === "lootbox") {
            commandToUse = Commands.COM_OPEN.command;
            Settings.spawning.lootbox = true;
        } else {
            commandToUse = Commands.COM_CATCH.command;
            Settings.spawning.poro = true;
        }
        return msg.channel.send(Settings.spawnedType.appear, {file: Settings.spawnedType.image})
            .then(setTimeout(function () {
                msg.channel.send(vsprintf(Settings.spawnedType.catch, [commandToUse, Settings.rmCatchNumb]))
                    .then(msg => msg.delete(Settings.TimeOut))
            }, 300))
            .then(msg => msg.delete(Settings.TimeOut)).catch(logger.warn);
    }

    // Start Commands
    help(msg, type) {
        let stm;
        let grp;
        if (type === Commands.COM_HELP.command) {
            grp = "user";
        } else {
            grp = "admin"
        }

        stm = "```\nVerfügbare Befehle:\n----------\n";
        for (let key in Commands) {
            if (Commands[key].group === grp) {
                stm += "!" + Commands[key].command + " ---> " + Commands[key].description + "\n";
            }
        }
        stm += "```";
        if (grp === "admin") return this.messageSend(mS.msgToAuthor, msg, stm);
        return this.messageSend(mS.msgToChannel, msg, stm);
    }

    // Assignment Channel
    addDiscordRole(msg,msgContent) {
        if (msgContent) {
            for (let key in Game) {
                if (Game[key].alias.toLowerCase() === msgContent.toLowerCase()) {
                    msg.member.addRole(msg.guild.roles.find("name", Game[key].role)).catch(error => logger.warn(error));
                    return this.messageSend(mS.sucUser, msg);
                }
            }
            return this.messageSend(mS.errUser, msg);
        }
    }
    removeDiscordRole(msg,msgContent) {
        if (msgContent) {
            for (let key in Game) {
                if (Game[key].alias.toLowerCase() === msgContent.toLowerCase()) {
                    msg.member.removeRole(msg.guild.roles.find("name", Game[key].role)).catch(error => logger.warn(error)
                    );
                    return this.messageSend(mS.sucUser, msg);
                }
            }
            return this.messageSend(mS.errUser, msg);
        }
    }

    // Poro MiniGame
    spawnPoro(msg) {
        if (this.checkValid(msg, cV.onAdmin)) {
            let _this = this;
            (function loop() {
                let Settings = PoroGame.Settings;
                let rand = Math.round(Math.random() * (Settings.MaxIntVall - Settings.MinIntVall) + Settings.MinIntVall); // random TimeOut for loop Intval
                Settings.rmCatchNumb = Math.floor(1000 + Math.random() * 9000); // 0000x4 - Random Number for catching the 'poroboro'
                _this.messageSend(mS.PoroSpawn, msg);
                setTimeout(function () {
                    if (Settings.spawning.lootbox) {
                        Settings.spawning.lootbox = false;
                    } else {
                        Settings.spawning.poro = false;
                    }
                }, Settings.TimeOut);
                Settings.looper = setTimeout(function () {
                    loop();
                }, rand);
            }());
        }
    }
    spawnStop(msg) {
        if (this.checkValid(msg, cV.onAdmin)) {
            clearTimeout(PoroGame.Settings.looper);
        }
    }
    chooseRandomAttribute(obj) {
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
                    PoroGame.POROS.LOOTBOX.loot = 3;
                    break;
                case 2:
                    gold = Math.floor((Math.random() * 21) + 40);
                    PoroGame.POROS.LOOTBOX.loot = 2;
                    break;
                case 3:
                    gold = Math.floor((Math.random() * 41) + 80);
                    PoroGame.POROS.LOOTBOX.loot = 1;
                    break;
            }
            Settings.spawning.lootbox = false;
            this.messageSend(mS.PoroLootbox,msg,gold);
            connection.query('INSERT INTO user(discordID, points) VALUES('+msg.author.id+','+gold+') ON DUPLICATE KEY UPDATE points = points + '+gold+' ;', function (error) {
                if (error) throw error;
            });
        } else if((Settings.spawning.poro) && (number == Settings.rmCatchNumb) && (catchType === "catch")) {
            gold = Math.floor((Math.random() * 30) + 40);
            Settings.spawning.poro = false;
            this.messageSend(mS.PoroCaught,msg,gold);
            connection.query('INSERT INTO user(discordID, points) VALUES('+msg.author.id+','+gold+') ON DUPLICATE KEY UPDATE points = points + '+gold+' ;', function (error) {
                if (error) throw error;
            });
        }
    }
    listLoot(msg) {
        if(this.checkValid(msg, cV.onAdmin)) {
            connection.query('SELECT * FROM loot;', function(error,result) {
                if(error) throw error;
                let stm = "```Lootable Items in Database:\n\n";
                for (let key in result) {
                    if (result.hasOwnProperty(key)) {
                        stm += "ID: " + result[key].id + " |   Name: " + result[key].name + "    |   Beschreibung: " + result[key].description + "\n";
                        if (stm.length >= 1900) {
                            bot.messageSend(mS.msgToAuthor,msg,stm);
                            stm = "```";
                        }
                    }
                }
                stm +="```";
                bot.messageSend(mS.msgToAuthor,msg,stm);
            });
        }
    }

    showGold(msg) {
        connection.query('SELECT points FROM user WHERE discordID = '+msg.author.id+';', function (error, result) {
            if(error) logger.warn(error);
            bot.messageSend(mS.Bank, msg, result[0]);
        });
    }
    showRanking(msg) {
        connection.query('SELECT * FROM user ORDER BY points DESC;', function (error, result) {
            if(error) logger.warn(error);
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
            bot.messageSend(mS.msgToChannel,msg,stm);
        });
    }

    storeList(msg) {
        let stm = "```\n";
        for(let key in PoroGame.STORE) {
            if(!PoroGame.STORE.hasOwnProperty(key)) continue;

            let Store = PoroGame.STORE[key];
            for(let key in Store) {
                if(!Store.hasOwnProperty(key)) continue;
                stm += "Item-Typ: "+Store[key].type + ": !" + Commands.COM_BUY_ITEM.command + " " + Store[key].name + " ----> Aktueller Preis: " + Store[key].price + " Gold\n";
            }
        }
        stm += "```";
        this.messageSend(mS.msgToChannel,msg,stm);
    }
    buyItem(msg, item) {
        for (let key in PoroGame.STORE) {
            let lang = PoroGame.Lang;
            if(!PoroGame.STORE.hasOwnProperty(key)) continue;
            let existence = false;
            let Store = PoroGame.STORE[key];
            for (let key in Store) {
                if(!Store.hasOwnProperty(key)) continue;

                if(Store[key].name === item) {
                    existence = true;
                    connection.query('SELECT points FROM user WHERE discordID = '+msg.author.id+';', function (error, result) {
                        if(error) logger.warn(error);

                        if(!result[0] && result[0].points >= Store[key].price) {
                            msg.member.addRole(msg.guild.roles.find("name", Store[key].item)).catch(error => logger.warn(error));
                            let gold = result[0].points - Store[key].price;
                            connection.query('UPDATE user SET points = '+gold+' WHERE discordID = '+msg.author.id+';', function (error) {
                                if(error) throw error;
                            });
                            bot.messageSend(mS.msgToChannel,msg,lang.buy_success);
                        } else {
                            bot.messageSend(mS.msgToChannel,msg,lang.buy_notEnough);
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
            this.messageSend(mS.errUser,msg);
        }
    }
    memeHelp(msg){ // json request
        let url = "https://memegen.link/api/search/";

        request({
            url: url,
            json: true
        }, function (error, response, body) {

            if (!error && response.statusCode === 200) {
                let stm = "```\n Verfügbare Möglichkeiten:\n !"+Commands.COM_MEMEGEN.command+" Image \"Text 1\" \"Text 2\"\n\n Mit eigenem Bild: \n !"+Commands.COM_MEMEGEN.command+" custom \"Text1\" \"Text2\" Bild-URL\n\n Verfügbare Images:\n";
                for(let key in body) {
                    if(body.hasOwnProperty(key)) {
                        let imageURL = body[key].template.blank.split("/");
                        stm +=  imageURL[3]+", "; // Print the json response
                    }
                }
                stm += "\n```";
                bot.messageSend(mS.msgToAuthor,msg, stm);
            }
        });
    }
}

const bot = new BotData();
let logger = log4js.getLogger('Bot');
logger.logCommand = function(msg, msgCmd, channel) {
    this.info("["+msg.author.username+"]"+ " User has used Command '" + msgCmd + "' in Channel " + channel);
};

client.on("ready", () => {
    logger.info("Bot has been started and is ready for usage");
});

client.on("message", (message) => {
    if(message.author.id === Id.USER_BOT) return;

    if (bot.checkValid(message.content, cV.onCommand)) {
        let msgCmd = message.content.substring(1).split(" ");
        logger.logCommand(message, msgCmd, message.channel.id);
        message.delete().catch(error => logger.warn(error));
        // Command Usage in Assignment Channel, Listed Commands: addRole, removeRole, help.
        switch(message.channel.id) {
            case Channel.CH_ROLE_ASSIGNMENT:
                switch (msgCmd[0].toLowerCase()) {

                    case Commands.COM_ADD_ROLE.command.toLowerCase():
                        return bot.addDiscordRole(message, msgCmd[1]);

                    case Commands.COM_REMOVE_ROLE.command.toLowerCase():
                        return bot.removeDiscordRole(message, msgCmd[1]);

                    default:
                        return bot.messageSend(mS.errUser, message);
                }
            case Channel.CH_DEVELOPMENT:
            case Channel.CH_LOBBY:
                switch (msgCmd[0].toLowerCase()) {

                    case Commands.COM_LIST_LOOT.command.toLowerCase():
                        return bot.listLoot(message);

                    case Commands.COM_HELP.command.toLowerCase():
                        return bot.help(message, Commands.COM_HELP.command);

                    case Commands.COM_AHELP.command.toLowerCase():
                        return bot.help(message, Commands.COM_AHELP.command);

                    case Commands.COM_SPAWN_PORO.command.toLowerCase():
                        return bot.spawnPoro(message);

                    case Commands.COM_SPAWN_STOP.command:
                        return bot.spawnStop(message);

                    case Commands.COM_CATCH.command:
                        return bot.catchPoro(message, msgCmd[1], "catch");

                    case Commands.COM_OPEN.command:
                        return bot.catchPoro(message, msgCmd[1], "open");

                    case Commands.COM_SHOW_GOLD.command:
                        return bot.showGold(message);

                    case Commands.COM_SHOW_RANK.command:
                        return bot.showRanking(message);

                    case Commands.COM_MEMEGEN.command:
                        return bot.memeGen(message, message.content.substring(1));

                    case Commands.COM_MEMEGEN_HELP.command:
                        return bot.memeHelp(message);

                    default:
                        return bot.messageSend(mS.errUser, message);
                }
            case Channel.CH_MEMETALK:
                switch (msgCmd[0]) {

                    case Commands.COM_MEMEGEN.command:
                        return bot.memeGen(message, message.content.substring(1));

                    case Commands.COM_MEMEGEN_HELP.command:
                        return bot.memeHelp(message);

                    default:
                        return bot.messageSend(mS.errUser, message);

                }
            case Channel.CH_SHOP:
                switch (msgCmd[0]) {
                    case Commands.COM_SHOW_STORE.command:
                        return bot.storeList(message);

                    case Commands.COM_BUY_ITEM.command:
                        return bot.buyItem(message, msgCmd[1]);

                    default:
                        return bot.messageSend(mS.errUser, message);
                }

        }
    } else if (message.channel.id === Channel.CH_ROLE_ASSIGNMENT || message.channel.id === Channel.CH_SHOP) {
        message.delete().catch(error => logger.warn(error));
    }
});

client.login(token);