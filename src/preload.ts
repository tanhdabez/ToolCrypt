import { contextBridge, ipcRenderer } from 'electron';

export interface CSVFile {
  id: number;
  filename: string;
  originalPath: string;
  tags: string;
  uploadDate: string;
  size: number;
}

export interface WalletAnalysis {
  address: string;
  totalTransactions: number;
  filesAppeared: string[];
  filesNotAppeared: string[];
  earliestTransaction: string;
  latestTransaction: string;
}

export interface AnalysisResult {
  wallets: WalletAnalysis[];
  totalFiles: number;
  totalWallets: number;
  duplicateWallets: number;
}

const electronAPI = {
  // File management
  uploadCSVFiles: (filePaths: string[]) => ipcRenderer.invoke('upload-csv-files', filePaths),
  getCSVFiles: (): Promise<CSVFile[]> => ipcRenderer.invoke('get-csv-files'),
  deleteCSVFile: (fileId: number) => ipcRenderer.invoke('delete-csv-file', fileId),
  deleteAllCSVFiles: () => ipcRenderer.invoke('delete-all-csv-files'),
  downloadCSVFile: (fileId: number) => ipcRenderer.invoke('download-csv-file', fileId),
  updateFileTags: (fileId: number, tags: string) => ipcRenderer.invoke('update-file-tags', fileId, tags),
  
  // Analysis
  analyzeCSVFiles: (fileIds: number[]): Promise<AnalysisResult> => ipcRenderer.invoke('analyze-csv-files', fileIds),
  
  // Dialog
  showOpenDialog: (): Promise<string[]> => ipcRenderer.invoke('show-open-dialog'),
  
    // External links
    openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
    
    // Auto-update
    checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
    downloadUpdate: () => ipcRenderer.invoke('download-update'),
    installUpdate: () => ipcRenderer.invoke('install-update'),
    
    // Auto-update events
    onUpdateAvailable: (callback: (info: any) => void) => ipcRenderer.on('update-available', callback),
    onDownloadProgress: (callback: (progress: any) => void) => ipcRenderer.on('download-progress', callback),
    onUpdateDownloaded: (callback: (info: any) => void) => ipcRenderer.on('update-downloaded', callback),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

declare global {
  interface Window {
    electronAPI: typeof electronAPI;
  }
}
