import React from 'react';
import { Schema } from '../types';

interface SchemaViewerProps {
  schema: Schema;
}

const SchemaViewer: React.FC<SchemaViewerProps> = ({ schema }) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">{schema.name}</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">Column</th>
            <th className="border p-2 text-left">Type</th>
            <th className="border p-2 text-left">Tags</th>
            <th className="border p-2 text-left">Sample</th>
            <th className="border p-2 text-left">Description</th>
            <th className="border p-2 text-left">Important</th>
          </tr>
        </thead>
        <tbody>
          {schema.columns.map((column) => (
            <tr key={column.name}>
              <td className="border p-2">{column.name}</td>
              <td className="border p-2">{column.type}</td>
              <td className="border p-2">
                {column.tags.map((tag) => (
                  <span
                    key={tag.name}
                    className={`inline-block text-xs px-2 py-1 rounded-full mr-1 mb-1 ${
                      tag.isAI ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {tag.name}
                  </span>
                ))}
              </td>
              <td className="border p-2">{column.sample}</td>
              <td className="border p-2">{column.description || 'N/A'}</td>
              <td className="border p-2">{column.isImportant ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SchemaViewer;