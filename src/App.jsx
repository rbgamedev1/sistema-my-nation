// src/App.jsx

import React, { useState } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { calculateFinances } from './utils/calculations';

// Components
import GameHeader from './components/GameHeader';
import Notification from './components/Notification';
import OverviewTab from './views/OverviewTab';
import TerritoryTab from './views/TerritoryTab';
import MinistriesTab from './views/MinistriesTab';
import FinancesTab from './views/FinancesTab';
import TechnologyTab from './views/TechnologyTab';

const MyNation = () => {
  const {
    gameState,
    president,
    nation,
    notifications,
    startGame,
    createMinistry,
    hireMinister,
    updateMinisterSalary,
    createFacility,
    updateJobSalary,
    nextTurn,
    startResearch
  } = useGameLogic();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [setupForm, setSetupForm] = useState({ name: '', nationName: '' });

  const finances = nation ? calculateFinances(nation) : null;

  // Setup Screen
  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-4xl font-bold text-center text-blue-900 mb-2">
            My Nation
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Simulador Presidencial
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Presidente
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite seu nome"
                value={setupForm.name}
                onChange={(e) => setSetupForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Nação
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite o nome da sua nação"
                value={setupForm.nationName}
                onChange={(e) => setSetupForm(prev => ({ ...prev, nationName: e.target.value }))}
              />
            </div>
            
            <button
              onClick={() => startGame(setupForm.name, setupForm.nationName)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!setupForm.name || !setupForm.nationName}
            >
              Fundar Nação
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>💡 Dica: Pesquise tecnologias para melhorar suas benfeitorias!</p>
          </div>
        </div>
      </div>
    );
  }

  // Main Game Screen
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Notifications */}
      <Notification notifications={notifications} />

      {/* Header */}
      <GameHeader nation={nation} president={president} />

      {/* Navigation */}
      <div className="bg-white shadow">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex gap-1">
            {['overview', 'territory', 'ministries', 'technology', 'finances'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab === 'overview' && '📊 Visão Geral'}
                {tab === 'territory' && '🗺️ Território'}
                {tab === 'ministries' && '🏛️ Ministérios'}
                {tab === 'technology' && '🔬 Tecnologia'}
                {tab === 'finances' && '💰 Finanças'}
              </button>
            ))}
          </div>
          <button
            onClick={nextTurn}
            className="mr-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-bold transition shadow-lg transform hover:scale-105"
          >
            ⏩ Próximo Mês
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto p-6">
        {activeTab === 'overview' && (
          <OverviewTab nation={nation} finances={finances} />
        )}

        {activeTab === 'territory' && (
          <TerritoryTab nation={nation} />
        )}

        {activeTab === 'ministries' && (
          <MinistriesTab
            nation={nation}
            selectedMinistry={selectedMinistry}
            setSelectedMinistry={setSelectedMinistry}
            onCreateMinistry={createMinistry}
            onHireMinister={hireMinister}
            onUpdateMinisterSalary={updateMinisterSalary}
            onCreateFacility={createFacility}
            onUpdateJobSalary={updateJobSalary}
          />
        )}

        {activeTab === 'technology' && (
          <TechnologyTab
            nation={nation}
            onStartResearch={startResearch}
          />
        )}

        {activeTab === 'finances' && (
          <FinancesTab nation={nation} finances={finances} />
        )}
      </div>
    </div>
  );
};

export default MyNation;