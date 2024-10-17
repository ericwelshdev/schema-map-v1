import React, { useState } from 'react';
import { Upload, ArrowRight, Check } from 'lucide-react';
import { Schema, Column, MetadataMapping } from '../types';
import { parseCSV, inferSchemaFromFileContent } from '../utils/fileParser';

interface DataDictionaryWizardProps {
  sourceSchema: Schema;
  onComplete: (updatedSchema: Schema, metadataMapping: MetadataMapping) => void;
}

const DataDictionaryWizard: React.FC<DataDictionaryWizardProps> = ({ sourceSchema, onComplete }) => {
  const [step, setStep] = useState(1);
  const [dictionarySchema, setDictionarySchema] = useState<Schema | null>(null);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [importantColumns, setImportantColumns] = useState<string[]>([]);
  const [metadataMapping, setMetadataMapping] = useState<MetadataMapping>({
    fileNameFields: [],
    fileDataTypeField: '',
    columnNamesField: '',
    relevantFields: [],
  });

  const handleDictionaryUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const fileContent = parseCSV(content);
        const schema = inferSchemaFromFileContent(file.name, fileContent);
        setDictionarySchema(schema);
        setStep(2);
      };
      reader.readAsText(file);
    }
  };

  const handleColumnMapping = (sourceColumn: string, dictionaryColumn: string) => {
    setColumnMapping((prev) => ({ ...prev, [sourceColumn]: dictionaryColumn }));
  };

  const handleImportantColumnToggle = (column: string) => {
    setImportantColumns((prev) =>
      prev.includes(column) ? prev.filter((c) => c !== column) : [...prev, column]
    );
  };

  const handleMetadataMappingChange = (field: keyof MetadataMapping, value: string | string[]) => {
    setMetadataMapping((prev) => ({ ...prev, [field]: value }));
  };

  const handleComplete = () => {
    const updatedSchema: Schema = {
      ...sourceSchema,
      columns: sourceSchema.columns.map((column) => ({
        ...column,
        description: dictionarySchema?.columns.find((c) => c.name === columnMapping[column.name])?.sample || '',
        isImportant: importantColumns.includes(column.name),
      })),
    };
    onComplete(updatedSchema, metadataMapping);
  };

  const renderStep1 = () => (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Step 1: Upload Data Dictionary</h3>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <input
          type="file"
          id="dictionary-upload"
          className="hidden"
          onChange={handleDictionaryUpload}
          accept=".csv"
        />
        <label
          htmlFor="dictionary-upload"
          className="cursor-pointer flex flex-col items-center justify-center"
        >
          <Upload className="w-12 h-12 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            Click to upload your data dictionary CSV file
          </p>
        </label>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Step 2: Map Columns</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">Source Column</th>
            <th className="border p-2 text-left">Dictionary Column</th>
          </tr>
        </thead>
        <tbody>
          {sourceSchema.columns.map((column) => (
            <tr key={column.name}>
              <td className="border p-2">{column.name}</td>
              <td className="border p-2">
                <select
                  value={columnMapping[column.name] || ''}
                  onChange={(e) => handleColumnMapping(column.name, e.target.value)}
                  className="w-full p-1 border rounded"
                >
                  <option value="">Select a column</option>
                  {dictionarySchema?.columns.map((dictColumn) => (
                    <option key={dictColumn.name} value={dictColumn.name}>
                      {dictColumn.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => setStep(3)}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Next <ArrowRight className="inline-block ml-1" size={16} />
      </button>
    </div>
  );

  const renderStep3 = () => (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Step 3: Select Important Columns</h3>
      <p className="text-sm text-gray-600 mb-2">
        Choose columns that provide detailed information about the data:
      </p>
      <div className="grid grid-cols-2 gap-4">
        {sourceSchema.columns.map((column) => (
          <div key={column.name} className="flex items-center">
            <input
              type="checkbox"
              id={`important-${column.name}`}
              checked={importantColumns.includes(column.name)}
              onChange={() => handleImportantColumnToggle(column.name)}
              className="mr-2"
            />
            <label htmlFor={`important-${column.name}`}>{column.name}</label>
          </div>
        ))}
      </div>
      <button
        onClick={() => setStep(4)}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Next <ArrowRight className="inline-block ml-1" size={16} />
      </button>
    </div>
  );

  const renderStep4 = () => (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Step 4: Metadata Mapping</h3>
      <p className="text-sm text-gray-600 mb-2">
        Map the metadata fields to establish a connection between the data dictionary and the data file:
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">File Name Fields</label>
          <select
            multiple
            value={metadataMapping.fileNameFields}
            onChange={(e) => handleMetadataMappingChange('fileNameFields', Array.from(e.target.selectedOptions, option => option.value))}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {dictionarySchema?.columns.map((column) => (
              <option key={column.name} value={column.name}>
                {column.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">File Data Type Field</label>
          <select
            value={metadataMapping.fileDataTypeField}
            onChange={(e) => handleMetadataMappingChange('fileDataTypeField', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select a field</option>
            {dictionarySchema?.columns.map((column) => (
              <option key={column.name} value={column.name}>
                {column.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Column Names Field</label>
          <select
            value={metadataMapping.columnNamesField}
            onChange={(e) => handleMetadataMappingChange('columnNamesField', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select a field</option>
            {dictionarySchema?.columns.map((column) => (
              <option key={column.name} value={column.name}>
                {column.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Relevant Fields for Evaluation</label>
          <select
            multiple
            value={metadataMapping.relevantFields}
            onChange={(e) => handleMetadataMappingChange('relevantFields', Array.from(e.target.selectedOptions, option => option.value))}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {dictionarySchema?.columns.map((column) => (
              <option key={column.name} value={column.name}>
                {column.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        onClick={handleComplete}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Complete <Check className="inline-block ml-1" size={16} />
      </button>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Data Dictionary Wizard</h2>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
    </div>
  );
};

export default DataDictionaryWizard;