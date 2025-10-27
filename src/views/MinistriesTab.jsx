import React from 'react';
import { AlertTriangle } from 'lucide-react';
import JobPosition from '../components/JobPosition';
import { MINISTRY_TYPES } from '../data/ministryTypes';
import { GAME_CONFIG } from '../data/gameConfig';

const MinistriesTab = ({ 
  nation, 
  selectedMinistry, 
  setSelectedMinistry,
  onCreateMinistry,
  onHireMinister,
  onCreateFacility,
  onUpdateJobSalary
}) => {
  return (
    <div className="space-y-6">
      {/* Create new ministry */}
      {['educacao', 'saude', 'defesa', 'agricultura', 'minasEnergia'].some(type => 
        !nation.ministries.find(m => m.type === type)
      ) && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">
            Criar Novo Ministério (Custo: R$ {GAME_CONFIG.MINISTRY_COST.toLocaleString()})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {['educacao', 'saude', 'defesa', 'agricultura', 'minasEnergia'].map(type => {
              const exists = nation.ministries.find(m => m.type === type);
              if (exists) return null;
              
              const ministry = MINISTRY_TYPES[type];
              return (
                <button
                  key={type}
                  onClick={() => onCreateMinistry(type)}
                  className="p-4 rounded-lg font-medium transition bg-blue-600 text-white hover:bg-blue-700"
                >
                  {ministry.icon} {ministry.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active ministries */}
      {nation.ministries.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Ministérios Ativos</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {nation.ministries.map(ministry => (
              <button
                key={ministry.id}
                onClick={() => setSelectedMinistry(ministry.id)}
                className={`p-4 rounded-lg font-medium transition ${
                  selectedMinistry === ministry.id
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                {ministry.icon} {ministry.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ministry details */}
      {nation.ministries.map(ministry => (
        selectedMinistry === ministry.id && (
          <div key={ministry.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{ministry.icon} Ministério de {ministry.name}</h3>
                {ministry.minister ? (
                  <p className="text-green-600">
                    ✓ {ministry.minister.name} - R$ {ministry.minister.salary.toLocaleString()}/mês
                  </p>
                ) : (
                  <p className="text-red-600">✗ Sem ministro - Contrate um para desbloquear construções</p>
                )}
              </div>
              {!ministry.minister && (
                <button
                  onClick={() => {
                    const salary = prompt('Salário mensal do ministro (R$):', '5000');
                    if (salary) onHireMinister(ministry.id, parseInt(salary));
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
                      className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600 text-left transition"
                    >
                      <div className="font-bold text-lg mb-1">{fac.name}</div>
                      <div className="text-sm mb-2">Custo: R$ {fac.cost.toLocaleString()}</div>
                      <div className="text-xs opacity-90">
                        {fac.jobs.length} tipos de cargo | {fac.jobs.reduce((s, j) => s + j.count, 0)} vagas totais
                      </div>
                    </button>
                  ))}
                </div>

                {nation.facilities.filter(f => f.ministryId === ministry.id).length > 0 && (
                  <div>
                    <h4 className="font-bold mb-3 text-lg">Benfeitorias Construídas:</h4>
                    <div className="space-y-4">
                      {nation.facilities.filter(f => f.ministryId === ministry.id).map(facility => (
                        <div key={facility.id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600">
                          <div className="mb-3">
                            <h5 className="font-bold text-lg">{facility.name}</h5>
                            <p className="text-sm text-gray-500">
                              Investimento: R$ {facility.cost.toLocaleString()} | 
                              Vagas: {facility.jobs.reduce((s, j) => s + (j.filled || 0), 0)}/
                              {facility.jobs.reduce((s, j) => s + j.count, 0)}
                            </p>
                          </div>
                          
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
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      ))}

      {nation.ministries.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-yellow-600" size={24} />
            <div>
              <h3 className="font-bold text-lg">Nenhum Ministério Criado</h3>
              <p className="text-gray-700">
                Crie ministérios para começar a desenvolver sua nação. 
                Cada ministério permite construir benfeitorias específicas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinistriesTab;