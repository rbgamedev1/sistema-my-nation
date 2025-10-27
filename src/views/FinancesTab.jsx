// src/views/FinancesTab.jsx

import React from 'react';
import { GAME_CONFIG } from '../data/gameConfig';
import { groupFacilities, calculateGroupTotals } from '../utils/facilityUtils';

const FinancesTab = ({ nation, finances }) => {
  const groupedFacilities = groupFacilities(nation.facilities);

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Relatório Financeiro Mensal</h2>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
            <div>
              <span className="font-medium text-lg">Receitas Totais</span>
              <p className="text-sm text-gray-600">
                Impostos + Exportação de Recursos
              </p>
            </div>
            <span className="text-green-600 font-bold text-xl">
              + R$ {finances.revenue.toLocaleString()}
            </span>
          </div>

          {/* Detalhamento de Receitas */}
          <div className="ml-4 space-y-2">
            <div className="flex justify-between items-center p-3 bg-green-100 rounded">
              <div>
                <span className="font-medium">💼 Impostos</span>
                <p className="text-xs text-gray-600">
                  {(nation.workers.common - nation.workers.employed).toLocaleString()} trabalhadores × R$ {GAME_CONFIG.BASE_WORKER_SALARY} × {(GAME_CONFIG.TAX_RATE * 100)}%
                </p>
              </div>
              <span className="text-green-700 font-bold">
                + R$ {finances.taxRevenue.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-green-100 rounded">
              <div>
                <span className="font-medium">📦 Exportação de Recursos</span>
                <p className="text-xs text-gray-600">
                  50% dos excedentes vendidos automaticamente
                </p>
              </div>
              <span className="text-green-700 font-bold">
                + R$ {finances.resourceRevenue.toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
            <div>
              <span className="font-medium text-lg">Despesas Totais</span>
              <p className="text-sm text-gray-600">
                Salários + Penalidades de Recursos
              </p>
            </div>
            <span className="text-red-600 font-bold text-xl">
              - R$ {finances.expenses.toLocaleString()}
            </span>
          </div>

          {/* Detalhamento de Despesas */}
          {finances.resourcePenalty > 0 && (
            <div className="ml-4">
              <div className="flex justify-between items-center p-3 bg-red-100 rounded">
                <div>
                  <span className="font-medium">⚠️ Importação de Recursos</span>
                  <p className="text-xs text-gray-600">
                    Custo de recursos em déficit
                  </p>
                </div>
                <span className="text-red-700 font-bold">
                  - R$ {finances.resourcePenalty.toLocaleString()}
                </span>
              </div>
            </div>
          )}
          
          <div className={`flex justify-between items-center p-4 rounded-lg font-bold text-xl ${
            finances.balance >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <span>Balanço Mensal</span>
            <span>{finances.balance >= 0 ? '+' : ''} R$ {finances.balance.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center p-4 bg-blue-100 rounded-lg">
            <span className="font-medium text-lg">Tesouro Projetado (próximo mês)</span>
            <span className="font-bold text-xl text-blue-700">
              R$ {(nation.treasury + finances.balance).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Expenses breakdown */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-3">Detalhamento de Despesas</h3>
        
        {nation.ministries.filter(m => m.minister).length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Ministros:</h4>
            <div className="space-y-2">
              {nation.ministries.map(ministry => (
                ministry.minister && (
                  <div key={ministry.id} className="flex justify-between p-2 border-b">
                    <span>Ministro de {ministry.name}</span>
                    <span className="font-medium">R$ {ministry.minister.salary.toLocaleString()}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {groupedFacilities.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Funcionários por Tipo de Benfeitoria:</h4>
            <div className="space-y-3">
              {groupedFacilities.map(group => {
                const totals = calculateGroupTotals(group);
                
                return (
                  <div key={group.name} className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between font-medium mb-2">
                      <span>
                        {group.name} <span className="text-sm text-gray-500">(x{group.count})</span>
                      </span>
                      <span className="text-blue-600">R$ {totals.totalMonthlyCost.toLocaleString()}/mês</span>
                    </div>
                    <div className="pl-4 space-y-1 text-sm">
                      {Object.values(group.jobs).map(job => {
                        const cost = job.totalFilled * job.avgSalary;
                        return cost > 0 ? (
                          <div key={job.role} className="flex justify-between text-gray-600">
                            <span>• {job.totalFilled} {job.role}(s)</span>
                            <span>R$ {cost.toLocaleString()}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {nation.ministries.filter(m => m.minister).length === 0 && groupedFacilities.length === 0 && (
          <p className="text-gray-500 text-center py-4">Nenhuma despesa registrada ainda.</p>
        )}
      </div>

      {/* Financial tips */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
        <h3 className="font-bold text-lg mb-2">💡 Dicas Financeiras</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Mantenha sempre um saldo positivo no tesouro para emergências</li>
          <li>• Aumente salários para atrair trabalhadores mais rapidamente</li>
          <li>• População feliz cresce mais rápido, gerando mais impostos</li>
          <li>• Construir benfeitorias aumenta a felicidade e os indicadores nacionais</li>
          <li>• Benfeitorias do mesmo tipo são agrupadas automaticamente para facilitar a gestão</li>
        </ul>
      </div>
    </div>
  );
};

export default FinancesTab;