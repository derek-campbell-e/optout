/*

// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const ipc = require('electron').ipcMain;
const OptOut = require('./index');
const fork = require('child_process').fork;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

let dim = {};
let mainWindow

function createWindow () {
  // Create the browser window.
  let dimensions = {x: 0, y: 0, width: 1200, height: 800};
  try {
    dim = require('./window.json');
    dimensions = dim.gui;
    console.log(dimensions);
  } catch (error){
    console.log(error);
  }

  mainWindow = new BrowserWindow(dimensions)

  // and load the index.html of the app.
  const path = require('path');
  const www = path.join(__dirname, 'src/www');
  let index = path.join(www, 'index.html');
  mainWindow.loadFile(index)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  mainWindow.on('move', updateDimensions)
  mainWindow.on('resize', updateDimensions)

  ipc.on('ready', function(event, args){
    let child = fork('./index');
    child.send(args);
    //OptOut(args);
  });
}

function updateDimensions(){
  let _dim = mainWindow.getBounds();
  let saveDim = {x: _dim.x, y: _dim.y, width: _dim.width, height: _dim.height};
  dim.gui = saveDim
  let json = JSON.stringify(dim);
  require('fs').writeFile('window.json', json, console.log);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

*/

