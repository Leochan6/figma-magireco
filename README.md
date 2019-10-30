# Magia Record Character Grid Creator Interface

![Artwork](https://github.com/Leochan6/figma-magireco/readme/Banner.png)

This plugin is for create a grid view of you Magical Girls in the game [Magia Record: Puella Magi Madoka Magica Side Story](https://magiarecord-en.com/). The game does not include a good overview for displaying all you owned Magical Girls and how levelled they are, so this plugin create that view as image for easy sharing.

## Installing the Plugin
1. Duplicate the Figma project [Magia Record Character Grids](https://www.figma.com/file/jcgWY0YGzPbAwBp47LV3oL/Magia-Record-Character-Grids).
2. Install the plugin and open the Magia Record Character Grids Project.
3. Right click on the background or go to the hamburger menu and select **Plugins** > **Magia Record Character Grid Creator Interface**
4. The HTML window for the plugin will open.

## Features
1. Create a fully detailed Character Displays for your Magical Girls, including: Character Card, Stars (Rank), Attribute, Experience Level, Magic Level, Magia Level, and Episode Level.
2. Available values for each field are automatically filled in and available for selection for easy creation.
3. Update an existing Character Display if a mistake was made or as you progress though the game.
4. Copy the properties of an existing Character Display to create a new or update an existing one.
5. Automatic placement of newly create Character Displays with respect to the selected Character Display or parent Frame.

## Usage

### Create new Character Display
1. Eiher select an existing instance or frame (can be the document itself)
2. Select the properties you want.
3. Press `Create`.

### Update an Existing Character Display
1. Select an existing instance of a Character Display.
2. Press the `Copy Selected` and all properties appear in fields.
3. Modify the fields you want to update.
3. Press `Update Selected`. 

### Create new Character Display with Existing Properties
1. Select an existing instance of a Character Display.
2. Press the `Copy Selected` and all properties appear in fields.
3. Modify any fields if desired.
4. Press `Create`.

## Gallery

![Home Screen](https://github.com/Leochan6/figma-magireco/readme/Home.png)

![Name Select](https://github.com/Leochan6/figma-magireco/readme/SelectName.png)

![Settings](https://github.com/Leochan6/figma-magireco/readme/Settings.png)

![Sample List 1](https://github.com/Leochan6/figma-magireco/readme/SampleList1.png)

![Sample List 2](https://github.com/Leochan6/figma-magireco/readme/SampleList2.png)

![Sample List 3](https://github.com/Leochan6/figma-magireco/readme/SampleList3.png)


### Manual Installation Instructions

1. Clone this [git repository](https://github.com/Leochan6/figma-magireco) and add the `manifest.json` to the Figma Desktop App.
2. Set up you environment to compile and run the plugin. For more information, so to the [Figma Developer Setup Guide](https://www.figma.com/plugin-docs/setup/).
3. As well as typescript and the plugin added to the Figma Desktop App, you'd need webpack to bundle all the code split up in multiple files together. For more information, so to the [Figma Developer Bundling with Webpack](https://www.figma.com/plugin-docs/bundling-webpack/).