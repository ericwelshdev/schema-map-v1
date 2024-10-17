import React, { useState } from 'react';
import { Schema, MetadataMapping } from '../types';
import SchemaViewer from './SchemaViewer';
import DataDictionaryWizard from './DataDictionaryWizard';

interface IngestionPageProps {
  sourceSchema: Schema;
  targetSchema: Schema;
  onProceedToMapping: (updatedSourceSchema: Schema, updatedTargetSchema: Schema, metadataMapping: MetadataMapping) => void;
}

const IngestionPage: React.FC<IngestionPageProps> = ({
  sourceSchema,
  targetSchema,
  onProceedToMapping,
}) => {
  const [step, setStep] = useState<'initial' | 'dictionary' | 'manual' | 'complete'>('initial');
  const [updatedSourceSchema, setUpdatedSourceSchema] = useState(sourceSchema);
  const [updatedTargetSchema, setUpdatedTargetSchema] = useState(targetSchema);
  const [metadataMapping, setMetadataMapping] = useState<MetadataMapping | null>(null);

  const handleDictionaryComplete = (schema: Schema, mapping: MetadataMapping) => {
    setUpdatedSourceSchema(schema);
    setMetadataMapping(mapping);
    setStep('complete');
  };

  const handleManualInput = () => {
    // Implement manual input logic here
    setStep('complete');
  };

  const handleSkipToAI = () => {
    setStep('complete');
  };

  const renderInitialStep = () => (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Data Ingestion Options</h2>
      <div className="flex space-x-4">
        <button
          onClick={() => setStep('dictionary')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Use Data Dictionary
        </button>
        <button
          onClick={() => setStep('manual')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Manual Input
        </button>
        <button
          onClick={handleSkipToAI}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Skip to AI Mapping
        </button>
      </div>
    </div>
  );

  return (
    <div className="mt-8">
      <h1 className="text-3xl font-bold mb-8">Data Ingestion and Preparation</h1>
      {step === 'initial' && renderInitialStep()}
      {step === 'dictionary' && (
        <DataDictionaryWizard sourceSchema={sourceSchema} onComplete={handleDictionaryComplete} />
      )}
      {step === 'manual' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Manual Input</h2>
          {/* Implement manual input interface here */}
          <button onClick={handleManualInput} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Complete Manual Input
          </button>
        </div>
      )}
      {step === 'complete' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Ingestion Complete</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Source Schema</h3>
              <SchemaViewer schema={updatedSourceSchema} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Target Schema</h3>
              <SchemaViewer schema={updatedTargetSchema} />
            </div>
          </div>
          {metadataMapping && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-2">Metadata Mapping</h3>
              <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(metadataMapping, null, 2)}</pre>
            </div>
          )}
          <div className="mt-8 text-center">
            <button
              onClick={() => onProceedToMapping(updatedSourceSchema, updatedTargetSchema, metadataMapping || {
                fileNameFields: [],
                fileDataTypeField: '',
                columnNamesField: '',
                relevantFields: [],
              })}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Continue to AI Mapping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngestionPage;