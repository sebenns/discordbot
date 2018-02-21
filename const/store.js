module.exports = {
    ITEMS: {  // ALIAS = !buy alias, ITEMNAME | DESCRIPTION | COST | Type 0 = Rank, 1 = Flower, 2 = Command
        ITEM_UNICORN: [{
            ALIAS : "Unicorn-of-Love",
            ITEM : "Unicorn of Love",
            DESCRIPTION : "Ein Rang der nur so vor Liebe strotzt! Are you the Unicorn of Love?",
            GOLD : 7500,
            TYPE : 0
        }],
        ITEM_CAT : [{
            ALIAS : "Flying-Cat",
            ITEM : "Flying Cat",
            DESCRIPTION : "Flying Cats here, Flying Cats there, Flying Cats everywhere!",
            GOLD : 3500,
            TYPE : 0
        }],
        ITEM_FOOD : [{
            ALIAS : "Katzenfutter",
            ITEM : "Katzenfutter",
            DESCRIPTION : "Hast Du dich schon immer mit Katzenfutter identifizieren können?",
            GOLD : 500,
            TYPE : 0
        }],
        ITEM_FLOWER : [{
            ALIAS : "Blümchen",
            ITEM : "Blume des Ursprungs des Lebens",
            DESCRIPTION : "Verschenke Blumen an deine Freunde, esse sie oder pflanze sie in die Eingangshalle!",
            GOLD : 250,
            TYPE : 1,
            SELL : 150
        }],
        ITEM_TEST : [{
            ALIAS : "test",
            ITEM : "NicknameChanger",
            DESCRIPTION : "Trolle deine Freunde und bennene sie um! Höhöhö",
            GOLD : 99999999,
            TYPE : 2
        }],
    }
};