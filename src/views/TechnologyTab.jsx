// src/views/TechnologyTab.jsx - ATUALIZADO

import React, { useState } from 'react';
import { TECHNOLOGIES, canResearch, calculateResearchSpeed } from '../data/technologies';

const TechnologyCard = ({ techId, tech, nation, onStartResearch, isResearching, progress }) => {
  const { can, reason } = canResearch(techId, nation);
  const isResearched = nation.technologies?.researched?.includes(techId);

  return (
    <div className={`p-4 rounded-lg border-2 ${
      isResearched ? 'bg-green-50 border-green-500' :
      isResearching ? 'bg-blue-50 border-blue-500' :
      can ? 'bg-white border-gray-300 hover:border-blue-400' :
      'bg-gray-50 border-gray-200 opacity-60'
    } transition cursor-pointer`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{tech.icon}</span>
          <div>
            <h4 className="font-bold text-lg">{tech.name}</h4>
            <p className="text-xs text-gray-500">{tech.category}</p>
          </div>
        </div>
        {isResearched && <span className="text-2xl">✅</span>}
        {isResearching && <span className="text-2xl">🔬</span>}
      </div>

      <p className="text-sm text-gray-700 mb-3">{tech.description}</p>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Custo:</span>
          <span className="font-medium">R$ {tech.cost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tempo:</span>
          <span className="font-medium">{tech.researchTime} meses</span>
        </div>

        {tech.requirements.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-600 mb-1">Requisitos:</p>
            {tech.requirements.map(reqId => (
              <span 
                key={reqId}
                className={`inline-block text-xs px-2 py-1 rounded mr-1 mb-1 ${
                  nation.technologies?.researched?.includes(reqId)
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {TECHNOLOGIES[reqId].name}
              </span>
            ))}
          </div>
        )}

        {tech.effects.benefits && (
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-600 mb-1">Benefícios:</p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(tech.effects.benefits).map(([key, val]) => (
                <span key={key} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {key}: +{val}
                </span>
              ))}
            </div>
          </div>
        )}

        {tech.effects.efficiency > 1 && (
          <div className="text-xs text-purple-600">
            ⚡ +{((tech.effects.efficiency - 1) * 100).toFixed(0)}% eficiência
          </div>
        )}

        {tech.effects.costReduction < 1 && (
          <div className="text-xs text-green-600">
            💰 -{((1 - tech.effects.costReduction) * 100).toFixed(0)}% custo operacional
          </div>
        )}
      </div>

      {isResearching && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all flex items-center justify-center text-xs text-white font-bold"
              style={{ width: `${progress}%` }}
            >
              {progress > 15 && `${progress.toFixed(0)}%`}
            </div>
          </div>
          <p className="text-xs text-center mt-1 text-gray-600">
            Em pesquisa...
          </p>
        </div>
      )}

      {!isResearched && !isResearching && (
        <button
          onClick={() => can && onStartResearch(techId)}
          disabled={!can}
          className={`w-full mt-3 py-2 rounded font-medium transition ${
            can
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isResearched ? 'Pesquisada' : can ? 'Iniciar Pesquisa' : reason}
        </button>
      )}
    </div>
  );
};

const TechnologyTab = ({ nation, onStartResearch }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const hasTechMinistry = nation.ministries?.some(m => m.type === 'tecnologia' && m.minister);
  const researchSpeed = calculateResearchSpeed(nation);
  const researching = nation.technologies?.researching || [];
  const researched = nation.technologies?.researched || [];

  const categories = [
    { id: 'all', name: 'Todas', icon: '🌐' },
    { id: 'educacao', name: 'Educação', icon: '📚' },
    { id: 'saude', name: 'Saúde', icon: '🏥' },
    { id: 'agricultura', name: 'Agricultura', icon: '🌾' },
    { id: 'defesa', name: 'Defesa', icon: '🛡️' },
    { id: 'minasEnergia', name: 'Energia', icon: '⚡' },
    { id: 'industria', name: 'Indústria', icon: '🏭' },
    { id: 'infraestrutura', name: 'Infraestrutura', icon: '🏗️' },
    { id: 'justica', name: 'Justiça', icon: '⚖️' },
    { id: 'cultura', name: 'Cultura', icon: '🎭' },
    { id: 'tecnologia', name: 'Tecnologia', icon: '💻' },
    { id: 'geral', name: 'Geral', icon: '⭐' }
  ];

  const filteredTechs = Object.entries(TECHNOLOGIES).filter(([id, tech]) => 
    selectedCategory === 'all' || tech.category === selectedCategory
  );

  if (!hasTechMinistry) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
        <div className="flex items-center gap-3">
          <span className="text-yellow-600 text-4xl">⚠️</span>
          <div>
            <h3 className="font-bold text-xl mb-2">Ministério de Tecnologia Necessário</h3>
            <p className="text-gray-700 mb-3">
              Para desbloquear pesquisas tecnológicas, você precisa:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Criar o Ministério de Tecnologia (R$ {500000})</li>
              <li>Contratar um Ministro de Tecnologia</li>
              <li>Construir instalações de pesquisa para acelerar as descobertas</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats de Pesquisa */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">🔬 Centro de Pesquisa Nacional</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm text-gray-600">Velocidade de Pesquisa</p>
            <p className="text-2xl font-bold text-blue-600">{researchSpeed.toFixed(1)}x</p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <p className="text-sm text-gray-600">Tecnologias Pesquisadas</p>
            <p className="text-2xl font-bold text-green-600">{researched.length}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <p className="text-sm text-gray-600">Em Andamento</p>
            <p className="text-2xl font-bold text-purple-600">{researching.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded">
            <p className="text-sm text-gray-600">Disponíveis</p>
            <p className="text-2xl font-bold text-yellow-600">
              {Object.keys(TECHNOLOGIES).length - researched.length - researching.length}
            </p>
          </div>
        </div>
      </div>

      {/* Pesquisas em andamento */}
      {researching.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">🔬 Pesquisas em Andamento</h3>
          <div className="space-y-3">
            {researching.map(research => {
              const tech = TECHNOLOGIES[research.id];
              const progress = (research.progress / research.total) * 100;
              return (
                <div key={research.id} className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{tech.icon}</span>
                      <span className="font-bold">{tech.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {research.progress}/{research.total} meses
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-blue-600 h-4 rounded-full transition-all flex items-center justify-center text-xs text-white font-bold"
                      style={{ width: `${progress}%` }}
                    >
                      {progress.toFixed(0)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filtros de Categoria */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grade de Tecnologias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTechs.map(([techId, tech]) => {
          const research = researching.find(r => r.id === techId);
          const progress = research 
            ? (research.progress / research.total) * 100 
            : 0;
          
          return (
            <TechnologyCard
              key={techId}
              techId={techId}
              tech={tech}
              nation={nation}
              onStartResearch={onStartResearch}
              isResearching={!!research}
              progress={progress}
            />
          );
        })}
      </div>

      {filteredTechs.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          Nenhuma tecnologia disponível nesta categoria.
        </div>
      )}
    </div>
  );
};

export default TechnologyTab;