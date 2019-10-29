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
      problems: {
        problems_text_area: document.getElementById('problems') as HTMLTextAreaElement,
      }
    },
    sorting_tab:            document.getElementById('sorting_tab') as HTMLDivElement,
    sorting: {
      sort_by_1_select:     document.getElementById('sort_by_1_select') as HTMLSelectElement,
      sort_by_2_select:     document.getElementById('sort_by_2_select') as HTMLSelectElement,
      sort_order_1_select:  document.getElementById('sort_order_1_select') as HTMLSelectElement,
      sort_order_2_select:  document.getElementById('sort_order_2_select') as HTMLSelectElement,
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
  parent.postMessage({ pluginMessage: { type: 'name-change', name:name } }, '*')
}

// Open the Home Tab.
document.getElementById('home_btn').onclick = () => {
  openTab(event,'home_tab');
}

// Open the Sorting Tab.
document.getElementById('sorting_btn').onclick = () => {
  openTab(event,'sorting_tab');
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

// Change the available magia options selectable based on the selected episode.
document.getElementById('episode').onchange = () => {
  const episode_select = ui.tabs.home.fields.episode_select;
  const magia_select = ui.tabs.home.fields.magia_select;
  const episode = parseInt(episode_select.value,10);
  const magia = parseInt(magia_select.value,10);
  for (var i = 4; i > episode-1; i--) {
    magia_select.options[i].disabled = true;
  }
  for (var i = episode-1; i >= 0; i--) {
    magia_select.options[i].disabled = false;
  }
  for (var i = 4; i > episode-1; i--) {
    if (magia_select.value == (i+1).toString(10)) {
      magia_select.value = (episode).toString(10);
    }
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
  ui.tabs.home.fields.attribute_select.value = display_properties.attribute;
  ui.tabs.home.fields.rank_select.value = display_properties.rank;
  ui.tabs.home.fields.level_field.value = display_properties.level;
  ui.tabs.home.fields.magic_select.value = display_properties.magic;
  ui.tabs.home.fields.magia_select.value = display_properties.magia;
  ui.tabs.home.fields.episode_select.value = display_properties.episode;
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
  
  ui.tabs.home.problems.problems_text_area.value = "";

  // Update the problems text area's message.
  if (event.data.pluginMessage.type === 'update-problems') {
    ui.tabs.home.problems.problems_text_area.value = event.data.pluginMessage.message;
  }

  // Set the attribute and available ranks.
  else if (event.data.pluginMessage.type === 'update-attribute-rank') {
    for (var i = 0; i < 5; i++) {
      ui.tabs.home.fields.rank_select.options[i].disabled = event.data.pluginMessage.rank[i];
      if (!event.data.pluginMessage.rank[i] && event.data.pluginMessage.rank[i-1]) {
        ui.tabs.home.fields.rank_select.value = (i+1).toString(10);
      }
    }
    ui.tabs.home.fields.attribute_select.value = event.data.pluginMessage.attribute;
    for (var i = 0; i < 6; i++) {
      if (ui.tabs.home.fields.attribute_select.options[i].value != event.data.pluginMessage.attribute) {
        ui.tabs.home.fields.attribute_select.options[i].disabled = true;
      } else {
        ui.tabs.home.fields.attribute_select.options[i].disabled = false;
      }
    }
    ui.tabs.home.fields.rank_select.dispatchEvent(new Event('change'));
  }

  // Add names to the name_select field.
  else if (event.data.pluginMessage.type === 'update-names') {
    event.data.pluginMessage.names.forEach(function(name) {
      ui.tabs.home.fields.name_select.options.add(new Option(name, name, false));
    });
    ui.tabs.home.fields.name_select.value = "Iroha Tamaki";
    ui.tabs.home.fields.name_select.dispatchEvent(new Event('change'));
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