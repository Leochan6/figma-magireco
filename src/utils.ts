// gets the names of all the Magical Girls in character_image frame and sorts them alphabetically.
function getNames() {
  var names = [];
  var character_image = figma.getNodeById("1:142") as FrameNode;
  character_image.children.forEach(function (child: ComponentNode) {
    var name = child.name;
    name = name.split("/")[1];
    if (names.indexOf(name) == -1) {
      names.push(name);
    }
  });
  names.sort();
  return names;
}

// gets the attribute and the available ranks for the Magical Girls name.
function getAttributeRanks(name: string) {
  var result = { attribute: "", ranks: [true, true, true, true, true] };
  var character_image = figma.getNodeById("1:142") as FrameNode;
  character_image.children.forEach(function (child: ComponentNode) {
    var child_name = child.name;
    var child_name_split = child_name.split("/");
    if (child_name_split[1] == name) {
      var description = JSON.parse(child.description);
      result.attribute = description["attribute"];
      var rank = description["rank"];
      result.ranks[rank - 1] = false;
    }
  });
  return result;
}

// get the character id of the name.
function getCharacterId(name: string) {
  var character_image = figma.getNodeById("1:142") as FrameNode;
  var result = "0"
  character_image.children.forEach(function (child: ComponentNode) {
    var child_name = child.name;
    var child_name_split = child_name.split("/");
    if (child_name_split[1] == name) {
      var description = JSON.parse(child.description);
      result = description["id"];
    }
  });
  return result;
}

// gets the properties of the current selection.
function getDisplayProperties(selection: InstanceNode) {
  var display_properties = {};
  var magia_instance = selection.children[0] as InstanceNode;
  var magic_instance = selection.children[1] as InstanceNode;
  var characted_base_instance = selection.children[2] as InstanceNode;
  var contents_group = characted_base_instance.children[0] as FrameNode;
  var level_text = selection.children[3] as TextNode;

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

  display_properties["id"] = JSON.parse(card_instance.masterComponent.description)["id"];

  display_properties["nodeId"] = selection.id;

  return display_properties;
}

function printFrameDisplays(selection: SceneNode) {
  if (selection.type == "FRAME") selection = selection as FrameNode;
  else return;
  selection.children.forEach(function (child: SceneNode) {
    if (child.type == "INSTANCE") child = child as InstanceNode;
    else return;
    if (child.masterComponent.name == "Character Display") {
      var display_properties = getDisplayProperties(child);
      console.log(display_properties);
    }
  });
}

function createComponentsFromChildren() {
  var frame = figma.currentPage.selection[0] as FrameNode;
  frame.children.forEach(function (element, i) {
    var component = figma.createComponent();
    component.appendChild(element);
    component.resize(element.width, element.height);
    component.x = element.x;
    component.y = element.y;
    element.x = 0;
    element.y = 0;
    component.name = element.name;
    frame.insertChild(i, component);
  });
}

function compareVersion(documentCharacters: string, expectedCharacters: string) {
  if (documentCharacters != expectedCharacters) {
    if (!documentCharacters.match(RegExp("Document Version: [0-9](.[0-9])*"))) {
      console.log("text modified");
      return 1;
    }
    var result = documentCharacters.match(RegExp("[0-9](.[0-9])*"));
    var expected = expectedCharacters.match(RegExp("[0-9](.[0-9])*"));
    // console.log(result, expected);
    // console.log(parseFloat(result[0]), parseFloat(expected[0]));
    if (parseFloat(result[0]) >= parseFloat(expected[0])) {
      // console.log("same or greater version");
      return 0;
    } else {
      console.log("different version");
      return 1;
    }
  } else {
    // console.log("same text");
    return 0;
  }
}

const defaultSettings = { "keep_open": true, "full_name": false };

async function getSettings() {
  var settings = defaultSettings;
  for (var setting in settings) {
    var value = await figma.clientStorage.getAsync(setting);
    if (value !== undefined) settings[setting] = value;
  }
  return settings;
}

async function saveSettings(settings: any) {
  for (var setting in settings) {
    await figma.clientStorage.setAsync(setting, settings[setting]);
  }
}

class ButtonOptionsModel {
  copy: boolean = false;
  update: boolean = false;
  convert: boolean = false;
  sort: boolean = false;
  update_background: boolean = false;
  resize_background: boolean = false;
  remove_background: boolean = false;

  constructor(init?: Partial<ButtonOptionsModel>) {
    Object.assign(this, init);
  }

  enabledDisableButtons() {
    if (this.copy) figma.ui.postMessage({ type: 'enable-element', name: "copy" });
    else figma.ui.postMessage({ type: 'disable-element', name: "copy" });
    if (this.update) figma.ui.postMessage({ type: 'enable-element', name: "update" });
    else figma.ui.postMessage({ type: 'disable-element', name: "update" });
    if (this.convert) figma.ui.postMessage({ type: 'enable-element', name: "convert" });
    else figma.ui.postMessage({ type: 'disable-element', name: "convert" });
    if (this.sort) figma.ui.postMessage({ type: 'enable-element', name: "sort" });
    else figma.ui.postMessage({ type: 'disable-element', name: "sort" });
    if (this.update_background) figma.ui.postMessage({ type: 'enable-element', name: "update_background" });
    else figma.ui.postMessage({ type: 'disable-element', name: "update_background" });
    if (this.resize_background) figma.ui.postMessage({ type: 'enable-element', name: "resize_background" });
    else figma.ui.postMessage({ type: 'disable-element', name: "resize_background" });
    if (this.remove_background) figma.ui.postMessage({ type: 'enable-element', name: "remove_background" });
    else figma.ui.postMessage({ type: 'disable-element', name: "remove_background" });
  }
}


/**
 * https://bytemaster.io/javascript-object-multi-property-sort
 * Function to be passed into array.sort() with a array storing the prop, direction, and isString.
 * let sortBy = [{
 *   prop:'grade',
 *   direction: -1,
 *   isString: false
 * },{
 *   prop:'lastName',
 *   direction: 1,
 *   isString: true
 * }];
 */
function sortArrayBy(a: any, b: any, sortBy: any[]) {
  let i = 0, result = 0;
  while (i < sortBy.length && result === 0) {
    if (sortBy[i].isString) result = sortBy[i].direction * (a[sortBy[i].prop].toString() < b[sortBy[i].prop].toString() ? -1 : (a[sortBy[i].prop].toString() > b[sortBy[i].prop].toString() ? 1 : 0));
    else result = sortBy[i].direction * (parseInt((a[sortBy[i].prop]).toString()) < parseInt((b[sortBy[i].prop]).toString()) ? -1 : (parseInt((a[sortBy[i].prop]).toString()) > parseInt((b[sortBy[i].prop]).toString()) ? 1 : 0));
    i++;
  }
  return result;
}

export { getNames, getAttributeRanks, getCharacterId, getDisplayProperties, compareVersion, getSettings, saveSettings, printFrameDisplays, createComponentsFromChildren, ButtonOptionsModel, sortArrayBy };