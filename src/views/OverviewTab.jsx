import React from 'react';
import { Users, Briefcase, TrendingUp, Trophy } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { GAME_CONFIG } from '../data/gameConfig';

const OverviewTab = ({ nation, finances }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="População Total"
          value={nation.population.toLocaleString()}
          icon={Users}
          color="text-blue-500"
          subtitle={`${nation.workers.employed.toLocaleString()} empregados`}
        />
        <StatsCard
          title="Trabalhadores Disponíveis"
          value={(nation.workers.common - nation.workers.employed).toLocaleString()}
          icon={Briefcase}
          color="text-green-500"
          subtitle="Procurando emprego"
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

      {/* Stats indicators */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Indicadores Nacionais</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Educação', value: nation.stats.education, icon: '📚' },
            { name: 'Saúde', value: nation.stats.health, icon: '🏥' },
            { name: 'Segurança', value: nation.stats.security, icon: '🛡️' },
            { name: 'Alimentação', value: nation.stats.food, icon: '🌾' },
            { name: 'Economia', value: nation.stats.economy, icon: '💰' },
            { name: 'Pesquisa', value: nation.stats.research, icon: '🔬' },
            { name: 'Energia', value: nation.stats.energy, icon: '⚡' },
            { name: 'Recursos', value: nation.stats.resources, icon: '⛏️' }
          ].map(stat => (
            <div key={stat.name} className="bg-gray-50 p-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <span className="font-medium">{stat.name}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${Math.min(stat.value, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">{stat.value} pontos</p>
            </div>
          ))}
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
            <span className="font-bold">
              {nation.facilities.reduce((sum, f) => 
                sum + f.jobs.reduce((s, j) => s + j.count, 0), 0
              ).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between p-3 bg-yellow-50 rounded">
            <span>Taxa de Emprego</span>
            <span className="font-bold">
              {((nation.workers.employed / nation.population) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;