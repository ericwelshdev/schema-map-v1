  import React, { useState } from 'react';
  import { Box, Card, CardContent, Typography, LinearProgress, Alert} from '@mui/material';
  import { Upload } from 'lucide-react';
  import { processFile } from '../utils/fileUtils';
  import { useView } from '../contexts/ViewContext';

  const ResourceFileIngestionSetup = ({ onConfigChange = {} }) => {
    const { setFooterAlert } = useView();
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);
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
      handleFileUpload(selectedFile);
    };

    const handleFileUpload = async (file, ingestionSettings = {}) => {
      console.log('handleFileUpload-> Uploading file:', file);
      console.log('handleFileUpload-> Ingestion Settings:', ingestionSettings);

      setLoading(true);
      setProgress(0);
      setUploadStatus(null);

      const updateProgress = (value) => {
        setProgress(value);
      };

      try {
        const result = await processFile(file, ingestionSettings, true, updateProgress);
        setUploadStatus(result.uploadStatus);
        setFooterAlert({
          type: 'success',
          message: 'File processed successfully'
        });
        onConfigChange(result);
        console.log('handleFileUpload-> Result:', result);
      } catch (error) {
        setUploadStatus({ type: 'error', message: error.message });

        setFooterAlert({
          type: 'error',
          message: error.message
        });
        onConfigChange({
          uploadStatus: { type: 'error', message: error.message }
        });
      } finally {
        setLoading(false);
      }
    };

    return (
      <Box sx={{ '& > *': {ml:-2, mt:-4 } }}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div" >
              <Upload style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              File Upload
            </Typography>
            <input
              accept={fileTypes}
              style={{ display: 'none' }}
              id="raised-button-file"
              multiple
              type="file"
              onChange={(e) => handleFileUpload(e.target.files[0])}
            />
            <label htmlFor="raised-button-file">
              <Card
                variant="outlined"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  border: isDragging ? '2px dashed #1976d2' : '2px dashed #ccc',
                  alignItems: 'center',
                  padding: 3,
                  cursor: 'pointer',
                }}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Upload size={48} />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Click to upload or drag and drop
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {fileTypes.join(', ')}
                </Typography>
              </Card>
            </label>
          </CardContent>
        </Card>
        {loading && <LinearProgress variant="determinate" value={progress} sx={{ mt: 2, mb: 2 }} />}
        {uploadStatus && (
        <Alert severity={uploadStatus.type} sx={{ mt: 2, mb: 2 }}> </Alert>
        )}
      </Box>
    );
  };

  ResourceFileIngestionSetup.handleFileUpload = async (updatedConfig) => {
    const { File, ingestionSettings } = updatedConfig;
    console.log('handleFileUpload called with updatedConfig:' , updatedConfig);

    return processFile(File, ingestionSettings, true);
  };
  export default ResourceFileIngestionSetup;