// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const express = require('express')
const srv = express()
const server = require('http').createServer(srv)
const io = require('socket.io')(server)

const names = {}
io.on('connection', function (socket) {
  console.log('client connected')
  socket.broadcast.emit('hi')
  socket.on('name', (data) => {
    names[socket.id] = {name: data}
  })
  socket.on('message', function (data) {
    io.emit('message', names[socket.id].name + ': ' + data)
  })
})



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  server.listen(3000, () => console.log('Example app listening on port 3000!'))

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
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
srv.use(express.static('public'))
srv.get('/', (req, res, next) => {
  res.send()
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
