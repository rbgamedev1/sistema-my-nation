// src/views/MinistriesTab.jsx - COM BENFEITORIAS COLAPSÁVEIS

import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { MINISTRY_TYPES } from '../data/ministryTypes';
import { GAME_CONFIG } from '../data/gameConfig';

const CollapsibleFacilityGroup = ({ groupName, facilities, onUpdateJobSalary }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [newSalary, setNewSalary] = useState('');

  const totalVacancies = facilities.reduce((sum, f) => 
    sum + f.jobs.reduce((s, j) => s + j.count, 0), 0
  );
  const filledVacancies = facilities.reduce((sum, f) => 
    sum + f.jobs.reduce((s, j) => s + (j.filled || 0), 0), 0
  );
  const fillRate = totalVacancies > 0 ? (filledVacancies / totalVacancies) * 100 : 0;

  const handleUpdateSalary = (facilityId, role) => {
    const salary = parseInt(newSalary);
    if (!isNaN(salary)) {
      onUpdateJobSalary(facilityId, role, salary);
      setEditingJob(null);
      setNewSalary('');
    }
  };

  return (
    <div className="border-2 border-blue-300 rounded-lg overflow-hidden mb-3">
      {/* Header Colapsável */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex items-center justify-between hover:from-blue-600 hover:to-blue-700 transition"
      >
        <div className="flex items-center gap-3">
          {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          <div className="text-left">
            <h4 className="font-bold text-lg">{groupName} ({facilities.length} unidade{facilities.length > 1 ? 's' : ''})</h4>
            <p className="text-sm text-blue-100">
              {filledVacancies}/{totalVacancies} vagas preenchidas ({fillRate.toFixed(0)}%)
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">Clique para {isOpen ? 'ocultar' : 'ver'} detalhes</p>
        </div>
      </button>

      {/* Conteúdo Colapsável */}
      {isOpen && (
        <div className="bg-white p-4 space-y-3">
          {facilities.map((facility, index) => (
            <div key={facility.id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h5 className="font-bold mb-3">
                Unidade #{index + 1}
                {facility.appliedTechs && facility.appliedTechs.length > 0 && (
                  <span className="ml-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                    ⚡ {facility.appliedTechs.length} Tech
                  </span>
                )}
              </h5>
              
              {/* Jobs */}
              <div className="space-y-2">
                {facility.jobs.map(job => (
                  <div key={job.role} className="bg-white p-3 rounded border-l-2 border-green-500">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{job.role}</p>
                        <p className="text-sm text-gray-500">
                          {job.filled || 0}/{job.count} vagas
                        </p>
                      </div>
                      
                      <div className="text-right">
                        {editingJob === `${facility.id}-${job.role}` ? (
                          <div className="flex gap-1">
                            <input
                              type="number"
                              value={newSalary}
                              onChange={(e) => setNewSalary(e.target.value)}
                              className="w-24 px-2 py-1 border rounded text-sm"
                              min={job.minSalary}
                              placeholder={job.currentSalary || job.minSalary}
                            />
                            <button
                              onClick={() => handleUpdateSalary(facility.id, job.role)}
                              className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => {
                                setEditingJob(null);
                                setNewSalary('');
                              }}
                              className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
                            >
                              ✗
                            </button>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm font-medium">
                              R$ {(job.currentSalary || job.minSalary).toLocaleString()}/mês
                            </p>
                            <button
                              onClick={() => {
                                setEditingJob(`${facility.id}-${job.role}`);
                                setNewSalary((job.currentSalary || job.minSalary).toString());
                              }}
                              className="text-xs text-blue-600 hover:underline"
                            >
                              ✏️ Editar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${job.count > 0 ? ((job.filled || 0) / job.count) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Benefícios */}
              {facility.benefits && Object.keys(facility.benefits).length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs font-medium text-gray-600 mb-1">Benefícios:</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(facility.benefits).map(([key, value]) => (
                      <span key={key} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {key}: +{value}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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

  const availableMinistries = ['educacao', 'saude', 'defesa', 'agricultura', 'industria', 'minasEnergia', 'tecnologia', 'infraestrutura', 'justica', 'cultura'];

  return (
    <div className="space-y-6">
      {/* Create new ministry */}
      {availableMinistries.some(type => !nation.ministries.find(m => m.type === type)) && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">
            Criar Novo Ministério (Custo: R$ {GAME_CONFIG.MINISTRY_COST.toLocaleString()})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {availableMinistries.map(type => {
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
        
        // Agrupar por nome
        const facilityGroups = {};
        ministryFacilities.forEach(facility => {
          if (!facilityGroups[facility.name]) {
            facilityGroups[facility.name] = [];
          }
          facilityGroups[facility.name].push(facility);
        });

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
                    const salary = prompt('Salário mensal do ministro (mínimo R$ 5.000):', '10000');
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
                      <div className="text-sm mb-2">💰 R$ {fac.cost.toLocaleString()}</div>
                      <div className="text-xs opacity-90">
                        👥 {fac.jobs.reduce((s, j) => s + j.count, 0)} vagas
                      </div>
                    </button>
                  ))}
                </div>

                {Object.keys(facilityGroups).length > 0 && (
                  <div>
                    <h4 className="font-bold mb-3 text-lg">
                      Benfeitorias Construídas ({ministryFacilities.length} unidades):
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(facilityGroups).map(([name, facilities]) => (
                        <CollapsibleFacilityGroup
                          key={name}
                          groupName={name}
                          facilities={facilities}
                          onUpdateJobSalary={onUpdateJobSalary}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {ministryFacilities.length === 0 && (
                  <div className="bg-gray-50 p-4 rounded text-center text-gray-500">
                    Nenhuma benfeitoria construída ainda.
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
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinistriesTab;