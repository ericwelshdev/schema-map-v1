import React from 'react';
import { EnhancedDataset } from '../types';
import MissingDataAnalysis from './MissingDataAnalysis';
import ColumnProfileViewer from './ColumnProfileViewer';
import CorrelationMatrixHeatmap from './CorrelationMatrixHeatmap';

interface EnhancedDatasetViewerProps {
  enhancedDataset: EnhancedDataset;
}

const EnhancedDatasetViewer: React.FC<EnhancedDatasetViewerProps> = ({ enhancedDataset }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Enhanced Dataset Analysis</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Column Profiles</h3>
        {Object.entries(enhancedDataset.metadata.columnProfiles).map(([columnName, profile]) => (
          <ColumnProfileViewer
            key={columnName}
            columnName={columnName}
            profile={profile}
            advancedProfile={enhancedDataset.metadata.advancedProfiles[columnName]}
          />
        ))}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Correlation Matrix</h3>
        <CorrelationMatrixHeatmap
          correlationMatrix={enhancedDataset.metadata.correlationMatrix}
          columnNames={Object.keys(enhancedDataset.metadata.columnProfiles)}
        />
      </div>

      <div className="mb-8">
        <MissingDataAnalysis missingDataAnalysis={enhancedDataset.metadata.missingDataAnalysis} />
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Mapping Scores</h3>
        {/* Implement mapping scores table here */}
      </div>
    </div>
  );
};

export default EnhancedDatasetViewer;