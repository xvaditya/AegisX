/**
 * AegisX Electron — Main Process
 *
 * Creates two windows:
 * 1. Main Dashboard (full-size, loads React frontend at localhost:5173)
 * 2. Floating Assistant (frameless, always-on-top, compact overlay)
 *
 * Also creates a system tray icon with quick access.
 */

const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const path = require('path');

let dashboardWindow = null;
let floatingWindow = null;
let tray = null;

const FRONTEND_URL = 'http://localhost:5173';

function createDashboardWindow() {
  dashboardWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    title: 'AegisX Dashboard',
    backgroundColor: '#0a0b0f',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '..', 'preload', 'index.js'),
    },
  });

  dashboardWindow.loadURL(FRONTEND_URL);

  dashboardWindow.on('closed', () => {
    dashboardWindow = null;
  });
}

function createFloatingWindow() {
  floatingWindow = new BrowserWindow({
    width: 320,
    height: 500,
    maxWidth: 400,
    maxHeight: 700,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    resizable: true,
    skipTaskbar: true,
    title: 'AegisX Assistant',
    backgroundColor: '#00000000',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '..', 'preload', 'index.js'),
    },
  });

  floatingWindow.loadURL(`${FRONTEND_URL}/floating`);

  // Position in bottom-right
  const { screen } = require('electron');
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workArea;
  floatingWindow.setPosition(width - 340, height - 520);

  floatingWindow.on('closed', () => {
    floatingWindow = null;
  });
}

function createTray() {
  // Use a simple tray icon (we'll use NSIS icon or generate one)
  // For now, use default
  try {
    tray = new Tray(path.join(__dirname, '..', '..', 'assets', 'icon.png'));
  } catch {
    // Fallback: no icon
    return;
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Dashboard',
      click: () => {
        if (!dashboardWindow) createDashboardWindow();
        else dashboardWindow.show();
      },
    },
    {
      label: 'Toggle Assistant',
      click: () => {
        if (!floatingWindow) {
          createFloatingWindow();
        } else if (floatingWindow.isVisible()) {
          floatingWindow.hide();
        } else {
          floatingWindow.show();
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Quit AegisX',
      click: () => app.quit(),
    },
  ]);

  tray.setToolTip('AegisX — AI Incident Analyst');
  tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
  createDashboardWindow();
  createFloatingWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createDashboardWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers
ipcMain.handle('window:minimize', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.minimize();
});

ipcMain.handle('window:close', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.close();
});

ipcMain.handle('window:toggle-float', () => {
  if (floatingWindow) {
    floatingWindow.isVisible() ? floatingWindow.hide() : floatingWindow.show();
  } else {
    createFloatingWindow();
  }
});
