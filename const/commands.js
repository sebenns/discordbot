module.exports = {
    HELP : {
        COMMAND : "help",
        DESCRIPTION : "Listet alle verfügbaren Commands.",
        GROUP : "user",
        SYNTAX : "!help || !help command"
    },
    // ASSIGNMENT
        ADD_ROLE: {
            COMMAND: "addRole",
            DESCRIPTION: "Fügt Dir eine Gamingrolle hinzu.",
            GROUP: "user",
            SYNTAX : "!addrole role"
        },
        REMOVE_ROLE: {
            COMMAND: "removeRole",
            DESCRIPTION: "Nimmt Dir eine Gamingrolle weg.",
            GROUP: "user",
            SYNTAX : "!removerole role"
        },
        ADD_GAME: {
            COMMAND: "addGame",
            DESCRIPTION: "!addGame \"Spielbezeichnung\" Alias \"Rollenbezeichnung\"",
            GROUP: "admin",
            SYNTAX: "!addGame \"game\" alias \"role\""
        },
        REMOVE_GAME: {
            COMMAND: "removeGame",
            DESCRIPTION: "!removeGame \"Spielbezeichnung\"",
            GROUP: "admin",
            SYNTAX: "!removeGame \"game\""
        },
        LIST_GAMES: {
            COMMAND: "listRoles",
            DESCRIPTION: "Listet alle zurzeit verfügbaren Rollen auf.",
            GROUP: "user",
            SYNTAX: "!listroles"
        },
    // POROGAME
        CATCH: {
            COMMAND: "catch",
            DESCRIPTION: "Fange ein Wesen ein und verkaufe es!",
            GROUP: "user",
            SYNTAX: "!catch 1234"
        },
        OPEN: {
            COMMAND: "open",
            DESCRIPTION: "Öffne eine geheimnisvolle Kiste!",
            GROUP: "user",
            SYNTAX: "!open 1234"
        },
        SPAWN_PORO: {
            COMMAND: "spawn",
            DESCRIPTION: "Startet den geheimnisvollen Spawnrhythmus.",
            GROUP: "admin",
            SYNTAX: "!spawn"
        },
        SPAWN_STOP : {
            COMMAND : "spawnkill",
            DESCRIPTION : "Killt den Mysteryspawner :(.",
            GROUP : "admin",
            SYNTAX: "!spawnkill"
        },
        // LOOTBOX
            LIST_LOOT : {
                COMMAND : "loot",
                DESCRIPTION : "Zeige den Loot der Lootboxen an",
                GROUP : "admin",
                SYNTAX : "!loot"
            },
            ADD_LOOT : {
                COMMAND : "addloot",
                DESCRIPTION : "Füge Loot zu den Lootboxen hinzu.",
                GROUP : "admin",
                SYNTAX : "!addLoot \"loot name\" \"loot description\""
            },
            REMOVE_LOOT : {
                COMMAND : "removeloot",
                DESCRIPTION : "Entferne Loot aus den Lootboxen.",
                GROUP : "admin",
                SYNTAX : "!removeLoot ID"
            },
    // CURRENCY
        SHOW_GOLD: {
            COMMAND: "gold",
            DESCRIPTION: "Zeige allen, wie viel Gold du besitzt!",
            GROUP: "user",
            SYNTAX: "!gold || !gold @Nickname"
        },
        SHOW_RANK : {
            COMMAND : "rank",
            DESCRIPTION : "Liste die Top 5 Nutzer mit dem meisten Gold auf.",
            GROUP : "user",
            SYNTAX: "!rank"
        },
        GIVE_GOLD: {
            COMMAND: "giveGold",
            DESCRIPTION: "Gebe einem Nutzer etwas Gold.",
            GROUP : "admin",
            SYNTAX : "!giveGold @Nickname amount"
        },
        TAKE_GOLD: {
            COMMAND: "takeGold",
            DESCRIPTION: "Nehme einem Nutzer etwas Gold.",
            GROUP : "admin",
            SYNTAX : "!takeGold @Nickname amount"
        },
    // STORE
        BUY_ITEM: {
            COMMAND: "buy",
            DESCRIPTION: "Kaufe Dir mit deinem Gold eine Rolle!",
            GROUP: "user",
            SYNTAX: "!buy Item-Name"
        },
        SHOW_STORE : {
            COMMAND : "store",
            DESCRIPTION : "Zeige alle kaufbaren Items an.",
            GROUP : "user",
            SYNTAX : "!store"
        },
        SELL_ITEM: {
            COMMAND: "sell",
            DESCRIPTION: "Verkaufe deine Items und verdiene etwas Gold!",
            GROUP: "user",
            SYNTAX: "!sell Item-Name"
        },
    // FLOWER
        GIVE_FLOWER : {
            COMMAND : "flower",
            DESCRIPTION : "Verschenke eine Blume des Ursprungs des Lebens an deinen Liebling mit !flower @Name!",
            GROUP : "user",
            SYNTAX : "!flower @nickname"
        },
        PLANT_FLOWER : {
            COMMAND : "plant",
            DESCRIPTION : "Pflanze eine Blume! Vielleicht pflückt sie ja jemand? Vorsichtig, verwelkt stündlich!",
            GROUP : "user",
            SYNTAX : "!plant"
        },
        PICKUP_FLOWER : {
            COMMAND : "pickup",
            DESCRIPTION : "Pflücke eine in der Eingangshalle gepflanzte Blume des Ursprungs des Lebens!",
            GROUP : "user",
            SYNTAX : "!pickup"
        },
        EAT_FLOWER : {
            COMMAND : "eat",
            DESCRIPTION : "Esse eine deiner Blumen aus deinem Inventar!",
            GROUP : "user",
            SYNTAX : "!eat",
        },
};