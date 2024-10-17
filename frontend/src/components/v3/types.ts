// ... (existing types)

export interface UploadedFile {
    name: string;
    content: any;
    schema: Schema;
    classification: 'source' | 'target' | 'dictionary' | 'unclassified';
    settings: {
      delimiter?: string;
      sheet?: string;
      [key: string]: any;
    };
    sheets: string[];
  }
  
  // ... (rest of the file remains the same)