import React from 'react';
import { Schema, EnhancedDataset } from '../types';
import EnhancedDatasetViewer from './EnhancedDatasetViewer';

interface DataProfilingPageProps {
  sourceSchema: Schema;
  targetSchema: Schema;
  enhancedDataset: EnhancedDataset | null;
}

const DataProfilingPage: React.FC<DataProfilingPageProps> = ({
  sourceSchema,
  targetSchema,
  enhancedDataset,
}) => {
  return (
    <div className="mt-8">
      <h1 className="text-3xl font-bold mb-8">Data Profiling</h1>
      {enhancedDataset ? (
        <EnhancedDatasetViewer enhancedDataset={enhancedDataset} />
      ) : (
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-lg mb-4">
            No enhanced dataset available. Please run the data processing pipeline first.
          </p>
          <h2 className="text-2xl font-semibold mb-4">Available Schemas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Source Schema</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(sourceSchema, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Target Schema</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(targetSchema, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataProfilingPage;