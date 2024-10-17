import { IngestedData } from '../types';

export async function ingestData(filePath: string): Promise<IngestedData> {
  // Simulating file reading since we can't use fs in the browser
  const simulatedData = [
    { id: 1, name: 'John Doe', age: 30 },
    { id: 2, name: 'Jane Smith', age: 25 },
    { id: 3, name: 'Bob Johnson', age: 35 },
  ];

  return {
    data: simulatedData,
    headers: Object.keys(simulatedData[0]),
    rowCount: simulatedData.length,
  };
}