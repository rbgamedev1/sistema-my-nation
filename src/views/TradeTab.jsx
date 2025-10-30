// src/views/TradeTab.jsx - SISTEMA DE EXPORTAÇÃO

import React, { useState } from 'react';

const TradeTab = ({ nation, onExportResource }) => {
  const [exportAmounts, setExportAmounts] = useState({});

  // Preços base por unidade (em R$)
  const basePrices = {
    agua: 10,
    petroleo: 100,
    gas: 80,
    ferro: 50,
    ouro: 500,
    cobre: 70,
    terrasAraveis: 30,
    food: 20,
    energy: 15,
    fuel: 90,
    madeira: 40,
    furniture: 150,
    fruits: 25,
    vegetables: 25,
    clothing: 120,
    medicine: 200,
    floresta: 35
  };

  const resourceIcons = {
    agua: '💧',
    petroleo: '🛢️',
    gas: '💨',
    ferro: '⚙️',
    ouro: '🏆',
    cobre: '🔶',
    terrasAraveis: '🌾',
    food: '🍞',
    energy: '⚡',
    fuel: '⛽',
    madeira: '🪵',
    furniture: '🪑',
    fruits: '🍎',
    vegetables: '🥕',
    clothing: '👕',
    medicine: '💊',
    floresta: '🌲'
  };

  const resourceNames = {
    agua: 'Água',
    petroleo: 'Petróleo',
    gas: 'Gás Natural',
    ferro: 'Ferro',
    ouro: 'Ouro',
    cobre: 'Cobre',
    terrasAraveis: 'Terras Aráveis',
    food: 'Alimentos',
    energy: 'Energia',
    fuel: 'Combustível',
    madeira: 'Madeira',
    furniture: 'Móveis',
    fruits: 'Frutas',
    vegetables: 'Vegetais',
    clothing: 'Roupas',
    medicine: 'Medicamentos',
    floresta: 'Floresta'
  };

  const handleExport = (resource) => {
    const amount = parseInt(exportAmounts[resource]);
    if (!isNaN(amount) && amount > 0) {
      onExportResource(resource, amount);
      setExportAmounts({ ...exportAmounts, [resource]: '' });
    }
  };

  const exportableResources = Object.entries(nation.resourceStorage || {})
    .filter(([_, amount]) => amount > 0)
    .sort(([a], [b]) => (resourceNames[a] || a).localeCompare(resourceNames[b] || b));

  const totalStorageValue = exportableResources.reduce((sum, [resource, amount]) => {
    return sum + (amount * (basePrices[resource] || 50));
  }, 0);

  return (
    <div className="space-y-6">
      {/* Resumo de Comércio */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-lg shadow border-2 border-emerald-300">
        <h2 className="text-2xl font-bold mb-4 text-emerald-900">💱 Centro de Comércio Internacional</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Recursos Disponíveis</p>
            <p className="text-2xl font-bold text-emerald-600">{exportableResources.length}</p>
            <p className="text-xs text-gray-500">tipos diferentes</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Valor Total em Estoque</p>
            <p className="text-2xl font-bold text-blue-600">R$ {totalStorageValue.toLocaleString()}</p>
            <p className="text-xs text-gray-500">potencial de exportação</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Tesouro Atual</p>
            <p className="text-2xl font-bold text-amber-600">R$ {nation.treasury.toLocaleString()}</p>
            <p className="text-xs text-gray-500">após exportações</p>
          </div>
        </div>
      </div>

      {/* Informações sobre Comércio */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
        <h3 className="font-bold text-lg mb-2">💡 Como Funciona o Comércio</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• <strong>Exportação:</strong> Venda recursos excedentes por dinheiro para aumentar seu tesouro</li>
          <li>• <strong>Preços Fixos:</strong> Cada recurso tem um preço de mercado internacional estabelecido</li>
          <li>• <strong>Estoque Automático:</strong> Recursos excedentes são armazenados automaticamente todo mês</li>
          <li>• <strong>Estratégia:</strong> Mantenha sempre uma reserva para emergências antes de exportar tudo</li>
          <li>• <strong>Recursos Raros:</strong> Ouro e medicamentos têm valores muito altos no mercado</li>
        </ul>
      </div>

      {/* Lista de Recursos Exportáveis */}
      {exportableResources.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">📦 Recursos Disponíveis para Exportação</h3>
          
          <div className="space-y-3">
            {exportableResources.map(([resource, amount]) => {
              const price = basePrices[resource] || 50;
              const maxValue = Math.floor(amount * price);
              const currentAmount = exportAmounts[resource] || '';
              const currentValue = currentAmount ? Math.floor(parseInt(currentAmount) * price) : 0;

              return (
                <div 
                  key={resource}
                  className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-lg border-2 border-emerald-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{resourceIcons[resource] || '📦'}</span>
                      <div>
                        <h4 className="font-bold text-lg">{resourceNames[resource] || resource}</h4>
                        <p className="text-sm text-gray-600">
                          Estoque: {Math.floor(amount).toLocaleString()} unidades
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Preço Unitário</p>
                      <p className="text-xl font-bold text-emerald-600">
                        R$ {price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg mb-3">
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Valor Máximo Possível</p>
                        <p className="text-lg font-bold text-blue-600">
                          R$ {maxValue.toLocaleString()}
                        </p>
                      </div>
                      {currentAmount && (
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Valor da Exportação</p>
                          <p className="text-lg font-bold text-green-600">
                            R$ {currentValue.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={currentAmount}
                      onChange={(e) => setExportAmounts({ 
                        ...exportAmounts, 
                        [resource]: e.target.value 
                      })}
                      placeholder="Quantidade a exportar"
                      min="1"
                      max={Math.floor(amount)}
                      className="flex-1 px-4 py-2 border-2 border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => setExportAmounts({ 
                        ...exportAmounts, 
                        [resource]: Math.floor(amount).toString()
                      })}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-medium"
                    >
                      Máximo
                    </button>
                    <button
                      onClick={() => setExportAmounts({ 
                        ...exportAmounts, 
                        [resource]: Math.floor(amount * 0.5).toString()
                      })}
                      className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition font-medium"
                    >
                      50%
                    </button>
                    <button
                      onClick={() => handleExport(resource)}
                      disabled={!currentAmount || parseInt(currentAmount) <= 0}
                      className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      💰 Exportar
                    </button>
                  </div>

                  {currentAmount && parseInt(currentAmount) > Math.floor(amount) && (
                    <p className="text-red-600 text-sm mt-2">
                      ⚠️ Quantidade maior que o estoque disponível!
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-bold mb-2 text-gray-700">Nenhum Recurso Disponível</h3>
          <p className="text-gray-600 mb-4">
            Você ainda não possui recursos excedentes em estoque para exportar.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-left max-w-md mx-auto">
            <p className="text-sm text-gray-700">
              <strong>Como acumular recursos:</strong>
            </p>
            <ul className="text-sm text-gray-700 mt-2 space-y-1 list-disc list-inside">
              <li>Construa benfeitorias que produzem recursos</li>
              <li>Produza mais do que sua população consome</li>
              <li>O excedente é armazenado automaticamente todo mês</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tabela de Preços */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">📊 Tabela de Preços do Mercado Internacional</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(basePrices)
            .sort(([a], [b]) => (resourceNames[a] || a).localeCompare(resourceNames[b] || b))
            .map(([resource, price]) => {
              const inStock = (nation.resourceStorage?.[resource] || 0) > 0;
              
              return (
                <div 
                  key={resource} 
                  className={`p-3 rounded-lg border-2 ${
                    inStock 
                      ? 'bg-green-50 border-green-300' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{resourceIcons[resource] || '📦'}</span>
                    <span className="text-xs font-medium">{resourceNames[resource] || resource}</span>
                  </div>
                  <p className={`text-lg font-bold ${inStock ? 'text-green-600' : 'text-gray-600'}`}>
                    R$ {price.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">por unidade</p>
                  {inStock && (
                    <p className="text-xs text-green-600 font-medium mt-1">
                      ✓ Em estoque
                    </p>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Dicas de Comércio */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded">
        <h3 className="font-bold text-lg mb-2">💡 Dicas de Comércio Estratégico</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• <strong>Recursos Valiosos:</strong> Ouro (R$ 500), Medicamentos (R$ 200) e Móveis (R$ 150) são os mais lucrativos</li>
          <li>• <strong>Mantenha Reservas:</strong> Sempre guarde pelo menos 3-5 meses de consumo antes de exportar</li>
          <li>• <strong>Excedentes Automáticos:</strong> 50% da produção excedente é armazenada todo mês</li>
          <li>• <strong>Estratégia de Crescimento:</strong> Use o dinheiro das exportações para construir mais benfeitorias</li>
          <li>• <strong>Recursos Raros:</strong> Se seu território não tem certos recursos, você precisará produzi-los</li>
          <li>• <strong>Balanceamento:</strong> Não exporte recursos essenciais (água, alimentos, energia) se sua população precisa deles</li>
        </ul>
      </div>
    </div>
  );
};

export default TradeTab;