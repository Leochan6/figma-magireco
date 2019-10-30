import {getNames, getAttributeRanks, getCharacterId, getDisplayProperties, selectionSame, selectionEquals, sortArrayBy} from "./utils";
import {setCharacter, setLevel, setMagic, setMagia, parametersValid, createDisplay, setLocation, updateDisplay} from "./character";

// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.resize(500, 500);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.

// The default sorting order.
var sortBy = [{  prop:'level',     direction: -1,   isString: false },
              {  prop:'rank',      direction:  1,   isString: false },
              {  prop:'attribute', direction:  1,   isString: true  },
              {  prop:'id',        direction:  1,   isString: false }];

var table_data = [];



figma.on("selectionchange", () => {
  console.log(figma.currentPage.selection);

  if (figma.currentPage.selection.length == 1) {
    var selection = figma.currentPage.selection[0];
    if (selection.type == "INSTANCE") {
      // enable copy and update buttons
      if (selection.masterComponent.name == "Character Display") {
        var display_properties = getDisplayProperties(selection);
        // console.log(JSON.stringify(display_properties))
        figma.ui.postMessage({type: 'update-properties', display_properties:display_properties });
        figma.ui.postMessage({type: 'enable-element', name: "copy"});
        figma.ui.postMessage({type: 'enable-element', name: "update"});
        figma.ui.postMessage({type: 'disable-element', name: "sort"});
      }
    }
    else if (selection.type == "FRAME" || selection.type == "GROUP") {
      // enable sort buttons and disable copy and update buttons.
      var frame = selection;
      var all_character_display = true;
      frame.children.forEach((child) => {
        if (child.type != "INSTANCE" || child.masterComponent.name != "Character Display") {
          all_character_display = false;
        }
      });
      if (all_character_display) figma.ui.postMessage({type: 'enable-element', name: "sort"});
      figma.ui.postMessage({type: 'disable-element', name: "copy"});
      figma.ui.postMessage({type: 'disable-element', name: "update"});
    }
  }

  // disable copy, update and sort buttons
  if (figma.currentPage.selection.length != 1) {
    figma.ui.postMessage({type: 'disable-element', name: "copy"});
    figma.ui.postMessage({type: 'disable-element', name: "update"});
    figma.ui.postMessage({type: 'disable-element', name: "sort"});
  }
});

figma.ui.onmessage = msg => {
  
  // startup to check if in expected file
  if (msg.type === 'startup') {
    if (figma.getNodeById("3:908") === null || figma.getNodeById("3:908").name != "Character Display") {
      var message = "The current file is not 'Magia Record Character Grids'. Please duplicate and open the Figma Project as indicated in the plugin page before using this plugin.";
      alert(message);
      figma.closePlugin(message);
    }
    else {
      figma.loadFontAsync({ family: "Roboto", style: "Regular" }).then(() => {
        // get the names and set the name select fields.
        var names = getNames();
        figma.ui.postMessage({type: 'update-names', names:names, elementId:"name" });
        figma.ui.postMessage({type: 'update-names', names:names, elementId:"create_list_name" });
      });
    }
  }
  
  else if (msg.type === 'create-display') {
    var instance = createDisplay(msg) as InstanceNode;
    if (instance !== null) {
      setLocation(instance);
    }
  }

  else if (msg.type === 'update-display') {
    updateDisplay(figma.currentPage.selection[0] as InstanceNode, msg);
  }

  else if (msg.type === 'table-get-id') {
    var row_data = msg.row_data;
    row_data["id"] = getCharacterId(row_data.name);
    table_data.push(row_data);
    figma.ui.postMessage({type: 'table-add-row', row_data:row_data });
  }

  else if (msg.type === 'table-data-remove-row') {
    var row_data = table_data.pop();
    var row_index = table_data.length;
    figma.ui.postMessage({type: 'table-remove-row', row_data:row_data, row_index:row_index });
  }

  // get the attribute and avaliable ranks for the name
  else if (msg.type === 'name-change') {
    var result = getAttributeRanks(msg.name);
    figma.ui.postMessage({type: 'update-attribute-rank', rank: result.ranks, attribute: result.attribute, tab:msg.tab });
  }

  else if (msg.type === 'sort-displays') {
    var sortOrder = msg.sortBy;
    console.log(sortOrder);
  }

  // create a new frame with the contents of the list.
  else if (msg.type === 'table-to-list') {
    
  }
  
  // close the plugin.
  else if (msg.type === 'cancel') {
    figma.closePlugin();
  }

};
