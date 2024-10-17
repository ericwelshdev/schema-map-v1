import React, { useState } from 'react';
import { Upload, Database, Tag, Brain, CheckSquare, RefreshCw } from 'lucide-react';
import FileUpload from './components/FileUpload';
import SchemaViewer from './components/SchemaViewer';
import MappingInterface from './components/MappingInterface';
import AIMapping from './components/AIMapping';
import IngestionPage from './components/IngestionPage';
import DataProcessingPipeline from './components/DataProcessingPipeline';
import EnhancedDatasetViewer from './components/EnhancedDatasetViewer';
import { Schema, Mapping, MetadataMapping, EnhancedDataset } from './types';

function App() {
  const [sourceSchema, setSourceSchema] = useState<Schema | null>(null);
  const [targetSchema, setTargetSchema] = useState<Schema | null>(null);
  const [mapping, setMapping] = useState<Mapping[] | null>(null);
  const [metadataMapping, setMetadataMapping] = useState<MetadataMapping | null>(null);
  const [enhancedDataset, setEnhancedDataset] = useState<EnhancedDataset | null>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'ingestion' | 'processing' | 'mapping'>('upload');

  const handleFileUpload = (type: 'source' | 'target', schema: Schema) => {
    if (type === 'source') {
      setSourceSchema(schema);
    } else {
      setTargetSchema(schema);
    }
  };

  const handleAIMapping = (aiMapping: Mapping[]) => {
    setMapping(aiMapping);
  };

  const handleMappingUpdate = (updatedMapping: Mapping[]) => {
    setMapping(updatedMapping);
  };

  const handleProceedToIngestion = () => {
    if (sourceSchema && targetSchema) {
      setCurrentStep('ingestion');
    }
  };

  const handleProceedToProcessing = (updatedSourceSchema: Schema, updatedTargetSchema: Schema, metadataMapping: MetadataMapping) => {
    setSourceSchema(updatedSourceSchema);
    setTargetSchema(updatedTargetSchema);
    setMetadataMapping(metadataMapping);
    setCurrentStep('processing');
  };

  const handleProcessingComplete = (enhancedDataset: EnhancedDataset) => {
    setEnhancedDataset(enhancedDataset);
    setCurrentStep('mapping');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">AI-Powered Data Schema Mapping</h1>
      {currentStep === 'upload' && (
        <>
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold mb-4">File Upload</h2>
            <p className="text-gray-600 mb-4">
              Upload your source and target CSV files to begin the schema mapping process. 
              Each file should be in CSV format and not exceed 5MB in size.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FileUpload onUpload={(schema) => handleFileUpload('source', schema)} type="source" />
              <FileUpload onUpload={(schema) => handleFileUpload('target', schema)} type="target" />
            </div>
          </div>
          {sourceSchema && targetSchema && (
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h2 className="text-xl font-semibold mb-4">Uploaded Schemas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SchemaViewer schema={sourceSchema} />
                <SchemaViewer schema={targetSchema} />
              </div>
            </div>
          )}
          <div className="mt-8 text-center">
            <button
              onClick={handleProceedToIngestion}
              className={`bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold transition duration-300 ease-in-out ${
                !(sourceSchema && targetSchema) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
              disabled={!(sourceSchema && targetSchema)}
            >
              Continue to Ingestion
            </button>
          </div>
        </>
      )}
      {currentStep === 'ingestion' && sourceSchema && targetSchema && (
        <IngestionPage
          sourceSchema={sourceSchema}
          targetSchema={targetSchema}
          onProceedToMapping={handleProceedToProcessing}
        />
      )}
      {currentStep === 'processing' && sourceSchema && targetSchema && (
        <DataProcessingPipeline
          sourceSchema={sourceSchema}
          targetSchema={targetSchema}
          onComplete={handleProcessingComplete}
        />
      )}
      {currentStep === 'mapping' && sourceSchema && targetSchema && enhancedDataset && (
        <>
          <EnhancedDatasetViewer enhancedDataset={enhancedDataset} />
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Brain className="mr-2" /> AI Mapping
            </h2>
            <AIMapping
              sourceSchema={sourceSchema}
              targetSchema={targetSchema}
              metadataMapping={metadataMapping}
              onMappingComplete={handleAIMapping}
            />
          </div>
          {mapping && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CheckSquare className="mr-2" /> Review and Correct Mappings
              </h2>
              <MappingInterface
                sourceSchema={sourceSchema}
                targetSchema={targetSchema}
                mapping={mapping}
                onMappingUpdate={handleMappingUpdate}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;