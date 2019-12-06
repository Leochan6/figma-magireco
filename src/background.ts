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
  var background_frame: ComponentNode = null;
  if      (type == "Home Screen")      background_frame = figma.getNodeById("16:5638") as ComponentNode;
  else if (type == "Web Backgrounds")  background_frame = figma.getNodeById("373:3335") as ComponentNode;
  else if (type == "Story Backgrounds") background_frame = figma.getNodeById("16:5647") as ComponentNode;
  if (background_frame == null) {
    figma.notify("That background is invalid or backgrounds not found in document.", {timeout: 10000});
    return;
  }
  var background_id: string;
  // search for component id.
  background_frame.children.forEach(function(child: ComponentNode) {
    if (child.name == name) {
      background_id = child.id;
      return;
    }
  });
  var background_component = figma.getNodeById(background_id) as ComponentNode;
  var selection = figma.currentPage.selection[0] as SceneNode;
  var background_instance: InstanceNode = null;
  // if current selection is the frame.
  if (selection.type == "FRAME") {
    // search if an background instance exists.
    selection.children.forEach(function(child) {
      if (isBackgroundInstance(child)) background_instance = child as InstanceNode;
      return;
    });
    // a background already exists.
    if (background_instance != null) {
      background_instance.masterComponent = background_component
    } else {
      // create new background instance.
      background_instance = background_component.createInstance();
      selection.insertChild(0, background_instance);
    }
  } 
  // if the current selection is the background instance.
  else if (selection.type == "INSTANCE") {
    background_instance = selection;
    background_instance.masterComponent = background_component
  }
  setBackgroundSizeLocation();
  figma.currentPage.selection = [];
  setTimeout(() => {
    figma.currentPage.selection = [selection];
  },100);
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

// remove the background instance from the frame.
function removeBackground() {
  var background_instance: InstanceNode = null;
  var selection = figma.currentPage.selection[0];
  if (selection.type == "FRAME") {
    // search if an background instance exists.
    selection.children.forEach(function(child) {
      if (isBackgroundInstance(child)) background_instance = child as InstanceNode;
      return;
    });
  } else if (selection.type == "INSTANCE") {
    background_instance = selection;
  }
  var parent = background_instance.parent as SceneNode;
  background_instance.remove();
  figma.currentPage.selection = [];
  setTimeout(() => {
    figma.currentPage.selection = [parent];
  },100);
}

export {getBackgroundNames, isBackgroundInstance, updateBackground, setBackgroundSizeLocation, removeBackground};