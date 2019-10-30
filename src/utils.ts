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

  return display_properties;
}

function selectionSame(x, y) {
  var selectionAreSame = true;
  if (x.length != y.length) return false;
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


// Checks if the two input are equal.
function selectionEquals (x, y) {

  // if both x and y are null or undefined and exactly the same
  if (x === y) return true;

  // if they are not strictly equal, they both need to be Objects
  if (!(x instanceof Object) || !(y instanceof Object)) return false;

  // they must have the exact same prototype chain, the closest we can do is
  // test there constructor.
  if (x.constructor !== y.constructor) return false;

  if (x.hasOwnProperty("length") && x.hasOwnProperty("length") && x.length != y.length) {
    return false;
  }
    // they both have the length property but not the same.

  for (var p in x) {
    // other properties were tested using x.constructor === y.constructor
    if (!x.hasOwnProperty(p)) continue;

    // allows to compare x[ p ] and y[ p ] when set to undefined
    if (!y.hasOwnProperty(p)) {
      return false;
    }

    // if they have the same strict value or identity then they are equal
    if (x[p] === y[p]) continue;

    // Numbers, Strings, Functions, Booleans must be strictly equal
    if (typeof(x[p]) !== "object") return false;

    // Objects and Arrays must be tested recursively
    if (!selectionEquals(x[p],  y[p])) return false;
  }

  for (p in y) {
    // allows x[ p ] to be set to undefined
    if (y.hasOwnProperty(p) && ! x.hasOwnProperty(p)) return false;
  }
  return true;
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
function sortArrayBy(a, b, sortBy) {
  let i = 0, result = 0;
    while (i < sortBy.length && result === 0) {
      if (sortBy[i].isString) result = sortBy[i].direction*(a[sortBy[i].prop].toString() < b[sortBy[i].prop].toString() ? -1 : (a[sortBy[i].prop].toString() > b[sortBy[i].prop].toString() ? 1 : 0));
      else result = sortBy[i].direction*(parseInt((a[sortBy[i].prop]).toString()) < parseInt((b[sortBy[i].prop]).toString()) ? -1 : (parseInt((a[sortBy[i].prop]).toString()) > parseInt((b[sortBy[i].prop]).toString()) ? 1 : 0));
      i++;
    }
  return result;
}

export {getNames, getAttributeRanks, getCharacterId, getDisplayProperties, selectionSame, selectionEquals, sortArrayBy};