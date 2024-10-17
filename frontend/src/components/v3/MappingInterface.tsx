import React, { useState } from 'react';
import { Schema, Mapping } from '../types';
import { X, Search } from 'lucide-react';

interface MappingInterfaceProps {
  sourceSchema: Schema;
  targetSchema: Schema;
  mapping: Mapping[];
  onMappingUpdate: (updatedMapping: Mapping[]) => void;
}

const MappingInterface: React.FC<MappingInterfaceProps> = ({
  sourceSchema,
  targetSchema,
  mapping,
  onMappingUpdate,
}) => {
  const [selectedMapping, setSelectedMapping] = useState<Mapping | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleMappingChange = (sourceColumn: string, targetColumn: string, targetTable: string) => {
    const updatedMapping = mapping.map((m) =>
      m.sourceColumn === sourceColumn
        ? { ...m, targetColumn, targetTable, confidence: 1, explanation: "User-defined mapping", userCorrected: true }
        : m
    );
    onMappingUpdate(updatedMapping);
    setSelectedMapping(null);
  };

  const openMappingDialog = (m: Mapping) => {
    setSelectedMapping(m);
    setSearchTerm('');
  };

  const filteredTargetColumns = targetSchema.columns.filter(
    (column) => column.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">Source Column</th>
            <th className="border p-2 text-left">Target Table</th>
            <th className="border p-2 text-left">Target Column</th>
            <th className="border p-2 text-left">Confidence</th>
            <th className="border p-2 text-left">Explanation</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mapping.map((m) => (
            <tr key={m.sourceColumn} className={m.userCorrected ? 'bg-green-50' : ''}>
              <td className="border p-2">{m.sourceColumn}</td>
              <td className="border p-2">{m.targetTable}</td>
              <td className="border p-2">{m.targetColumn}</td>
              <td className="border p-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${m.confidence * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs">{(m.confidence * 100).toFixed(0)}%</span>
              </td>
              <td className="border p-2 text-sm">{m.explanation}</td>
              <td className="border p-2">
                <button
                  onClick={() => openMappingDialog(m)}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                >
                  Change Mapping
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedMapping && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-3/4 max-h-3/4 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Change Mapping for {selectedMapping.sourceColumn}</h3>
              <button onClick={() => setSelectedMapping(null)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Search target columns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2 text-left">Target Table</th>
                  <th className="border p-2 text-left">Target Column</th>
                  <th className="border p-2 text-left">Confidence</th>
                  <th className="border p-2 text-left">Explanation</th>
                  <th className="border p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTargetColumns.map((column) => {
                  const confidence = calculateConfidence(selectedMapping.sourceColumn, column.name);
                  const explanation = generateExplanation(selectedMapping.sourceColumn, column.name);
                  return (
                    <tr key={column.name} className={column.name === selectedMapping.targetColumn ? 'bg-pink-100' : ''}>
                      <td className="border p-2">{targetSchema.name}</td>
                      <td className="border p-2">{column.name}</td>
                      <td className="border p-2">{(confidence * 100).toFixed(0)}%</td>
                      <td className="border p-2">{explanation}</td>
                      <td className="border p-2">
                        <button
                          onClick={() => handleMappingChange(selectedMapping.sourceColumn, column.name, targetSchema.name)}
                          className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const calculateConfidence = (sourceColumn: string, targetColumn: string) => {
  // Implement a simple confidence calculation based on string similarity
  const similarity = calculateStringSimilarity(sourceColumn, targetColumn);
  return similarity;
};

const calculateStringSimilarity = (a: string, b: string) => {
  const aLower = a.toLowerCase();
  const bLower = b.toLowerCase();
  const maxLength = Math.max(aLower.length, bLower.length);
  let matches = 0;
  for (let i = 0; i < maxLength; i++) {
    if (aLower[i] === bLower[i]) matches++;
  }
  return matches / maxLength;
};

const generateExplanation = (sourceColumn: string, targetColumn: string) => {
  const similarity = calculateStringSimilarity(sourceColumn, targetColumn);
  if (similarity > 0.8) {
    return "Column names are very similar";
  } else if (similarity > 0.5) {
    return "Column names have some similarity";
  } else {
    return "Best guess based on available columns";
  }
};

export default MappingInterface;