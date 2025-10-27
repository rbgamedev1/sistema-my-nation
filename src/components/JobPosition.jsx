// src/components/JobPosition.jsx

import React, { useState } from 'react';

const JobPosition = ({ job, facilityId, onUpdateSalary }) => {
  const [editing, setEditing] = useState(false);
  const [salary, setSalary] = useState(job.currentSalary || job.minSalary);
  const filled = job.filled || 0;
  const percentage = (filled / job.count) * 100;

  const handleSave = () => {
    onUpdateSalary(facilityId, job.role, salary);
    setEditing(false);
  };

  return (
    <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <p className="font-medium">{job.role}</p>
          <p className="text-sm text-gray-500">
            Vagas: {job.count} | Preenchidas: {filled} ({percentage.toFixed(0)}%)
          </p>
        </div>
        <div className="text-right">
          {editing ? (
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(parseInt(e.target.value))}
                className="w-24 px-2 py-1 border rounded text-sm"
                min={job.minSalary}
              />
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
              >
                Salvar
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium">R$ {(job.currentSalary || job.minSalary).toLocaleString()}/mês</p>
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-blue-600 hover:underline"
              >
                Editar salário
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <p className="text-xs text-gray-500">
        Salário mínimo: R$ {job.minSalary.toLocaleString()} | 
        Total mensal: R$ {(filled * (job.currentSalary || job.minSalary)).toLocaleString()}
      </p>
    </div>
  );
};

export default JobPosition;