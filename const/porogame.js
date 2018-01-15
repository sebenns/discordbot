module.exports = {
    "Settings" : {
        "TimeOut": 30000, // 30 Seconds TimeOut for PoroSpawn Message
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
    "POROS": {  // different Types of Poros. Maybe you wanna add some new one?
        "PORO": {
            "appear" : "Ein wildes Poro ist erschienen!",
            "catch" : "Benutze `!%s %s` um das wilde Poro einzufangen!",
            "type" : "normal",
            "image" : "http://riverflowsinyou.de/scr/187d0fd46e07644bbcc52d1d08e0fba4.png",
            "caught" : "%s hat das Poro eingefangen und auf dem nächsten **White-Poro-Market** für **%s Gold** an einen kuriosen muskolösen bärtigen Mann verkauft."
        },
        "TEEMORO" : {
            "appear" : "Ein Teemoro kommt aus dem Jungle gerannt!",
            "catch" : "Benutze `!%s %s` um den Wicht zu fangen und zu zerstampfen!",
            "type" : "normal",
            "image" : "http://riverflowsinyou.de/scr/teemoro.png",
            "caught" : "%s hat das Teemoro eingefangen und auf dem nächsten Scheiterhaufen zerstampft. Übrig geblieben sind **%s Gold** und ein Pilz."
        },
        "LOOTBOX" : {
            "appear" : "Eine Lootbox ist vom Himmel gefallen!?!",
            "catch" : "Benutze `!%s %s` um die Lootbox zu öffnen und dein Glück herauszufordern!",
            "type" : "lootbox",
            "image" : "http://riverflowsinyou.de/scr/8.png",
            "caught_1" : "%s hat die Lootbox geöffnet und erschaudert vor dem legendären Anblick eines **__%s__** Skins. Leider war es ein Duplikat. Schade aber auch :(. ( + **%s Gold** ).",
            "caught_2" : "%s hat die Lootbox gegen die Wand geschmissen. Aus der Box fallen lauter wertlose Gegenstände. Das war wohl leider nix. Verkauft bringen sie trotzdem was! ( + **%s Gold** ).",
            "caught_3" : "Eines Tages bekam %s - nach etlichen Versuchen mit dem Zahnstocher.. - die Lootbox schließlich auf. Drinnen war aber leider nichts. Vielleicht nächstes Mal?",
            "loot" : 0,
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
        }
    },
    "STORE": {  // Items for sell. Maybe some commands will be added.
        "ITEM_UNICORN": {
            "name" : "Unicorn-of-Love",
            "item" : "Unicorn of Love",
            "description" : "Ein Rang der nur vor Liebe strotzt. Are you the Unicorn of Love?",
            "price" : 5000,
            "type" : "Rank"
        },
        "ITEM_CAT" : {
            "name" : "Flying-Cat",
            "item" : "Flying Cat",
            "description" : "Flying Cats here, Flying Cats there, Flying Cats everywhere!",
            "price" : 2500,
            "type" : "Rank"
        },
        "ITEM_FOOD" : {
            "name" : "Katzenfutter",
            "item" : "Katzenfutter",
            "description" : "Hast Du dich schon immer mit Katzenfutter identifizieren können?",
            "price" : 500,
            "type" : "Rank"
        }
    }
};