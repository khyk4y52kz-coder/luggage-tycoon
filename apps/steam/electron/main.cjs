const { app, BrowserWindow } = require("electron");
const path = require("path");
const { initSteamworks } = require("./steam.cjs");

const isDev = process.env.NODE_ENV === "development";
const steamAppId = process.env.STEAM_APP_ID || process.env.STEAM_TEST_APP_ID;

let mainWindow = null;

function getIndexPath() {
  if (app.isPackaged) {
    return path.join(__dirname, "../dist/index.html");
  }
  return path.join(__dirname, "../../../../.steam-build/dist/index.html");
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 960,
    height: 860,
    minWidth: 640,
    minHeight: 720,
    title: "The Little Bag Factory",
    backgroundColor: "#1c1814",
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.on("did-fail-load", (_event, code, description, url) => {
    console.error(`[electron] Failed to load ${url}: ${code} ${description}`);
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    const indexPath = getIndexPath();
    console.log(`[electron] Loading production build: ${indexPath}`);
    mainWindow.loadFile(indexPath);
  }
}

app.whenReady().then(() => {
  initSteamworks(steamAppId);
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});