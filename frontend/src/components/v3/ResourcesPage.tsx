import React from 'react';
import { UploadedFile } from '../types';

interface ResourcesPageProps {
  uploadedFiles: UploadedFile[];
  onFileSelect: (file: UploadedFile) => void;
}

const ResourcesPage: React.FC<ResourcesPageProps> = ({ uploadedFiles, onFileSelect }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Resources</h2>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">File Name</th>
            <th className="p-2 text-left">Classification</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {uploadedFiles.map((file, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{file.name}</td>
              <td className="p-2">{file.classification}</td>
              <td className="p-2">
                <button
                  onClick={() => onFileSelect(file)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Select
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResourcesPage;