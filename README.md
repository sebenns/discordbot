# A list of fuckups in your code. Ausgehend von commit 2aa4eace4306637a8ad033e05f4e082f3fffa853

Erstmal vorab, du hast immer noch alle in einer Datei und das macht es nicht gerade übersichtlich. Du kannst dir ja mal das module-System in Javascript selbst bzw., da du ja eh node.js benutzt, nodes module-System anschauen und ein paar Sachen aufteilen, die deinen Hauptbot eventuell etwas enträumen.  
Außerdem solltest du *wirklich* mal Groß- und Kleinschreibung vereinheitlichen. Also wirklich.

Zeile 36: dein `Commands`-Objekt hat immer noch für jedes Command ein Array an einem Objekt. Und du kannst immer noch die Anführungszeichen um den linken Teil der Objekte entfernen, weil das nur in JSON gebraucht wird und Javascript da sonst noch mehr konvertieren muss als eh schon. Außerdem könntest du theoretisch ein Array an Objekten anlegen, welches einfach nur noch auf das `command`-Attribut reagiert und dann jeweils ein Callback einführen, welches die entsprechende Funktion dann aufruft, aber so geht das natürlich auch.  
Verbesserung:  
```js
const Commands = {
    COM_HELP: {
        command: "help",
        description: "Zeigt alle Commands an.",
        group: "user"
    },
    // ...
}
```

Zeile 108: siehe oben, die Keys sind auch hier Strings anstatt einfachen Attributnamen.

Zeile 115: siehe Zeile 108. Außerdem ist `GROUP_ADMIN` nicht wirklich eine ID, sondern ein Name, aber jedem wie er es für richtig hält.

Zeile 121: Ich sag's mal so.. hier sind auch noch Arrays von Objekten mit einem Eintrag da.  
Verbesserung:  
```js
const Game = {
    LOL: {
        role: "League of Legends",
        alias: "LoL"
    },
    // ...
}
```

Zeile 132: hier gibt es einige Dinge:
- siehe oben, Keys sind Strings.
- `PoroGame.Settings.TimeOut` ist immer noch ein String.
- `PoroGame.POROS` ist ein Array aus einem Objekt, die wiederrum Arrays aus einem Objekt haben. Solltest du auch mal aufräumen.
- `PoroGame.POROS.x.cought` &rarr; `PoroGame.POROS.x.caught` (einfach für das richtige Englisch)
- `PoroGame.STORE` ist auch ein Array aus einem Objekt, genauso wie die Unterobjekte.
- `PoroGame.STORE.x.prize` ist ein String und sollte eventuell eine Zahl sein und 2. sollte es `price` heißen, weil `prize` der wörtliche Preis ist, den man gewinnen kann, nicht den, den man bezahlt.

Zeile 219: wofür deinen eigenen `Logger` (plus Initialisierung bei Zeile 539), wenn du einen anderen hast? Wenn du so eine Methode hinzufügen willst, kannst du das auch auf dem anderen Logger selbst tun - in Javascript geht sowas, weißt du?  
Du willst wohl sowas machen:  
```js
let logger = log4js.getLogger('Bot');
logger.logCommand = function(msg, msgCmd, channel) {
    this.info(/*...*/);
}
// sometime later:
logger.logCommand(x, y, z);
```

Zeile 225: da hier gleich die ganzen `switch`es kommen, will ich dich nochmal fragen: wie wolltest du eigentlich eine `switch`-Abfrage mit einer `for`-Schleife umschreiben?  
Allgemein zu der Klasse: du hast **SO** viele gehardcodede Variablen drin, holy shit. Fast in jeder Methode fragst du nach einem Typen ab, der einfach nur ein String ist. Kann man so machen, bei einem Schreibfehler oder so sucht man dann aber manchmal ewig nach der Fehlerquelle, die eigentlich direkt vor einem ist. *Für sowas* existiert eigentlich das Konzept eines Enumerators oder irgendwas ähnlichem, was eine integrierte Kontrolle durch die IDE oder das System hat und Fehler direkt abfängt. Du hast ja nicht mal in einem der `switch`-Blöcke einen `default`-Fall, der einfach nur einen Fehler in der Konsole ausgibt oder so... uff (außer in dem der Lootbox und da gibt es einfach nur `"Error"` aus, sehr aussagekräftig).  
Sowas hier reicht ja:  
```js
checkValid(msg, type, numb) {
    switch(type) {
        // cases...
        default:
            // ausgehend davon, dass logger.warn formattieren kann, ich kenn die API nicht
            logger.warn("No fitting type when calling checkValid(%s, %s, %s).", msg, type, numb);
    }
}
```

Zeile 228: wie gesagt, String-Checking und kein `default`-Fall.

Zeile 240: Die Methode hier gehört zusammen. String-Checking im `switch`, kein `default`-Fall.  
Zeile 248: hier sollte es *eigentlich* reichen, wenn du das Callback am Ende durch eine Methodenreferenz ersetzt (aka: `.send(stm).catch(logger.warn)`), weil das angegebene Argument direkt weiterverwendet wird.  
Zeile 255: wenn `Settings.spawning.lootbox` auf `true` gesetzt wird, wurde vermutlich kein Poro gespawned, wie mir im Comment erzählt wird.  
Zeile 261/269: Callback am Ende.  
Zeilen 254-270: du hast hier innerhalb einer `if`-Abfrage zweimal fast denselben Code (copy-paste, denk ich mal, sonst wäre der Kommentar ja nicht da) und es unterschiedet sich im Endeffekt der Type und das Command. Warum machst du da nicht einfach eine Methode draus, die den gespawnten Typ annimmt und dann je nachdem entscheidet, was zu tun ist? (Ich meine damit nicht, die `if` einfach komplett zu kopieren, sondern *nachzudenken*, was sich unterscheidet).  
Lösungsvorschlag:  
```js
// die Zeile ändert sich vermutlich auch noch (arrays):
Settings.spawnedType = poro[1][0];
this.doSpawning(Settings.spawnedType.type);
// ... weiter unten
doSpawning(type) {
    let commandToUse = 0;
    if(type === "lootbox") {
        commandToUse = Commands.COM_OPEN;
    } else {
        commandToUse = Commands.COM_CATCH;
    }
    // sowas...
}
```  
Außerdem bin ich immer noch kein Fan von 1. einer Typ-Variable als String, 2. warum extra `Settings.spawning.lootbox` bzw. `Settings.spawing.poro`, wenn du danach eh den Typen des ausgewählten Dings als String abfragst, 3. erwarte ich bei `Settings.spawnedType` eigentlich schon den Typen und nicht erst beim Unteraufruf auf `.type`. Naming, mein Freund.  
Zeile 274: `pickRandomPoro(/*...*/.themain)`? Die Methode solltest du wohl eher auf sowas wie `chooseRandomAttribute` umbenennen, weil das ja.. nicht nur für Poros ist (auf die Methode komm ich später nochmal).  
Zeile 275: Magic Numbers in einem `switch` seh ich auch echt gern, ich weiß direkt, was die 1/2/3 bedeutet. Aber wenigstens der eine `default`-Fall mit... einem kleinen Mini-Log.  
Zeile 285: der `"Bank"`-case verwirrt mich, da weiß ich nicht mal genau, was passiert, aber ja. Passt schon.

Zeile 296: String-Typ-Check, ich erwähn' es nur nochmal.  
Zeile 301: Muss man wirklich überprüfen, ob `Commands` den Key besitzt, den man gerade aus `Commands` gezogen hat? I don't think so.  
Zeilen 298-318: Das ist im Endeffekt wieder fast derselbe Code, mit drei kleinen Veränderungen, die nicht dazu führen sollten, den kompletten Code zu kopieren. Eigentlich kann man das schön ohne eine große `if` klären.

Zeile 353: ...sind wir hier nicht gerade in dem Bot? Warum dann `bot.messageSend` und nicht `this.messageSend`? Das kann schief gehen, wenn keine `bot`-Variable existiert.  
Zeile 358: dieses Attribut von `Settings` existiert nicht mehr, seit du Lootboxen und Poros getrennt hast... uh, nice refactoring.  
Generell.. du forced überall die tollen `arg => doSomething(arg, 2)`-Callbacks und **HIER** benutzt du dann wieder `function() { loop(); }`, anstatt einfach `() => loop()` zu machen, rrrrrrrrr

Zeile 372: `pickRandomPoro`... also, lass mich mal etwas klarstellen. Du verwendest überall ein Array mit einem Objekt, das die Keys hat und dann darin nochmal einen Array und ein Objekt. Was du hier aber machst, ist im Endeffekt nichts anderes, als über einen Array zu iterieren, weil du dir ja einfach das entsprechende Attribut des Objekts holst, welches du dir random aussuchst. Also, entweder du entscheidest dich jetzt dafür, alles als Objekte zu lassen und du arbeitest mit den Keys oder du machst einfach einen Array aus solchen Dingen, die du vermutlich nie mit einem Key ansprechen wirst und kannst dir einfach nur in einer Zeile dann ein zufälliges Objekt aus diesem Array aussuchen - entweder oder, entscheide dich mal, was du jetzt eigentlich machen willst.

Zeilen 381-409: Das ist auch wieder kritisch - das Gold wird anders berechnet, es wird eine andere Flag gesetzt und Nachricht gesendet, aber auch das kann man eigentlich einfach nur einzelne kleine `if`s regeln; den SQL-Befehl willst du nämlich eigentlich nie doppelt irgendwo stehen haben, vor allem, wenn du noch Variablen aus dem Code dazupackst. Auch hier sollte es eigentlich recht leicht regelbar sein, was du wie wann machst. Oder du lagerst den SQL-Befehl aus. Je nachdem.  
Zeile 399 & 400/ 406 & 407: Nice error handling.

Zeile 414: Anstatt den Error in der Console ausgeben zu lassen oder als Nachricht zu senden, throwst du den hier auch lieber.

Zeile 420: Error.  
Zeile 424: Auch hier ist es vermutlich nicht notwendig, zu überprüfen, ob `result` tatsächlich den Key hat, aber zusätzlich glaube ich, dass `result` ein Array ist, ich kann mich aber auch täuschen, ich kenn' die API immer noch nicht.

Zeile 439/443: sollte immer noch unnötig sein.

Zeile 453/457: warum?  
Zeile 452: Eigentlich willst du die Language nur einmal kriegen und nicht für jeden Store, den du angelegt hast, die verändert sich ja nicht über die `for`-Schleife hinweg. Also, außerhalb der `for` deklarieren.  
Zeile 462: throwwwwwww  
Zeilen 464-466: Du kannst das `if` hier schön mit dem darunter verbinden, indem du die Abfrage auf `result[0] && result[0].points >= Store/*bla*/` veränderst; da Javascript short-curcuit verwendet, wird `result[0]` zuerst gechecked und falls es fehlschlägt, direkt in den `else`-Zweig gewechselt. Keine extra `if`, die dasselbe wie das `else` drunter macht.

Zeile 488: ich... sag dazu nichts. *Gut gemacht*.

Zeile 547: Außer, du hast noch vor, auf deine eigenen Messages zu reagieren, kannst du hier auch einfach ein `if(message.author.id === Id.USER_BOT) return;` machen, bevor du ein riesiges `if` um alles baust.  
Zeilen 553-631: Dir ist schon bewusst, dass du hier ziemlich viele Dopplungen drin hast? Sobald du mal eine Sache anpassen willst, musst du das bei fast jeder anderen Instanz des Codes auch machen. Ich verstehe, dass du pro Channel die Nutzung einschränken willst, aber das solltest du eher innerhalb des jeweiligen `case`s machen (aka. eine große `switch` und in den `case`s die Einteilung anstatt andersrum). Dann kannst du auch eher kontrollieren, wie was einsetzbar ist und musst nicht 4 mal das Command an sich checken.
