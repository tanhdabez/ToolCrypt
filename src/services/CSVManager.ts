import * as fs from 'fs';
import * as path from 'path';
import * as Papa from 'papaparse';
import { DatabaseManager, CSVFileRecord } from '../database/DatabaseManager';

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

export interface CSVRow {
  Signature: string;
  'Block Time': string;
  'Human Time': string;
  Action: string;
  From: string;
  To: string;
  Amount: string;
  Value: string;
  Decimals: string;
  'Token Address': string;
  Multiplier: string;
}

export class CSVManager {
  constructor(private dbManager: DatabaseManager) {}

  public async uploadFiles(filePaths: string[]): Promise<{ success: boolean; message: string; uploadedCount: number }> {
    let uploadedCount = 0;
    const uploadsDir = this.dbManager.getUploadsDirectory();

    try {
      for (const filePath of filePaths) {
        if (!fs.existsSync(filePath)) {
          continue;
        }

        const filename = path.basename(filePath);
        const stats = fs.statSync(filePath);
        const timestamp = Date.now();
        const storedFilename = `${timestamp}_${filename}`;
        const storedPath = path.join(uploadsDir, storedFilename);

        // Copy file to uploads directory
        fs.copyFileSync(filePath, storedPath);

        // Save to database
        const fileRecord: CSVFileRecord = {
          filename,
          originalPath: filePath,
          storedPath,
          tags: '',
          uploadDate: new Date().toISOString(),
          size: stats.size,
        };

        await this.dbManager.insertFile(fileRecord);
        uploadedCount++;
      }

      return {
        success: true,
        message: `Successfully uploaded ${uploadedCount} files`,
        uploadedCount,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error uploading files: ${error}`,
        uploadedCount,
      };
    }
  }

  public async getAllFiles(): Promise<CSVFileRecord[]> {
    return await this.dbManager.getAllFiles();
  }

  public async deleteFile(fileId: number): Promise<boolean> {
    return await this.dbManager.deleteFile(fileId);
  }

  public async deleteAllFiles(): Promise<boolean> {
    return await this.dbManager.deleteAllFiles();
  }

  public async downloadFile(fileId: number, destinationPath: string): Promise<boolean> {
    try {
      const fileRecord = await this.dbManager.getFileById(fileId);
      if (!fileRecord || !fs.existsSync(fileRecord.storedPath)) {
        return false;
      }

      fs.copyFileSync(fileRecord.storedPath, destinationPath);
      return true;
    } catch (error) {
      console.error('Error downloading file:', error);
      return false;
    }
  }

  public async updateFileTags(fileId: number, tags: string): Promise<boolean> {
    return await this.dbManager.updateFileTags(fileId, tags);
  }

  public async analyzeFiles(fileIds: number[]): Promise<AnalysisResult> {
    const files = await this.dbManager.getAllFiles();
    const selectedFiles = files.filter(file => fileIds.includes(file.id!));
    
    if (selectedFiles.length === 0) {
      return {
        wallets: [],
        totalFiles: 0,
        totalWallets: 0,
        duplicateWallets: 0,
      };
    }

    const walletMap = new Map<string, {
      totalTransactions: number;
      filesAppeared: Set<string>;
      transactions: Array<{ time: string; filename: string }>;
    }>();

    // Process each CSV file
    for (const file of selectedFiles) {
      if (!fs.existsSync(file.storedPath)) {
        continue;
      }

      const csvContent = fs.readFileSync(file.storedPath, 'utf-8');
      const parseResult = Papa.parse<CSVRow>(csvContent, {
        header: true,
        skipEmptyLines: true,
      });

      if (parseResult.errors.length > 0) {
        console.warn(`Errors parsing ${file.filename}:`, parseResult.errors);
      }

      // Process each row
      parseResult.data.forEach((row) => {
        const fromAddress = row.From?.trim();
        const toAddress = row.To?.trim();
        const humanTime = row['Human Time']?.trim();

        if (!humanTime) return;

        // Process 'From' address
        if (fromAddress && fromAddress !== '') {
          if (!walletMap.has(fromAddress)) {
            walletMap.set(fromAddress, {
              totalTransactions: 0,
              filesAppeared: new Set(),
              transactions: [],
            });
          }
          const wallet = walletMap.get(fromAddress)!;
          wallet.totalTransactions++;
          wallet.filesAppeared.add(file.filename);
          wallet.transactions.push({ time: humanTime, filename: file.filename });
        }

        // Process 'To' address
        if (toAddress && toAddress !== '') {
          if (!walletMap.has(toAddress)) {
            walletMap.set(toAddress, {
              totalTransactions: 0,
              filesAppeared: new Set(),
              transactions: [],
            });
          }
          const wallet = walletMap.get(toAddress)!;
          wallet.totalTransactions++;
          wallet.filesAppeared.add(file.filename);
          wallet.transactions.push({ time: humanTime, filename: file.filename });
        }
      });
    }

    // Convert to analysis result
    const allFilenames = selectedFiles.map(f => f.filename);
    const wallets: WalletAnalysis[] = [];

    walletMap.forEach((walletData, address) => {
      const filesAppeared = Array.from(walletData.filesAppeared);
      const filesNotAppeared = allFilenames.filter(f => !filesAppeared.includes(f));
      
      // Sort transactions by time to get earliest and latest
      const sortedTransactions = walletData.transactions
        .filter(t => t.time && t.time !== '')
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

      const earliestTransaction = sortedTransactions.length > 0 ? sortedTransactions[0].time : '';
      const latestTransaction = sortedTransactions.length > 0 ? sortedTransactions[sortedTransactions.length - 1].time : '';

      wallets.push({
        address,
        totalTransactions: walletData.totalTransactions,
        filesAppeared,
        filesNotAppeared,
        earliestTransaction,
        latestTransaction,
      });
    });

    // Sort wallets by total transactions (descending)
    wallets.sort((a, b) => b.totalTransactions - a.totalTransactions);

    // Count duplicates (wallets appearing in more than one file)
    const duplicateWallets = wallets.filter(w => w.filesAppeared.length > 1).length;

    return {
      wallets,
      totalFiles: selectedFiles.length,
      totalWallets: wallets.length,
      duplicateWallets,
    };
  }
}
