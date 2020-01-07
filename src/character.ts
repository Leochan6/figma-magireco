import {getDisplayProperties, sortArrayBy} from "./utils";
import { isBackgroundInstance } from "./background";


// Create a new Character Display and returns the instance.
function createDisplay (parameters: any) {
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
function updateDisplay (instance: InstanceNode, parameters: any) {
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
  if (isBackgroundInstance(selection)) selection = selection.parent as SceneNode;
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
    var last_child = null;
    var hasBackground = selection.children.some(isBackgroundInstance);
    if (selection.children.length > 0 && !hasBackground || selection.children.length > 1 && hasBackground) {
      // get the last character display.
      if (selection.children.length > 0 && !hasBackground) {
        if (isCharacterDisplayInstance(selection.children[0]))
          last_child = selection.children[0];
      } else if (selection.children.length > 1 && hasBackground) {
        if (isCharacterDisplayInstance(selection.children[1]))
          last_child = selection.children[1];
      } 
    }
    if (last_child != null) {
      // set the instance x and y value.
      var x_next = last_child.x + last_child.width;
      var y_next = last_child.y;
      if (x_next < selection.width && y_next < selection.height) {
        instance.x = x_next;
        instance.y = y_next;
      } else if (x_next >= selection.width && last_child.y + instance.height < selection.height) {
        instance.x = 0;
        instance.y = last_child.y + instance.height;
      } else {
        figma.notify("No more Character Displays can be added to the selection.", {timeout: 10000});
        instance.remove();
        return;
      }
    }
    if (hasBackground) selection.insertChild(1, instance);
    else selection.insertChild(0, instance);
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
  var character_display_master = figma.getNodeById("3:908") as ComponentNode;
  var master_level = character_display_master.children[3] as TextNode;
  var level_fill = master_level.getRangeFills(0, 4) as Paint[]
  var value_fill = master_level.getRangeFills(5, master_level.characters.length) as Paint[]
  var level_size = master_level.getRangeFontSize(0, 4) as number;
  var value_size = master_level.getRangeFontSize(5, master_level.characters.length) as number;
  
  var text_all = instance.children[3] as TextNode;
  text_all.characters = "Lvl. " + level;
  text_all.setRangeFills(0, 5, level_fill);
  text_all.setRangeFills(5, text_all.characters.length, value_fill);
  text_all.setRangeFontSize(0, 5, level_size);
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
function parametersValid (msg: any) {
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


// Check if the objects in the frame are the right type and names match.
function isCharacterDisplay(selection: FrameNode) {
  if (selection.type != "FRAME" || selection.name.split("/")[0] != "Character Display") return false;
  if (selection.children[0].type != "FRAME" || selection.children[0].name.split("/")[0] != "Magia") return false;
  if (selection.children[1].type != "FRAME" || selection.children[1].name.split("/")[0] != "Magic") return false;
  if (selection.children[2].type != "FRAME" || selection.children[2].name != "Character Base") return false;
  if (selection.children[3].type != "TEXT" || selection.children[3].name != "Level") return false;
  if (!RegExp('^Card\/(.+?)\/Rank [1-5]$').test(((selection.children[2] as FrameNode).children[0] as FrameNode).children[2].name)) return false;
  if (!RegExp('^Attribute\/[A-z]+$').test((selection.children[2] as FrameNode).children[2].name)) return false;
  if (!RegExp('^Star\/Rank [1-5]$').test((selection.children[2] as FrameNode).children[3].name)) return false;
  if (!RegExp('^Lvl. [0-9]+$').test((selection.children[3] as TextNode).characters)) return false;
  if (!RegExp('^Magic\/Level [0-3]$').test(selection.children[1].name)) return false;
  if (!RegExp('^Magia\/Level [1-5]-[1-5]$').test(selection.children[0].name)) return false;
  return true;
}

// convert each frame in the selection to an instance of Character Display.
function convertToCharacterDisplay(selections: readonly FrameNode[]) {
  var currentSelections = selections;
  if (selections.length == 1 && selections[0].children.every(isCharacterDisplay)) {
    currentSelections = selections[0].children as readonly FrameNode[];
  }
  var results = []
  currentSelections.forEach(function (selection) {
    var properties = {};
    properties["name"] = ((selection.children[2] as FrameNode).children[0] as FrameNode).children[2].name.split("/")[1];
    properties["attribute"] = (selection.children[2] as FrameNode).children[2].name.split("/")[1];
    properties["rank"] = (selection.children[2] as FrameNode).children[3].name.split("/")[1].split(" ")[1];
    properties["level"] = (selection.children[3] as TextNode).characters.split(" ")[1];
    properties["magic"] = selection.children[1].name.split("/")[1].split(" ")[1];
    properties["magia"] = selection.children[0].name.split("/")[1].split(" ")[1].split("-")[0];
    properties["episode"] = selection.children[0].name.split("/")[1].split(" ")[1].split("-")[1];
    properties["full_name"] = selection.name.includes("Rank") || selection.name.includes("Level") || selection.name.includes("Magic") || selection.name.includes("Magia") || selection.name.includes("Episode");
    var instance = createDisplay(properties);
    if (instance !== null) {
      results.push({created: true, name: selection.name, properties:properties});
      selection.parent.insertChild(selection.parent.children.indexOf(selection), instance);
      instance.x = selection.x
      instance.y = selection.y
      selection.remove();
    } else {
      results.push({created: false, name: selection.name, properties:properties});
    }
  });
  var created = 0, skipped = 0;
  var message = "";
  results.forEach(function(result) {
    if (result["created"]) created++;
    else skipped++;
  });
  message = "converted " + created + ", skipped " + skipped;
  figma.notify(message, {timeout: 10000})
}

// check if the Scene Node is an Instance Node and is an instance of Character Display.
function isCharacterDisplayInstance(node: SceneNode) {
  if (node.type == "INSTANCE" && node.masterComponent.name == "Character Display") return true;
  else return false;
}

const ATTRIBUTE_ORDER = {"Fire": 0, "Water": 1, "Forest": 2, "Light": 3, "Dark": 4, "Void": 5};

function sortDisplays(group_by: string, group_dir: number, sort_by_1: string, sort_dir_1: number, sort_by_2: string, sort_dir_2: number, sort_id_dir: number, num_per_row: number) {
  
  // get the display properties of all the children in the frame.
  var display_properties = [];
  (figma.currentPage.selection[0] as FrameNode).children.forEach(function (child: InstanceNode) {
    if (isCharacterDisplayInstance(child)) display_properties.push(getDisplayProperties(child));
  });

  // add each display_property to the corresponding group.
  var display_groups = group_properties(display_properties, group_by, group_dir);

  // convert attributes to numbers.
  for (var group_name in display_groups) {
    var group = display_groups[group_name];
    group.forEach(function(properties: any) {
      var attribute = properties["attribute"];
      properties["attribute"] = ATTRIBUTE_ORDER[attribute];
    })
  }
  
  // sort each group by the specified property.
  var sortBy = [];
  if (sort_by_1 != "none") {
    sortBy.push({ prop: sort_by_1, direction: sort_dir_1, isString: false });
  }
  if (sort_by_2 != "none") {
    sortBy.push({ prop: sort_by_2, direction: sort_dir_2, isString: false });
  }
  sortBy.push({ prop: "id", direction: sort_id_dir, isString: false });

  for (var group in display_groups) {
    display_groups[group] = display_groups[group].sort((a: any, b: any) => sortArrayBy(a,b,sortBy));
  }

  placeCharacterDisplays(display_groups, num_per_row);
}

const NUM_TO_WORD = {"0": "Zero", "1": "One", "2": "Two", "3": "Three", "4": "Four", "5": "Five"};

// adds each display_property to the corresponding group.
function group_properties (display_properties: any[], group_by: string, group_dir: number) {
  var display_groups = {};
  if (group_by == "attribute") {
    if (group_dir == 1) display_groups = {"Fire": [], "Water": [], "Forest": [], "Light": [], "Dark": [], "Void": []};
    if (group_dir == -1) display_groups = {"Void": [], "Dark": [], "Light": [], "Forest": [], "Water": [], "Fire": []};
    display_properties.forEach(function(properties) {
      display_groups[properties["attribute"]].push(properties);
    });
  } else if (group_by == "rank") {
    if (group_dir == 1) display_groups = {"One": [], "Two": [], "Three": [], "Four": [], "Five": []};
    if (group_dir == -1) display_groups = {"Five": [], "Four": [], "Three": [], "Two": [], "One": []};
    display_properties.forEach(function(properties) {
      display_groups[NUM_TO_WORD[properties["rank"]]].push(properties);
    });
  } else if (group_by == "magic") {
    if (group_dir == 1) display_groups = {"Zero": [], "One": [], "Two": [], "Three": []};
    if (group_dir == -1) display_groups = {"Three": [], "Two": [], "One": [], "Zero": []};
    display_properties.forEach(function(properties) {
      display_groups[NUM_TO_WORD[properties["magic"]]].push(properties);
    });
  } else if (group_by == "magia") {
    if (group_dir == 1) display_groups = {"One": [], "Two": [], "Three": [], "Four": [], "Five": []};
    if (group_dir == -1) display_groups = {"Five": [], "Four": [], "Three": [], "Two": [], "One": []};
    display_properties.forEach(function(properties) {
      display_groups[NUM_TO_WORD[properties["magia"]]].push(properties);
    });
  } else if (group_by == "episode") {
    if (group_dir == 1) display_groups = {"One": [], "Two": [], "Three": [], "Four": [], "Five": []};
    if (group_dir == -1) display_groups = {"Five": [], "Four": [], "Three": [], "Two": [], "One": []};
    display_properties.forEach(function(properties) {
      display_groups[NUM_TO_WORD[properties["episode"]]].push(properties);
    });
  } else if (group_by == "none") {
    display_groups = {"none": []};
    display_properties.forEach(function(properties) {
      display_groups["none"].push(properties);
    });
  }
  return display_groups;
}

function placeCharacterDisplays(display_groups: any, num_per_row: number) {
  var character_display_component = figma.getNodeById("3:908") as ComponentNode;
  var width = character_display_component.width;
  var height = character_display_component.height;
  var frame = figma.currentPage.selection[0] as FrameNode;

  var rows = 0;
  for (var group in display_groups) {
    rows += Math.ceil(display_groups[group].length/num_per_row);
  }
  
  // set the frame size to fit the groups.
  frame.resize(num_per_row * width, rows * height);

  // loop though each display and set position
  var curr_x = 0;
  var curr_y = 0;
  var index = frame.children.length-1;
  for (var group in display_groups) {
    if (display_groups[group].length == 0) continue;
    display_groups[group].forEach((element: any) => {
      var instance = figma.getNodeById(element["nodeId"]) as InstanceNode;
      // go to next line of out of frame.
      if (curr_x >= num_per_row * width) {
        curr_x = 0;
        curr_y += height;
      }
      instance.x = curr_x;
      instance.y = curr_y;
      curr_x += width;
      // set the layer location.
      frame.insertChild(index, instance);
      index--;
    });
    curr_x = 0;
    curr_y += height;
  }
}

export {createDisplay, updateDisplay, setCharacter, setLevel, setMagic, setMagia, setLocation, parametersValid, isCharacterDisplay, convertToCharacterDisplay, isCharacterDisplayInstance, sortDisplays};