import { app, BrowserWindow, ipcMain, dialog, shell, protocol } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as path from 'path';
import * as fs from 'fs';
import { DatabaseManager } from './database/DatabaseManager';
import { CSVManager } from './services/CSVManager';

class MainProcess {
  private mainWindow: BrowserWindow | null = null;
  private dbManager: DatabaseManager;
  private csvManager: CSVManager;

  constructor() {
    this.dbManager = new DatabaseManager();
    this.csvManager = new CSVManager(this.dbManager);
    this.setupEventHandlers();
    this.setupAutoUpdater();
  }

  private getIconPath(): string {
    const isDev = !app.isPackaged;
    
    if (process.platform === 'win32') {
      // Dev dùng file trong project, Prod dùng file trong resources
      return isDev
        ? path.join(__dirname, '../assets/icon.ico')
        : path.join(process.resourcesPath, 'assets/icon.ico');
    } else {
      // macOS/Linux dùng PNG
      return isDev
        ? path.join(__dirname, '../assets/icon.png')
        : path.join(process.resourcesPath, 'assets/icon.png');
    }
  }

  private setupAutoUpdater(): void {
    // Configure auto-updater
    autoUpdater.checkForUpdatesAndNotify();
    
    // Check for updates every 1 hour (60 minutes)
    setInterval(() => {
      autoUpdater.checkForUpdatesAndNotify();
    }, 60 * 60 * 1000);
    
    // Auto-updater events
    autoUpdater.on('checking-for-update', () => {
      console.log('🔍 [AUTO-UPDATE] Checking for updates...');
    });
    
    autoUpdater.on('update-available', async (info) => {
      console.log('📦 [AUTO-UPDATE] Update available:', info.version);
      
      // Show dialog asking user if they want to update
      const result = await dialog.showMessageBox(this.mainWindow!, {
        type: 'question',
        buttons: ['Cập nhật ngay', 'Hủy'],
        defaultId: 0,
        cancelId: 1,
        title: 'Có bản cập nhật mới',
        message: `Phiên bản ${info.version} đã có sẵn!`,
        detail: 'Bạn có muốn tải xuống và cài đặt bản cập nhật ngay bây giờ không?'
      });
      
      if (result.response === 0) {
        // User chose to update
        console.log('✅ [AUTO-UPDATE] User confirmed update');
        this.sendToRenderer('update-available', info);
        autoUpdater.downloadUpdate();
      } else {
        console.log('❌ [AUTO-UPDATE] User cancelled update');
        this.sendToRenderer('update-cancelled', info);
      }
    });
    
    autoUpdater.on('update-not-available', (info) => {
      console.log('✅ [AUTO-UPDATE] No updates available');
    });
    
    autoUpdater.on('error', (err) => {
      console.error('❌ [AUTO-UPDATE] Error:', err);
    });
    
    autoUpdater.on('download-progress', (progressObj) => {
      console.log('📥 [AUTO-UPDATE] Download progress:', progressObj.percent);
      this.sendToRenderer('download-progress', progressObj);
    });
    
    autoUpdater.on('update-downloaded', (info) => {
      console.log('🎉 [AUTO-UPDATE] Update downloaded, ready to install');
      this.sendToRenderer('update-downloaded', info);
    });
  }

  private setupProtocol(): void {
    // Register protocol to serve static files
    protocol.registerFileProtocol('app', (request, callback) => {
      const url = request.url.substr(6); // Remove 'app://' prefix
      const filePath = path.join(__dirname, '../assets', url);
      callback({ path: filePath });
    });
  }

  private setupEventHandlers(): void {
    app.whenReady().then(() => {
      // Giúp Windows taskbar/notification nhận diện đúng app
      app.setAppUserModelId('com.toolcrypt.csvmanager'); // Khớp appId trong config
      this.setupProtocol();
      this.createWindow();
      this.setupIpcHandlers();
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });
  }

  private createWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 1000,
      minHeight: 700,
      icon: this.getIconPath(),
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
      },
      titleBarStyle: 'default',
      show: false,
      backgroundColor: '#000000',
    });

    // Load loading screen first
    this.mainWindow.loadFile(path.join(__dirname, '../src/renderer/loading.html'));

    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
      
      // After showing loading screen, wait a bit then load main app
      setTimeout(() => {
        this.loadMainApp();
      }, 3000); // 3 seconds loading time
    });

    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.webContents.openDevTools();
    }
  }

  private loadMainApp(): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.loadFile(path.join(__dirname, '../src/renderer/index.html'));
    }
  }

  private sendToRenderer(channel: string, data?: any): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send(channel, data);
    }
  }

  private setupIpcHandlers(): void {
    console.log('🔧 [MAIN] Setting up IPC handlers...');
    
    // File management handlers
    ipcMain.handle('upload-csv-files', async (event, filePaths: string[]) => {
      console.log('📤 [MAIN] upload-csv-files called with:', filePaths);
      try {
        const result = await this.csvManager.uploadFiles(filePaths);
        console.log('✅ [MAIN] upload-csv-files result:', result);
        return result;
      } catch (error) {
        console.error('❌ [MAIN] upload-csv-files error:', error);
        throw error;
      }
    });

    ipcMain.handle('get-csv-files', async () => {
      console.log('📋 [MAIN] get-csv-files called');
      try {
        const result = await this.csvManager.getAllFiles();
        console.log('✅ [MAIN] get-csv-files result:', result?.length || 0, 'files');
        return result;
      } catch (error) {
        console.error('❌ [MAIN] get-csv-files error:', error);
        throw error;
      }
    });

    ipcMain.handle('delete-csv-file', async (event, fileId: number) => {
      console.log('🗑️ [MAIN] delete-csv-file called with fileId:', fileId);
      try {
        const result = await this.csvManager.deleteFile(fileId);
        console.log('✅ [MAIN] delete-csv-file result:', result);
        return result;
      } catch (error) {
        console.error('❌ [MAIN] delete-csv-file error:', error);
        throw error;
      }
    });

    ipcMain.handle('delete-all-csv-files', async () => {
      console.log('🗑️ [MAIN] delete-all-csv-files called');
      try {
        const result = await this.csvManager.deleteAllFiles();
        console.log('✅ [MAIN] delete-all-csv-files result:', result);
        return result;
      } catch (error) {
        console.error('❌ [MAIN] delete-all-csv-files error:', error);
        throw error;
      }
    });

    ipcMain.handle('download-csv-file', async (event, fileId: number) => {
      console.log('💾 [MAIN] download-csv-file called with fileId:', fileId);
      try {
        const result = await dialog.showSaveDialog(this.mainWindow!, {
          filters: [{ name: 'CSV Files', extensions: ['csv'] }],
        });

        if (!result.canceled && result.filePath) {
          const downloadResult = await this.csvManager.downloadFile(fileId, result.filePath);
          console.log('✅ [MAIN] download-csv-file result:', downloadResult);
          return downloadResult;
        }
        console.log('❌ [MAIN] download-csv-file canceled');
        return false;
      } catch (error) {
        console.error('❌ [MAIN] download-csv-file error:', error);
        throw error;
      }
    });

    ipcMain.handle('update-file-tags', async (event, fileId: number, tags: string) => {
      console.log('🏷️ [MAIN] update-file-tags called with fileId:', fileId, 'tags:', tags);
      try {
        const result = await this.csvManager.updateFileTags(fileId, tags);
        console.log('✅ [MAIN] update-file-tags result:', result);
        return result;
      } catch (error) {
        console.error('❌ [MAIN] update-file-tags error:', error);
        throw error;
      }
    });

    // Analysis handlers
    ipcMain.handle('analyze-csv-files', async (event, fileIds: number[]) => {
      console.log('🔍 [MAIN] analyze-csv-files called with fileIds:', fileIds);
      try {
        const result = await this.csvManager.analyzeFiles(fileIds);
        console.log('✅ [MAIN] analyze-csv-files result:', result ? 'success' : 'failed');
        return result;
      } catch (error) {
        console.error('❌ [MAIN] analyze-csv-files error:', error);
        throw error;
      }
    });

    // Dialog handlers
    ipcMain.handle('show-open-dialog', async () => {
      console.log('📁 [MAIN] show-open-dialog called');
      try {
        const result = await dialog.showOpenDialog(this.mainWindow!, {
          properties: ['openFile', 'multiSelections'],
          filters: [{ name: 'CSV Files', extensions: ['csv'] }],
        });
        console.log('✅ [MAIN] show-open-dialog result:', result.filePaths);
        return result.filePaths;
      } catch (error) {
        console.error('❌ [MAIN] show-open-dialog error:', error);
        throw error;
      }
    });

    // External link handler
    ipcMain.handle('open-external', async (event, url: string) => {
      console.log('🌐 [MAIN] open-external called with URL:', url);
      try {
        await shell.openExternal(url);
        console.log('✅ [MAIN] open-external success');
        return true;
      } catch (error) {
        console.error('❌ [MAIN] open-external error:', error);
        throw error;
      }
    });

    // Auto-update handlers
    ipcMain.handle('check-for-updates', async () => {
      console.log('🔍 [MAIN] check-for-updates called');
      try {
        const result = await autoUpdater.checkForUpdates();
        console.log('✅ [MAIN] check-for-updates result:', result);
        return result;
      } catch (error) {
        console.error('❌ [MAIN] check-for-updates error:', error);
        throw error;
      }
    });

    ipcMain.handle('download-update', async () => {
      console.log('📥 [MAIN] download-update called');
      try {
        const result = await autoUpdater.downloadUpdate();
        console.log('✅ [MAIN] download-update result:', result);
        return result;
      } catch (error) {
        console.error('❌ [MAIN] download-update error:', error);
        throw error;
      }
    });

    ipcMain.handle('install-update', async () => {
      console.log('🚀 [MAIN] install-update called');
      try {
        autoUpdater.quitAndInstall();
        return true;
      } catch (error) {
        console.error('❌ [MAIN] install-update error:', error);
        throw error;
      }
    });
    
    console.log('✅ [MAIN] All IPC handlers set up successfully');
  }
}

new MainProcess();
