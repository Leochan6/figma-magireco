// swaps instances for the character's image card, frame, stars, attribute, and background.
function setCharacter (instance: InstanceNode, name: string, attribute: string, rank: string, component_id: string) {
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

export {setCharacter, setLevel, setMagic, setMagia};