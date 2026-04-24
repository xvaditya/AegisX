/**
 * AegisX Electron — Preload Script
 *
 * Exposes safe APIs to the renderer via contextBridge.
 * contextIsolation is ON and nodeIntegration is OFF.
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('aegisDesktop', {
  // Window controls
  minimize: () => ipcRenderer.invoke('window:minimize'),
  close: () => ipcRenderer.invoke('window:close'),
  toggleFloat: () => ipcRenderer.invoke('window:toggle-float'),

  // Platform info
  platform: process.platform,
  isElectron: true,
});
