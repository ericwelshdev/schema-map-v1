import React, { useState } from 'react';
import { runDataProcessingPipeline } from '../pipeline';
import { Schema, EnhancedDataset } from '../types';

interface DataProcessingPipelineProps {
  sourceSchema: Schema;
  targetSchema: Schema;
  selectedModel: 'openai' | 'iqvia';
  onComplete: (enhancedDataset: EnhancedDataset) => void;
}

const DataProcessingPipeline: React.FC<DataProcessingPipelineProps> = ({
  sourceSchema,
  targetSchema,
  selectedModel,
  onComplete,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleProcessing = async () => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // Simulating file processing
      const simulatedFilePath = 'simulated_data.csv';
      const enhancedDataset = await runDataProcessingPipeline(simulatedFilePath, sourceSchema, targetSchema, selectedModel);
      
      if (enhancedDataset) {
        onComplete(enhancedDataset);
      } else {
        throw new Error('Failed to process data. The result is undefined.');
      }
    } catch (error) {
      console.error('Error processing data:', error);
      if (error instanceof Error) {
        setError(`An error occurred while processing the data: ${error.message}`);
      } else {
        setError(`An unexpected error occurred while processing the data.`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Data Processing Pipeline</h2>
      <p className="mb-4">Selected Model: {selectedModel.toUpperCase()}</p>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <button
        onClick={handleProcessing}
        disabled={isProcessing}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : 'Start Processing'}
      </button>
      {isProcessing && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Processing... {progress.toFixed(0)}%</p>
        </div>
      )}
    </div>
  );
};

export default DataProcessingPipeline;