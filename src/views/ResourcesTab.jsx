// src/views/ResourcesTab.jsx - CORRIGIDO (Imports corretos)

import React from 'react';
import { calculateResourceBalance, calculatePopulationResourceConsumption } from '../utils/calculations';
import { GAME_CONFIG, RESOURCE_NAMES, RESOURCE_ICONS, RESOURCE_CATEGORIES, DEFICIT_PENALTIES } from '../data/gameConfig';

const ResourcesTab = ({ nation }) => {
  const TrendingUp = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );

  const TrendingDown = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
      <polyline points="17 18 23 18 23 12"></polyline>
    </svg>
  );

  const Minus = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );

  const Users = ({ size, className }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );

  const { production, consumption, balance } = calculateResourceBalance(nation);
  const populationConsumption = calculatePopulationResourceConsumption(nation.population);

  const getResourceCategory = (resource) => {
    for (const [category, resources] of Object.entries(RESOURCE_CATEGORIES)) {
      if (resources.includes(resource)) return category;
    }
    return 'other';
  };

  const getPenaltyText = (resource) => {
    const category = getResourceCategory(resource);
    const penalty = DEFICIT_PENALTIES[category];
    switch(category) {
      case 'critical': return `💀 CRÍTICO: ${penalty}% felicidade`;
      case 'important': return `⚠️ IMPORTANTE: ${penalty}% felicidade`;
      case 'comfort': return `😕 CONFORTO: ${penalty}% felicidade`;
      case 'health': return `💊 SAÚDE: ${penalty}% felicidade`;
      case 'industrial': return '🏭 Impede construções';
      default: return '⚠️ DÉFICIT';
    }
  };

  const allResources = Object.keys(balance).sort((a, b) => {
    const catA = getResourceCategory(a);
    const catB = getResourceCategory(b);
    const order = ['critical', 'important', 'comfort', 'health', 'industrial'];
    return order.indexOf(catA) - order.indexOf(catB);
  });

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">📊 Balanço de Recursos</h2>
        <p className="text-gray-600 mb-4">
          Recursos são gerados pelo seu território e benfeitorias, e consumidos pela população e infraestrutura.
          <strong className="text-red-600"> NÃO HÁ IMPORTAÇÃO AUTOMÁTICA!</strong> Recursos em déficit causam diferentes penalidades.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Recursos em Superávit</p>
            <p className="text-2xl font-bold text-green-600">
              {Object.values(balance).filter(v => v > 0).length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Déficit Crítico</p>
            <p className="text-2xl font-bold text-red-600">
              {Object.entries(balance).filter(([r, v]) => v < 0 && RESOURCE_CATEGORIES.critical.includes(r)).length}
            </p>
            <p className="text-xs text-gray-500">{DEFICIT_PENALTIES.critical}% cada</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Déficit Importante</p>
            <p className="text-2xl font-bold text-orange-600">
              {Object.entries(balance).filter(([r, v]) => v < 0 && RESOURCE_CATEGORIES.important.includes(r)).length}
            </p>
            <p className="text-xs text-gray-500">{DEFICIT_PENALTIES.important}% cada</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Déficit Conforto</p>
            <p className="text-2xl font-bold text-yellow-600">
              {Object.entries(balance).filter(([r, v]) => v < 0 && RESOURCE_CATEGORIES.comfort.includes(r)).length}
            </p>
            <p className="text-xs text-gray-500">{DEFICIT_PENALTIES.comfort}% cada</p>
          </div>
        </div>
      </div>

      {/* Requisitos da População */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow border-2 border-blue-300">
        <div className="flex items-center gap-3 mb-4">
          <Users size={32} className="text-blue-600" />
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(GAME_CONFIG.POPULATION_CONSUMPTION).map(([resource, amountPer1000]) => {
              const category = getResourceCategory(resource);
              const borderColor = 
                category === 'critical' ? 'border-red-400' :
                category === 'important' ? 'border-orange-400' :
                category === 'comfort' ? 'border-yellow-400' :
                'border-blue-400';
              
              return (
                <div key={resource} className={`bg-gray-50 p-3 rounded border-l-4 ${borderColor}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{RESOURCE_ICONS[resource] || '📦'}</span>
                    <span className="text-xs font-medium">{RESOURCE_NAMES[resource] || resource}</span>
                  </div>
                  <p className="text-sm text-gray-600 font-bold">{amountPer1000} / 1k hab</p>
                  <p className="text-xs text-gray-500">
                    {category === 'critical' && '💀 Crítico'}
                    {category === 'important' && '⚠️ Importante'}
                    {category === 'comfort' && '😊 Conforto'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg">
          <p className="text-sm font-bold text-gray-700 mb-2">Consumo Total da População Este Mês:</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(populationConsumption).map(([resource, amount]) => (
              <div key={resource} className="bg-blue-50 p-3 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{RESOURCE_ICONS[resource] || '📦'}</span>
                  <span className="text-xs font-medium">{RESOURCE_NAMES[resource] || resource}</span>
                </div>
                <p className="text-lg font-bold text-blue-700">{amount.toFixed(1)}</p>
                <p className="text-xs text-gray-500">unidades/mês</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alertas de Déficit por Categoria */}
      {Object.entries(balance).filter(([_, v]) => v < 0).length > 0 && (
        <div className="space-y-3">
          {/* Recursos Críticos */}
          {Object.entries(balance).filter(([r, v]) => v < 0 && RESOURCE_CATEGORIES.critical.includes(r)).length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded">
              <div className="flex items-start gap-3">
                <span className="text-red-600 text-3xl">🚨</span>
                <div>
                  <h3 className="font-bold text-xl text-red-800 mb-2">ALERTA CRÍTICO: Recursos Essenciais em Falta!</h3>
                  <p className="text-red-700 mb-3 font-medium">
                    ⚠️ Sua população está sofrendo sem recursos básicos para sobrevivência! <strong>{DEFICIT_PENALTIES.critical}% felicidade por recurso</strong>
                  </p>
                  
                  <div className="bg-red-100 p-4 rounded-lg border-2 border-red-400 mb-3">
                    <ul className="list-disc list-inside space-y-1 text-red-800">
                      {Object.entries(balance).filter(([r, v]) => v < 0 && RESOURCE_CATEGORIES.critical.includes(r)).map(([resource, amount]) => (
                        <li key={resource}>
                          <strong>{RESOURCE_ICONS[resource]} {RESOURCE_NAMES[resource]}</strong>: Déficit de {Math.abs(amount).toFixed(1)} unidades/mês
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-white rounded border-l-4 border-blue-500">
                    <p className="text-sm font-bold text-gray-700 mb-2">💡 Soluções Urgentes:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>Água:</strong> Construa Poços Artesianos (1k/mês) ou Estações de Tratamento (2k/mês)</li>
                      <li>• <strong>Arroz/Feijão:</strong> Construa Fazendas específicas (600-900/mês cada)</li>
                      <li>• <strong>Energia:</strong> Construa Usinas de Energia (2k/mês)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recursos Importantes */}
          {Object.entries(balance).filter(([r, v]) => v < 0 && RESOURCE_CATEGORIES.important.includes(r)).length > 0 && (
            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded">
              <div className="flex items-start gap-3">
                <span className="text-orange-600 text-3xl">⚠️</span>
                <div>
                  <h3 className="font-bold text-lg text-orange-800 mb-2">Recursos Importantes em Falta ({DEFICIT_PENALTIES.important}% felicidade cada)</h3>
                  <ul className="list-disc list-inside space-y-1 text-orange-800">
                    {Object.entries(balance).filter(([r, v]) => v < 0 && RESOURCE_CATEGORIES.important.includes(r)).map(([resource, amount]) => (
                      <li key={resource}>
                        <strong>{RESOURCE_ICONS[resource]} {RESOURCE_NAMES[resource]}</strong>: Déficit de {Math.abs(amount).toFixed(1)} unidades/mês
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Recursos de Conforto */}
          {Object.entries(balance).filter(([r, v]) => v < 0 && RESOURCE_CATEGORIES.comfort.includes(r)).length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
              <div className="flex items-start gap-3">
                <span className="text-yellow-600 text-3xl">😕</span>
                <div>
                  <h3 className="font-bold text-lg text-yellow-800 mb-2">Recursos de Conforto em Falta ({DEFICIT_PENALTIES.comfort}% felicidade cada)</h3>
                  <ul className="list-disc list-inside space-y-1 text-yellow-800">
                    {Object.entries(balance).filter(([r, v]) => v < 0 && RESOURCE_CATEGORIES.comfort.includes(r)).map(([resource, amount]) => (
                      <li key={resource}>
                        <strong>{RESOURCE_ICONS[resource]} {RESOURCE_NAMES[resource]}</strong>: Déficit de {Math.abs(amount).toFixed(1)} unidades/mês
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Recursos Industriais */}
          {Object.entries(balance).filter(([r, v]) => v < 0 && RESOURCE_CATEGORIES.industrial.includes(r)).length > 0 && (
            <div className="bg-gray-50 border-l-4 border-gray-500 p-6 rounded">
              <div className="flex items-start gap-3">
                <span className="text-gray-600 text-3xl">🏭</span>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">Recursos Industriais em Falta (impede construções)</h3>
                  <p className="text-sm text-gray-600 mb-2">Estes recursos não afetam a felicidade da população, mas são necessários para construir benfeitorias.</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {Object.entries(balance).filter(([r, v]) => v < 0 && RESOURCE_CATEGORIES.industrial.includes(r)).map(([resource, amount]) => (
                      <li key={resource}>
                        <strong>{RESOURCE_ICONS[resource]} {RESOURCE_NAMES[resource]}</strong>: Déficit de {Math.abs(amount).toFixed(1)} unidades/mês
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
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
            const category = getResourceCategory(resource);

            return (
              <div 
                key={resource}
                className={`p-4 rounded-lg border-2 ${
                  isPositive ? 'bg-green-50 border-green-300' :
                  isNegative && category === 'critical' ? 'bg-red-100 border-red-500' :
                  isNegative && category === 'important' ? 'bg-orange-50 border-orange-300' :
                  isNegative && category === 'comfort' ? 'bg-yellow-50 border-yellow-300' :
                  isNegative ? 'bg-gray-50 border-gray-300' :
                  'bg-gray-50 border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{RESOURCE_ICONS[resource] || '📦'}</span>
                    <div>
                      <h4 className="font-bold text-lg">{RESOURCE_NAMES[resource] || resource}</h4>
                      <p className="text-sm text-gray-600">
                        {isPositive && '✅ Excedente armazenado'}
                        {isNegative && getPenaltyText(resource)}
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
                <span className="text-2xl">{RESOURCE_ICONS[resource] || '📦'}</span>
                <span className="font-medium text-sm">{RESOURCE_NAMES[resource] || resource}</span>
              </div>
              <p className="text-2xl font-bold text-amber-700">{amount.toLocaleString()}</p>
              <p className="text-xs text-gray-600 mt-1">unidades/mês</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dicas */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
        <h3 className="font-bold text-lg mb-2">💡 Sistema de Recursos Expandido</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• <strong className="text-red-600">Recursos Críticos</strong> (água, arroz, feijão, energia): {DEFICIT_PENALTIES.critical}% felicidade cada</li>
          <li>• <strong className="text-orange-600">Recursos Importantes</strong> (milho, soja, açúcar, café, vegetais): {DEFICIT_PENALTIES.important}% felicidade cada</li>
          <li>• <strong className="text-yellow-600">Recursos de Conforto</strong> (frutas, móveis, roupas): {DEFICIT_PENALTIES.comfort}% felicidade cada</li>
          <li>• <strong className="text-gray-600">Recursos Industriais</strong> (petróleo, ferro, etc): não afetam felicidade, mas impedem construções</li>
          <li>• <strong>11 Produtos Agrícolas:</strong> Arroz, Feijão, Milho, Soja, Açúcar, Café, Banana, Laranja, Maçã, Limão, Especiarias</li>
          <li>• <strong>Cidadãos Autônomos:</strong> Com educação, cidadãos criam plantações e ajudam a suprir demanda</li>
          <li>• <strong>Excedentes:</strong> São armazenados automaticamente para uso futuro ou comércio</li>
          <li>• <strong>Planeje:</strong> O crescimento populacional aumenta o consumo proporcionalmente!</li>
        </ul>
      </div>
    </div>
  );
};

export default ResourcesTab;