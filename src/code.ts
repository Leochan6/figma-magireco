import {getNames, getAttributeRanks, getCharacterId, getDisplayProperties, getBackgroundNames, isBackgroundInstance, updateBackground, setBackgroundSizeLocation, printFrameDisplays, sortArrayBy} from "./utils";
import {createDisplay, setLocation, updateDisplay, isCharacterDisplay, convertToCharacterDisplay, isCharacterDisplayInstance, sortDisplays} from "./character";

const documentVersion = "Document Version: 4";

// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.resize(400, 300);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.


figma.on("selectionchange", () => {
  console.log(figma.currentPage.selection);

  if (figma.currentPage.selection.length == 1) {
    var selection = figma.currentPage.selection[0];
    if (selection.type == "INSTANCE") {
      // enable copy and update buttons
      if (isCharacterDisplayInstance(selection)) {
        var display_properties = getDisplayProperties(selection);
        // console.log(JSON.stringify(display_properties))
        figma.ui.postMessage({type: 'update-properties', display_properties:display_properties });
        figma.ui.postMessage({type: 'enable-element', name: "copy"});
        figma.ui.postMessage({type: 'enable-element', name: "update"});
      } 
      figma.ui.postMessage({type: 'disable-element', name: "convert"});
      figma.ui.postMessage({type: 'disable-element', name: "sort"});
      figma.ui.postMessage({type: 'disable-element', name: "update_background"});
      figma.ui.postMessage({type: 'disable-element', name: "resize_background"});
    }

    // frame selected and is a single Character Display.
    else if (selection.type == "FRAME" && isCharacterDisplay(selection)) {
      figma.ui.postMessage({type: 'enable-element', name: "convert"});
      figma.ui.postMessage({type: 'disable-element', name: "copy"});
      figma.ui.postMessage({type: 'disable-element', name: "update"});
      figma.ui.postMessage({type: 'disable-element', name: "sort"});
      figma.ui.postMessage({type: 'disable-element', name: "update_background"});
      figma.ui.postMessage({type: 'disable-element', name: "resize_background"});
    }

    // frame selected and all children are frame and Character Displays.
    else if (selection.type == "FRAME" && selection.children.every(isCharacterDisplay)) {
      figma.ui.postMessage({type: 'enable-element', name: "convert"});
      figma.ui.postMessage({type: 'disable-element', name: "copy"});
      figma.ui.postMessage({type: 'disable-element', name: "update"});
      figma.ui.postMessage({type: 'disable-element', name: "sort"});
      figma.ui.postMessage({type: 'disable-element', name: "update_background"});
      figma.ui.postMessage({type: 'disable-element', name: "resize_background"});
    }

    // frame selected and all children are Character Displays instances.
    else if (selection.type == "FRAME" && 
      selection.children.every((child) => child.type == "INSTANCE") &&
      selection.children.every((child) => isCharacterDisplayInstance(child) || isBackgroundInstance(child))) {
      figma.ui.postMessage({type: 'enable-element', name: "sort"});
      figma.ui.postMessage({type: 'enable-element', name: "update_background"});
      if (selection.children.some((child) => isBackgroundInstance(child))) {
        figma.ui.postMessage({type: 'enable-element', name: "resize_background"});
      }
    }

    else if (selection.type == "FRAME" || selection.type == "GROUP") {
      // disable copy, update, convert buttons.
      figma.ui.postMessage({type: 'disable-element', name: "copy"});
      figma.ui.postMessage({type: 'disable-element', name: "update"});
      figma.ui.postMessage({type: 'disable-element', name: "convert"});
      figma.ui.postMessage({type: 'disable-element', name: "sort"});
      figma.ui.postMessage({type: 'disable-element', name: "update_background"});
      figma.ui.postMessage({type: 'disable-element', name: "resize_background"});
    }
  }

  // disable copy, update and sort buttons  
  else {
    if (figma.currentPage.selection.length > 1 && figma.currentPage.selection.every(isCharacterDisplay)) {
      figma.ui.postMessage({type: 'enable-element', name: "convert"});
    } else {
      figma.ui.postMessage({type: 'disable-element', name: "copy"});
      figma.ui.postMessage({type: 'disable-element', name: "update"});
      figma.ui.postMessage({type: 'disable-element', name: "convert"});
      figma.ui.postMessage({type: 'disable-element', name: "sort"});
      figma.ui.postMessage({type: 'disable-element', name: "update_background"});
      figma.ui.postMessage({type: 'disable-element', name: "resize_background"});
    }
  }
});

figma.ui.onmessage = msg => {
  
  // startup to check if in expected file
  if (msg.type === 'startup') {
    if (figma.getNodeById("3:908") === null || figma.getNodeById("3:908").name != "Character Display") {
      var message = "The current file is not 'Magia Record Character Grids'.";
      figma.notify(message, {timeout: 5000});
      message = "Please duplicate and open the Figma Project linked in the plugin page before using this plugin.";
      figma.notify(message, {timeout: 5000});
      figma.closePlugin();
    }
    else {
      // check the version of the project file.
      var documentVersionText = figma.getNodeById("474:5384");
      if (documentVersionText == null || documentVersionText.type != "TEXT" || (documentVersionText as TextNode).characters != documentVersion) {
        if (documentVersionText != null && documentVersionText.type == "TEXT") {
          console.log("Expected: " + documentVersion + " Found: " + (documentVersionText as TextNode).characters);
        }
        message = "The current project is outdated and some plugin features may not work.";
        figma.notify(message, {timeout: 5000});
        message = "Please reduplicate the project.";
        figma.notify(message, {timeout: 5000});
      }
      figma.loadFontAsync({ family: "Roboto", style: "Regular" }).then(() => {
        // get the names and set the name select fields.
        var names = getNames();
        figma.ui.postMessage({type: 'update-names', names:names });
        var background_names = getBackgroundNames("Home Screen");
        figma.ui.postMessage({type: 'update-background-names', background_names:background_names });
      });
    }
  }
  
  // create a new Character Display with the inputted fields.
  else if (msg.type === 'create-display') {
    var instance = createDisplay(msg) as InstanceNode;
    if (instance !== null) {
      setLocation(instance);
    }
  }

  // update the selected Character Display with the inputted fields.
  else if (msg.type === 'update-display') {
    updateDisplay(figma.currentPage.selection[0] as InstanceNode, msg);
  }

  // convert the selected frame(s) to Character Displays.
  else if (msg.type === 'convert-selection') {
    convertToCharacterDisplay(figma.currentPage.selection as FrameNode[]);
  }

  // get the attribute and avaliable ranks for the name
  else if (msg.type === 'name-change') {
    var result = getAttributeRanks(msg.name);
    figma.ui.postMessage({type: 'update-attribute-rank', rank: result.ranks, attribute: result.attribute, tab:msg.tab, copied:msg.copied });
  }

  else if (msg.type === 'sort-displays') {
    var group_by = msg.group_by;
    var sort_by = msg.sort_by;
    var sort_dir = msg.sort_dir;
    var sort_id_dir = msg.sort_id_dir;
    var num_per_row = msg.num_per_row;
    sortDisplays(group_by, sort_by, sort_dir, sort_id_dir, num_per_row);
  }

  else if (msg.type === 'background-change') {
    var background_type = msg.background_type;
    var background_names = getBackgroundNames(background_type);
    figma.ui.postMessage({type: 'update-background-names', background_names:background_names });
  }

  else if (msg.type === 'update-background') {
    var background_type = msg.background_type;
    var background_name = msg.background_name;
    updateBackground(background_type, background_name);
  }

  else if (msg.type === 'resize-background') {
    setBackgroundSizeLocation();
  }
  
  // close the plugin.
  else if (msg.type === 'cancel') {
    figma.closePlugin();
  }

};
