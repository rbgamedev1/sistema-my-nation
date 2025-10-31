// src/views/CitizensTab.jsx - CORRIGIDO

import React, { useState } from 'react';
import { Users, Briefcase, TrendingUp, Building, AlertCircle } from 'lucide-react';

const CitizensTab = ({ 
  nation, 
  citizenSystem, 
  populationNeeds,
  onUpgradeEducation,
  onApproveExpansion,
  onDestroyBusiness
}) => {
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  if (!citizenSystem || !populationNeeds) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
        <div className="flex items-center gap-3">
          <AlertCircle className="text-yellow-600" size={32} />
          <div>
            <h3 className="font-bold text-xl">Sistema de Cidadãos Não Inicializado</h3>
            <p className="text-gray-700 mt-2">
              O sistema de cidadãos será inicializado automaticamente ao começar um novo jogo.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const statistics = citizenSystem.getStatistics();
  const educationLevels = citizenSystem.getEducationLevels();
  const currentEducation = educationLevels[nation.educationLevel];
  const products = citizenSystem.getAgriculturalProducts();

  // Agrupar negócios por produto
  const businessesByProduct = {};
  citizenSystem.autonomousBusinesses.forEach(business => {
    if (!businessesByProduct[business.product]) {
      businessesByProduct[business.product] = [];
    }
    businessesByProduct[business.product].push(business);
  });

  // Calcular produção autônoma para o relatório
  const autonomousProduction = {};
  citizenSystem.autonomousBusinesses.forEach(b => {
    autonomousProduction[b.product] = (autonomousProduction[b.product] || 0) + b.production;
  });

  // Calcular relatório de satisfação
  const satisfactionReport = populationNeeds.generateReport(
    nation.population,
    nation.resources || {},
    autonomousProduction,
    nation.educationLevel,
    nation.economicStatus
  );

  return (
    <div className="space-y-6">
      {/* Header: Nível de Educação */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold mb-2">🎓 Sistema de Cidadãos Autônomos</h2>
            <p className="text-indigo-100 mb-4">
              Cidadãos educados criam seus próprios negócios e ajudam a economia crescer
            </p>
            
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
              <p className="text-sm mb-2">Nível de Educação Atual:</p>
              <p className="text-2xl font-bold">{
                nation.educationLevel === 'none' ? 'Nenhum' :
                nation.educationLevel === 'basic' ? 'Básico' :
                nation.educationLevel === 'intermediate' ? 'Intermediário' :
                nation.educationLevel === 'advanced' ? 'Avançado' : 'Superior'
              }</p>
              
              {currentEducation.canStartBusiness && (
                <div className="mt-3 text-sm">
                  <p>✓ Cidadãos podem criar negócios {currentEducation.businessSize}</p>
                  <p>✓ Capacidade máxima: {currentEducation.employeeCapacity} funcionários</p>
                </div>
              )}
            </div>
          </div>

          {nation.educationLevel !== 'superior' && (
            <button
              onClick={onUpgradeEducation}
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold hover:bg-indigo-50 transition"
            >
              📚 Melhorar Educação
            </button>
          )}
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Cidadãos Empreendedores</span>
            <Users className="text-blue-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-blue-600">{statistics.totalCitizens}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Negócios Ativos</span>
            <Building className="text-green-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-green-600">{statistics.totalBusinesses}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Empregos Criados</span>
            <Briefcase className="text-purple-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-purple-600">{statistics.totalJobs.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Produção Total</span>
            <TrendingUp className="text-orange-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-orange-600">{statistics.totalProduction.toLocaleString()}</p>
        </div>
      </div>

      {/* Satisfação da População */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-2xl font-bold mb-4">😊 Satisfação da População</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(satisfactionReport.satisfaction)
            .filter(([key]) => ['critical', 'important', 'comfort', 'health'].includes(key))
            .map(([category, data]) => {
              const labels = {
                critical: { name: 'Críticos', icon: '💀', color: 'red' },
                important: { name: 'Importantes', icon: '⚠️', color: 'orange' },
                comfort: { name: 'Conforto', icon: '😊', color: 'yellow' },
                health: { name: 'Saúde', icon: '💊', color: 'blue' }
              };
              const label = labels[category];

              return (
                <div key={category} className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{label.icon}</span>
                    <span className="font-bold">{label.name}</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-700">
                    {data.percentage.toFixed(0)}%
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>

        <div className={`p-6 rounded-lg border-2 ${
          satisfactionReport.satisfaction.overallSatisfaction >= 80 ? 'bg-green-50 border-green-500' :
          satisfactionReport.satisfaction.overallSatisfaction >= 60 ? 'bg-blue-50 border-blue-500' :
          satisfactionReport.satisfaction.overallSatisfaction >= 40 ? 'bg-yellow-50 border-yellow-500' :
          'bg-red-50 border-red-500'
        }`}>
          <h4 className="text-xl font-bold mb-2">Satisfação Geral</h4>
          <p className="text-4xl font-bold mb-2">
            {satisfactionReport.satisfaction.overallSatisfaction}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className={`h-4 rounded-full transition-all ${
                satisfactionReport.satisfaction.overallSatisfaction >= 80 ? 'bg-green-600' :
                satisfactionReport.satisfaction.overallSatisfaction >= 60 ? 'bg-blue-600' :
                satisfactionReport.satisfaction.overallSatisfaction >= 40 ? 'bg-yellow-600' :
                'bg-red-600'
              }`}
              style={{ width: `${satisfactionReport.satisfaction.overallSatisfaction}%` }}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Produtividade:</p>
              <p className="font-bold">{(satisfactionReport.effects.productivity * 100).toFixed(0)}%</p>
            </div>
            <div>
              <p className="text-gray-600">Arrecadação:</p>
              <p className="font-bold">{(satisfactionReport.effects.taxCompliance * 100).toFixed(0)}%</p>
            </div>
            <div>
              <p className="text-gray-600">Crescimento:</p>
              <p className="font-bold">{(satisfactionReport.effects.growth * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>

        {/* Alertas Críticos */}
        {satisfactionReport.satisfaction.criticalShortages.length > 0 && (
          <div className="mt-4 bg-red-50 border-2 border-red-500 p-4 rounded-lg">
            <h4 className="font-bold text-red-800 mb-2">🚨 Escassez Crítica!</h4>
            <ul className="space-y-1">
              {satisfactionReport.satisfaction.criticalShortages.map((shortage, idx) => (
                <li key={idx} className="text-red-700">
                  • <strong>{populationNeeds.getResourceInfo(shortage.item).name}</strong>: 
                  Déficit de {shortage.deficit} unidades ({shortage.fulfillment} atendido)
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recomendações */}
        {satisfactionReport.recommendations.length > 0 && (
          <div className="mt-4 bg-blue-50 border-2 border-blue-500 p-4 rounded-lg">
            <h4 className="font-bold text-blue-800 mb-2">💡 Recomendações</h4>
            <ul className="space-y-2">
              {satisfactionReport.recommendations.slice(0, 5).map((rec, idx) => (
                <li key={idx} className="text-blue-700 text-sm">
                  <span className={`font-bold ${
                    rec.priority === 'URGENTE' ? 'text-red-600' :
                    rec.priority === 'ALTA' ? 'text-orange-600' :
                    rec.priority === 'MÉDIA' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`}>[{rec.priority}]</span> {rec.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Negócios por Produto */}
      {Object.keys(businessesByProduct).length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-2xl font-bold mb-4">🌾 Negócios Autônomos por Produto</h3>
          
          <div className="space-y-4">
            {Object.entries(businessesByProduct).map(([product, businesses]) => {
              const productInfo = products[product];
              const totalProduction = businesses.reduce((sum, b) => sum + b.production, 0);
              const totalEmployees = businesses.reduce((sum, b) => sum + b.employees, 0);
              const totalTax = businesses.reduce((sum, b) => sum + b.monthlyTax, 0);

              return (
                <div key={product} className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-300">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{productInfo.icon}</span>
                      <div>
                        <h4 className="font-bold text-xl">{productInfo.name}</h4>
                        <p className="text-sm text-gray-600">{businesses.length} negócio(s) ativo(s)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Produção Total</p>
                      <p className="text-2xl font-bold text-green-600">{totalProduction.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="bg-white p-3 rounded">
                      <p className="text-xs text-gray-600">Empregos</p>
                      <p className="text-lg font-bold text-blue-600">{totalEmployees}</p>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <p className="text-xs text-gray-600">Impostos/Mês</p>
                      <p className="text-lg font-bold text-green-600">R$ {totalTax.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <p className="text-xs text-gray-600">Preço Base</p>
                      <p className="text-lg font-bold text-purple-600">R$ {productInfo.basePrice}</p>
                    </div>
                  </div>

                  {/* Lista de Negócios */}
                  <div className="space-y-2">
                    {businesses.map(business => {
                      const owner = citizenSystem.citizens.find(c => c.id === business.ownerId);
                      const expansion = business.expandable ? 
                        citizenSystem.checkBusinessExpansion(business, nation) : null;

                      return (
                        <div key={business.id} className="bg-white p-3 rounded border-l-4 border-green-500">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-bold">{business.name}</p>
                              <p className="text-sm text-gray-600">
                                Proprietário: {owner?.name || 'Desconhecido'} | 
                                Tamanho: {business.size} | 
                                {business.monthsActive} meses ativo
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {expansion && (
                                <button
                                  onClick={() => onApproveExpansion(business.id)}
                                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                                >
                                  🚀 Expandir
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  if (confirm(`Tem certeza que deseja destruir ${business.name}? ${business.employees} empregos serão perdidos.`)) {
                                    onDestroyBusiness(business.id);
                                  }
                                }}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                              >
                                🗑️ Destruir
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-2 text-sm">
                            <div>
                              <p className="text-gray-600">Funcionários:</p>
                              <p className="font-bold">{business.employees}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Produção:</p>
                              <p className="font-bold">{business.production}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Impostos:</p>
                              <p className="font-bold text-green-600">R$ {business.monthlyTax.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Lucro Dono:</p>
                              <p className="font-bold text-blue-600">R$ {business.monthlyProfit.toLocaleString()}</p>
                            </div>
                          </div>

                          {expansion && (
                            <div className="mt-2 pt-2 border-t bg-blue-50 p-2 rounded">
                              <p className="text-sm font-bold text-blue-800 mb-1">
                                🚀 Oportunidade de Expansão Disponível!
                              </p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <p className="text-gray-600">Novo tamanho: <strong>{expansion.nextSize}</strong></p>
                                  <p className="text-gray-600">+{expansion.benefits.additionalEmployees} empregos</p>
                                  <p className="text-gray-600">+{expansion.benefits.additionalProduction} produção</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Custos:</p>
                                  <p className="text-gray-600">{expansion.costs.land} terra</p>
                                  <p className="text-gray-600">{expansion.costs.water} água</p>
                                  <p className="text-gray-600">R$ {expansion.costs.money.toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-xl font-bold mb-2">Nenhum Negócio Autônomo Ainda</h3>
          <p className="text-gray-600 mb-4">
            {nation.educationLevel === 'none' 
              ? 'Melhore a educação para permitir que cidadãos criem seus próprios negócios.'
              : 'Cidadãos começarão a criar negócios automaticamente quando houver demanda não atendida pelo governo (15% de chance por mês).'
            }
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-left max-w-2xl mx-auto">
            <p className="text-sm font-bold text-gray-700 mb-2">📊 Condições para criar negócios:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ Nível de educação: {nation.educationLevel !== 'none' ? '✅ OK' : '❌ Necessário'}</li>
              <li>✓ Terra disponível: {(nation.resources?.land || 0).toLocaleString()} unidades</li>
              <li>✓ Água disponível: {(nation.resources?.water || 0).toLocaleString()} unidades</li>
              <li>✓ Déficit de recursos: Verifique na aba Recursos</li>
              <li>✓ Chance por turno: 15%</li>
            </ul>
          </div>
        </div>
      )}

      {/* Dicas */}
      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded">
        <h3 className="font-bold text-lg mb-2">💡 Como Funciona o Sistema de Cidadãos</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• <strong>Educação Básica:</strong> Cidadãos podem criar pequenas plantações (2-5 funcionários, 30-80 produção)</li>
          <li>• <strong>Educação Intermediária:</strong> Negócios médios (5-13 funcionários, 80-180 produção)</li>
          <li>• <strong>Educação Avançada:</strong> Grandes fazendas (15-40 funcionários, 180-380 produção)</li>
          <li>• <strong>Educação Superior:</strong> Agronegócio corporativo (50-130 funcionários, 380-780 produção)</li>
          <li>• <strong>Criação Automática:</strong> 15% de chance por mês quando há demanda não atendida</li>
          <li>• <strong>Expansão:</strong> Após 6 meses, negócios podem expandir se o proprietário tiver educação suficiente</li>
          <li>• <strong>Benefícios:</strong> Gera empregos, paga impostos (15% da receita) e atende necessidades da população</li>
          <li>• <strong>Recursos:</strong> Cidadãos usam terra e água, governo subsidia 50% do custo</li>
          <li>• <strong>Destruição:</strong> Você pode destruir negócios, mas perderá empregos e receita de impostos</li>
        </ul>
      </div>
    </div>
  );
};

export default CitizensTab;