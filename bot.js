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
    database : 'discord_porobot'
});

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

// Import const/ files.
const COMMANDS = require("./const/commands.js");
const POROGAME = require("./const/porogame.js");
const STOREITEMS = require("./const/store.js");
const LANG = require("./const/language.js");

class BotData {

    permissionChecker(msg, permission) {
        return msg.member.roles.has(permission);
    }
    convertNickToID(nickname) {
        if(typeof nickname !== "string") return false;
        return nickname.toString().replace(/[<>@!]/g, "");
    }

    help(msg, command) {
        if (command) {
            for (let key in COMMANDS) {
                if(COMMANDS[key].COMMAND.toLowerCase() === command.toLowerCase()) return messager.messageToChannel(msg, "`"+COMMANDS[key].SYNTAX+"`", 6000);
            }
        }
        let stm, grp = "user";
        stm = LANG.COMMANDS.HELP.STATEMENT_HEADER;
        for (let key in COMMANDS) {
            if (COMMANDS[key].GROUP === grp && !this.permissionChecker(msg, LANG.PERMISSIONS.ADMIN)) {
                stm += "!" + COMMANDS[key].COMMAND + " ---> | " + COMMANDS[key].DESCRIPTION + "\n";
            } else if (this.permissionChecker(msg, LANG.PERMISSIONS.ADMIN)) {
                stm += "!" + COMMANDS[key].COMMAND + " ---> | " + COMMANDS[key].DESCRIPTION + "\n";
            }
        }

        stm += "```";
        return messager.messageToAuthor(msg, stm);
    }

}
class Messager {
    messageToChannel(msg, stm, timeout) {
        msg.channel.send(stm)
            .then(msg => { msg.delete(timeout); LANG.MESSAGE.ID = msg.id; })
            .catch(logger.warn);
    }
    messageToChannelWithImage(msg, stm, image, timeout) {
        msg.channel.send(stm, {file: image})
            .then(msg => { msg.delete(timeout); LANG.MESSAGE.ID = msg.id; })
            .catch(logger.warn);
    }
    messageToAuthor(msg, stm) {
        msg.author.send(stm)
            .then(msg => { LANG.MESSAGE.ID = msg.id; })
            .catch(logger.warn);
    }
    messageToAuthorWithImage(msg, stm, image) {
        msg.author.send(stm, {file: image})
            .then(msg => { LANG.MESSAGE.ID = msg.id; })
            .catch(logger.warn);
    }
    messageToUser(msg, ID, stm) {
        msg.guild.members.find("id", ID).send(stm)
            .then(msg => { LANG.MESSAGE.ID = msg.id })
            .catch(logger.warn);
    }
    messageToUserWithImage(msg, ID, stm, image) {
        msg.guild.members.find("id", ID).send(stm, {file: image})
            .then(msg => { LANG.MESSAGE.ID = msg.id })
            .catch(logger.warn);
    }
    deleteMessageByID(msg, ID) {
        return msg.channel.fetchMessage(ID)
            .then(message => message.delete())
            .catch(logger.warn);
    }
}
class Currency {
    showCurrencyByID(msg, ID) {
        connection.query('SELECT points FROM user WHERE discordID = '+ID+' ;', function (error, result) {
            if (error) logger.warn(error);
            if (!result[0] || result[0] === 0) return messager.messageToAuthor(msg, LANG.CURRENCY.BANK.STATUS_NO_MONEY);
            messager.messageToAuthor(msg, vsprintf(LANG.CURRENCY.BANK.STATUS_SELECTED_USER,[result[0].points]));
        });
    }
    takeCurrencyByID(ID,amount) {
        connection.query('UPDATE user SET points = points - '+amount+' WHERE discordID = '+ID+';', function (error) {
            if (error) logger.warn(error);
        });
    }
    giveCurrencyByID(ID,amount) {
        connection.query('INSERT INTO user(discordID, points) VALUES('+ID+','+amount+') ON DUPLICATE KEY UPDATE points = points + '+amount+' ;', function (error) {
            if (error) logger.warn(error);
        });
    }
    showCurrency(msg, nickname) {
        if (nickname && bot.permissionChecker(msg, LANG.PERMISSIONS.ADMIN)) {
            return this.showCurrencyByID(msg, bot.convertNickToID(nickname));
        }
        connection.query('SELECT points FROM user WHERE discordID = '+msg.author.id+';', function (error, result) {
            if(error) logger.warn(error);
            return messager.messageToAuthorWithImage(msg, vsprintf(LANG.CURRENCY.BANK.STATUS,[result[0].points]), LANG.CURRENCY.BANK.IMAGE);
        });
    }
    showCurrencyRanking(msg) {
        connection.query('SELECT * FROM user ORDER BY points DESC;', function (error, result) {
            if(error) logger.warn(error);
            let rank = 0, stm = "Ranking - ( Top 5 ) " + client.emojis.find("name", "snake-1") +": \n\n";
            for (let key in result) {
                if (result.hasOwnProperty(key) && msg.guild.member(result[key].discordID) != null) {
                    rank++;
                    stm += rank + ". --> " + msg.guild.member(result[key].discordID) + " mit " + result[key].points + " Gold in der Beutetruhe.\n";
                    if (rank == 5) {
                        break;
                    }
                }
            }
            messager.messageToChannel(msg, stm, 15000);
        });
    }
}

class Store {
    constructor() {
        this.existence = false;
    }
    storeList(msg) {
        let stm = "```\n";
        for(let key in STOREITEMS.ITEMS) {
            if(!STOREITEMS.ITEMS.hasOwnProperty(key)) continue;

            let ITEM = STOREITEMS.ITEMS[key];
            for(let key in ITEM) {
                if(!ITEM.hasOwnProperty(key)) continue;
                if(ITEM[key].TYPE === 2) {
                    stm += "Command: !" + ITEM[key].ALIAS + " --> Aktueller Preis: " + ITEM[key].GOLD + " Gold\n" +
                        "Beschreibung: " + ITEM[key].DESCRIPTION + "\n\n";
                    continue;
                }
                stm += "Command: !" + COMMANDS.BUY_ITEM.COMMAND + " " + ITEM[key].ALIAS + " --> Aktueller Preis: " + ITEM[key].GOLD + " Gold\n" +
                    "Beschreibung: " + ITEM[key].DESCRIPTION + "\n";
            }
        }
        stm += "```";
        return messager.messageToChannel(msg, stm, 15000);
    }
    buyItem(msg, item) {
        for (let key in STOREITEMS.ITEMS) {
            if(!STOREITEMS.ITEMS.hasOwnProperty(key)) continue;
            let ITEM = STOREITEMS.ITEMS[key];
            for (let key in ITEM) {
                if(!ITEM.hasOwnProperty(key)) continue;
                if (ITEM[key].ALIAS === item) {
                    this.existence = true;
                    connection.query('SELECT points FROM user WHERE discordID = ' + msg.author.id + ';', function (error, result) {
                        if (error) logger.warn(error);

                        if (result[0] && (result[0].points >= ITEM[key].GOLD)) {
                            switch (ITEM[key].TYPE) {
                                case 0:
                                    msg.member.addRole(msg.guild.roles.find("name", ITEM[key].ITEM)).catch(error => logger.warn(error));
                                    break;
                                case 1:
                                    flower.buyFlower(msg);
                                    break;
                                default:
                                    return messager.messageToChannel(msg,LANG.STORE.ITEM_DOES_NOT_EXIST, 15000);
                            }
                            currency.takeCurrencyByID(msg.author.id, ITEM[key].GOLD);
                            messager.messageToChannel(msg,LANG.STORE.ITEM_BOUGHT_SUCCESSFULLY,15000);
                        } else {
                            messager.messageToChannel(msg,LANG.STORE.NOT_ENOUGH_MONEY, 15000);
                        }
                    });
                }
            }
        }
        if(!this.existence) {
            messager.messageToChannel(msg,LANG.STORE.ITEM_DOES_NOT_EXIST,15000);
        }
    }
    sellItem(msg, item) {
        for (let key in STOREITEMS.ITEMS) {
            if(!STOREITEMS.ITEMS.hasOwnProperty(key)) continue;
            let ITEM = STOREITEMS.ITEMS[key];
            for (let key in ITEM) {
                if(!ITEM.hasOwnProperty(key)) continue;
                if (ITEM[key].ALIAS === item) {
                    this.existence = true;

                    switch (ITEM[key].TYPE) {
                        case 0:
                            return messager.messageToChannel(msg, LANG.STORE.ITEM_CANT_BE_SOLD, 15000);
                        case 1:
                            flower.sellFlower(msg);
                            break;
                        default:
                            return messager.messageToChannel(msg, LANG.STORE.ITEM_DOES_NOT_EXIST, 15000);
                    }
                }
            }
        }
        if(!this.existence) {
            messager.messageToChannel(msg,LANG.STORE.ITEM_DOES_NOT_EXIST,15000);
        }
    }
}
class Poro {
    constructor() {
        this.objectSpawned = false; // true, false
        this.spawnerInterval = null; // function()
        this.catchNumber = 1234; // 4-digits rmNumb
        this.object = []; // objectArr
        this.spawnTimeOut = POROGAME.SETTINGS.TIMEOUT; // Spawn Message disappears
        this.earnGold = 0; // gold 2 earn
    }
    // general methods
    spawnCommand(msg) { // check permissions before executing
        if (!bot.permissionChecker(msg, LANG.PERMISSIONS.ADMIN)) return messager.messageToChannel(msg, LANG.GENERAL.ERROR, 3000);
        let _this = this;
        (function loop() {
            let rand = Math.round(Math.random() * (POROGAME.SETTINGS.MAX_SPAWN_INTERVAL - POROGAME.SETTINGS.MIN_SPAWN_INTERVAL) + POROGAME.SETTINGS.MIN_SPAWN_INTERVAL); // random TimeOut for loop Intval
            _this.catchNumber = Math.floor(1000 + Math.random() * 9000); // 0000x4 - Random Number for catching the 'poroboro'
            _this.doSpawning(msg);
            logger.info(rand);
            setTimeout(function () {
                this.objectSpawned = false;
            }, _this.spawnTimeOut);
            _this.spawnerInterval = setTimeout(function () {
                loop();
            }, rand);
        }());
    }
    spawnStop(msg) { // check permissions before executing
        if(!bot.permissionChecker(msg, LANG.PERMISSIONS.ADMIN)) return messager.messageToChannel(msg, LANG.GENERAL.ERROR, 3000);
        clearInterval(this.spawnerInterval);
    }
    doSpawning(msg) {
        let _this = this;
        this.objectSpawned = true;
        this.object = this.pickRandomAttribute(POROGAME.OBJECTS);
        messager.messageToChannelWithImage(msg, this.object[1].APPEAR, this.object[1].IMAGE, this.spawnTimeOut);
        setTimeout(function() {
            _this.catchMsg = messager.messageToChannel(msg, vsprintf(_this.object[1].CATCH, [_this.object[1].COMMAND_TO_USE, _this.catchNumber]), _this.spawnTimeOut);
        }, 500);
    }
    pickRandomAttribute(obj) {
        let objArr = Object.keys(obj);
        let rmNumb = Math.floor(Math.random() * objArr.length) + 1;
        objArr = Object.entries(obj)[rmNumb-1];
        return objArr;
    }
    catchObject(msg, catchNumber, command) {
        if (this.object[1].COMMAND_TO_USE !== command) return;
        if (this.objectSpawned) {
            // delete Spawn-Messages
            this.objectSpawned = false;
            clearTimeout(this.spawnerTimeOut);
            switch (this.object[1].TYPE) {
                // Type 0 = normal objects
                case 0 :
                    if (this.object[1].LOOT.RANDOM) {
                        this.earnGold = Math.round(Math.random() * (this.object[1].LOOT.MAX_GOLD - this.object[1].LOOT.MIN_GOLD) + this.object[1].LOOT.MIN_GOLD);
                    } else {
                        this.earnGold = this.object[1].MAX_GOLD;
                    }
                    currency.giveCurrencyByID(msg.author.id, this.earnGold);
                    let objectCaughtMessage = this.pickRandomAttribute(this.object[1].CAUGHT);
                    return messager.messageToChannel(msg, vsprintf(objectCaughtMessage[1], [msg.author, this.earnGold]), this.spawnTimeOut);
                // Type 1 = lootbox
                case 1 :
                    let _this = this;
                    let loot = this.pickRandomAttribute(this.object[1].CAUGHT);
                    this.earnGold = loot[1].GOLD;
                    switch (loot[0]) {
                        case "LEGENDARY" :
                            connection.query('SELECT description FROM loot ORDER BY RAND() LIMIT 1;', function (error, result) {
                                if (error) logger.warn(error);
                                messager.messageToChannel(msg, vsprintf(loot[1].MSG, [msg.author, result[0].description, _this.earnGold]), _this.spawnTimeOut);
                            });
                            break;
                        case "NOTHING" :
                            messager.messageToChannel(msg, vsprintf(loot[1].MSG, [msg.author]), this.spawnTimeOut);
                            break;
                        default :
                            messager.messageToChannel(msg, vsprintf(loot[1].MSG, [msg.author, this.earnGold]), this.spawnTimeOut);
                    }
                    return currency.giveCurrencyByID(msg.author.id, this.earnGold);
                default:
                    logger.warn(LANG.LOGGER.POROGAME.NO_SUCH_TYPE);
            }
        } else {
            return messager.messageToChannel(msg, LANG.GENERAL.ERROR, 3000);
        }
    }

    // lootbox methods to list, add or remove loot from boxes
    listLoot(msg) { // check permissions before executing
        connection.query('SELECT * FROM loot;', function(error,result) {
            if(error) logger.warn(error);
            let stm = "```Lootable Items in Database:\n\n";
            for (let key in result) {
                if (result.hasOwnProperty(key)) {
                    stm += "ID: " + result[key].id + " |   Name: " + result[key].name + "    |   Beschreibung: " + result[key].description + "\n";
                    if (stm.length >= 1900) {
                        messager.messageToAuthor(msg, stm);
                        stm = "```";
                    }
                }
            }
            stm +="```";
            messager.messageToAuthor(msg, stm);
        });
    }
    addLoot(msg, name, description) {
        connection.query('INSERT INTO loot(name, description) VALUES("'+name+'", "'+description+'");', function(error) {
            if(error) logger.warn(error);
        });
        return messager.messageToAuthor(msg, LANG.POROGAME.LOOTBOX.LOOT.ADDED);
    }
    removeLoot(msg, ID) {
        connection.query('DELETE FROM loot WHERE id = '+ID+';', function(error) {
            if(error) logger.warn(error);
        });
        return messager.messageToAuthor(msg, LANG.POROGAME.LOOTBOX.LOOT.REMOVED);
    }
}
class Flower {
    constructor() {
        this.flowerSpawned = false;
        this.flowerTimeOut = 0;
    }

    buyFlower(msg) {
        connection.query('UPDATE user SET flower = flower + 1 WHERE discordID = ' + msg.author.id + ';', function (error) {
            if (error) logger.warn(error);
        });
    }
    sellFlower(msg) {
        connection.query('SELECT flower FROM user WHERE discordID = '+msg.author.id+';', function(error, result) {
           if (error) logger.warn(error);

           if (!result[0] || result[0].flower <= 0) return messager.messageToChannel(msg, LANG.FLOWER.NO_FLOWER_IN_INVENTORY, 15000);
           connection.query('UPDATE user SET flower = flower - 1 WHERE discordID = '+msg.author.id+';', function(error) {
               if(error) logger.warn(error);

               currency.giveCurrencyByID(msg.author.id, 150);
               return messager.messageToChannel(msg, LANG.STORE.ITEM_SOLD_SUCCESSFULLY, 15000);
           });
        });
    }
    eatFlower(msg) {
        connection.query('SELECT flower FROM user WHERE discordID = '+msg.author.id+';', function(error, result) {
            if (error) logger.warn(error);

            if (!result[0] || result[0].flower <= 0) return messager.messageToChannel(msg, LANG.FLOWER.NO_FLOWER_IN_INVENTORY, 15000);
            connection.query('UPDATE user SET flower = flower - 1 WHERE discordID = '+msg.author.id+';', function(error) {
                if(error) logger.warn(error);

                return messager.messageToChannel(msg, vsprintf(LANG.FLOWER.FLOWER_ATE, [msg.author.username,client.emojis.find("name", "sakura")]), 150000);
            });
        });
    }
    giveFlower(msg, giftedID) {
        let _this = this, clearID = bot.convertNickToID(giftedID);

        connection.query('SELECT * FROM user WHERE discordID = ' + msg.author.id + ';', function (error, result) {
            if (error) logger.warn(error);

            if(!result[0] || result[0].flower <= 0) {
                return _this.messageToChannel(msg, LANG.FLOWER.NO_FLOWER_IN_INVENTORY, 6000);
            } else {
                connection.query('UPDATE user SET flower = flower - 1 WHERE discordID = ' + msg.author.id + ';', function (error) {
                    if (error) logger.warn(error);

                    connection.query('INSERT INTO user(discordID, flower) VALUES('+clearID+', 1) ON DUPLICATE KEY UPDATE flower = flower + 1;', function (error) {
                        if (error) logger.warn(error);

                        messager.messageToUserWithImage(msg, clearID, vsprintf(LANG.FLOWER.FLOWER_GIFTED_USERMESSAGE, [msg.author.username,client.emojis.find("name", "sakura")]), LANG.FLOWER.FLOWER_IMAGE);
                        return messager.messageToChannelWithImage(msg, vsprintf(LANG.FLOWER.FLOWER_GIFTED_PUBLIC, [msg.author,giftedID,client.emojis.find("name", "sakura")]), LANG.FLOWER.FLOWER_IMAGE, 30000);
                    });
                });
            }
        });
    }
    plantFlower(msg) {
        let _this = this;

        if (this.flowerSpawned) {
            return messager.messageToChannel(msg, LANG.FLOWER.ALREADY_PLANTED, 15000);
        }
        connection.query('SELECT * FROM user WHERE discordID = ' + msg.author.id + ';', function (error, result) {
            if (error) logger.warn(error);

            if (!result[0] || result[0].flower <= 0) {
                return messager.messageToChannel(msg, LANG.FLOWER.NO_FLOWER_IN_INVENTORY, 6000);
            } else {
                connection.query('UPDATE user SET flower = flower - 1 WHERE discordID = ' + msg.author.id + ';', function (error) {
                    if (error) logger.warn(error);
                    _this.flowerSpawned = true;
                    _this.flowerTimeOut = setTimeout(function() { _this.flowerSpawned = false; }, 3600000);
                    messager.messageToChannelWithImage(msg, vsprintf(LANG.FLOWER.FLOWER_PLANTED, [msg.author.username, client.emojis.find("name", "sakura")]), LANG.FLOWER.FLOWER_IMAGE, 3600000);
                });
            }
        });
    }
    pickupFlower(msg) {
        if (this.flowerSpawned) {
            clearTimeout(this.flowerTimeOut);
            this.flowerSpawned = false;
            logger.info(LANG.MESSAGE.ID);
            messager.deleteMessageByID(msg, LANG.MESSAGE.ID);
            messager.messageToChannel(msg, vsprintf(LANG.FLOWER.FLOWER_PICKED_UP, [msg.author, client.emojis.find("name", "sakura")]), 15000);

            connection.query('INSERT INTO user(discordID, flower) VALUES('+msg.author.id+', 1) ON DUPLICATE KEY UPDATE flower = flower + 1;', function (error) {
                if (error) logger.warn(error);

            });
        } else {
            messager.messageToChannel(msg, LANG.GENERAL.ERROR, 3000);
        }
    }
}
class Assignment {
    addGame(msg,msgContent) {
        let game = msgContent[1], alias = msgContent[2], role = msgContent[3];
        msg.guild.createRole({name: role, permissions: ['MENTION_EVERYONE']})
            .then(role => logger.info('Rolle '+role+' erstellt.'))
            .catch(logger.warn);
        connection.query('INSERT INTO games(game,alias,role) VALUES("'+game+'","'+alias+'","'+role+'");', function (error) {
            if (error) logger.warn(error);
            return messager.messageToChannel(msg, vsprintf(LANG.GENERAL.SUCCESS,[msg.author, client.emojis.find("name", "poro")]),3000);
        })
    }
    removeGame(msg,msgContent) {
        let game = msgContent[1];
        connection.query('SELECT * FROM games WHERE game = "'+game+'";', function (error, result) {
            if (error) logger.warn(error);
            if(result) {
                msg.guild.roles.find("name", result[0].role).delete()
                    .then(role => logger.info("Rolle "+role+" gelöscht"))
                    .catch(logger.warn);
                connection.query('DELETE FROM games WHERE game = "'+game+'";', function (error) {
                    if (error) logger.warn(error);
                    return messager.messageToChannel(msg, vsprintf(LANG.GENERAL.SUCCESS,[msg.author, client.emojis.find("name", "poro")]),3000);
                });
            } else {
                return messager.messageToChannel(msg, LANG.GENERAL.ERROR, 3000);
            }
        })
    }
    listRoles(msg) {
        connection.query('SELECT game, alias FROM games;', function(error,result) {
            if(error) throw error;
            let stm = "```Erhältliche Rollen via !addRole:\n\n";
            for (let key in result) {
                if (result.hasOwnProperty(key)) {
                    stm += "Spiel: " + result[key].game + " |   Alias: !addRole " + result[key].alias +"\n\n";
                    if (stm.length >= 1900) {
                        messager.messageToChannel(msg, stm, 15000);
                        stm = "```";
                    }
                }
            }
            stm +="```";
            messager.messageToChannel(msg, stm, 15000);
        });
    }
    addDiscordRole(msg,msgContent) {
        connection.query('SELECT * FROM games WHERE alias = "'+msgContent+'";', function (error, result) {
            if(error) logger.warn(error);
            result = result[0];
            if (result) {
                if (result.alias.toLowerCase() === msgContent.toLowerCase()) {
                    msg.member.addRole(msg.guild.roles.find("name", result.role)).catch(error => logger.warn(error));
                    return messager.messageToChannel(msg,vsprintf(LANG.GENERAL.SUCCESS,[msg.author, client.emojis.find("name", "poro")]),3000);
                }
            } else {
                return messager.messageToChannel(msg, LANG.GENERAL.ERROR, 3000);
            }
        });
    }
    removeDiscordRole(msg,msgContent) {
        let that = this;
        connection.query('SELECT * FROM games WHERE alias = "'+msgContent+'";', function (error, result) {
            if (error) logger.warn(error);
            result = result[0];
            if (result) {
                if (result.alias.toLowerCase() === msgContent.toLowerCase()) {
                    msg.member.removeRole(msg.guild.roles.find("name", result.role)).catch(error => logger.warn(error)
                    );
                    return that.messageSend(msg, vsprintf(LANG.GENERAL.SUCCESS,[msg.author, client.emojis.find("name", "poro")]),3000);
                }
            } else {
                return messager.messageToChannel(msg, LANG.GENERAL.ERROR, 3000);
            }
        });
    }

}

const bot = new BotData();
const currency = new Currency();
const messager = new Messager();
const poro = new Poro();
const assignment = new Assignment();
const store = new Store();
const flower = new Flower();

let logger = log4js.getLogger('Bot');
logger.logCommand = function(msg, msgCmd, channel) {
    this.info("["+msg.author.username+"]"+ " User has used Command '" + msgCmd + "' in Channel " + channel);
};

client.on("ready", () => {
    logger.info("Bot has been started and is ready for usage");
});

client.on("message", (message) => {
    if(message.author.id === LANG.PERMISSIONS.KING_PORO) return;

    if (message.content.startsWith("!")) {
        let msgCmd = [].map.call(message.content.substring(1).split(/\s\s*(?=(?:[^"]|"[^"]*")*$)/g), function(el) { return el.replace(/^"|"$/g, '');});
        logger.logCommand(message, msgCmd, message.channel.id);
        message.delete(100).catch(error => logger.warn(error));

        switch(message.channel.id) {
            case LANG.CHANNEL.ROLE_ASSIGNMENT:
                switch (msgCmd[0].toLowerCase()) {

                    case COMMANDS.ADD_ROLE.COMMAND.toLowerCase():
                        return assignment.addDiscordRole(message, msgCmd[1]);
                    case COMMANDS.REMOVE_ROLE.COMMAND.toLowerCase():
                        return assignment.removeDiscordRole(message, msgCmd[1]);
                    case COMMANDS.ADD_GAME.COMMAND.toLowerCase():
                        return assignment.addGame(message, msgCmd);
                    case COMMANDS.REMOVE_GAME.COMMAND.toLowerCase():
                        return assignment.removeGame(message, msgCmd);
                    case COMMANDS.LIST_GAMES.COMMAND.toLowerCase():
                        return assignment.listRoles(message);
                    default:
                        return messager.messageToChannel(message, LANG.GENERAL.ERROR, 3000);
                }
            case LANG.CHANNEL.DEVELOPMENT:
            case LANG.CHANNEL.LOBBY:
            case LANG.CHANNEL.ANIME_TALK:
            case LANG.CHANNEL.MEME_TALK:
                switch (msgCmd[0].toLowerCase()) {

                    case COMMANDS.HELP.COMMAND.toLowerCase():
                        return bot.help(message, msgCmd[1]);

                    // POROGAME
                    case COMMANDS.SPAWN_PORO.COMMAND.toLowerCase():
                        return poro.spawnCommand(message);
                    case COMMANDS.SPAWN_STOP.COMMAND.toLowerCase():
                        return poro.spawnStop(message);
                    case COMMANDS.CATCH.COMMAND.toLowerCase():
                        return poro.catchObject(message, msgCmd[1], COMMANDS.CATCH.COMMAND);
                    case COMMANDS.OPEN.COMMAND.toLowerCase():
                        return poro.catchObject(message, msgCmd[1], COMMANDS.OPEN.COMMAND);

                    // POROGAME -- LOOTBOX
                    case COMMANDS.LIST_LOOT.COMMAND.toLowerCase():
                        return poro.listLoot(message);
                    case COMMANDS.ADD_LOOT.COMMAND.toLowerCase():
                        return poro.addLoot(message, msgCmd[1], msgCmd[2]);
                    case COMMANDS.REMOVE_LOOT.COMMAND.toLowerCase():
                        return poro.removeLoot(message, msgCmd[1]);

                    // CURRENCY
                    case COMMANDS.SHOW_GOLD.COMMAND.toLowerCase():
                        return currency.showCurrency(message, msgCmd[1]);
                    case COMMANDS.SHOW_RANK.COMMAND.toLowerCase():
                        return currency.showCurrencyRanking(message);
                    case COMMANDS.GIVE_GOLD.COMMAND.toLowerCase():
                        if (!(message.guild.members.has(bot.convertNickToID(msgCmd[1])) && Number.isInteger(parseInt(msgCmd[2])))) return messager.messageToAuthor(message, LANG.CURRENCY.CURRENCY_INPUT_IS_INVALID);
                        if(!bot.permissionChecker(message, LANG.PERMISSIONS.ADMIN)) return messager.messageToAuthor(message, LANG.CURRENCY.CURRENCY_NO_PERMISSIONS);
                        currency.giveCurrencyByID(bot.convertNickToID(msgCmd[1]), msgCmd[2]);
                        return messager.messageToAuthor(message, vsprintf(LANG.CURRENCY.CURRENCY_GIVEN, [msgCmd[1],msgCmd[2]]));
                    case COMMANDS.TAKE_GOLD.COMMAND.toLowerCase():
                        if (!(message.guild.members.has(bot.convertNickToID(msgCmd[1])) && Number.isInteger(parseInt(msgCmd[2])))) return messager.messageToAuthor(message, LANG.CURRENCY.CURRENCY_INPUT_IS_INVALID);
                        if(!bot.permissionChecker(message, LANG.PERMISSIONS.ADMIN)) return messager.messageToAuthor(message, LANG.CURRENCY.CURRENCY_NO_PERMISSIONS);
                        currency.takeCurrencyByID(bot.convertNickToID(msgCmd[1]), msgCmd[2]);
                        return messager.messageToAuthor(message, vsprintf(LANG.CURRENCY.CURRENCY_TAKEN, [msgCmd[1],msgCmd[2]]));

                    // FLOWER
                    case COMMANDS.GIVE_FLOWER.COMMAND.toLowerCase():
                        if(!(message.guild.members.has(bot.convertNickToID(msgCmd[1])))) return message.messageToChannel(message, LANG.GENERAL.ERROR, 3000);
                        return flower.giveFlower(message, msgCmd[1]);
                    case COMMANDS.PICKUP_FLOWER.COMMAND.toLowerCase():
                        return flower.pickupFlower(message);
                    case COMMANDS.PLANT_FLOWER.COMMAND.toLowerCase():
                        return flower.plantFlower(message);
                    case COMMANDS.EAT_FLOWER.COMMAND.toLowerCase():
                        return flower.eatFlower(message);

                    default:
                        return messager.messageToChannel(message, LANG.GENERAL.ERROR, 3000);
                }

            case LANG.CHANNEL.SHOP:
                switch (msgCmd[0]) {
                    case COMMANDS.SHOW_GOLD.COMMAND.toLowerCase():
                        return currency.showCurrency(message, msgCmd[1]);
                    case COMMANDS.SHOW_STORE.COMMAND.toLowerCase():
                        return store.storeList(message);
                    case COMMANDS.BUY_ITEM.COMMAND.toLowerCase():
                        return store.buyItem(message, msgCmd[1]);
                    case COMMANDS.SELL_ITEM.COMMAND.toLowerCase():
                        return store.sellItem(message, msgCmd[1]);

                    default:
                        return messager.messageToChannel(message, LANG.GENERAL.ERROR, 3000);
                }
        }
    } else if (message.channel.id === LANG.CHANNEL.ROLE_ASSIGNMENT || message.channel.id === LANG.CHANNEL.SHOP) {
        message.delete().catch(error => logger.warn(error));
    }
});

client.login(token);