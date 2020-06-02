const { app, BrowserWindow, systemPreferences, Menu, MenuItem } = require("electron");
const { join } = require("path");

function createWindow () {
  const { screen } = require("electron");
  const size = screen.getPrimaryDisplay().size;
  const win = new BrowserWindow({
    x: 0, y: 0,
    width: size.width,
    height: size.height,
    frame: false,
    show: true,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    hasShadow: false,
    webPreferences: { nodeIntegration: true },
  });
  // win.setIgnoreMouseEvents(true);
  win.maximize();
  // app.dock.hide();
  // win.setAlwaysOnTop(true, "floating");
  win.setVisibleOnAllWorkspaces(true);
  win.fullScreenable = false;
  // app.dock.show();
  win.loadFile(join(__dirname, "index.html"));
  win.webContents.openDevTools();
}

/**
 *
 * @param {"camera" | "microphone"} type
 */
async function mediaAccess(type) {
  switch(systemPreferences.getMediaAccessStatus(type)) {
    case "denied":
    case "not-determined":
    case "unknown":
    case "restricted":
      await systemPreferences.askForMediaAccess(type);
      return
    case "granted":
  }
}

function buildMenu() {
  return Menu.buildFromTemplate([
    {
      label: "Electron",
      submenu: [
        {
          label: "Cameras",
          submenu: []
        }
      ],
    }
  ]);
}

async function main() {
  await mediaAccess("microphone");
  await mediaAccess("camera");
  app.allowRendererProcessReuse = true;
  app.on("ready", async () => {
    Menu.setApplicationMenu(buildMenu());
    createWindow();
  });
}
main();
