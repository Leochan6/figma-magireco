
// Create a new Character Display and returns the instance.
function createDisplay (parameters) {
  var valid = parametersValid(parameters);
  var instance = null;
  if (valid.all_valid) {
    var character_display_component = figma.getNodeById("3:908") as ComponentNode;
    instance = character_display_component.createInstance();
    instance.name = "Character Display/" + parameters.name;
    if (parameters.full_name) instance.name += " - Rank " + parameters.rank + 
      " - Level " + parameters.level + " - Magic " + parameters.magic + 
      " - Magia " +  parameters.magia + " - Epsiode " + parameters.episode;
    setCharacter(instance, parameters.attribute, parameters.rank, valid.component_id);
    setLevel(instance, parameters.level);
    setMagic(instance, parameters.magic);
    setMagia(instance, parameters.magia, parameters.episode);
  } else {
    figma.notify(valid.message, {timeout: 10000});
  }
  return instance;
}

// Updates the selected Character Display with the new parameters
function updateDisplay (instance: InstanceNode, parameters) {
  var valid = parametersValid(parameters);
  if (valid.all_valid) {
    instance.name = "Character Display/" + parameters.name;
    if (parameters.full_name) instance.name += " - Rank " + parameters.rank + 
      " - Level " + parameters.level + " - Magic " + parameters.magic + 
      " - Magia " +  parameters.magia + " - Epsiode " + parameters.episode;
    setCharacter(instance, parameters.attribute, parameters.rank, valid.component_id);
    setLevel(instance, parameters.level);
    setMagic(instance, parameters.magic);
    setMagia(instance, parameters.magia, parameters.episode);
  } else {
    figma.notify(valid.message, {timeout: 10000});
  }
}

// Sets the location of the instance based on the current selection.
function setLocation (instance: InstanceNode) {
  if (figma.currentPage.selection.length != 1) return;
  var selection = figma.currentPage.selection[0];
  console.log(selection);
  console.log(selection.x, selection.y);
  if (selection.type == "INSTANCE") {
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
      figma.currentPage.selection = [instance];
    }
  } 
  else if (selection.type == "FRAME" || selection.type == "GROUP" || selection.type == "COMPONENT") {
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
}

// swaps instances for the character's image card, frame, stars, attribute, and background.
function setCharacter (instance: InstanceNode, attribute: string, rank: string, component_id: string) {
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
  else if (magic == "3")   magic_instance.masterComponent = figma.getNodeById("7:477") as ComponentNode;
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


// check if the parameters in msg are valid.
function parametersValid (msg) {
  var character_image = figma.getNodeById("1:142") as FrameNode;
  var result = {all_valid:false,name_valid:false,attribute_valid:false,rank_valid:false,level_valid:false, magic_valid:false, magia_valid:false, episode_valid:false, component_id:"", message:""};
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
          var description = JSON.parse(child.description);
          if (description["attribute"] == msg.attribute) {
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
  result.all_valid = result.name_valid && result.attribute_valid && result.rank_valid && result.level_valid && result.magic_valid && result.magia_valid && result.episode_valid
  return result;
}


export {createDisplay, updateDisplay, setCharacter, setLevel, setMagic, setMagia, setLocation, parametersValid};