// src/views/OverviewTab.jsx - CORRIGIDO (Redundância de Felicidade Removida)

import React from 'react';
import { Users, Briefcase, TrendingUp, Trophy } from 'lucide-react';
import { GAME_CONFIG } from '../data/gameConfig';

const StatsCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <Icon className={color} size={32} />
    </div>
  </div>
);

const OverviewTab = ({ nation, finances }) => {
  const totalJobs = nation.facilities.reduce((sum, f) => 
    sum + f.jobs.reduce((s, j) => s + j.count, 0), 0
  );

  const employmentRate = nation.workers.common > 0 
    ? (nation.workers.employed / nation.workers.common) * 100 
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="População Total"
          value={nation.population.toLocaleString()}
          icon={Users}
          color="text-blue-500"
          subtitle={`${nation.workers.common.toLocaleString()} trabalhadores`}
        />
        <StatsCard
          title="Empregados"
          value={nation.workers.employed.toLocaleString()}
          icon={Briefcase}
          color="text-green-500"
          subtitle={`${(nation.workers.common - nation.workers.employed).toLocaleString()} desempregados`}
        />
        <StatsCard
          title="Balanço Mensal"
          value={`R$ ${finances.balance.toLocaleString()}`}
          icon={TrendingUp}
          color={finances.balance >= 0 ? 'text-green-500' : 'text-red-500'}
          subtitle={finances.balance >= 0 ? 'Superávit' : 'Déficit'}
        />
        <StatsCard
          title="Felicidade"
          value={`${nation.happiness.toFixed(1)}%`}
          icon={Trophy}
          color={
            nation.happiness >= GAME_CONFIG.HAPPINESS_THRESHOLD.EXCELLENT ? 'text-green-500' :
            nation.happiness >= GAME_CONFIG.HAPPINESS_THRESHOLD.GOOD ? 'text-blue-500' :
            nation.happiness >= GAME_CONFIG.HAPPINESS_THRESHOLD.AVERAGE ? 'text-yellow-500' :
            'text-red-500'
          }
          subtitle={
            nation.happiness >= GAME_CONFIG.HAPPINESS_THRESHOLD.EXCELLENT ? 'Excelente' :
            nation.happiness >= GAME_CONFIG.HAPPINESS_THRESHOLD.GOOD ? 'Bom' :
            nation.happiness >= GAME_CONFIG.HAPPINESS_THRESHOLD.AVERAGE ? 'Regular' :
            'Ruim'
          }
        />
      </div>

      {/* Stats indicators - CORRIGIDO: Pesos corretos */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Indicadores Nacionais</h2>
        <p className="text-sm text-gray-600 mb-4">
          Estes indicadores mostram o desenvolvimento geral da nação. A felicidade é calculada com base neles.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Educação', value: nation.stats.education, icon: '📚', weight: 0.2 },
            { name: 'Saúde', value: nation.stats.health, icon: '🏥', weight: 0.3 },
            { name: 'Segurança', value: nation.stats.security, icon: '🛡️', weight: 0.1 },
            { name: 'Alimentação', value: nation.stats.food, icon: '🌾', weight: 0.2 },
            { name: 'Economia', value: nation.stats.economy, icon: '💰', weight: null },
            { name: 'Pesquisa', value: nation.stats.research, icon: '🔬', weight: null },
            { name: 'Energia', value: nation.stats.energy, icon: '⚡', weight: null },
            { name: 'Cultura', value: nation.stats.culture || 0, icon: '🎭', weight: 0.15 }
          ].map(stat => {
            const contribution = stat.weight ? stat.value * stat.weight : 0;
            return (
              <div key={stat.name} className="bg-gray-50 p-4 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className="font-medium text-sm">{stat.name}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(stat.value, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">{stat.value} pontos</p>
                {stat.weight && (
                  <p className="text-xs text-blue-600 font-medium">
                    +{contribution.toFixed(1)}% felicidade
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
          <p className="text-sm font-bold text-gray-700 mb-2">📊 Como a Felicidade é Calculada:</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Base: 50%</li>
            <li>• Educação: +{nation.stats.education * 0.2}% (peso 0.2)</li>
            <li>• Saúde: +{nation.stats.health * 0.3}% (peso 0.3)</li>
            <li>• Segurança: +{nation.stats.security * 0.1}% (peso 0.1)</li>
            <li>• Alimentação: +{nation.stats.food * 0.2}% (peso 0.2)</li>
            <li>• Cultura: +{(nation.stats.culture || 0) * 0.15}% (peso 0.15)</li>
            <li>• Penalidades por déficit de recursos são subtraídas</li>
          </ul>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Resumo da Nação</h2>
        <div className="space-y-3">
          <div className="flex justify-between p-3 bg-blue-50 rounded">
            <span>Ministérios Ativos</span>
            <span className="font-bold">{nation.ministries.length}</span>
          </div>
          <div className="flex justify-between p-3 bg-green-50 rounded">
            <span>Benfeitorias Construídas</span>
            <span className="font-bold">{nation.facilities.length}</span>
          </div>
          <div className="flex justify-between p-3 bg-purple-50 rounded">
            <span>Total de Vagas de Emprego</span>
            <span className="font-bold">{totalJobs.toLocaleString()}</span>
          </div>
          <div className="flex justify-between p-3 bg-yellow-50 rounded">
            <span>Taxa de Emprego</span>
            <span className="font-bold">{employmentRate.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between p-3 bg-orange-50 rounded">
            <span>Taxa de Preenchimento de Vagas</span>
            <span className="font-bold">
              {totalJobs > 0 ? ((nation.workers.employed / totalJobs) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;