// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.resize(400, 550);
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
    // main logic
    if (msg.type === 'create-display') {
        var valid = parametersValid(msg);
        if (valid.name_valid && valid.attribute_valid && valid.rank_valid && valid.level_valid && valid.magic_valid && valid.magia_valid && valid.episode_valid) {
            var character_display = figma.getNodeById("3:908");
            var instance = character_display.createInstance();
            instance.name = "Character Display/" + msg.name;
            var full_name = instance.name + " - Rank " + msg.rank + " - Level " + msg.level + " - Magic " + msg.magic + " - Magia " + msg.magia + " - Epsiode " + msg.episode;
            if (msg.full_name)
                instance.name = full_name;
            figma.loadFontAsync({ family: "Roboto", style: "Regular" }).then(() => {
                setCharacter(instance, msg.name, msg.attribute, msg.rank, valid.component_id);
                setLevel(instance, msg.level);
                setMagic(instance, msg.magic);
                setMagia(instance, msg.magia, msg.episode);
                console.log("Created: " + instance.name);
            });
            figma.closePlugin();
        }
        else {
            // log input and invalid fields.
            console.log("Charcter Display Not Created.");
            console.log(valid.message);
            console.log(msg);
            console.log(valid);
            // send invalid message to dialog.
            figma.ui.postMessage({ type: 'update-problems', message: valid.message });
        }
    }
    // get the list of Magical Girl names.
    else if (msg.type === 'get-names') {
        var names = getNames();
        figma.ui.postMessage({ type: 'update-names', names: names });
    }
    // get the attribute and avaliable ranks for the name
    else if (msg.type === 'name-change') {
        var result = getAttributeRanks(msg.name);
        figma.ui.postMessage({ type: 'update-attribute-rank', rank: result.ranks, attribute: result.attribute });
    }
    // close the plugin.
    else if (msg.type === 'cancel') {
        figma.closePlugin();
    }
};
// check if the parameters in msg are valid.
function parametersValid(msg) {
    var character_image = figma.getNodeById("1:142");
    var result = { name_valid: false, attribute_valid: false, rank_valid: false, level_valid: false, magic_valid: false, magia_valid: false, episode_valid: false, component_id: "", message: "" };
    var level = parseInt(msg.level, 10);
    var magic = parseInt(msg.magic, 10);
    var magia = parseInt(msg.magia, 10);
    var episode = parseInt(msg.episode, 10);
    // simple logic checks.
    if (magic >= 0 && magic <= 3)
        result.magic_valid = true;
    else
        result.message += "Magic Level must be between 0 and 3.\n";
    if (magia >= 1 && magia <= 5)
        result.magia_valid = true;
    else
        result.message += "Magia Level must be between 1 and 5.\n";
    if (episode >= 1 && episode <= 5)
        result.episode_valid = true;
    else
        result.message += "Episode Level must be between 1 and 5.\n";
    if (magia > episode) {
        result.magia_valid = false;
        result.episode_valid = false;
        result.message += "Magia Level must be greater than or equal to Episode Level.\n";
    }
    // loop through all character image components to check if name, attribute, rank, and level are valid.
    character_image.children.forEach(function (child) {
        if (child.name.includes("Card/" + msg.name)) {
            result.name_valid = true;
            if (child.name.includes("/Rank " + msg.rank)) {
                result.rank_valid = true;
                if (msg.rank == "1") {
                    if (level >= 1 && level <= 40)
                        result.level_valid = true;
                    else
                        result.message += "Experience Level must be between 1 and 40 for rank 1.\n";
                }
                else if (msg.rank == "2") {
                    if (level >= 1 && level <= 50)
                        result.level_valid = true;
                    else
                        result.message += "Experience Level must be between 1 and 50 for rank 2.\n";
                }
                else if (msg.rank == "3") {
                    if (level >= 1 && level <= 60)
                        result.level_valid = true;
                    else
                        result.message += "Experience Level must be between 1 and 60 for rank 3.\n";
                }
                else if (msg.rank == "4") {
                    if (level >= 1 && level <= 80)
                        result.level_valid = true;
                    else
                        result.message += "Experience Level must be between 1 and 80 for rank 4.\n";
                }
                else if (msg.rank == "5") {
                    if (level >= 1 && level <= 100)
                        result.level_valid = true;
                    else
                        result.message += "Experience Level must be between 1 and 100 for rank 5.\n";
                }
                if (result.name_valid && result.rank_valid && result.level_valid) {
                    if (child.description == "Attribute:" + msg.attribute) {
                        result.attribute_valid = true;
                        result.component_id = child.id;
                    }
                    else
                        result.message += "The Attribute " + msg.attribute + " is not avaliable for " + msg.name + ".\n";
                }
            }
        }
    });
    if (!result.rank_valid)
        result.message += "Rank " + msg.rank + " is not avaliable for " + msg.name + ".\n";
    if (!result.name_valid)
        result.message += "Name " + msg.name + " is not avaliable.\n";
    return result;
}
// swaps instances for the character's image card, frame, stars, attribute, and background.
function setCharacter(instance, name, attribute, rank, component_id) {
    var card_component = figma.getNodeById(component_id);
    var character_base_instance = instance.children[2];
    var contents_group = character_base_instance.children[0];
    var frame_intance = character_base_instance.children[1];
    var attribute_instance = character_base_instance.children[2];
    var star_instance = character_base_instance.children[3];
    var background_instance = contents_group.children[1];
    var card_instance = contents_group.children[2];
    card_instance.masterComponent = card_component;
    if (attribute == "Dark") {
        attribute_instance.masterComponent = figma.getNodeById("1:136");
        background_instance.masterComponent = figma.getNodeById("1:113");
    }
    else if (attribute == "Fire") {
        attribute_instance.masterComponent = figma.getNodeById("1:137");
        background_instance.masterComponent = figma.getNodeById("1:114");
    }
    else if (attribute == "Light") {
        attribute_instance.masterComponent = figma.getNodeById("1:138");
        background_instance.masterComponent = figma.getNodeById("1:115");
    }
    else if (attribute == "Forest") {
        attribute_instance.masterComponent = figma.getNodeById("1:139");
        background_instance.masterComponent = figma.getNodeById("1:116");
    }
    else if (attribute == "Void") {
        attribute_instance.masterComponent = figma.getNodeById("1:140");
        background_instance.masterComponent = figma.getNodeById("1:117");
    }
    else if (attribute == "Water") {
        attribute_instance.masterComponent = figma.getNodeById("1:141");
        background_instance.masterComponent = figma.getNodeById("1:118");
    }
    if (rank == "1") {
        frame_intance.masterComponent = figma.getNodeById("1:97");
        star_instance.masterComponent = figma.getNodeById("1:124");
    }
    else if (rank == "2") {
        frame_intance.masterComponent = figma.getNodeById("1:98");
        star_instance.masterComponent = figma.getNodeById("1:125");
    }
    else if (rank == "3") {
        frame_intance.masterComponent = figma.getNodeById("1:99");
        star_instance.masterComponent = figma.getNodeById("1:126");
    }
    else if (rank == "4") {
        frame_intance.masterComponent = figma.getNodeById("1:100");
        star_instance.masterComponent = figma.getNodeById("1:127");
    }
    else if (rank == "5") {
        frame_intance.masterComponent = figma.getNodeById("1:101");
        star_instance.masterComponent = figma.getNodeById("1:128");
    }
}
;
// sets the experience level text box.
function setLevel(instance, level) {
    var text_all = instance.children[3];
    var level_fill = text_all.getRangeFills(0, 4);
    var value_fill = text_all.getRangeFills(5, text_all.characters.length);
    var value_size = text_all.getRangeFontSize(5, text_all.characters.length);
    text_all.characters = "Lvl. " + level;
    text_all.setRangeFills(0, 4, level_fill);
    text_all.setRangeFills(5, text_all.characters.length, value_fill);
    text_all.setRangeFontSize(5, text_all.characters.length, value_size);
}
;
// sets the magic level.
function setMagic(instance, magic) {
    var magic_instance = instance.children[1];
    if (magic == "0")
        magic_instance.masterComponent = figma.getNodeById("3:896");
    else if (magic == "1")
        magic_instance.masterComponent = figma.getNodeById("3:13");
    else if (magic == "2")
        magic_instance.masterComponent = figma.getNodeById("7:470");
    else if (magic == "3")
        magic_instance.masterComponent = figma.getNodeById("3:25");
}
;
// sets the magia and episode level.
function setMagia(instance, magia, episode) {
    var magia_instance = instance.children[0];
    if (magia == "1" && episode == "1")
        magia_instance.masterComponent = figma.getNodeById("10:1993");
    else if (magia == "1" && episode == "2")
        magia_instance.masterComponent = figma.getNodeById("10:1960");
    else if (magia == "1" && episode == "3")
        magia_instance.masterComponent = figma.getNodeById("10:1911");
    else if (magia == "1" && episode == "4")
        magia_instance.masterComponent = figma.getNodeById("10:1846");
    else if (magia == "1" && episode == "5")
        magia_instance.masterComponent = figma.getNodeById("3:41");
    else if (magia == "2" && episode == "2")
        magia_instance.masterComponent = figma.getNodeById("10:1961");
    else if (magia == "2" && episode == "3")
        magia_instance.masterComponent = figma.getNodeById("10:1912");
    else if (magia == "2" && episode == "4")
        magia_instance.masterComponent = figma.getNodeById("10:1847");
    else if (magia == "2" && episode == "5")
        magia_instance.masterComponent = figma.getNodeById("7:496");
    else if (magia == "3" && episode == "3")
        magia_instance.masterComponent = figma.getNodeById("10:1913");
    else if (magia == "3" && episode == "4")
        magia_instance.masterComponent = figma.getNodeById("10:1848");
    else if (magia == "3" && episode == "5")
        magia_instance.masterComponent = figma.getNodeById("7:507");
    else if (magia == "4" && episode == "4")
        magia_instance.masterComponent = figma.getNodeById("10:1849");
    else if (magia == "4" && episode == "5")
        magia_instance.masterComponent = figma.getNodeById("7:514");
    else if (magia == "5" && episode == "5")
        magia_instance.masterComponent = figma.getNodeById("7:521");
}
;
// gets the names of all the Magical Girls in character_image frame and sorts them alphabetically.
function getNames() {
    var names = [];
    var character_image = figma.getNodeById("1:142");
    character_image.children.forEach(function (child) {
        var name = child.name;
        name = name.split("/")[1];
        if (!names.includes(name)) {
            names.push(name);
        }
    });
    names.sort();
    return names;
}
// gets the attribute and the available ranks for the Magical Girls name.
function getAttributeRanks(name) {
    var result = { attribute: "", ranks: [true, true, true, true, true] };
    var character_image = figma.getNodeById("1:142");
    character_image.children.forEach(function (child) {
        var child_name = child.name;
        var child_name_split = child_name.split("/");
        if (child_name_split[1] == name) {
            result.attribute = child.description.split(":")[1];
            var rank = parseInt(child_name_split[2].split(" ")[1], 10);
            result.ranks[rank - 1] = false;
        }
    });
    return result;
}
