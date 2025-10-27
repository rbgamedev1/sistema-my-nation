// src/views/ResourcesTab.jsx

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { calculateResourceBalance } from '../utils/calculations';

const ResourcesTab = ({ nation }) => {
  const { production, consumption, balance } = calculateResourceBalance(nation);

  const resourceIcons = {
    water: '💧',
    oil: '🛢️',
    gas: '💨',
    steel: '⚙️',
    gold: '🏆',
    copper: '🔶',
    arableLand: '🌾',
    food: '🍞',
    energy: '⚡',
    fuel: '⛽'
  };

  const resourceNames = {
    water: 'Água',
    oil: 'Petróleo',
    gas: 'Gás Natural',
    steel: 'Aço',
    gold: 'Ouro',
    copper: 'Cobre',
    arableLand: 'Terra Arável',
    food: 'Alimentos',
    energy: 'Energia',
    fuel: 'Combustível'
  };

  const allResources = Object.keys(balance).sort();

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">📊 Balanço de Recursos</h2>
        <p className="text-gray-600 mb-4">
          Recursos são gerados pelo seu território e benfeitorias, e consumidos pela população e infraestrutura.
          Excedentes podem ser exportados para gerar receita adicional.
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
            <p className="text-sm text-gray-600">Recursos Equilibrados</p>
            <p className="text-2xl font-bold text-blue-600">
              {Object.values(balance).filter(v => v === 0).length}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total de Recursos</p>
            <p className="text-2xl font-bold text-purple-600">
              {allResources.length}
            </p>
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
                    <strong>{resourceNames[resource]}</strong>: Faltam {Math.abs(amount).toFixed(1)} unidades/mês
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
                    <span className="text-3xl">{resourceIcons[resource]}</span>
                    <div>
                      <h4 className="font-bold text-lg">{resourceNames[resource]}</h4>
                      <p className="text-sm text-gray-600">
                        {isPositive && '✅ Exportando excedente'}
                        {isNegative && '⚠️ Importando faltante'}
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

                <div className="grid grid-cols-2 gap-4">
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
                    <p className="text-xs text-gray-600 mb-1">Consumo</p>
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

                {isPositive && (
                  <div className="mt-3 p-2 bg-green-100 rounded text-sm text-green-800">
                    💰 Receita de exportação: ~R$ {(bal * 0.5 * getResourcePrice(resource)).toFixed(0)}/mês
                  </div>
                )}

                {isNegative && (
                  <div className="mt-3 p-2 bg-red-100 rounded text-sm text-red-800">
                    💸 Custo de importação: ~R$ {(Math.abs(bal) * getResourcePrice(resource)).toFixed(0)}/mês
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
                <span className="text-2xl">{resourceIcons[resource]}</span>
                <span className="font-medium text-sm">{resourceNames[resource]}</span>
              </div>
              <p className="text-2xl font-bold text-amber-700">{amount}</p>
              <p className="text-xs text-gray-600 mt-1">unidades/mês</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dicas */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
        <h3 className="font-bold text-lg mb-2">💡 Gerenciamento de Recursos</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• <strong>Água:</strong> Essencial para toda infraestrutura. Seu território gera naturalmente.</li>
          <li>• <strong>Alimentos:</strong> Construa Fazendas Cooperativas em territórios com terras aráveis.</li>
          <li>• <strong>Energia:</strong> Construa Usinas de Energia. Consomem petróleo e água.</li>
          <li>• <strong>Petróleo/Gás:</strong> Construa Poços de Petróleo em territórios ricos neste recurso.</li>
          <li>• <strong>Minérios:</strong> Construa Minas para extrair aço, ouro e cobre.</li>
          <li>• <strong>Excedentes:</strong> 50% do excedente é automaticamente exportado gerando receita.</li>
          <li>• <strong>Déficit:</strong> Recursos em falta causam penalidades financeiras e reduzem felicidade.</li>
          <li>• <strong>Multiplayer:</strong> No futuro você poderá comercializar recursos com outras nações!</li>
        </ul>
      </div>
    </div>
  );
};

// Preços de mercado
const getResourcePrice = (resource) => {
  const prices = {
    oil: 100,
    gas: 80,
    steel: 50,
    gold: 500,
    copper: 40,
    food: 20,
    energy: 30,
    fuel: 60,
    water: 5,
    arableLand: 0
  };
  return prices[resource] || 0;
};

export default ResourcesTab;