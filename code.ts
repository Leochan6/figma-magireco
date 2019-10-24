// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.resize(400, 550);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.

var selections_array = [];

figma.ui.onmessage = msg => {

  setInterval(function() {
    var new_selections_array = [];
    selections = figma.currentPage.selection;
    selections.forEach(function(selection) {
      var properties = {"id":selection.id, "name":selection.name, "type":selection.type};
      if (selection.type == "INSTANCE") {
        properties["masterComponentId"] = selection.masterComponent.id;
        properties["masterComponentName"] = selection.masterComponent.name;
      }
      new_selections_array.push(properties);
    });
    if (!selectionSame(new_selections_array,selections_array)) {
      if (new_selections_array.length > 0) {
        console.log(new_selections_array);
      }
      selections_array = new_selections_array;

      // enable copy button
      if (selections_array.length == 1) {
        if (selections_array[0].masterComponentName == "Character Display") {
          var display_properties = getDisplayProperties(selections_array[0]);
          console.log(display_properties);
          figma.ui.postMessage({type: 'update-properties', display_properties:display_properties });
        }
      }





    }
  }, 1000);

  // main logic
  if (msg.type === 'create-display') {
    var valid = parametersValid(msg);
    if (valid.name_valid && valid.attribute_valid && valid.rank_valid && valid.level_valid && valid.magic_valid && valid.magia_valid && valid.episode_valid) {
      var character_display = figma.getNodeById("3:908") as ComponentNode;
      var instance = character_display.createInstance();
      instance.name = "Character Display/" + msg.name;
      var full_name = instance.name + " - Rank " + msg.rank + " - Level " + msg.level + " - Magic " + msg.magic + " - Magia " +  msg.magia + " - Epsiode " + msg.episode;
      if (msg.full_name) instance.name = full_name;

      // add display as a child of the current selection.
      var selections = figma.currentPage.selection;
      if (selections.length == 1) {
        var selection = selections[0];
        if (selection.type == "FRAME" || selection.type == "GROUP" || selection.type == "COMPONENT") {
          if (selection.children.length > 0) {
            var last_child = selection.children[0];
            var x_next = last_child.x + last_child.width;
            var y_next = last_child.y;
            
            // set the instance x and y value.
            if (x_next < selection.width && y_next < selection.height) {
              instance.x = x_next;
              instance.y = y_next;
            } else if (x_next >= selection.width) {
              instance.x = 0;
              instance.y = last_child.y + instance.height;
            }
          }
          selection.insertChild(0, instance);
        }
        else if (selection.type == "INSTANCE") {
          if (selection.parent.type == "FRAME" || selection.parent.type == "GROUP" || selection.parent.type == "COMPONENT" || selection.parent.type == "PAGE" || selection.parent.type == "DOCUMENT") {
            // set the instance x and y value.
            instance.x = selection.x + selection.width;
            instance.y = selection.y;
            // find the index to insert.
            for (var i = 0; i < selection.parent.children.length; i++) {
              if (selection.parent.children[i] == selection) {
                selection.parent.insertChild(i, instance);
              }
            }
          }
        }
      }
      figma.loadFontAsync({ family: "Roboto", style: "Regular" }).then(() => {
        setCharacter(instance, msg.name, msg.attribute, msg.rank, valid.component_id);
        setLevel(instance, msg.level);
        setMagic(instance, msg.magic);
        setMagia(instance, msg.magia, msg.episode);
        console.log("Created: " + instance.name);
      });
      if (!msg.keep_open) figma.closePlugin();
    } else {
      // log input and invalid fields.
      console.log("Charcter Display Not Created.");
      console.log(valid.message);
      console.log(msg);
      console.log(valid);
      // send invalid message to dialog.
      figma.ui.postMessage({type: 'update-problems', message:valid.message });
    }
  }

  if (msg.type === 'update-display') {
    var valid = parametersValid(msg);
    if (valid.name_valid && valid.attribute_valid && valid.rank_valid && valid.level_valid && valid.magic_valid && valid.magia_valid && valid.episode_valid) {
      var character_display = figma.getNodeById("3:908") as ComponentNode;
      var instance = character_display.createInstance();
      instance.name = "Character Display/" + msg.name;
      var full_name = instance.name + " - Rank " + msg.rank + " - Level " + msg.level + " - Magic " + msg.magic + " - Magia " +  msg.magia + " - Epsiode " + msg.episode;
      if (msg.full_name) instance.name = full_name;

      // replace display as a child of the current selection.
      var selections = figma.currentPage.selection;
      if (selections.length == 1) {
        var selection = selections[0];
        if (selection.type == "INSTANCE" && selection.masterComponent.name == "Character Display") {
          if (selection.parent.type == "FRAME" || selection.parent.type == "GROUP" || selection.parent.type == "COMPONENT" || selection.parent.type == "PAGE" || selection.parent.type == "DOCUMENT") {
            // set the instance x and y value.
            instance.x = selection.x;
            instance.y = selection.y;
            // find the index to insert.
            for (var i = 0; i < selection.parent.children.length; i++) {
              if (selection.parent.children[i] == selection) {
                selection.parent.insertChild(i, instance);
                selection.remove();
                break;
              }
            }
          }
        }
      }
      figma.loadFontAsync({ family: "Roboto", style: "Regular" }).then(() => {
        setCharacter(instance, msg.name, msg.attribute, msg.rank, valid.component_id);
        setLevel(instance, msg.level);
        setMagic(instance, msg.magic);
        setMagia(instance, msg.magia, msg.episode);
        console.log("Created: " + instance.name);
      });
      if (!msg.keep_open) figma.closePlugin();
    } else {
      // log input and invalid fields.
      console.log("Charcter Display Not Updated.");
      console.log(valid.message);
      console.log(msg);
      console.log(valid);
      // send invalid message to dialog.
      figma.ui.postMessage({type: 'update-problems', message:valid.message });
    }
  }

  // get the list of Magical Girl names.
  else if (msg.type === 'get-names') {
    var names = getNames();
    figma.ui.postMessage({type: 'update-names', names:names });
  }

  // get the attribute and avaliable ranks for the name
  else if (msg.type === 'name-change') {
    var result = getAttributeRanks(msg.name);
    figma.ui.postMessage({type: 'update-attribute-rank', rank: result.ranks, attribute: result.attribute });
  }
  
  // close the plugin.
  else if (msg.type === 'cancel') {
    figma.closePlugin();
  }

};

// Functions.


// check if the parameters in msg are valid.
function parametersValid (msg) {
  var character_image = figma.getNodeById("1:142") as FrameNode;
  var result = {name_valid:false,attribute_valid:false,rank_valid:false,level_valid:false, magic_valid:false, magia_valid:false, episode_valid:false, component_id:"", message:""};
  var level = parseInt(msg.level, 10);
  var magic = parseInt(msg.magic, 10);
  var magia = parseInt(msg.magia, 10);
  var episode = parseInt(msg.episode, 10);

  // simple logic checks.
  if (magic >= 0 && magic <= 3) result.magic_valid = true;
  else result.message += "Magic Level must be between 0 and 3.\n";
  if (magia >= 1 && magia <= 5) result.magia_valid = true;
  else result.message += "Magia Level must be between 1 and 5.\n";
  if (episode >= 1 && episode <= 5) result.episode_valid = true;
  else result.message += "Episode Level must be between 1 and 5.\n";
  if (magia > episode) {
    result.magia_valid = false;
    result.episode_valid = false;
    result.message += "Magia Level must be greater than or equal to Episode Level.\n";
  }
  
  // loop through all character image components to check if name, attribute, rank, and level are valid.
  character_image.children.forEach(function(child: ComponentNode) {
    if (child.name.includes("Card/" + msg.name)) {
      result.name_valid = true;
      if (child.name.includes("/Rank " + msg.rank)) {
        result.rank_valid = true;
        if (msg.rank == "1") {
          if (level >= 1 && level <= 40) result.level_valid = true;
          else result.message += "Experience Level must be between 1 and 40 for rank 1.\n";
        }
        else if (msg.rank == "2") {
          if (level >= 1 && level <= 50) result.level_valid = true;
          else result.message += "Experience Level must be between 1 and 50 for rank 2.\n";
        }
        else if (msg.rank == "3") {
          if (level >= 1 && level <= 60) result.level_valid = true;
          else result.message += "Experience Level must be between 1 and 60 for rank 3.\n";
        }
        else if (msg.rank == "4") {
          if (level >= 1 && level <= 80) result.level_valid = true;
          else result.message += "Experience Level must be between 1 and 80 for rank 4.\n";
        }
        else if (msg.rank == "5") {
          if (level >= 1 && level <= 100) result.level_valid = true;
          else result.message += "Experience Level must be between 1 and 100 for rank 5.\n";
        }
        if (result.name_valid && result.rank_valid && result.level_valid) {
          if (child.description == "Attribute:" + msg.attribute) {
            result.attribute_valid = true;
            result.component_id = child.id;
          }
          else result.message += "The Attribute " + msg.attribute + " is not avaliable for " + msg.name + ".\n";
        }
      }
    }
  });
  if (!result.rank_valid) result.message += "Rank " + msg.rank + " is not avaliable for " + msg.name + ".\n";
  if (!result.name_valid) result.message += "Name " + msg.name + " is not avaliable.\n";
  return result;
}

// swaps instances for the character's image card, frame, stars, attribute, and background.
function setCharacter (instance: InstanceNode, name: string, attribute: string, rank: string, component_id: string) {
  var card_component = figma.getNodeById(component_id) as ComponentNode;
  var character_base_instance = instance.children[2] as InstanceNode;
  var contents_group = character_base_instance.children[0] as FrameNode;
  var frame_intance = character_base_instance.children[1] as InstanceNode;
  var attribute_instance = character_base_instance.children[2] as InstanceNode;
  var star_instance = character_base_instance.children[3] as InstanceNode;
  var background_instance = contents_group.children[1] as InstanceNode;
  var card_instance = contents_group.children[2] as InstanceNode;

  card_instance.masterComponent = card_component;

  if (attribute == "Dark") {
    attribute_instance.masterComponent  = figma.getNodeById("1:136") as ComponentNode;
    background_instance.masterComponent = figma.getNodeById("1:113") as ComponentNode;
  } else if (attribute == "Fire") {
    attribute_instance.masterComponent  = figma.getNodeById("1:137") as ComponentNode;
    background_instance.masterComponent = figma.getNodeById("1:114") as ComponentNode;
  } else if (attribute == "Light") {
    attribute_instance.masterComponent  = figma.getNodeById("1:138") as ComponentNode;
    background_instance.masterComponent = figma.getNodeById("1:115") as ComponentNode;
  } else if (attribute == "Forest") {
    attribute_instance.masterComponent  = figma.getNodeById("1:139") as ComponentNode;
    background_instance.masterComponent = figma.getNodeById("1:116") as ComponentNode;
  } else if (attribute == "Void") {
    attribute_instance.masterComponent  = figma.getNodeById("1:140") as ComponentNode;
    background_instance.masterComponent = figma.getNodeById("1:117") as ComponentNode;
  } else if (attribute == "Water") {
    attribute_instance.masterComponent  = figma.getNodeById("1:141") as ComponentNode;
    background_instance.masterComponent = figma.getNodeById("1:118") as ComponentNode;
  }

  if (rank == "1") {
    frame_intance.masterComponent = figma.getNodeById("1:97") as ComponentNode;
    star_instance.masterComponent = figma.getNodeById("1:124") as ComponentNode;
  }
  else if (rank == "2") {
    frame_intance.masterComponent = figma.getNodeById("1:98") as ComponentNode;
    star_instance.masterComponent = figma.getNodeById("1:125") as ComponentNode;
  }
  else if (rank == "3") {
    frame_intance.masterComponent = figma.getNodeById("1:99") as ComponentNode;
    star_instance.masterComponent = figma.getNodeById("1:126") as ComponentNode;
  }
  else if (rank == "4") {
    frame_intance.masterComponent = figma.getNodeById("1:100") as ComponentNode;
    star_instance.masterComponent = figma.getNodeById("1:127") as ComponentNode;
  }
  else if (rank == "5") {
    frame_intance.masterComponent = figma.getNodeById("1:101") as ComponentNode;
    star_instance.masterComponent = figma.getNodeById("1:128") as ComponentNode;
  }

};

// sets the experience level text box.
function setLevel (instance: InstanceNode, level: string) {
  var text_all = instance.children[3] as TextNode;
  var level_fill = text_all.getRangeFills(0, 4) as Paint[]
  var value_fill = text_all.getRangeFills(5, text_all.characters.length) as Paint[]
  var value_size = text_all.getRangeFontSize(5, text_all.characters.length) as number;
  text_all.characters = "Lvl. " + level;
  text_all.setRangeFills(0, 4, level_fill);
  text_all.setRangeFills(5, text_all.characters.length, value_fill);
  text_all.setRangeFontSize(5, text_all.characters.length, value_size);
};

// sets the magic level.
function setMagic (instance: InstanceNode, magic: string) {
  var magic_instance = instance.children[1] as InstanceNode;
  if      (magic == "0")   magic_instance.masterComponent = figma.getNodeById("3:896") as ComponentNode;
  else if (magic == "1")   magic_instance.masterComponent = figma.getNodeById("3:13") as ComponentNode;
  else if (magic == "2")   magic_instance.masterComponent = figma.getNodeById("7:470") as ComponentNode;
  else if (magic == "3")   magic_instance.masterComponent = figma.getNodeById("3:25") as ComponentNode;
};

// sets the magia and episode level.
function setMagia (instance: InstanceNode, magia: string, episode: string) {
  var magia_instance = instance.children[0] as InstanceNode;
  if      (magia == "1" && episode == "1")   magia_instance.masterComponent = figma.getNodeById("10:1993") as ComponentNode;
  else if (magia == "1" && episode == "2")   magia_instance.masterComponent = figma.getNodeById("10:1960") as ComponentNode;
  else if (magia == "1" && episode == "3")   magia_instance.masterComponent = figma.getNodeById("10:1911") as ComponentNode;
  else if (magia == "1" && episode == "4")   magia_instance.masterComponent = figma.getNodeById("10:1846") as ComponentNode;
  else if (magia == "1" && episode == "5")   magia_instance.masterComponent = figma.getNodeById("3:41") as ComponentNode;
  else if (magia == "2" && episode == "2")   magia_instance.masterComponent = figma.getNodeById("10:1961") as ComponentNode;
  else if (magia == "2" && episode == "3")   magia_instance.masterComponent = figma.getNodeById("10:1912") as ComponentNode;
  else if (magia == "2" && episode == "4")   magia_instance.masterComponent = figma.getNodeById("10:1847") as ComponentNode;
  else if (magia == "2" && episode == "5")   magia_instance.masterComponent = figma.getNodeById("7:496") as ComponentNode;
  else if (magia == "3" && episode == "3")   magia_instance.masterComponent = figma.getNodeById("10:1913") as ComponentNode;
  else if (magia == "3" && episode == "4")   magia_instance.masterComponent = figma.getNodeById("10:1848") as ComponentNode;
  else if (magia == "3" && episode == "5")   magia_instance.masterComponent = figma.getNodeById("7:507") as ComponentNode;
  else if (magia == "4" && episode == "4")   magia_instance.masterComponent = figma.getNodeById("10:1849") as ComponentNode;
  else if (magia == "4" && episode == "5")   magia_instance.masterComponent = figma.getNodeById("7:514") as ComponentNode;
  else if (magia == "5" && episode == "5")   magia_instance.masterComponent = figma.getNodeById("7:521") as ComponentNode;
};

// gets the names of all the Magical Girls in character_image frame and sorts them alphabetically.
function getNames () {
  var names = [];
  var character_image = figma.getNodeById("1:142") as FrameNode;
  character_image.children.forEach(function(child: ComponentNode) {
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
function getAttributeRanks (name: string) {
  var result = {attribute:"",ranks:[true,true,true,true,true]};
  var character_image = figma.getNodeById("1:142") as FrameNode;
  character_image.children.forEach(function(child: ComponentNode) {
    var child_name = child.name;
    var child_name_split = child_name.split("/");
    if (child_name_split[1] == name) {
      result.attribute = child.description.split(":")[1];
      var rank = parseInt(child_name_split[2].split(" ")[1], 10);
      result.ranks[rank-1] = false;
    }
  });
  return result;
}

// gets the properties of the current selection.
function getDisplayProperties (selection_properties) {
  var display_properties = {};
  var instance = figma.getNodeById(selection_properties.id) as InstanceNode;
  var magia_instance = instance.children[0] as InstanceNode;
  var magic_instance = instance.children[1] as InstanceNode;
  var characted_base_instance = instance.children[2] as InstanceNode;
  var contents_group = characted_base_instance.children[0] as FrameNode;
  var level_text = instance.children[3] as TextNode;

  var card_instance = contents_group.children[2] as InstanceNode
  var name = card_instance.masterComponent.name.split("/")[1];
  display_properties["name"] = name;

  var attribute_instance = characted_base_instance.children[2] as InstanceNode
  var attribute = attribute_instance.masterComponent.name.split("/")[1];
  display_properties["attribute"] = attribute;

  var frame_instance = characted_base_instance.children[1] as InstanceNode
  var rank = frame_instance.masterComponent.name.split(" ")[1];
  display_properties["rank"] = rank;

  var level = level_text.characters.split(" ")[1];
  display_properties["level"] = level;

  var magic = magic_instance.masterComponent.name.split(" ")[1];
  display_properties["magic"] = magic;

  var magia_episode = magia_instance.masterComponent.name.split(" ")[1].split("-");
  display_properties["magia"] = magia_episode[0];
  display_properties["episode"] = magia_episode[1];




  return display_properties;
}

function selectionSame(x, y) {
  var selectionAreSame = true;
  try {
    for (var index in x) {
      for(var propertyName in x[index]) {
        if(x[index][propertyName] !== y[index][propertyName]) {
          selectionAreSame = false;
          break;
        }
      }
    }
  }
  catch(err) {
    selectionAreSame = false;
  }  
  return selectionAreSame;
}