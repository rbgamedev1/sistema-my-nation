import React from 'react';
import JobPosition from './JobPosition';
import { TECHNOLOGIES } from '../data/technologies';

const FacilityCard = ({ facility, onUpdateJobSalary }) => {
  const totalVacancies = facility.jobs.reduce((sum, j) => sum + j.count, 0);
  const filledVacancies = facility.jobs.reduce((sum, j) => sum + (j.filled || 0), 0);
  const totalMonthlyCost = facility.jobs.reduce(
    (sum, job) => sum + (job.filled || 0) * (job.currentSalary || job.minSalary),
    0
  );

  // Tecnologias aplicadas a esta benfeitoria
  const appliedTechs = facility.appliedTechs || [];

  return (
    <div className={`p-4 rounded-lg border-2 ${
      appliedTechs.length > 0 ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50' : 'border-blue-600 bg-gray-50'
    }`}>
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <h5 className="font-bold text-lg">{facility.name}</h5>
          {appliedTechs.length > 0 && (
            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              ⚡ {appliedTechs.length} Tech
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-500">
          Investimento: R$ {facility.cost.toLocaleString()} | 
          Vagas: {filledVacancies}/{totalVacancies} ({((filledVacancies/totalVacancies)*100).toFixed(0)}%)
        </p>
        
        {totalMonthlyCost > 0 && (
          <p className="text-sm text-blue-600 font-medium">
            Custo mensal: R$ {totalMonthlyCost.toLocaleString()}
          </p>
        )}
      </div>

      {/* Tecnologias Aplicadas */}
      {appliedTechs.length > 0 && (
        <div className="mb-3 pb-3 border-b-2 border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-2">🔬 Tecnologias Ativas:</p>
          <div className="flex flex-wrap gap-1">
            {appliedTechs.map(techId => {
              const tech = TECHNOLOGIES[techId];
              if (!tech) return null;
              return (
                <div
                  key={techId}
                  className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded flex items-center gap-1"
                  title={tech.description}
                >
                  <span>{tech.icon}</span>
                  <span className="font-medium">{tech.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {facility.jobs.map(job => (
          <JobPosition
            key={job.role}
            job={job}
            facilityId={facility.id}
            onUpdateSalary={onUpdateJobSalary}
          />
        ))}
      </div>

      {facility.benefits && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs font-medium text-gray-600 mb-1">Benefícios Totais:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(facility.benefits).map(([key, value]) => (
              <span 
                key={key} 
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium"
              >
                {key}: +{value}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilityCard;