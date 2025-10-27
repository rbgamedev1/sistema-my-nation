import React, { useState, useEffect } from 'react';
import { Building2, Users, TrendingUp, DollarSign, Map, Settings, MapPin, Hammer } from 'lucide-react';

const MyNation = () => {
  const [gameState, setGameState] = useState('setup'); // setup, playing
  const [president, setPresident] = useState({ name: '', nationName: '' });
  const [nation, setNation] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMinistry, setSelectedMinistry] = useState(null);

  // Gerar território aleatório
  const generateTerritory = () => {
    const x = Math.floor(Math.random() * 100);
    const y = Math.floor(Math.random() * 100);
    
    // Recursos baseados na geolocalização
    const resources = {};
    
    // Regiões norte (y < 33) - mais petróleo e gás
    if (y < 33) {
      resources.petroleo = Math.floor(Math.random() * 1000000) + 500000;
      resources.gas = Math.floor(Math.random() * 800000) + 300000;
      resources.ferro = Math.floor(Math.random() * 300000);
    }
    // Regiões centrais (33 <= y < 66) - mais minérios diversos
    else if (y < 66) {
      resources.ouro = Math.floor(Math.random() * 100000);
      resources.ferro = Math.floor(Math.random() * 800000) + 400000;
      resources.cobre = Math.floor(Math.random() * 500000);
      resources.petroleo = Math.floor(Math.random() * 300000);
    }
    // Regiões sul (y >= 66) - mais agricultura
    else {
      resources.terrasAraveis = Math.floor(Math.random() * 500000) + 300000;
      resources.agua = Math.floor(Math.random() * 1000000) + 500000;
      resources.ferro = Math.floor(Math.random() * 200000);
    }

    return {
      x,
      y,
      size: Math.floor(Math.random() * 50) + 50,
      resources
    };
  };

  // Iniciar jogo
  const startGame = (name, nationName) => {
    const territory = generateTerritory();
    const initialNation = {
      territory,
      population: 1000000,
      treasury: 50000000, // 50 milhões inicial
      monthlyRevenue: 0,
      monthlyExpenses: 0,
      workers: {
        common: 1000000,
        ministers: 0,
        employees: 0
      },
      ministries: [],
      facilities: []
    };

    setPresident({ name, nationName });
    setNation(initialNation);
    setGameState('playing');
  };

  // Calcular receitas e despesas
  const calculateFinances = () => {
    if (!nation) return;

    // Receita: impostos sobre trabalhadores comuns (15% de 200 reais)
    const commonWorkersRevenue = nation.workers.common * 200 * 0.15;
    
    // Despesas: salários de ministros e funcionários
    let expenses = 0;
    nation.ministries.forEach(ministry => {
      if (ministry.minister) {
        expenses += ministry.minister.salary;
      }
    });
    
    nation.facilities.forEach(facility => {
      facility.employees.forEach(empGroup => {
        expenses += empGroup.count * empGroup.salary;
      });
    });

    return {
      revenue: commonWorkersRevenue,
      expenses,
      balance: commonWorkersRevenue - expenses
    };
  };

  // Criar ministério
  const createMinistry = (type) => {
    const ministryCost = 100000;
    
    if (nation.treasury < ministryCost) {
      alert('Tesouro insuficiente! Necessário R$ 100.000 para criar um ministério.');
      return;
    }

    const ministryTypes = {
      educacao: { name: 'Educação', icon: '📚', facilities: [
        { name: 'Creche', cost: 50000 },
        { name: 'Escola', cost: 100000 },
        { name: 'Universidade', cost: 500000 }
      ]},
      saude: { name: 'Saúde', icon: '🏥', facilities: [
        { name: 'Posto de Saúde', cost: 75000 },
        { name: 'Hospital', cost: 300000 },
        { name: 'Hospital Universitário', cost: 800000 }
      ]},
      defesa: { name: 'Defesa', icon: '🛡️', facilities: [
        { name: 'Base Militar', cost: 200000 },
        { name: 'Academia Militar', cost: 400000 },
        { name: 'Centro de Treinamento', cost: 150000 }
      ]},
      agricultura: { name: 'Agricultura', icon: '🌾', facilities: [
        { name: 'Fazenda Cooperativa', cost: 120000 },
        { name: 'Centro de Distribuição', cost: 180000 },
        { name: 'Instituto de Pesquisa', cost: 350000 }
      ]},
      minasEnergia: { name: 'Minas e Energia', icon: '⚡', facilities: [
        { name: 'Mina', cost: 250000 },
        { name: 'Refinaria', cost: 600000 },
        { name: 'Usina de Energia', cost: 1000000 }
      ]}
    };

    const newMinistry = {
      id: Date.now(),
      type,
      ...ministryTypes[type],
      minister: null,
      budget: 0
    };

    setNation(prev => ({
      ...prev,
      ministries: [...prev.ministries, newMinistry],
      treasury: prev.treasury - ministryCost
    }));
  };

  // Contratar ministro
  const hireMinister = (ministryId, salary) => {
    if (nation.treasury < salary) {
      alert('Tesouro insuficiente para pagar o salário do ministro!');
      return;
    }

    setNation(prev => ({
      ...prev,
      ministries: prev.ministries.map(m => 
        m.id === ministryId 
          ? { ...m, minister: { name: `Ministro ${m.name}`, salary } }
          : m
      ),
      workers: {
        ...prev.workers,
        common: prev.workers.common - 1,
        ministers: prev.workers.ministers + 1
      },
      treasury: prev.treasury - salary
    }));
  };

  // Criar benfeitoria
  const createFacility = (ministryId, facilityData) => {
    if (nation.treasury < facilityData.cost) {
      alert(`Tesouro insuficiente! Necessário R$ ${facilityData.cost.toLocaleString()} para construir ${facilityData.name}.`);
      return;
    }

    const ministry = nation.ministries.find(m => m.id === ministryId);
    
    const newFacility = {
      id: Date.now(),
      ministryId,
      type: facilityData.name,
      name: facilityData.name,
      cost: facilityData.cost,
      employees: []
    };

    setNation(prev => ({
      ...prev,
      facilities: [...prev.facilities, newFacility],
      treasury: prev.treasury - facilityData.cost
    }));
  };

  // Contratar funcionários para benfeitoria
  const hireFacilityEmployees = (facilityId, role, count, salary) => {
    const totalCost = count * salary;
    
    if (nation.treasury < totalCost) {
      alert(`Tesouro insuficiente! Necessário R$ ${totalCost.toLocaleString()} para pagar os salários.`);
      return;
    }

    if (nation.workers.common < count) {
      alert(`População insuficiente! Você tem apenas ${nation.workers.common.toLocaleString()} trabalhadores disponíveis.`);
      return;
    }

    setNation(prev => ({
      ...prev,
      facilities: prev.facilities.map(f => 
        f.id === facilityId
          ? {
              ...f,
              employees: [...f.employees, { role, count, salary }]
            }
          : f
      ),
      workers: {
        ...prev.workers,
        common: prev.workers.common - count,
        employees: prev.workers.employees + count
      },
      treasury: prev.treasury - totalCost
    }));
  };

  const finances = nation ? calculateFinances() : null;

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-4xl font-bold text-center text-blue-900 mb-2">My Nation</h1>
          <p className="text-center text-gray-600 mb-6">Simulador Presidencial</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Presidente
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite seu nome"
                onChange={(e) => setPresident(prev => ({ ...prev, name: e.target.value }))}
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
                onChange={(e) => setPresident(prev => ({ ...prev, nationName: e.target.value }))}
              />
            </div>
            
            <button
              onClick={() => startGame(president.name, president.nationName)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200"
              disabled={!president.name || !president.nationName}
            >
              Fundar Nação
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-900 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{president.nationName}</h1>
            <p className="text-blue-200">Presidente {president.name}</p>
          </div>
          <div className="flex gap-6">
            <div className="text-right">
              <p className="text-sm text-blue-200">Tesouro Nacional</p>
              <p className="text-xl font-bold">R$ {nation.treasury.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-200">População</p>
              <p className="text-xl font-bold">{nation.population.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow">
        <div className="container mx-auto">
          <div className="flex gap-1">
            {['overview', 'territory', 'ministries', 'finances'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab === 'overview' && 'Visão Geral'}
                {tab === 'territory' && 'Território'}
                {tab === 'ministries' && 'Ministérios'}
                {tab === 'finances' && 'Finanças'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Trabalhadores Comuns</p>
                  <p className="text-2xl font-bold">{nation.workers.common.toLocaleString()}</p>
                </div>
                <Users className="text-blue-500" size={32} />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Ministros</p>
                  <p className="text-2xl font-bold">{nation.workers.ministers}</p>
                </div>
                <Settings className="text-green-500" size={32} />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Funcionários Públicos</p>
                  <p className="text-2xl font-bold">{nation.workers.employees.toLocaleString()}</p>
                </div>
                <Building2 className="text-purple-500" size={32} />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Balanço Mensal</p>
                  <p className={`text-2xl font-bold ${finances.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    R$ {finances.balance.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className={finances.balance >= 0 ? 'text-green-500' : 'text-red-500'} size={32} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'territory' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Território e Recursos</h2>
            
            <div className="mb-6">
              <div className="relative bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-8 h-64 overflow-hidden">
                <div 
                  className="absolute bg-yellow-400 rounded-full opacity-70"
                  style={{
                    left: `${nation.territory.x}%`,
                    top: `${nation.territory.y}%`,
                    width: `${nation.territory.size}px`,
                    height: `${nation.territory.size}px`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
                <MapPin 
                  className="absolute text-red-600"
                  size={32}
                  style={{
                    left: `${nation.territory.x}%`,
                    top: `${nation.territory.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              </div>
            </div>

            <h3 className="text-xl font-bold mb-3">Recursos Naturais</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(nation.territory.resources).map(([resource, amount]) => (
                <div key={resource} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 capitalize">{resource.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-lg font-bold">{amount.toLocaleString()} ton</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ministries' && (
          <div className="space-y-6">
            {/* Ministérios disponíveis para criar */}
            {['educacao', 'saude', 'defesa', 'agricultura', 'minasEnergia'].some(type => 
              !nation.ministries.find(m => m.type === type)
            ) && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">Criar Novo Ministério (Custo: R$ 100.000)</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {['educacao', 'saude', 'defesa', 'agricultura', 'minasEnergia'].map(type => {
                    const exists = nation.ministries.find(m => m.type === type);
                    if (exists) return null;
                    
                    return (
                      <button
                        key={type}
                        onClick={() => createMinistry(type)}
                        className="p-4 rounded-lg font-medium transition bg-blue-600 text-white hover:bg-blue-700"
                      >
                        {type === 'educacao' && '📚 Educação'}
                        {type === 'saude' && '🏥 Saúde'}
                        {type === 'defesa' && '🛡️ Defesa'}
                        {type === 'agricultura' && '🌾 Agricultura'}
                        {type === 'minasEnergia' && '⚡ Minas/Energia'}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Ministérios criados */}
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

            {/* Detalhes do ministério selecionado */}
            {nation.ministries.map(ministry => (
              selectedMinistry === ministry.id && (
                <div key={ministry.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{ministry.icon} Ministério de {ministry.name}</h3>
                      {ministry.minister ? (
                        <p className="text-green-600">✓ Ministro contratado - R$ {ministry.minister.salary.toLocaleString()}/mês</p>
                      ) : (
                        <p className="text-red-600">✗ Sem ministro</p>
                      )}
                    </div>
                    {!ministry.minister && (
                      <button
                        onClick={() => {
                          const salary = prompt('Salário mensal do ministro (R$):');
                          if (salary) hireMinister(ministry.id, parseInt(salary));
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Contratar Ministro
                      </button>
                    )}
                  </div>

                  {ministry.minister && (
                    <div>
                      <h4 className="font-bold mb-2">Benfeitorias Disponíveis:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                        {ministry.facilities.map(fac => (
                          <button
                            key={fac.name}
                            onClick={() => createFacility(ministry.id, fac)}
                            className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 text-left"
                          >
                            <div className="font-bold">{fac.name}</div>
                            <div className="text-sm">Custo: R$ {fac.cost.toLocaleString()}</div>
                          </button>
                        ))}
                      </div>

                      {nation.facilities.filter(f => f.ministryId === ministry.id).length > 0 && (
                        <div>
                          <h4 className="font-bold mb-2">Benfeitorias Construídas:</h4>
                          <div className="space-y-2">
                            {nation.facilities.filter(f => f.ministryId === ministry.id).map(facility => (
                              <div key={facility.id} className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">{facility.name}</p>
                                    <p className="text-sm text-gray-500">Custo de construção: R$ {facility.cost.toLocaleString()}</p>
                                  </div>
                                  <button
                                    onClick={() => {
                                      const role = prompt('Cargo dos funcionários:');
                                      if (!role) return;
                                      const count = prompt('Quantidade:');
                                      if (!count) return;
                                      const salary = prompt('Salário mensal individual (R$):');
                                      if (salary) {
                                        hireFacilityEmployees(facility.id, role, parseInt(count), parseInt(salary));
                                      }
                                    }}
                                    className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
                                  >
                                    Contratar Funcionários
                                  </button>
                                </div>
                                {facility.employees.length > 0 && (
                                  <div className="mt-2 text-sm space-y-1">
                                    {facility.employees.map((emp, idx) => (
                                      <p key={idx} className="text-gray-600">
                                        • {emp.count} {emp.role}(s) - R$ {emp.salary.toLocaleString()}/mês cada (Total: R$ {(emp.count * emp.salary).toLocaleString()}/mês)
                                      </p>
                                    ))}
                                  </div>
                                )}
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
          </div>
        )}

        {activeTab === 'finances' && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Relatório Financeiro Mensal</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <span className="font-medium">Receitas (Impostos)</span>
                  <span className="text-green-600 font-bold">+ R$ {finances.revenue.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                  <span className="font-medium">Despesas (Salários)</span>
                  <span className="text-red-600 font-bold">- R$ {finances.expenses.toLocaleString()}</span>
                </div>
                
                <div className={`flex justify-between items-center p-4 rounded font-bold text-lg ${
                  finances.balance >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  <span>Balanço</span>
                  <span>{finances.balance >= 0 ? '+' : ''} R$ {finances.balance.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-3">Detalhamento de Despesas</h3>
              <div className="space-y-2">
                {nation.ministries.map(ministry => (
                  ministry.minister && (
                    <div key={ministry.id} className="flex justify-between p-2 border-b">
                      <span>Ministro de {ministry.name}</span>
                      <span className="font-medium">R$ {ministry.minister.salary.toLocaleString()}</span>
                    </div>
                  )
                ))}
                {nation.facilities.map(facility => (
                  facility.employees.map((emp, idx) => (
                    <div key={`${facility.id}-${idx}`} className="flex justify-between p-2 border-b">
                      <span>{emp.count} {emp.role}(s) - {facility.name}</span>
                      <span className="font-medium">R$ {(emp.count * emp.salary).toLocaleString()}</span>
                    </div>
                  ))
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNation;