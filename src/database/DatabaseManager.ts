import * as path from 'path';
import * as fs from 'fs';
import { app } from 'electron';

export interface CSVFileRecord {
  id?: number;
  filename: string;
  originalPath: string;
  storedPath: string;
  tags: string;
  uploadDate: string;
  size: number;
}

export class DatabaseManager {
  private dbPath: string;
  private uploadsDir: string;
  private data: { files: CSVFileRecord[], lastId: number } = { files: [], lastId: 0 };

  constructor() {
    const userDataPath = app.getPath('userData');
    this.dbPath = path.join(userDataPath, 'toolcrypt.json');
    this.uploadsDir = path.join(userDataPath, 'uploads');
    
    // Ensure uploads directory exists
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }

    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    try {
      if (fs.existsSync(this.dbPath)) {
        const content = fs.readFileSync(this.dbPath, 'utf-8');
        this.data = JSON.parse(content);
      } else {
        this.data = { files: [], lastId: 0 };
        this.saveData();
      }
    } catch (err) {
      console.error('Error initializing database:', err);
      this.data = { files: [], lastId: 0 };
      this.saveData();
    }
  }

  private saveData(): void {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2));
    } catch (err) {
      console.error('Error saving data:', err);
    }
  }

  public async insertFile(fileRecord: CSVFileRecord): Promise<number> {
    try {
      this.data.lastId++;
      const newFile = { ...fileRecord, id: this.data.lastId };
      this.data.files.push(newFile);
      this.saveData();
      return this.data.lastId;
    } catch (err) {
      throw err;
    }
  }

  public async getAllFiles(): Promise<CSVFileRecord[]> {
    try {
      return [...this.data.files].sort((a, b) => 
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      );
    } catch (err) {
      throw err;
    }
  }

  public async getFileById(id: number): Promise<CSVFileRecord | null> {
    try {
      const file = this.data.files.find(f => f.id === id);
      return file || null;
    } catch (err) {
      throw err;
    }
  }

  public async deleteFile(id: number): Promise<boolean> {
    try {
      // First get the file record to delete the actual file
      const fileRecord = await this.getFileById(id);
      if (fileRecord) {
        // Delete the actual file
        if (fs.existsSync(fileRecord.storedPath)) {
          fs.unlinkSync(fileRecord.storedPath);
        }
        
        // Delete from data
        this.data.files = this.data.files.filter(f => f.id !== id);
        this.saveData();
        return true;
      } else {
        return false;
      }
    } catch (err) {
      throw err;
    }
  }

  public async deleteAllFiles(): Promise<boolean> {
    try {
      // First get all files to delete them physically
      const files = await this.getAllFiles();
      
      // Delete all physical files
      files.forEach(file => {
        if (fs.existsSync(file.storedPath)) {
          fs.unlinkSync(file.storedPath);
        }
      });
      
      // Clear all records
      this.data.files = [];
      this.saveData();
      return true;
    } catch (err) {
      throw err;
    }
  }

  public async updateFileTags(id: number, tags: string): Promise<boolean> {
    try {
      const fileIndex = this.data.files.findIndex(f => f.id === id);
      if (fileIndex !== -1) {
        this.data.files[fileIndex].tags = tags;
        this.saveData();
        return true;
      }
      return false;
    } catch (err) {
      throw err;
    }
  }

  public getUploadsDirectory(): string {
    return this.uploadsDir;
  }

  public close(): void {
    // No need to close anything for JSON file storage
  }
}