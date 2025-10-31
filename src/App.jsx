import React, { useState } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { calculateFinances } from './utils/calculations';
import GameHeader from './components/GameHeader';
import Notification from './components/Notification';
import OverviewTab from './views/OverviewTab';
import MinistriesTab from './views/MinistriesTab';
import TerritoryTab from './views/TerritoryTab';
import FinancesTab from './views/FinancesTab';
import TechnologyTab from './views/TechnologyTab';
import ResourcesTab from './views/ResourcesTab';
import TradeTab from './views/TradeTab';
import CitizensTab from './views/CitizensTab';

function App() {
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
    startResearch,
    exportResource,
    upgradeEducation,
    approveBusinessExpansion,
    destroyCitizenBusiness,
    citizenSystem,
    populationNeeds
  } = useGameLogic();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [presidentName, setPresidentName] = useState('');
  const [nationName, setNationName] = useState('');

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
            🏛️ Nation Builder
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Construa e gerencie sua própria nação
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seu Nome (Presidente)
              </label>
              <input
                type="text"
                value={presidentName}
                onChange={(e) => setPresidentName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite seu nome"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Nação
              </label>
              <input
                type="text"
                value={nationName}
                onChange={(e) => setNationName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite o nome da sua nação"
              />
            </div>
            
            <button
              onClick={() => startGame(presidentName, nationName)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition transform hover:scale-105"
              disabled={!presidentName || !nationName}
            >
              🚀 Fundar Nação
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-bold text-sm text-blue-900 mb-2">
              ✨ Novidades nesta versão:
            </h3>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• 🎓 Sistema de Educação com 5 níveis</li>
              <li>• 👥 Cidadãos criam negócios autônomos</li>
              <li>• 🌾 11 produtos agrícolas diferentes</li>
              <li>• 😊 Sistema de satisfação da população</li>
              <li>• 🚀 Expansão de negócios</li>
              <li>• 💼 Economia orgânica e dinâmica</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const finances = calculateFinances(nation);

  const tabs = [
    { id: 'overview', name: '📊 Visão Geral', icon: '📊' },
    { id: 'ministries', name: '🏛️ Ministérios', icon: '🏛️' },
    { id: 'citizens', name: '👥 Cidadãos', icon: '👥', badge: citizenSystem?.autonomousBusinesses?.length || 0 },
    { id: 'territory', name: '🗺️ Território', icon: '🗺️' },
    { id: 'resources', name: '📦 Recursos', icon: '📦' },
    { id: 'finances', name: '💰 Finanças', icon: '💰' },
    { id: 'technology', name: '🔬 Tecnologia', icon: '🔬' },
    { id: 'trade', name: '🌍 Comércio', icon: '🌍' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <GameHeader nation={nation} president={president} />
      <Notification notifications={notifications} />
      
      <div className="container mx-auto p-4">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-4 p-2">
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition relative ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.icon} {tab.name.replace(tab.icon, '').trim()}
                {tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Next Turn Button */}
        <div className="bg-white rounded-lg shadow mb-4 p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Mês Atual</p>
              <p className="text-2xl font-bold text-blue-600">{nation.currentMonth}</p>
            </div>
            <button
              onClick={nextTurn}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition transform hover:scale-105 flex items-center gap-2"
            >
              ⏭️ Próximo Turno
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'overview' && (
            <OverviewTab nation={nation} finances={finances} />
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

          {activeTab === 'citizens' && (
            <CitizensTab
              nation={nation}
              citizenSystem={citizenSystem}
              populationNeeds={populationNeeds}
              onUpgradeEducation={upgradeEducation}
              onApproveExpansion={approveBusinessExpansion}
              onDestroyBusiness={destroyCitizenBusiness}
            />
          )}
          
          {activeTab === 'territory' && (
            <TerritoryTab nation={nation} />
          )}

          {activeTab === 'resources' && (
            <ResourcesTab nation={nation} />
          )}
          
          {activeTab === 'finances' && (
            <FinancesTab nation={nation} finances={finances} />
          )}
          
          {activeTab === 'technology' && (
            <TechnologyTab 
              nation={nation} 
              onStartResearch={startResearch}
            />
          )}

          {activeTab === 'trade' && (
            <TradeTab
              nation={nation}
              onExportResource={exportResource}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;