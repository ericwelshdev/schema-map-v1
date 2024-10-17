import React from 'react';

interface ModelSelectorProps {
  selectedModel: 'openai' | 'iqvia';
  onModelChange: (model: 'openai' | 'iqvia') => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor="model-select" className="block text-sm font-medium text-gray-700">
        Select AI Model:
      </label>
      <select
        id="model-select"
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value as 'openai' | 'iqvia')}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="openai">OpenAI</option>
        <option value="iqvia">IQVIA</option>
      </select>
    </div>
  );
};

export default ModelSelector;