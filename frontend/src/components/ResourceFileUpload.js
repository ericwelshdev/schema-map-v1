import React, { useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Upload } from 'lucide-react';

const ResourceFileUpload = ({ onUpload, type }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileTypes = [".txt", ".csv", ".xls", ".xlsx", ".json", ".xml", ".parquet", ".snappy", ".hive"];

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    setFile(selectedFile);
    if (typeof onUpload === 'function') {
      onUpload(selectedFile);
    }
  };

  const handleClick = () => {
    document.getElementById(`${type}-file-upload`).click();
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      handleFile(event.target.files[0]);
    }
  };

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        mt: 1, 
        ml: 0, 
        border: isDragging ? '2px dashed #1976d2' : '2px dashed #ccc',
        backgroundColor: isDragging ? '#e3f2fd' : 'transparent',
        cursor: 'pointer'
      }}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <CardContent >
        <Typography variant="h6" component="div" >
          <Upload style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          File Upload
        </Typography>
        <input
          type="file"
          id={`${type}-file-upload`}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept={fileTypes.join(',')}
        />
        <Typography variant="body2" color="text.secondary" align="center">
          Drag and drop your file here, or click to select
        </Typography>
        <Typography variant="caption" display="block" align="center" sx={{ mt: 1 }}>
          Supported formats: {fileTypes.join(', ')} (max 5MB)
        </Typography>
        {file && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Selected file: {file.name}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ResourceFileUpload;
