import './ui.css'

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
    sorting_tab:               document.getElementById('sorting_tab') as HTMLDivElement,
    sorting: {
      fields: {
        group_select:        document.getElementById('group_by') as HTMLSelectElement,
        group_dir_select:        document.getElementById('group_dir') as HTMLSelectElement,
        sort_by_1_select:         document.getElementById('sort_by_1') as HTMLSelectElement,
        sort_dir_1_select:     document.getElementById('sort_dir_1') as HTMLSelectElement,
        sort_by_2_select:         document.getElementById('sort_by_2') as HTMLSelectElement,
        sort_dir_2_select:     document.getElementById('sort_dir_2') as HTMLSelectElement,
        sort_id_dir_select:  document.getElementById('sort_id_dir') as HTMLSelectElement,
        row_field:           document.getElementById('displays_per_row') as HTMLInputElement,
      },
      buttons: {
        sort_button:      document.getElementById('sort') as HTMLButtonElement,
      },
    },
    background_tab:               document.getElementById('background_tab') as HTMLDivElement,
    background: {
      fields: {
        type_select:        document.getElementById('background_type') as HTMLSelectElement,
        name_select:         document.getElementById('background_name') as HTMLSelectElement,
      },
      buttons: {
        update_background_button:      document.getElementById('update_background') as HTMLButtonElement,
        resize_background_button:      document.getElementById('resize_background') as HTMLButtonElement,
        remove_background_button:      document.getElementById('remove_background') as HTMLButtonElement,
      },
    },
    settings_tab:           document.getElementById('settings_tab') as HTMLDivElement,
    settings: {
      fields: {
        keep_open_checkbox:   document.getElementById('keep_open') as HTMLInputElement,
        full_name_checkbox:   document.getElementById('full_name') as HTMLInputElement,
      },
      buttons: {
        save_settings_button: document.getElementById('save_settings') as HTMLButtonElement,
      }
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

// Open the Home Tab.
document.getElementById('home_btn').onclick = () => {
  openTab(event,'home_tab');
}

// Open the Sorting Tab.
document.getElementById('sorting_btn').onclick = () => {
  openTab(event,'sorting_tab');
}

// Open the Background Tab.
document.getElementById('background_btn').onclick = () => {
  openTab(event,'background_tab');
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

// Update the Background names based on the background type selected.
document.getElementById("background_type").onchange = () => {
  const type = ui.tabs.background.fields.type_select.value;
  parent.postMessage({ pluginMessage: { type: 'background-change', background_type:type } }, '*')
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
  const full_name = ui.tabs.settings.fields.full_name_checkbox.checked;
  const keep_open = ui.tabs.settings.fields.keep_open_checkbox.checked;
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
  const full_name = ui.tabs.settings.fields.full_name_checkbox.checked;
  const keep_open = ui.tabs.settings.fields.keep_open_checkbox.checked;
  parent.postMessage({ pluginMessage: { type: 'update-display', name, attribute, rank, level, magic, magia, episode, full_name, keep_open } }, '*')
}

// Convert the selected frames into instances.
document.getElementById('convert').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'convert-selection' } }, '*')
}

// Group and sort the current selection.
document.getElementById('sort').onclick = () => {
  const group_by = ui.tabs.sorting.fields.group_select.value.toLowerCase();
  const group_dir = ui.tabs.sorting.fields.group_dir_select.value == "Ascending" ? 1 : -1;
  const sort_by_1 = ui.tabs.sorting.fields.sort_by_1_select.value.toLowerCase();
  const sort_dir_1 = ui.tabs.sorting.fields.sort_dir_1_select.value == "Ascending" ? 1 : -1;
  const sort_by_2 = ui.tabs.sorting.fields.sort_by_2_select.value.toLowerCase();
  const sort_dir_2 = ui.tabs.sorting.fields.sort_dir_2_select.value == "Ascending" ? 1 : -1;
  const sort_id_dir = ui.tabs.sorting.fields.sort_id_dir_select.value == "Ascending" ? 1 : -1;
  const num_per_row = parseInt(ui.tabs.sorting.fields.row_field.value);
  parent.postMessage({ pluginMessage: { type: 'sort-displays', group_by: group_by, group_dir: group_dir, sort_by_1: sort_by_1, sort_dir_1: sort_dir_1, sort_by_2: sort_by_2, sort_dir_2: sort_dir_2, sort_id_dir: sort_id_dir, num_per_row: num_per_row} }, '*')
}

// Convert the selected frames into instances.
document.getElementById('update_background').onclick = () => {
  const background_type = ui.tabs.background.fields.type_select.value;
  const background_name = ui.tabs.background.fields.name_select.value;
  parent.postMessage({ pluginMessage: { type: 'update-background', background_type: background_type, background_name: background_name } }, '*')
}

// Auto resize the current background.
document.getElementById('resize_background').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'resize-background' } }, '*')
}

// removes the current background.
document.getElementById('remove_background').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'remove-background' } }, '*')
}

// save the settings to client storage.
document.getElementById('save_settings').onclick = () => {
  var settings = {};
  for (var field in ui.tabs.settings.fields) {
    settings[ui.tabs.settings.fields[field].id] = ui.tabs.settings.fields[field].checked;
  }
  parent.postMessage({ pluginMessage: { type: 'save-settings', settings: settings } }, '*')
}


onmessage = (event) => {
  
  // Set the attribute and available ranks.
  if (event.data.pluginMessage.type === 'update-attribute-rank') {
    var rank_select = ui.tabs.home.fields.rank_select;
    var attribute_select = ui.tabs.home.fields.attribute_select;
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
    var name_select = ui.tabs.home.fields.name_select
    event.data.pluginMessage.names.forEach(function(name: string) {
      name_select.options.add(new Option(name, name, false));
    });
    name_select.value = "Iroha Tamaki";
    name_select.dispatchEvent(new Event('change'));
  }

  // Add Background names to the background_name select field.
  else if (event.data.pluginMessage.type === 'update-background-names') {
    var name_select = ui.tabs.background.fields.name_select
    // remove existing options in select.
    var num_options = name_select.options.length;
    for (var i = num_options; i >= 0 ; i--) {
      name_select.options.remove(i);
    }
    event.data.pluginMessage.background_names.forEach(function(name: string) {
      name_select.options.add(new Option(name, name, false));
    });
    name_select.value = name_select.options[0].value;
  }

  // Set display_properties with the properties of the current selection.
  else if (event.data.pluginMessage.type === 'update-properties') {
    display_properties = event.data.pluginMessage.display_properties
  }

  // Update the settings checkboxes.
  else if (event.data.pluginMessage.type === 'update-settings') {
    var settings = event.data.pluginMessage.settings;
    for (var setting in settings) {
      ui.tabs.settings.fields[setting+"_checkbox"].checked = settings[setting];
    }
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
