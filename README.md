# Magia Record Character Grid Creator Interface

![Banner](https://raw.githubusercontent.com/Leochan6/figma-magireco/master/readme/Banner.png)

This plugin is for creating a grid view of your Magical Girls in the game [Magia Record: Puella Magi Madoka Magica Side Story](https://magiarecord-en.com/). The game does not include a good overview for displaying all you owned Magical Girls and how awakened and upgraded they are, so this plugin creates that view as image for easy sharing.

## Installing the Plugin
1. Duplicate the Figma project [Magia Record Character Grids](https://www.figma.com/file/jcgWY0YGzPbAwBp47LV3oL/Magia-Record-Character-Grids). 

    ![Duplicate to your Drafts](https://raw.githubusercontent.com/Leochan6/figma-magireco/master/readme/DuplicateToDrafts.png)

2. [Install the plugin](https://www.figma.com/c/plugin/764389386376321679/Magia-Record-Character-Grid-Creator-Interface) and open the Magia Record Character Grids Project.
3. Right click on the background or go to the hamburger menu and select **Plugins** > **Magia Record Character Grid Creator Interface**

    ![Run Plugin](https://raw.githubusercontent.com/Leochan6/figma-magireco/master/readme/RunPlugin.png)

4. The HTML window for the plugin will open.

## Features
1. Create a fully detailed Character Displays for your Magical Girls, including: Character Card, Stars (Rank), Attribute, Experience Level, Magic Level, Magia Level, and Episode Level.
2. Available values for each field are automatically filled in and available for selection for easy creation.
3. Update an existing Character Display if a mistake was made or as you progress though the game.
4. Copy the properties of an existing Character Display to create a new or update an existing one.
5. Automatic placement of newly create Character Displays with respect to the selected Character Display or parent Frame.

## Usage

### Create new Character Display
1. Either select an existing instance or frame (can be the document itself)
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
Home Screen:

![Home Screen](https://raw.githubusercontent.com/Leochan6/figma-magireco/master/readme/Home.png)

Name Select:

![Name Select](https://raw.githubusercontent.com/Leochan6/figma-magireco/master/readme/SelectName.png)

Settings:

![Settings](https://raw.githubusercontent.com/Leochan6/figma-magireco/master/readme/Settings.png)

Sample List 1:

![Sample List 1](https://raw.githubusercontent.com/Leochan6/figma-magireco/master/readme/SampleList1.png)

Sample List 2:

![Sample List 2](https://raw.githubusercontent.com/Leochan6/figma-magireco/master/readme/SampleList2.png)

Sample List 3:

![Sample List 3](https://raw.githubusercontent.com/Leochan6/figma-magireco/master/readme/SampleList3.png)


### Manual Installation Instructions

1. Clone this [git repository](https://github.com/Leochan6/figma-magireco) and add the `manifest.json` to the Figma Desktop App.
2. Set up you environment to compile and run the plugin. For more information, so to the [Figma Developer Setup Guide](https://www.figma.com/plugin-docs/setup/).
3. As well as typescript and the plugin added to the Figma Desktop App, you'd need webpack to bundle all the code split up in multiple files together. For more information, so to the [Figma Developer Bundling with Webpack](https://www.figma.com/plugin-docs/bundling-webpack/).