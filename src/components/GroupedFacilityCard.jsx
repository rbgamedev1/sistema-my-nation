import React, { useState } from 'react';
import { TECHNOLOGIES } from '../data/technologies';
import { calculateGroupTotals } from '../utils/facilityUtils';

const GroupedFacilityCard = ({ group, onUpdateJobSalary }) => {
  const [expanded, setExpanded] = useState(false);
  const totals = calculateGroupTotals(group);

  return (
    <div className={`p-4 rounded-lg border-2 ${
      group.appliedTechs.length > 0 
        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50' 
        : 'border-blue-600 bg-gray-50'
    }`}>
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h5 className="font-bold text-lg">{group.name}</h5>
            <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full font-bold">
              x{group.count}
            </span>
          </div>
          {group.appliedTechs.length > 0 && (
            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              ⚡ {group.appliedTechs.length} Tech
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-500">
          Investimento Total: R$ {group.totalInvestment.toLocaleString()} | 
          Vagas: {totals.filledVacancies}/{totals.totalVacancies} ({totals.fillRate.toFixed(0)}%)
        </p>
        
        {totals.totalMonthlyCost > 0 && (
          <p className="text-sm text-blue-600 font-medium">
            Custo mensal total: R$ {totals.totalMonthlyCost.toLocaleString()}
          </p>
        )}
      </div>

      {/* Tecnologias Aplicadas */}
      {group.appliedTechs.length > 0 && (
        <div className="mb-3 pb-3 border-b-2 border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-2">🔬 Tecnologias Ativas:</p>
          <div className="flex flex-wrap gap-1">
            {group.appliedTechs.map(techId => {
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

      {/* Jobs Summary */}
      <div className="space-y-2">
        {Object.values(group.jobs).map(job => (
          <div key={job.role} className="bg-white p-3 rounded border-l-4 border-blue-500">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <p className="font-medium">{job.role}</p>
                <p className="text-sm text-gray-500">
                  Total de Vagas: {job.totalCount} | Preenchidas: {job.totalFilled} ({((job.totalFilled/job.totalCount)*100).toFixed(0)}%)
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  Média: R$ {job.avgSalary.toLocaleString()}/mês
                </p>
                <p className="text-xs text-gray-500">
                  Mínimo: R$ {job.minSalary.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(job.totalFilled/job.totalCount)*100}%` }}
              />
            </div>
            
            <p className="text-xs text-gray-500">
              Custo total: R$ {(job.totalFilled * job.avgSalary).toLocaleString()}/mês
            </p>
          </div>
        ))}
      </div>

      {/* Benefícios Totais */}
      {Object.keys(group.benefits).length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs font-medium text-gray-600 mb-1">Benefícios Totais:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(group.benefits).map(([key, value]) => (
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

      {/* Expandir para ver detalhes individuais */}
      {group.count > 1 && (
        <div className="mt-3 pt-3 border-t">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {expanded ? '▼' : '▶'} {expanded ? 'Ocultar' : 'Ver'} detalhes de cada unidade ({group.count})
          </button>
          
          {expanded && (
            <div className="mt-3 space-y-2 pl-4 border-l-2 border-gray-300">
              {group.facilities.map((facility, index) => (
                <div key={facility.id} className="bg-gray-50 p-2 rounded text-xs">
                  <p className="font-medium mb-1">Unidade #{index + 1}</p>
                  {facility.jobs.map(job => (
                    <div key={job.role} className="flex justify-between text-gray-600 mb-1">
                      <span>{job.role}: {job.filled || 0}/{job.count}</span>
                      <span>R$ {(job.currentSalary || job.minSalary).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupedFacilityCard;