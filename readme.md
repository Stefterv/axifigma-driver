# Axifigma - An axidraw and figma mixup

Based and structured on [nornagon/saxi](https://github.com/nornagon/saxi)

This electron app aims to make working with the axidraw an effortless affair.




### Project structure

The project is structured into 3 parts

- The figma plugin
- A electron shell
- A nuxt application

I'm using nuxt for a convenient webpack configuration and development environment. 
In dev mode, nuxt launches the saxi server and the electron app, making the electron code live-reloading
In production mode, the electron app launches the saxi server and the nuxt server.


#### Figma plugin

The figma plugin is as small as possible, it just checks if the driver is running, and offers the download link/launch link if it is not.


#### Nuxt application

The nuxt application fills two roles, display the information in the menubar and provide the plotter ux in figma. 


#### Electron
Electron is used to make the install process as quick as possible, no command line commands, just download a file and put it in the proper location, as expected.