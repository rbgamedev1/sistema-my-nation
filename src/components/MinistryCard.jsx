import React from 'react';
import FacilityCard from './FacilityCard';

const MinistryCard = ({ 
  ministry, 
  facilities,
  onHireMinister, 
  onCreateFacility,
  onUpdateJobSalary 
}) => {
  const ministryFacilities = facilities.filter(f => f.ministryId === ministry.id);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">
            {ministry.icon} Ministério de {ministry.name}
          </h3>
          {ministry.minister ? (
            <p className="text-green-600">
              ✓ {ministry.minister.name} - R$ {ministry.minister.salary.toLocaleString()}/mês
            </p>
          ) : (
            <p className="text-red-600">
              ✗ Sem ministro - Contrate um para desbloquear construções
            </p>
          )}
        </div>
        {!ministry.minister && (
          <button
            onClick={() => {
              const salary = prompt('Salário mensal do ministro (R$):', '5000');
              if (salary && !isNaN(salary)) {
                onHireMinister(ministry.id, parseInt(salary));
              }
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Contratar Ministro
          </button>
        )}
      </div>

      {ministry.minister && (
        <div>
          <h4 className="font-bold mb-3 text-lg">Construir Benfeitorias:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {ministry.facilities.map(fac => (
              <button
                key={fac.name}
                onClick={() => onCreateFacility(ministry.id, fac)}
                className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600 text-left transition transform hover:scale-105"
              >
                <div className="font-bold text-lg mb-1">{fac.name}</div>
                <div className="text-sm mb-2">
                  💰 Custo: R$ {fac.cost.toLocaleString()}
                </div>
                <div className="text-xs opacity-90">
                  👥 {fac.jobs.length} tipos de cargo | 
                  {fac.jobs.reduce((s, j) => s + j.count, 0)} vagas totais
                </div>
                {fac.benefits && (
                  <div className="text-xs mt-2 pt-2 border-t border-blue-400">
                    {Object.entries(fac.benefits).map(([key, val]) => (
                      <span key={key} className="mr-2">
                        {key}: +{val}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>

          {ministryFacilities.length > 0 && (
            <div>
              <h4 className="font-bold mb-3 text-lg">
                Benfeitorias Construídas ({ministryFacilities.length}):
              </h4>
              <div className="space-y-4">
                {ministryFacilities.map(facility => (
                  <FacilityCard
                    key={facility.id}
                    facility={facility}
                    onUpdateJobSalary={onUpdateJobSalary}
                  />
                ))}
              </div>
            </div>
          )}

          {ministryFacilities.length === 0 && (
            <div className="bg-gray-50 p-4 rounded text-center text-gray-500">
              Nenhuma benfeitoria construída ainda. Construa sua primeira benfeitoria acima!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MinistryCard;