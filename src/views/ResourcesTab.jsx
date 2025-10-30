// src/views/ResourcesTab.jsx - ATUALIZADO

import React from 'react';
import { TrendingUp, TrendingDown, Minus, Users } from 'lucide-react';
import { calculateResourceBalance } from '../utils/calculations';
import { GAME_CONFIG } from '../data/gameConfig';

const ResourcesTab = ({ nation }) => {
  const { production, consumption, balance, populationConsumption } = calculateResourceBalance(nation);

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

  const allResources = Object.keys(balance).sort();

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">📊 Balanço de Recursos</h2>
        <p className="text-gray-600 mb-4">
          Recursos são gerados pelo seu território e benfeitorias, e consumidos pela população e infraestrutura.
          Recursos excedentes podem ser armazenados para uso futuro ou comércio com outras nações.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Recursos em Superávit</p>
            <p className="text-2xl font-bold text-green-600">
              {Object.values(balance).filter(v => v > 0).length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Recursos em Déficit</p>
            <p className="text-2xl font-bold text-red-600">
              {Object.values(balance).filter(v => v < 0).length}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Consumo da População</p>
            <p className="text-2xl font-bold text-blue-600">
              {Object.keys(populationConsumption).length}
            </p>
            <p className="text-xs text-gray-500">tipos de recursos</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total de Recursos</p>
            <p className="text-2xl font-bold text-purple-600">
              {allResources.length}
            </p>
          </div>
        </div>
      </div>

      {/* Requisitos da População */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow border-2 border-blue-300">
        <div className="flex items-center gap-3 mb-4">
          <Users className="text-blue-600" size={32} />
          <div>
            <h3 className="text-xl font-bold text-blue-900">Requisitos da População</h3>
            <p className="text-sm text-gray-600">
              {nation.population.toLocaleString()} habitantes consumindo recursos mensalmente
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg mb-3">
          <p className="text-sm text-gray-700 mb-3">
            <strong>Base de cálculo:</strong> Consumo per capita por 1.000 habitantes/mês
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(GAME_CONFIG.POPULATION_CONSUMPTION).map(([resource, amountPer1000]) => (
              <div key={resource} className="bg-gray-50 p-3 rounded border-l-4 border-blue-400">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{resourceIcons[resource] || '📦'}</span>
                  <span className="text-xs font-medium">{resourceNames[resource]}</span>
                </div>
                <p className="text-sm text-gray-600">{amountPer1000} / 1k hab</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg">
          <p className="text-sm font-bold text-gray-700 mb-2">Consumo Total da População Este Mês:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(populationConsumption).map(([resource, amount]) => (
              <div key={resource} className="bg-blue-50 p-3 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{resourceIcons[resource] || '📦'}</span>
                  <span className="text-xs font-medium">{resourceNames[resource]}</span>
                </div>
                <p className="text-lg font-bold text-blue-700">{amount.toFixed(1)}</p>
                <p className="text-xs text-gray-500">unidades/mês</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alertas */}
      {Object.entries(balance).filter(([_, v]) => v < 0).length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded">
          <div className="flex items-start gap-3">
            <span className="text-red-600 text-2xl">⚠️</span>
            <div>
              <h3 className="font-bold text-lg text-red-800 mb-2">Recursos Críticos!</h3>
              <p className="text-red-700 mb-2">
                Você está consumindo mais recursos do que produz. Isso causa penalidades financeiras e reduz a felicidade.
              </p>
              <ul className="list-disc list-inside space-y-1 text-red-700">
                {Object.entries(balance).filter(([_, v]) => v < 0).map(([resource, amount]) => (
                  <li key={resource}>
                    <strong>{resourceNames[resource] || resource}</strong>: Faltam {Math.abs(amount).toFixed(1)} unidades/mês
                  </li>
                ))}
              </ul>
              <p className="text-sm text-red-600 mt-2">
                💡 Dica: Construa mais benfeitorias que produzem esses recursos ou reduza o consumo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Recursos */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Detalhamento por Recurso</h3>
        
        <div className="space-y-3">
          {allResources.map(resource => {
            const prod = production[resource] || 0;
            const cons = consumption[resource] || 0;
            const bal = balance[resource] || 0;
            const popCons = populationConsumption[resource] || 0;
            const infraCons = cons - popCons;
            const isPositive = bal > 0;
            const isNegative = bal < 0;

            return (
              <div 
                key={resource}
                className={`p-4 rounded-lg border-2 ${
                  isPositive ? 'bg-green-50 border-green-300' :
                  isNegative ? 'bg-red-50 border-red-300' :
                  'bg-gray-50 border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{resourceIcons[resource] || '📦'}</span>
                    <div>
                      <h4 className="font-bold text-lg">{resourceNames[resource] || resource}</h4>
                      <p className="text-sm text-gray-600">
                        {isPositive && '✅ Excedente armazenado'}
                        {isNegative && '⚠️ Importando faltante (-5% felicidade)'}
                        {!isPositive && !isNegative && '⚖️ Equilibrado'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`flex items-center gap-2 text-2xl font-bold ${
                      isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {isPositive && <TrendingUp size={28} />}
                      {isNegative && <TrendingDown size={28} />}
                      {!isPositive && !isNegative && <Minus size={28} />}
                      <span>{bal > 0 ? '+' : ''}{bal.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-gray-500">unidades/mês</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="bg-white p-3 rounded">
                    <p className="text-xs text-gray-600 mb-1">Produção</p>
                    <p className="text-lg font-bold text-green-600">
                      +{prod.toFixed(1)}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: cons > 0 ? `${Math.min((prod / cons) * 100, 100)}%` : '100%' }}
                      />
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded">
                    <p className="text-xs text-gray-600 mb-1">Consumo Total</p>
                    <p className="text-lg font-bold text-red-600">
                      -{cons.toFixed(1)}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-red-600 h-2 rounded-full transition-all"
                        style={{ width: prod > 0 ? `${Math.min((cons / prod) * 100, 100)}%` : '100%' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Breakdown do consumo */}
                {(popCons > 0 || infraCons > 0) && (
                  <div className="bg-white p-3 rounded text-sm">
                    <p className="font-medium text-gray-700 mb-2">Detalhamento do Consumo:</p>
                    <div className="space-y-1">
                      {popCons > 0 && (
                        <div className="flex justify-between text-blue-600">
                          <span>👥 População ({nation.population.toLocaleString()} hab):</span>
                          <span className="font-bold">{popCons.toFixed(1)} unidades</span>
                        </div>
                      )}
                      {infraCons > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>🏗️ Infraestrutura ({nation.facilities.length} benfeitorias):</span>
                          <span className="font-bold">{infraCons.toFixed(1)} unidades</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {isNegative && (
                  <div className="mt-3 p-2 bg-red-100 rounded text-sm text-red-800">
                    💸 Custo de importação: ~R$ {(Math.abs(bal) * getResourcePrice(resource) * 1.2).toFixed(0)}/mês
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recursos Territoriais Base */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">🗺️ Recursos do Território</h3>
        <p className="text-gray-600 mb-4">
          Estes são os recursos naturais que seu território gera passivamente a cada mês.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(nation.territory.resources).map(([resource, amount]) => (
            <div key={resource} className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-lg border-2 border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{resourceIcons[resource] || '📦'}</span>
                <span className="font-medium text-sm">{resourceNames[resource] || resource}</span>
              </div>
              <p className="text-2xl font-bold text-amber-700">{amount.toLocaleString()}</p>
              <p className="text-xs text-gray-600 mt-1">unidades/mês</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dicas */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
        <h3 className="font-bold text-lg mb-2">💡 Gerenciamento de Recursos</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• <strong>Água:</strong> Seu território pode gerar naturalmente, ou construa Poços Artesianos e Estações de Tratamento</li>
          <li>• <strong>Alimentos:</strong> Construa Fazendas em territórios com terras aráveis</li>
          <li>• <strong>Energia:</strong> Construa Usinas de Energia. Consomem petróleo e água</li>
          <li>• <strong>Petróleo/Gás:</strong> Construa Poços de Petróleo em territórios ricos neste recurso</li>
          <li>• <strong>Minérios:</strong> Construa Minas para extrair ferro, ouro e cobre</li>
          <li>• <strong>Consumo da População:</strong> Cresce proporcionalmente ao número de habitantes</li>
          <li>• <strong>Excedentes:</strong> São armazenados automaticamente para uso futuro</li>
          <li>• <strong>Déficit:</strong> Recursos em falta causam penalidades financeiras e reduzem felicidade em 5% por recurso</li>
          <li>• <strong>Multiplayer:</strong> No futuro você poderá comercializar recursos com outras nações!</li>
        </ul>
      </div>
    </div>
  );
};

// Preços de mercado
const getResourcePrice = (resource) => {
  const prices = {
    petroleo: 100,
    gas: 80,
    ferro: 50,
    ouro: 500,
    cobre: 40,
    food: 20,
    energy: 30,
    fuel: 60,
    agua: 5,
    terrasAraveis: 0,
    madeira: 30,
    furniture: 80,
    fruits: 25,
    vegetables: 20,
    clothing: 50,
    medicine: 100,
    floresta: 10
  };
  return prices[resource] || 10;
};

export default ResourcesTab;