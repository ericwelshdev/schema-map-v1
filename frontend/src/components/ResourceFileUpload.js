import React, { useState } from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
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
        backgroundColor: isDragging ? '#e3f2fd' : 'transparent'
      }}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          <Upload style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          {type} File Upload
        </Typography>
        <input
          type="file"
          id={`${type}-file-upload`}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept={fileTypes.join(',')}
        />
        <label htmlFor={`${type}-file-upload`}>
          <Button
            variant="contained"
            component="span"
            startIcon={<Upload />}
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          >
            Choose File
          </Button>
        </label>
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
