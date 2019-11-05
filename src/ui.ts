import './ui.css'
import {getCharacterId, getDisplayProperties} from "./utils";



var display_properties = {name:'', attribute:'', rank:'', level:'', magic:'', magia:'', episode:'', keep_open:true, full_name:false};

const ui = {
  tab_bar: {
    tab_bar:                document.getElementById('tab_bar') as HTMLDivElement,
    hometabbtn:             document.getElementById('home_btn') as HTMLButtonElement,
    sorttabbtn:             document.getElementById('sort_btn') as HTMLButtonElement,
    settingstabbtn:         document.getElementById('settings_btn') as HTMLButtonElement,
  },
  tabs: {
    home_tab:               document.getElementById('home_tab') as HTMLDivElement,
    home: {
      fields: {
        name_select:        document.getElementById('name') as HTMLSelectElement,
        attribute_select:   document.getElementById('attribute') as HTMLSelectElement,
        rank_select:        document.getElementById('rank') as HTMLSelectElement,
        level_field:        document.getElementById('level') as HTMLInputElement,
        magic_select:       document.getElementById('magic') as HTMLSelectElement,
        magia_select:       document.getElementById('magia') as HTMLSelectElement,
        episode_select:     document.getElementById('episode') as HTMLSelectElement,
      },
      buttons: {
        create_button:      document.getElementById('create') as HTMLButtonElement,
        cancel_button:      document.getElementById('cancel') as HTMLButtonElement,
        update_button:      document.getElementById('update') as HTMLButtonElement,
        copy_button:        document.getElementById('copy') as HTMLButtonElement,
      },
    },
    sorting_tab:            document.getElementById('sorting_tab') as HTMLDivElement,
    sorting: {
      sort_by_1_select:     document.getElementById('sort_by_1_select') as HTMLSelectElement,
      sort_by_2_select:     document.getElementById('sort_by_2_select') as HTMLSelectElement,
      sort_order_1_select:  document.getElementById('sort_order_1_select') as HTMLSelectElement,
      sort_order_2_select:  document.getElementById('sort_order_2_select') as HTMLSelectElement,
    },
    create_list_tab:        document.getElementById('create_list_tab') as HTMLDivElement,
    create_list: {
      fields: {
        name_select:        document.getElementById('create_list_name') as HTMLSelectElement,
        attribute_select:   document.getElementById('create_list_attribute') as HTMLSelectElement,
        rank_select:        document.getElementById('create_list_rank') as HTMLSelectElement,
        level_field:        document.getElementById('create_list_level') as HTMLInputElement,
        magic_select:       document.getElementById('create_list_magic') as HTMLSelectElement,
        magia_select:       document.getElementById('create_list_magia') as HTMLSelectElement,
        episode_select:     document.getElementById('create_list_episode') as HTMLSelectElement,
      },
      fields2: {
        list_name_field:    document.getElementById('create_list_name') as HTMLInputElement,
        list_rows_field:    document.getElementById('create_list_rows') as HTMLInputElement,
        list_cols_field:    document.getElementById('create_list_cols') as HTMLInputElement,
      },
      buttons: {
        add_button:         document.getElementById('create_list_add') as HTMLButtonElement,
        remove_button:      document.getElementById('create_list_remove') as HTMLButtonElement,
        copy_button:        document.getElementById('create_list_copy') as HTMLButtonElement,
      },
      table: {
        table:              document.getElementById('create_list_data_table') as HTMLTableElement,
      }
    },
    settings_tab:           document.getElementById('settings_tab') as HTMLDivElement,
    settings: {
      keep_open_checkbox:   document.getElementById('keep_open') as HTMLInputElement,
      full_name_checkbox:   document.getElementById('full_name') as HTMLInputElement,
    },
  }
}

// Startup command to check correct file
parent.postMessage({ pluginMessage: { type: 'startup'}}, '*');

// Update the fields corresponding to the newly selected name.
ui.tabs.home.fields.name_select.onchange = () => {
  const name = ui.tabs.home.fields.name_select.value;
  parent.postMessage({ pluginMessage: { type: 'name-change', name:name, tab:"home", copied:false } }, '*')
}

// Update the fields corresponding to the newly selected name.
ui.tabs.create_list.fields.name_select.onchange = () => {
  const name = ui.tabs.create_list.fields.name_select.value;
  parent.postMessage({ pluginMessage: { type: 'name-change', name:name, tab:"create_list" } }, '*')
}

// Open the Home Tab.
document.getElementById('home_btn').onclick = () => {
  openTab(event,'home_tab');
}

// Open the Sorting Tab.
document.getElementById('sorting_btn').onclick = () => {
  openTab(event,'sorting_tab');
}

// Open the Create List Tab.
document.getElementById('create_list_btn').onclick = () => {
  openTab(event,'create_list_tab');
}

// Open the Settings Tab.
document.getElementById('settings_btn').onclick = () => {
  openTab(event,'settings_tab');
}

// Change the level_field attributes based on the selected rank_select value.
document.getElementById('rank').onchange = () => {
  const rank = parseInt(ui.tabs.home.fields.rank_select.value,10);
  const level_field = ui.tabs.home.fields.level_field;
  if (rank == 1) {
    level_field.max = '40';
    if (parseInt(level_field.value) > 40) level_field.value = '40';
  }
  else if (rank == 2) {
    level_field.max = '50';
    if (parseInt(level_field.value) > 50) level_field.value = '50';
  }
  else if (rank == 3) {
    level_field.max = '60';
    if (parseInt(level_field.value) > 60) level_field.value = '60';
  }
  else if (rank == 4) {
    level_field.max = '80';
    if (parseInt(level_field.value) > 80) level_field.value = '80';
  }
  else if (rank == 5) {
    level_field.max = '100';
  }
}

// Create a new Character Display.
document.getElementById('create').onclick = () => {
  const name = ui.tabs.home.fields.name_select.value;
  const attribute = ui.tabs.home.fields.attribute_select.value;
  const rank = ui.tabs.home.fields.rank_select.value;
  const level = ui.tabs.home.fields.level_field.value;
  const magic = ui.tabs.home.fields.magic_select.value;
  const magia = ui.tabs.home.fields.magia_select.value;
  const episode = ui.tabs.home.fields.episode_select.value;
  const full_name = ui.tabs.settings.full_name_checkbox.checked;
  const keep_open = ui.tabs.settings.keep_open_checkbox.checked;
  parent.postMessage({ pluginMessage: { type: 'create-display', name, attribute, rank, level, magic, magia, episode, full_name, keep_open } }, '*')
}

// Cancel button pressed, stop plugin.
document.getElementById('cancel').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
}

// Set the fields with the values in display_properties.
document.getElementById('copy').onclick = () => {
  ui.tabs.home.fields.name_select.value = display_properties.name;
  enableAllOptions();
  parent.postMessage({ pluginMessage: { type: 'name-change', name:display_properties.name, tab:"home", copied:true } }, '*')
}

// Replace the selected Character Display with a new one.
document.getElementById('update').onclick = () => {
  const name = ui.tabs.home.fields.name_select.value;
  const attribute = ui.tabs.home.fields.attribute_select.value;
  const rank = ui.tabs.home.fields.rank_select.value;
  const level = ui.tabs.home.fields.level_field.value;
  const magic = ui.tabs.home.fields.magic_select.value;
  const magia = ui.tabs.home.fields.magia_select.value;
  const episode = ui.tabs.home.fields.episode_select.value;
  const full_name = ui.tabs.settings.full_name_checkbox.checked;
  const keep_open = ui.tabs.settings.keep_open_checkbox.checked;
  parent.postMessage({ pluginMessage: { type: 'update-display', name, attribute, rank, level, magic, magia, episode, full_name, keep_open } }, '*')
}
const data = [
  '{"name":"Kyoko Sakura","attribute":"Fire","rank":"5","level":"100","magic":"0","magia":"5","episode":"5","id":"2004"}',
  '{"name":"Yachiyo Nanami","attribute":"Water","rank":"5","level":"100","magic":"3","magia":"5","episode":"5","id":"1002"}',
  '{"name":"Iroha Tamaki","attribute":"Light","rank":"4","level":"80","magic":"3","magia":"5","episode":"5","id":"1001"}'];



const table_header = {name:0,attribute:1,rank:2,level:3,magic:4,magia:5,episode:6,id:7};

// Create a new Character Display.
document.getElementById('create_list_add').onclick = () => {
  var row_data = {
    name: ui.tabs.create_list.fields.name_select.value,
    attribute: ui.tabs.create_list.fields.attribute_select.value,
    rank: ui.tabs.create_list.fields.rank_select.value,
    level: ui.tabs.create_list.fields.level_field.value,
    magic: ui.tabs.create_list.fields.magic_select.value,
    magia: ui.tabs.create_list.fields.magia_select.value,
    episode: ui.tabs.create_list.fields.episode_select.value,
  }
  parent.postMessage({ pluginMessage: { type: 'table-get-id', row_data: row_data } }, '*')
}

// Remove the last row.
document.getElementById('create_list_remove').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'table-data-remove-row' } }, '*')
}


// Set the fields of create list with the values in display_properties.
document.getElementById('create_list_copy').onclick = () => {
  ui.tabs.create_list.fields.name_select.value = display_properties.name;
  ui.tabs.create_list.fields.attribute_select.value = display_properties.attribute;
  ui.tabs.create_list.fields.rank_select.value = display_properties.rank;
  ui.tabs.create_list.fields.level_field.value = display_properties.level;
  ui.tabs.create_list.fields.magic_select.value = display_properties.magic;
  ui.tabs.create_list.fields.magia_select.value = display_properties.magia;
  ui.tabs.create_list.fields.episode_select.value = display_properties.episode;
}

// Create a new Character Display List.
document.getElementById('create_list_create').onclick = () => {
  var list_name = ui.tabs.create_list.fields2.list_name_field.value;
  var list_rows = ui.tabs.create_list.fields2.list_rows_field.value;
  var list_cols = ui.tabs.create_list.fields2.list_cols_field.value;
  parent.postMessage({ pluginMessage: { type: 'table-to-list', list_name:list_name, list_rows:list_rows, list_cols:list_cols} }, '*')
}

// Constants for if fields are stings.
const fieldIsString = {name:true,attribute:true,rank:false,level:false,magic:false,magia:false,episode:false,id:false};

// Get the selected sorting order and sort the Characted Displays in the selected frame.
document.getElementById('sort').onclick = () => {
  var sortBy = [];
  var sort_1_prop = ui.tabs.sorting.sort_by_1_select.value.toLocaleLowerCase();
  var sortBy1 = {
    prop:sort_1_prop,
    direction: parseInt(ui.tabs.sorting.sort_order_1_select.value),
    isString: fieldIsString[sort_1_prop]};
    var sort_2_prop = ui.tabs.sorting.sort_by_2_select.value.toLocaleLowerCase();
  var sortBy2 = {
    prop:sort_2_prop,
    direction: parseInt(ui.tabs.sorting.sort_order_2_select.value),
    isString: fieldIsString[sort_2_prop]};
  sortBy.push(sortBy1);
  sortBy.push(sortBy2);
  parent.postMessage({ pluginMessage: { type: 'sort-displays', sortBy: sortBy } }, '*')
}

onmessage = (event) => {
  
  // Set the attribute and available ranks.
  if (event.data.pluginMessage.type === 'update-attribute-rank') {
    var rank_select, attribute_select;
    if (event.data.pluginMessage.tab == "home") {
      rank_select = ui.tabs.home.fields.rank_select;
      attribute_select = ui.tabs.home.fields.attribute_select;
    } else if (event.data.pluginMessage.tab == "create_list") {
      rank_select = ui.tabs.create_list.fields.rank_select;
      attribute_select = ui.tabs.create_list.fields.attribute_select;
    }
    // disable if rank not available and set value equal to lowest rank.
    for (var i = 4; i >= 0; i--) {
      rank_select.options[i].disabled = event.data.pluginMessage.rank[i];
      if (!event.data.pluginMessage.rank[i]) rank_select.value = (i+1).toString(10);
    }
    attribute_select.value = event.data.pluginMessage.attribute;
    // disable if not attribute
    for (var i = 0; i < 6; i++) {
      attribute_select.options[i].disabled = attribute_select.options[i].value != event.data.pluginMessage.attribute;
    }
    // set the fields if this is called from a copy.
    if (event.data.pluginMessage.copied) updateCopied();
  }

  // Add names to the name_select field.
  else if (event.data.pluginMessage.type === 'update-names') {
    var name_select = document.getElementById(event.data.pluginMessage.elementId) as HTMLSelectElement;
    event.data.pluginMessage.names.forEach(function(name) {
      name_select.options.add(new Option(name, name, false));
    });
    name_select.value = "Iroha Tamaki";
    name_select.dispatchEvent(new Event('change'));
  }

  // Set isplay_properties with the properties of the current selection.
  else if (event.data.pluginMessage.type === 'update-properties') {
    display_properties = event.data.pluginMessage.display_properties
  }

  // Disable a specific button.
  else if (event.data.pluginMessage.type === 'disable-element') {
    var element = (document.getElementById(event.data.pluginMessage.name) as HTMLButtonElement);
    element.disabled = true;
    if (!element.className.includes(" buttonDisabled")) {
      element.className += " buttonDisabled";
    }
  }

  // Enable a specific button.
  else if (event.data.pluginMessage.type === 'enable-element') {
    var element = (document.getElementById(event.data.pluginMessage.name) as HTMLButtonElement);
    element.disabled = false;
    if (element.className.includes(" buttonDisabled")) {
      if (element.className.includes(" buttonGray")) {
        element.className = element.className.replace(" buttonDisabled", "");
      } else {
        element.className = element.className.replace(" buttonDisabled", " buttonGray");
      }
    }
  }

  else if (event.data.pluginMessage.type === 'table-add-row') {
    var row_data = event.data.pluginMessage.row_data;
    add_row(row_data);
  }

  else if (event.data.pluginMessage.type === 'table-remove-row') {
    var row_data = event.data.pluginMessage.row_data;
    var row_index = event.data.pluginMessage.row_index;
    remove_row(row_data, row_index);
  }
  
}

// Press the Create button when Enter key pressed.
document.addEventListener('keypress', function(event) {
  if (event.keyCode == 13) {
    event.preventDefault();
    document.getElementById("create").click();
  }
});

// Open the tab tabName and change event's button colour.
function openTab(event, tabName) {
  var i: number;
  var x = document.getElementsByClassName("tab") as HTMLCollectionOf<HTMLDivElement>;
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  var tablinks = document.getElementsByClassName("tablink") as HTMLCollectionOf<HTMLButtonElement>;
  for (i = 0; i < x.length; i++) {
    tablinks[i].className = tablinks[i].className.replace("buttonBlue", "buttonGray");
  }
  document.getElementById(tabName).style.display = "block";
  event.currentTarget.className = event.currentTarget.className.replace("buttonGray", "buttonBlue");
}
  
// Set the rest of the fields after name copied updated.
function updateCopied() {
  ui.tabs.home.fields.attribute_select.value = display_properties.attribute;
  ui.tabs.home.fields.rank_select.value = display_properties.rank;
  ui.tabs.home.fields.level_field.value = display_properties.level;
  ui.tabs.home.fields.magic_select.value = display_properties.magic;
  ui.tabs.home.fields.magia_select.value = display_properties.magia;
  ui.tabs.home.fields.episode_select.value = display_properties.episode;
}

function enableAllOptions() {
  for (var i = 0; i < 6; i++) {
    ui.tabs.home.fields.attribute_select.options[i].disabled = false;
  }
  for (var i = 0; i < 5; i++) {
    ui.tabs.home.fields.rank_select.options[i].disabled = false;
  }
}

function add_row(row_data) {
  var table = document.getElementById('create_list_data_table') as HTMLTableElement
  var new_row = table.insertRow(-1);
  new_row.className += "tableList";
  for (var key in table_header) {
    var new_cell = new_row.insertCell();
    new_cell.className += "tableList";
    var new_text = document.createTextNode(row_data[key])
    new_cell.appendChild(new_text);
  } 
}
  
function remove_row(row_data, row_index) {
  var table = document.getElementById('create_list_data_table') as HTMLTableElement
  table.deleteRow(row_index+1);
}
