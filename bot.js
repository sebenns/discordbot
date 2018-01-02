const Discord = require("discord.js");
const client = new Discord.Client();
const Emoji = client.emojis.find("name", "poro");
const token = "Mzk3MDYzOTMwMTgwMTQxMDU3.DSqwHg.Wy24nFb5GGt8pirb5f6bTDRJZ0E";

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
};

const Channel = {
    "CH_DEVELOPMENT" : "397075001637077002",
    "CH_ROLE_ASSIGNMENT" : "397120155601207307"
};

const Id = {
    "USER_BOT" : "397063930180141057",
    "USER_ADMIN" : "143077528905449473"
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
                stm += Commands[key][0].command+" ---> "+Commands[key][0].description+"\n";
            }
        }
        stm += "```";
        msg.channel.send(stm);
    }
    addDiscordRole(msg,msgContent) {
        if (msgContent) {
            switch (msgContent.toLowerCase()) {
                case "lol":
                    msg.member.addRole(msg.guild.roles.find("name", Game.LOL)).catch(console.error);
                    this.messageSend("sucUser",msg);
                    break;
                case "overwatch":
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
                case "lol":
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
    } else if (message.channel.id === Channel.CH_DEVELOPMENT) {
        if (bot.checkValid(message.content, "onCommand")) {
            let msgCmd = message.content.substring(1).split(" ");
            console.log(message.author.username);

            switch (msgCmd[0]) {

                case Commands.COM_HELP[0].command:
                    bot.help(message);
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