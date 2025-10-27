// src/views/FinancesTab.jsx

import React from 'react';
import { GAME_CONFIG } from '../data/gameConfig';
import { groupFacilities, calculateGroupTotals } from '../utils/facilityUtils';

const FinancesTab = ({ nation, finances }) => {
  const groupedFacilities = groupFacilities(nation.facilities);

  // Calcular investimento total
  const totalInvestment = nation.facilities.reduce((sum, f) => sum + f.cost, 0);
  const ministryCosts = nation.ministries.length * GAME_CONFIG.MINISTRY_COST;

  return (
    <div className="space-y-4">
      {/* Investimentos Realizados */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg shadow border-2 border-purple-300">
        <h2 className="text-2xl font-bold mb-4 text-purple-900">💎 Investimentos Acumulados</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Ministérios Criados</p>
            <p className="text-2xl font-bold text-purple-600">R$ {ministryCosts.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{nation.ministries.length} × R$ {GAME_CONFIG.MINISTRY_COST.toLocaleString()}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Benfeitorias Construídas</p>
            <p className="text-2xl font-bold text-blue-600">R$ {totalInvestment.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{nation.facilities.length} construções</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Total Investido</p>
            <p className="text-2xl font-bold text-indigo-600">R$ {(ministryCosts + totalInvestment).toLocaleString()}</p>
            <p className="text-xs text-gray-500">Desde fundação</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">💡 Dica Importante:</p>
          <p className="text-sm text-gray-700">
            <strong>Investimentos são gastos únicos</strong> na criação de ministérios e construção de benfeitorias. 
            Eles <strong>não aparecem nas despesas mensais</strong>, apenas os salários dos funcionários aparecem.
          </p>
        </div>
      </div>

      {/* Relatório Mensal */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">📊 Relatório Financeiro Mensal</h2>
        
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
                <span className="font-medium">💼 Impostos (Trabalhadores Empregados)</span>
                <p className="text-xs text-gray-600">
                  {nation.workers.employed.toLocaleString()} empregados × R$ {GAME_CONFIG.BASE_WORKER_SALARY.toLocaleString()} × {(GAME_CONFIG.EMPLOYMENT_TAX_RATE * 100)}%
                </p>
                <p className="text-xs text-orange-600 font-medium">
                  ⚠️ Desempregados ({(nation.workers.common - nation.workers.employed).toLocaleString()}) não pagam impostos
                </p>
              </div>
              <span className="text-green-700 font-bold">
                + R$ {finances.taxRevenue.toLocaleString()}
              </span>
            </div>

            {finances.resourceRevenue > 0 && (
              <div className="flex justify-between items-center p-3 bg-green-100 rounded">
                <div>
                  <span className="font-medium">📦 Exportação de Recursos</span>
                  <p className="text-xs text-gray-600">
                    Vendas no mercado internacional
                  </p>
                </div>
                <span className="text-green-700 font-bold">
                  + R$ {finances.resourceRevenue.toLocaleString()}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
            <div>
              <span className="font-medium text-lg">Despesas Totais</span>
              <p className="text-sm text-gray-600">
                Salários + Importação de Recursos
              </p>
            </div>
            <span className="text-red-600 font-bold text-xl">
              - R$ {finances.expenses.toLocaleString()}
            </span>
          </div>

          {/* Detalhamento de Despesas */}
          <div className="ml-4 space-y-2">
            <div className="flex justify-between items-center p-3 bg-red-100 rounded">
              <div>
                <span className="font-medium">👔 Salários Totais</span>
                <p className="text-xs text-gray-600">
                  Ministros + Funcionários de benfeitorias
                </p>
              </div>
              <span className="text-red-700 font-bold">
                - R$ {finances.salaryExpenses.toLocaleString()}
              </span>
            </div>

            {finances.resourcePenalty > 0 && (
              <div className="flex justify-between items-center p-3 bg-red-100 rounded">
                <div>
                  <span className="font-medium">⚠️ Importação de Recursos</span>
                  <p className="text-xs text-gray-600">
                    Custo de recursos em déficit (+50% taxa)
                  </p>
                </div>
                <span className="text-red-700 font-bold">
                  - R$ {finances.resourcePenalty.toLocaleString()}
                </span>
              </div>
            )}
          </div>
          
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

      {/* Detalhamento de Salários */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-3">💰 Detalhamento de Salários Mensais</h3>
        
        {nation.ministries.filter(m => m.minister).length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium mb-2 text-lg">👔 Ministros:</h4>
            <div className="space-y-2">
              {nation.ministries.map(ministry => (
                ministry.minister && (
                  <div key={ministry.id} className="flex justify-between p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                    <span className="font-medium">{ministry.icon} Ministro de {ministry.name}</span>
                    <span className="font-bold text-blue-700">R$ {ministry.minister.salary.toLocaleString()}/mês</span>
                  </div>
                )
              ))}
              <div className="flex justify-between p-2 bg-blue-100 rounded font-medium">
                <span>Subtotal Ministros:</span>
                <span className="text-blue-700">
                  R$ {nation.ministries.reduce((sum, m) => sum + (m.minister?.salary || 0), 0).toLocaleString()}/mês
                </span>
              </div>
            </div>
          </div>
        )}

        {groupedFacilities.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 text-lg">🏢 Funcionários por Tipo de Benfeitoria:</h4>
            <div className="space-y-3">
              {groupedFacilities.map(group => {
                const totals = calculateGroupTotals(group);
                
                return totals.totalMonthlyCost > 0 ? (
                  <div key={group.name} className="bg-gray-50 p-4 rounded border-l-4 border-green-500">
                    <div className="flex justify-between font-medium mb-2">
                      <span>
                        {group.name} <span className="text-sm text-gray-500">(×{group.count} unidades)</span>
                      </span>
                      <span className="text-green-600 font-bold">R$ {totals.totalMonthlyCost.toLocaleString()}/mês</span>
                    </div>
                    <div className="pl-4 space-y-1 text-sm">
                      {Object.values(group.jobs).map(job => {
                        const cost = job.totalFilled * job.avgSalary;
                        return cost > 0 ? (
                          <div key={job.role} className="flex justify-between text-gray-600">
                            <span>• {job.totalFilled} {job.role}(s) @ R$ {job.avgSalary.toLocaleString()}</span>
                            <span className="font-medium">R$ {cost.toLocaleString()}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                ) : null;
              })}
              <div className="flex justify-between p-3 bg-green-100 rounded font-medium text-lg">
                <span>Subtotal Funcionários:</span>
                <span className="text-green-700">
                  R$ {groupedFacilities.reduce((sum, g) => {
                    const totals = calculateGroupTotals(g);
                    return sum + totals.totalMonthlyCost;
                  }, 0).toLocaleString()}/mês
                </span>
              </div>
            </div>
          </div>
        )}

        {nation.ministries.filter(m => m.minister).length === 0 && groupedFacilities.length === 0 && (
          <p className="text-gray-500 text-center py-4">Nenhuma despesa salarial registrada ainda.</p>
        )}
      </div>

      {/* Armazenamento de Recursos */}
      {nation.resourceStorage && Object.keys(nation.resourceStorage).length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-lg shadow border-2 border-amber-300">
          <h3 className="text-xl font-bold mb-3">📦 Armazenamento de Recursos (Excedentes)</h3>
          <p className="text-sm text-gray-600 mb-4">
            Recursos excedentes são armazenados automaticamente. No futuro você poderá vendê-los para outros jogadores!
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(nation.resourceStorage).map(([resource, amount]) => (
              <div key={resource} className="bg-white p-3 rounded-lg shadow">
                <p className="text-xs text-gray-600 capitalize">{resource}</p>
                <p className="text-lg font-bold text-amber-700">{Math.floor(amount).toLocaleString()}</p>
                <p className="text-xs text-gray-500">unidades</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dicas Financeiras */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
        <h3 className="font-bold text-lg mb-2">💡 Dicas Financeiras</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• <strong>Desempregados não geram receita:</strong> Apenas trabalhadores empregados pagam impostos</li>
          <li>• <strong>Aumente salários:</strong> Salários mais altos atraem trabalhadores mais rapidamente</li>
          <li>• <strong>Evite déficit de recursos:</strong> Importar recursos é 50% mais caro que o preço de mercado</li>
          <li>• <strong>Invista em infraestrutura:</strong> Benfeitorias aumentam felicidade e criam empregos</li>
          <li>• <strong>Recursos excedentes:</strong> São armazenados automaticamente para venda futura</li>
          <li>• <strong>Mantenha reserva:</strong> Sempre tenha dinheiro suficiente para pelo menos 3 meses de despesas</li>
          <li>• <strong>Equilíbrio é fundamental:</strong> Invista em todas as áreas para manter a população feliz</li>
        </ul>
      </div>
    </div>
  );
};

export default FinancesTab;