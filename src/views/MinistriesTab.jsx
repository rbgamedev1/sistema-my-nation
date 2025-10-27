// src/views/MinistriesTab.jsx

import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { MINISTRY_TYPES } from '../data/ministryTypes';
import { GAME_CONFIG } from '../data/gameConfig';
import { groupFacilities } from '../utils/facilityUtils';
import GroupedFacilityCard from '../components/GroupedFacilityCard';

const MinistriesTab = ({ 
  nation, 
  selectedMinistry, 
  setSelectedMinistry,
  onCreateMinistry,
  onHireMinister,
  onUpdateMinisterSalary,
  onCreateFacility,
  onUpdateJobSalary
}) => {
  const [editingMinister, setEditingMinister] = useState(null);
  const [newMinisterSalary, setNewMinisterSalary] = useState('');

  const handleUpdateMinisterSalary = (ministryId) => {
    const salary = parseInt(newMinisterSalary);
    if (!isNaN(salary) && salary >= 5000) {
      onUpdateMinisterSalary(ministryId, salary);
      setEditingMinister(null);
      setNewMinisterSalary('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Create new ministry */}
      {['educacao', 'saude', 'defesa', 'agricultura', 'minasEnergia', 'tecnologia'].some(type => 
        !nation.ministries.find(m => m.type === type)
      ) && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">
            Criar Novo Ministério (Custo: R$ {GAME_CONFIG.MINISTRY_COST.toLocaleString()})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {['educacao', 'saude', 'defesa', 'agricultura', 'minasEnergia', 'tecnologia'].map(type => {
              const exists = nation.ministries.find(m => m.type === type);
              if (exists) return null;
              
              const ministry = MINISTRY_TYPES[type];
              return (
                <button
                  key={type}
                  onClick={() => onCreateMinistry(type)}
                  className="p-4 rounded-lg font-medium transition bg-blue-600 text-white hover:bg-blue-700"
                >
                  <div className="text-2xl mb-1">{ministry.icon}</div>
                  <div className="text-sm">{ministry.name}</div>
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
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
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
                <div className="text-2xl mb-1">{ministry.icon}</div>
                <div className="text-sm">{ministry.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ministry details */}
      {nation.ministries.map(ministry => {
        if (selectedMinistry !== ministry.id) return null;

        const ministryFacilities = nation.facilities.filter(f => f.ministryId === ministry.id);
        const groupedFacilities = groupFacilities(ministryFacilities);

        return (
          <div key={ministry.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{ministry.icon} Ministério de {ministry.name}</h3>
                {ministry.minister ? (
                  <div className="mt-2">
                    {editingMinister === ministry.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={newMinisterSalary}
                          onChange={(e) => setNewMinisterSalary(e.target.value)}
                          placeholder={ministry.minister.salary}
                          min="5000"
                          className="px-3 py-2 border border-gray-300 rounded w-40"
                        />
                        <button
                          onClick={() => handleUpdateMinisterSalary(ministry.id)}
                          className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => {
                            setEditingMinister(null);
                            setNewMinisterSalary('');
                          }}
                          className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-green-600">
                          ✓ {ministry.minister.name} - R$ {ministry.minister.salary.toLocaleString()}/mês
                        </p>
                        <button
                          onClick={() => {
                            setEditingMinister(ministry.id);
                            setNewMinisterSalary(ministry.minister.salary.toString());
                          }}
                          className="text-blue-600 hover:underline text-sm mt-1"
                        >
                          Editar salário
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-red-600 mt-2">✗ Sem ministro - Contrate um para desbloquear construções</p>
                )}
              </div>
              {!ministry.minister && (
                <button
                  onClick={() => {
                    const salary = prompt('Salário mensal do ministro (mínimo R$ 5.000):', '5000');
                    if (salary && !isNaN(salary)) {
                      onHireMinister(ministry.id, parseInt(salary));
                    }
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
                      className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600 text-left transition transform hover:scale-105"
                    >
                      <div className="font-bold text-lg mb-1">{fac.name}</div>
                      <div className="text-sm mb-2">💰 Custo: R$ {fac.cost.toLocaleString()}</div>
                      <div className="text-xs opacity-90">
                        👥 {fac.jobs.length} tipos de cargo | {fac.jobs.reduce((s, j) => s + j.count, 0)} vagas totais
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

                {groupedFacilities.length > 0 && (
                  <div>
                    <h4 className="font-bold mb-3 text-lg">
                      Benfeitorias Construídas ({ministryFacilities.length} unidades, {groupedFacilities.length} tipos):
                    </h4>
                    <div className="space-y-4">
                      {groupedFacilities.map(group => (
                        <GroupedFacilityCard
                          key={group.name}
                          group={group}
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
      })}

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