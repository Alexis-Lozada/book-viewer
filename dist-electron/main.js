import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
createRequire(import.meta.url);
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
let splash;
function createSplashWindow() {
  splash = new BrowserWindow({
    transparent: false,
    frame: false,
    alwaysOnTop: true,
    center: true,
    resizable: false,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg")
  });
  splash.loadFile(path.join(process.env.VITE_PUBLIC, "splash.html"));
}
function createWindow() {
  win = new BrowserWindow({
    show: false,
    // start hidden
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#242424",
      symbolColor: "#ffffff",
      height: 30
    },
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    }
  });
  win.setMenu(null);
  const showMainApp = () => {
    if (!splash) return;
    setTimeout(() => {
      if (splash) {
        splash.close();
        splash = null;
      }
      if (win) {
        win.show();
        win.focus();
      }
    }, 3500);
  };
  win.once("ready-to-show", showMainApp);
  setTimeout(() => {
    if (splash) showMainApp();
  }, 1e3);
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  ipcMain.handle("open-file", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "PDFs", extensions: ["pdf"] }]
    });
    if (canceled) return null;
    const filePath = filePaths[0];
    const fileBuffer = fs.readFileSync(filePath);
    return fileBuffer;
  });
  createSplashWindow();
  createWindow();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
