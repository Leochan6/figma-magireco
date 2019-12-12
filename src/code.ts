import {getNames, getAttributeRanks, getDisplayProperties, compareVersion, ButtonOptionsModel} from "./utils";
import {getBackgroundNames, isBackgroundInstance, updateBackground, setBackgroundSizeLocation, removeBackground } from "./background";
import {createDisplay, setLocation, updateDisplay, convertToCharacterDisplay, isCharacterDisplay, isCharacterDisplayInstance, sortDisplays} from "./character";


const documentVersion = "Document Version: 4";

// show the HTML page in "ui.html" and resize.
figma.showUI(__html__);
figma.ui.resize(400, 300);

// refresh the current selection.
var currentSelection = figma.currentPage.selection;
figma.currentPage.selection = [];
  setTimeout(() => {
    figma.currentPage.selection = currentSelection;
  },700);

// enable/disable buttons and update elements when the selection changes.
figma.on("selectionchange", () => {
  console.log(figma.currentPage.selection);

  if (figma.currentPage.selection.length == 1) {
    var selection = figma.currentPage.selection[0];
    // instance selected.
    if (selection.type == "INSTANCE") {
      // is a Character Display instances.
      if (isCharacterDisplayInstance(selection)) {
        var display_properties = getDisplayProperties(selection);
        figma.ui.postMessage({type: 'update-properties', display_properties:display_properties });
        var buttonOptions = new ButtonOptionsModel({"copy":true, "update":true});
        buttonOptions.enabledDisableButtons();
      } 

      // is a Background instance.
      else if (isBackgroundInstance(selection)) {
        var buttonOptions = new ButtonOptionsModel({"update_background":true, "resize_background":true, "remove_background":true});
        buttonOptions.enabledDisableButtons();
      }
    }
    
    // frame selected.
    else if (selection.type == "FRAME") {
      // is a single Character Display.
      if (isCharacterDisplay(selection)) {        
        var buttonOptions = new ButtonOptionsModel({"convert":true});
        buttonOptions.enabledDisableButtons();
      }

      // all children are frame and Character Display frames.
      else if (selection.children.length > 0 && selection.children.every(isCharacterDisplay)) {
        var buttonOptions = new ButtonOptionsModel({"convert":true});
        buttonOptions.enabledDisableButtons();
      }

      // all children are instances.
      else if (selection.children.every((child) => child.type == "INSTANCE")) {
        if (selection.children.every((child) => isCharacterDisplayInstance(child))) {
          var buttonOptions = new ButtonOptionsModel({"sort":true, "update_background":true});
          buttonOptions.enabledDisableButtons();
        }
        else if (selection.children.every((child) => isBackgroundInstance(child))) {
          var buttonOptions = new ButtonOptionsModel({"update_background":true, "resize_background":true, "remove_background":true});
          buttonOptions.enabledDisableButtons();
        }
        else if (selection.children.every((child) => isCharacterDisplayInstance(child) || isBackgroundInstance(child))) {
          var buttonOptions = new ButtonOptionsModel({"sort":true, "update_background":true, "resize_background":true, "remove_background":true});
          buttonOptions.enabledDisableButtons();
        }
      } 

      // unexpected frame contents.
      else {
        var buttonOptions = new ButtonOptionsModel();
        buttonOptions.enabledDisableButtons();
      }
    }

    // unexpected object selected.
    else {
      var buttonOptions = new ButtonOptionsModel();
      buttonOptions.enabledDisableButtons();
    }
  }

  // selection length not equal 1.
  else {
    // selection length greater than 1 and all are Character Display frames.
    if (figma.currentPage.selection.length > 1 && figma.currentPage.selection.every(isCharacterDisplay)) {
      figma.ui.postMessage({type: 'enable-element', name: "convert"});
    } 
    // anything else.
    else {
      var buttonOptions = new ButtonOptionsModel();
      buttonOptions.enabledDisableButtons();
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
      if (documentVersionText == null || documentVersionText.type != "TEXT" || compareVersion((documentVersionText as TextNode).characters, documentVersion)) {
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
    figma.ui.postMessage({type: 'update-attribute-rank', rank: result.ranks, attribute: result.attribute, copied:msg.copied });
  }

  // sort the Character Displays in the selected frame.
  else if (msg.type === 'sort-displays') {
    sortDisplays(msg.group_by, msg.group_dir, msg.sort_by_1, msg.sort_dir_1, msg.sort_by_2, msg.sort_dir_2, msg.sort_id_dir, msg.num_per_row);
  }

  // update the list of background names for the selected background type.
  else if (msg.type === 'background-change') {
    var background_type = msg.background_type;
    var background_names = getBackgroundNames(background_type);
    figma.ui.postMessage({type: 'update-background-names', background_names:background_names });
  }

  // create or update the background of the selected frame.
  else if (msg.type === 'update-background') {
    var background_type = msg.background_type;
    var background_name = msg.background_name;
    updateBackground(background_type, background_name);
  }

  // resize the background to fit the selected frame.
  else if (msg.type === 'resize-background') {
    setBackgroundSizeLocation();
  }

  // remove the background from the selected frame.
  else if (msg.type === 'remove-background') {
    removeBackground();
  }
  
  // close the plugin.
  else if (msg.type === 'cancel') {
    figma.closePlugin();
  }

};
