import {getNames, getAttributeRanks, getDisplayProperties, selectionSame, sortArrayBy} from "./utils";
import {setCharacter, setLevel, setMagic, setMagia} from "./character";

// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.resize(500, 600);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.


var sortBy = [{  prop:'level',     direction: -1,   isString: false },
              {  prop:'rank',      direction:  1,   isString: false },
              {  prop:'attribute', direction:  1,   isString: true  },
              {  prop:'id',        direction:  1,   isString: false }];

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

    if (!selectionSame(new_selections_array, selections_array)) {
      if (new_selections_array.length > 0) {
        console.log(new_selections_array);
      }
      selections_array = new_selections_array;

      
      if (selections_array.length == 1) {
        // enable copy and update buttons
        if (selections_array[0].masterComponentName == "Character Display") {
          var display_properties = getDisplayProperties(selections_array[0]);
          // console.log(JSON.stringify(display_properties))
          figma.ui.postMessage({type: 'update-properties', display_properties:display_properties });
          figma.ui.postMessage({type: 'enable-element', name: "copy"});
          figma.ui.postMessage({type: 'enable-element', name: "update"});
        } 
        // enable sort buttons
        else if (selections_array[0].type == "FRAME" || selections_array[0].type == "GROUP") {
          var frame = figma.getNodeById(selections_array[0].id) as FrameNode;
          var all_character_display = true;
          frame.children.forEach((child: InstanceNode) => {
            if (child.masterComponent.name != "Character Display") {
              all_character_display = false;
            }
          });
          if (all_character_display) {
            console.log('frame');
            figma.ui.postMessage({type: 'enable-element', name: "sort"});
          }
        }
      }

      // disable copy and update buttons
      if (selections_array.length != 1) {
        figma.ui.postMessage({type: 'disable-element', name: "copy"});
        figma.ui.postMessage({type: 'disable-element', name: "update"});
        figma.ui.postMessage({type: 'disable-element', name: "sort"});
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

  else if (msg.type === 'update-display') {
    var selections = figma.currentPage.selection;
    if (selections.length == 1) {
      var valid = parametersValid(msg);
      if (valid.name_valid && valid.attribute_valid && valid.rank_valid && valid.level_valid && valid.magic_valid && valid.magia_valid && valid.episode_valid) {
        var character_display = figma.getNodeById("3:908") as ComponentNode;
        var instance = character_display.createInstance();
        instance.name = "Character Display/" + msg.name;
        var full_name = instance.name + " - Rank " + msg.rank + " - Level " + msg.level + " - Magic " + msg.magic + " - Magia " +  msg.magia + " - Epsiode " + msg.episode;
        if (msg.full_name) instance.name = full_name;

        // replace display as a child of the current selection.
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
            figma.loadFontAsync({ family: "Roboto", style: "Regular" }).then(() => {
              setCharacter(instance, msg.name, msg.attribute, msg.rank, valid.component_id);
              setLevel(instance, msg.level);
              setMagic(instance, msg.magic);
              setMagia(instance, msg.magia, msg.episode);
              console.log("Created: " + instance.name);
            });
          }
        }
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
    } else {
      // send problem message to dialog for no display selected.
      figma.ui.postMessage({type: 'update-problems', message:"One Character Display must be selected to update." });
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

  else if (msg.type === 'sort-displays') {
    var sortOrder = msg.sortBy;
    console.log(sortOrder);
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
  return result;
}
