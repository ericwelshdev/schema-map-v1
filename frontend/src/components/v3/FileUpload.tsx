import React, { useState, useCallback } from 'react';
import { Upload, CheckCircle, XCircle } from 'lucide-react';
import { Schema } from '../types';
import { parseCSV, inferSchemaFromFileContent } from '../utils/fileParser';

interface FileUploadProps {
  onUpload: (schema: Schema) => void;
  type: 'source' | 'target';
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, type }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): boolean => {
    if (!file.name.endsWith('.csv')) {
      setErrorMessage('Please upload a CSV file.');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size should not exceed 5MB.');
      return false;
    }
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      setFile(file);
      setUploadStatus('uploading');
      setErrorMessage('');
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const fileContent = parseCSV(content);
        const schema = inferSchemaFromFileContent(file.name, fileContent);
        onUpload(schema);
        setUploadStatus('success');
      };
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setUploadProgress(progress);
        }
      };
      reader.onerror = () => {
        setUploadStatus('error');
        setErrorMessage('An error occurred while reading the file.');
      };
      reader.readAsText(file);
    } else {
      setUploadStatus('error');
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2 capitalize">{type} File Upload</h3>
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id={`${type}-file-upload`}
          className="hidden"
          onChange={handleChange}
          accept=".csv"
        />
        <label
          htmlFor={`${type}-file-upload`}
          className="cursor-pointer flex flex-col items-center justify-center"
        >
          <Upload className="w-12 h-12 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            Drag and drop your CSV file here, or click to select a file
          </p>
          <p className="text-xs text-gray-400 mt-1">Supported format: CSV (max 5MB)</p>
        </label>
      </div>
      {uploadStatus !== 'idle' && (
        <div className="mt-4">
          {uploadStatus === 'uploading' && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          <div className="flex items-center">
            {uploadStatus === 'success' && (
              <>
                <CheckCircle className="text-green-500 mr-2" />
                <span className="text-green-500">File uploaded successfully: {file?.name}</span>
              </>
            )}
            {uploadStatus === 'error' && (
              <>
                <XCircle className="text-red-500 mr-2" />
                <span className="text-red-500">{errorMessage}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;