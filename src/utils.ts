// gets the names of all the Magical Girls in character_image frame and sorts them alphabetically.
function getNames () {
  var names = [];
  var character_image = figma.getNodeById("1:142") as FrameNode;
  character_image.children.forEach(function(child: ComponentNode) {
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
function getAttributeRanks (name: string) {
  var result = {attribute:"",ranks:[true,true,true,true,true]};
  var character_image = figma.getNodeById("1:142") as FrameNode;
  character_image.children.forEach(function(child: ComponentNode) {
    var child_name = child.name;
    var child_name_split = child_name.split("/");
    if (child_name_split[1] == name) {
      var description = JSON.parse(child.description);
      result.attribute = description["attribute"];
      var rank = parseInt(child_name_split[2].split(" ")[1], 10);
      result.ranks[rank-1] = false;
    }
  });
  return result;
}

function getCharacterId (name: string) {
  var character_image = figma.getNodeById("1:142") as FrameNode;
  var result = "0"
  character_image.children.forEach(function(child: ComponentNode) {
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
function getDisplayProperties (selection: InstanceNode) {
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

// gets the background names for the selected background type.
function getBackgroundNames(type: string) {
  var names = [];
  var background_frame: ComponentNode;
  if      (type == "Home Screen")      background_frame = figma.getNodeById("16:5638") as ComponentNode;
  else if (type == "Web Backgrounds")  background_frame = figma.getNodeById("373:3335") as ComponentNode;
  else if (type == "Story Backgrounds") background_frame = figma.getNodeById("16:5647") as ComponentNode;
  background_frame.children.forEach(function(child: ComponentNode) {
    var name = child.name;
    if (names.indexOf(name) == -1) {
      names.push(name);
    }
  });
  names.sort();
  return names;
}

// check if the Frame Node is an Instance Node and is an instance of Background.
function isBackgroundInstance(node: SceneNode) {
  if (node.type == "INSTANCE" && (
    node.masterComponent.parent.name == "Home Screen" ||
    node.masterComponent.parent.name == "Web Backgrounds" ||
    node.masterComponent.parent.name == "Story Backgrounds")) return true;
  else return false;
}

// update the selected frame with the selected background name.
function updateBackground(type: string, name: string) {
  var background_frame: ComponentNode;
  if      (type == "Home Screen")      background_frame = figma.getNodeById("16:5638") as ComponentNode;
  else if (type == "Web Backgrounds")  background_frame = figma.getNodeById("373:3335") as ComponentNode;
  else if (type == "Story Backgrounds") background_frame = figma.getNodeById("16:5647") as ComponentNode;
  var background_id: string;
  // search for component id.
  background_frame.children.forEach(function(child: ComponentNode) {
    if (child.name == name) {
      background_id = child.id;
      return;
    }
  });
  var background_component = figma.getNodeById(background_id) as ComponentNode;
  var selection = figma.currentPage.selection[0] as FrameNode;
  var background_instance: InstanceNode = null;
  // search if an background instance exists.
  selection.children.forEach(function(child) {
    if (isBackgroundInstance(child)) background_instance = child as InstanceNode;
  });
  // a background already exists.
  if (background_instance != null) {
    background_instance.masterComponent = background_component
  } else {
    // create new background instance.
    background_instance = background_component.createInstance();
    selection.insertChild(0, background_instance);
  }
  setBackgroundSizeLocation();
}

// resize and moved the background to fit the currently selected frame.
function setBackgroundSizeLocation() {
  var background_instance: InstanceNode = null;
  var selection = figma.currentPage.selection[0] as FrameNode;
  // search if an background instance exists.
  selection.children.forEach(function(child) {
    if (isBackgroundInstance(child)) background_instance = child as InstanceNode;
    return;
  });
  // reset size of background to master component.
  var master_component = background_instance.masterComponent;
  background_instance.resize(master_component.width, master_component.height);
  // resize background instance.
  if (background_instance.height < selection.height && background_instance.width > selection.width) {
    var new_width = background_instance.width*selection.height/background_instance.height;
    background_instance.resize(new_width, selection.height);
  }
  else if (background_instance.width < selection.width && background_instance.height > selection.height) {
    var new_height = background_instance.height*selection.width/background_instance.width;
    background_instance.resize(selection.width, new_height);
  }
  else {
    var width_ratio = selection.width/background_instance.width
    var height_ratio = selection.height/background_instance.height;
    var new_width = background_instance.width*height_ratio;
    var new_height = background_instance.height*width_ratio;
    if (width_ratio > height_ratio) background_instance.resize(selection.width, new_height);
    else background_instance.resize(new_width, selection.height);
  }
  // move background instance align center.
  var new_x = selection.width/2 - background_instance.width/2;
  var new_y = selection.height/2 - background_instance.height/2;
  background_instance.x = new_x;
  background_instance.y = new_y;
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
      if (sortBy[i].isString) result = sortBy[i].direction*(a[sortBy[i].prop].toString() < b[sortBy[i].prop].toString() ? -1 : (a[sortBy[i].prop].toString() > b[sortBy[i].prop].toString() ? 1 : 0));
      else result = sortBy[i].direction*(parseInt((a[sortBy[i].prop]).toString()) < parseInt((b[sortBy[i].prop]).toString()) ? -1 : (parseInt((a[sortBy[i].prop]).toString()) > parseInt((b[sortBy[i].prop]).toString()) ? 1 : 0));
      i++;
    }
  return result;
}

export {getNames, getAttributeRanks, getCharacterId, getDisplayProperties, getBackgroundNames, isBackgroundInstance, updateBackground, setBackgroundSizeLocation, printFrameDisplays, sortArrayBy};