const COMMANDS = require("./commands.js");

module.exports = {
    SETTINGS : {
        TIMEOUT : 30000, // 30 Seconds TimeOut for PoroSpawn Message
        MAX_SPAWN_INTERVAL : 200000, // Max Interval for Spawning Time
        MIN_SPAWN_INTERVAL : 100000, // Min Interval for Spawning Time
    },
    OBJECTS: {
        // Type 0 = normal, 1 = lootbox || Appear = Appearmsg, || Catch = How To Catch Msg, || Image || Command_To_Use || Caught = Msgs if caught || Loot = If random = false, Max Gold = Default
        PORO: {
            TYPE : 0,
            APPEAR : "Ein wildes Poro ist erschienen!",
            CATCH : "Benutze `!%s %s` um das wilde Poro einzufangen!",
            IMAGE : "http://riverflowsinyou.de/scr/187d0fd46e07644bbcc52d1d08e0fba4.png",
            COMMAND_TO_USE : COMMANDS.CATCH.COMMAND,
            CAUGHT : {
                1: "%s hat das Poro eingefangen und auf dem nächsten **White-Poro-Market** für **%s Gold** an einen kuriosen muskolösen bärtigen Mann verkauft.",
                2: "Das Poro ist %s leider entwischt und hinterlässt etwas Poro-Kot. Auf dem nächsten **White-Poro-Market** verkaufst du den Poro-Kot für **%s Gold**." +
                "Man kann ja nicht alles haben ¯|_(ツ)_/¯",
                3: "Schwiii, Schwaaaa, Schwuuupps. Das Poro bewirft %s mit **%s Gold**. Bloß nicht in Ohnmacht fallen!"
            },
            LOOT : {
                RANDOM : true,
                MAX_GOLD : 100,
                MIN_GOLD : 50,
            }
        },
        TEEMORO : {
            TYPE : 0,
            APPEAR : "Ein Teemoro kommt aus dem Jungle gerannt!",
            CATCH : "Benutze `!%s %s` um den Wicht zu fangen und zu zerstampfen!",
            IMAGE : "http://riverflowsinyou.de/scr/teemoro.png",
            COMMAND_TO_USE : COMMANDS.CATCH.COMMAND,
            CAUGHT : {
                1: "%s hat das Teemoro eingefangen und auf dem nächsten Scheiterhaufen zerstampft. Übrig geblieben sind **%s Gold** und ein Pilz.",
                2: "Das Teemoro hat Feuer gefangen und verbrennt bei lebendigem Leibe. Übrig geblieben ist etwas Gold. %s hebt **%s Gold** auf und besucht den nächstgelegenen #poro-shop.",
                3: "Laute Schreie sind aus der tiefen Verdammnis zu hören. Wer wird da wohl gequält? %s tritt aus der Dunkelheit mit **%s Gold** heraus."
            },
            LOOT : {
                RANDOM : true,
                MAX_GOLD : 100,
                MIN_GOLD : 50,
            }
        },
        URF : {
            TYPE : 0,
            APPEAR : "Ein wildes Urf ist erschienen! Es scheint sich gerade mit Freunden zu unterhalten...?!",
            CATCH : "Benutze `!%s %s` um das wilde Urf zu fangen und es auf dem nächsten **URF-MARKET** zu verkaufen!",
            IMAGE : "http://riverflowsinyou.de/scr/urf.png",
            COMMAND_TO_USE : COMMANDS.CATCH.COMMAND,
            CAUGHT : {
                1: "**OH MEIN GOTT!** %s hat versucht das Urf zu fangen, ist gestolpert und in den nächstgelegenen Busch gerollt. HAHA! Wenigstens **%s Gold** gefunden! :)",
                2: "Das wilde Urf bewirft %s mit einem Pfannenwender, welcher nun für **%s Gold** verkauft wird. Urf-Pfannenwender sind halt etwas Besonderes ヽ༼☉ɷ⊙༽ﾉ",
                3: "(つಥ▽ಥ)つ⊂(ಥヮಥ⊂) FREUNDE FÜR IMMER (つಥ▽ಥ)つ⊂(ಥヮಥ⊂) Das wilde Urf schenkt %s genau **%s Gold**. (つಥ▽ಥ)つ⊂(ಥヮಥ⊂) FREUNDE (つಥ▽ಥ)つ⊂(ಥヮಥ⊂)"
            },
            LOOT : {
                RANDOM : true,
                MAX_GOLD : 300,
                MIN_GOLD : 100,
            }
        },
        THINKING_BARD : {
            TYPE : 0,
            APPEAR : "Ein Hyper-Feeder ist aufgetaucht. Fange ihn, bevor das Spiel verloren ist!",
            CATCH : "Benutze `!%s %s` um den verrückt gewordenen Feeder aufzuhalten und deine Runde noch zu gewinnen!",
            IMAGE : "http://riverflowsinyou.de/scr/bard.png",
            COMMAND_TO_USE : COMMANDS.CATCH.COMMAND,
            CAUGHT : {
              1: "%s hat den Hyper-Feeder gefangen und ihn zurück in die Base verfrachtet. Das Spiel scheint fast gewonnen zu sein! ( + **%s Gold** )",
              2: "Man kann leider nicht jedes Spiel gewinnen. %s hat es zwar nicht geschaffen den Feeder aufzuhalten, aber es gibt trotzdem etwas Gold! ( + **%s Gold** )",
              3: "%s hat sich dafür entschieden mit dem Feeder zu spielen. Nun trollen beide und das Spiel scheint verloren zu sein. Naja.. Was solls! ヽ༼☉ɷ⊙༽ﾉ ( + **%s Gold** )"
            },
            LOOT : {
                RANDOM : true,
                MAX_GOLD : 200,
                MIN_GOLD : 100,
            }
        },
        LOOTBOX : {
            TYPE : 1,
            APPEAR : "Eine Lootbox ist vom Himmel gefallen!?!",
            CATCH : "Benutze `!%s %s` um die Lootbox zu öffnen und dein Glück herauszufordern!",
            IMAGE : "http://riverflowsinyou.de/scr/8.png",
            COMMAND_TO_USE : COMMANDS.OPEN.COMMAND,
            CAUGHT : {
                LEGENDARY : {
                    MSG : "%s hat die Lootbox geöffnet und erschaudert vor dem legendären Anblick eines **__%s__** Skins. Leider war es ein Duplikat. Schade aber auch :(. ( + **%s Gold** ).",
                    GOLD : 250,
                },
                CRAP : {
                    MSG: "%s hat die Lootbox gegen die Wand geschmissen. Aus der Box fallen lauter wertlose Gegenstände. Das war wohl leider nix. Verkauft bringen sie trotzdem was! ( + **%s Gold** ).",
                    GOLD: 100,
                },
                NOTHING : {
                    MSG: "Eines Tages bekam %s - nach etlichen Versuchen mit dem Zahnstocher.. - die Lootbox schließlich auf. Drinnen war aber leider nichts. Vielleicht nächstes Mal?",
                    GOLD: 0,
                }
            },
        }
    },
};