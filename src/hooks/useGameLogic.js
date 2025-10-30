// src/hooks/useGameLogic.js - COMPLETO ATUALIZADO COM EXPORTAÇÃO

import { useState } from 'react';
import { GAME_CONFIG } from '../data/gameConfig';
import { MINISTRY_TYPES } from '../data/ministryTypes';
import { 
  generateTerritory, 
  calculateFinances, 
  calculateHappiness,
  calculatePopulationGrowth,
  autoFillJobs,
  calculateResourceBalance
} from '../utils/calculations';
import { 
  TECHNOLOGIES, 
  canResearch, 
  calculateResearchSpeed, 
  applyTechEffects 
} from '../data/technologies';

export const useGameLogic = () => {
  const [gameState, setGameState] = useState('setup');
  const [president, setPresident] = useState({ name: '', nationName: '' });
  const [nation, setNation] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Sistema de Notificações
  const addNotification = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Iniciar Jogo
  const startGame = (name, nationName) => {
    if (!name || !nationName) {
      addNotification('Preencha todos os campos!', 'error');
      return;
    }

    const territory = generateTerritory();
    const initialNation = {
      territory,
      population: GAME_CONFIG.INITIAL_POPULATION,
      treasury: GAME_CONFIG.INITIAL_TREASURY,
      currentMonth: 1,
      happiness: 50,
      stats: {
        education: 0,
        health: 0,
        security: 0,
        food: 0,
        economy: 0,
        research: 0,
        energy: 0,
        resources: 0
      },
      workers: {
        common: GAME_CONFIG.INITIAL_POPULATION,
        employed: 0
      },
      ministries: [],
      facilities: [],
      resourceStorage: {},
      technologies: {
        researching: [],
        researched: []
      }
    };

    setPresident({ name, nationName });
    setNation(initialNation);
    setGameState('playing');
    addNotification('🎉 Bem-vindo! Sua nação foi fundada com sucesso!', 'success');
  };

  // Criar Ministério
  const createMinistry = (type) => {
    if (!nation) return;

    if (nation.treasury < GAME_CONFIG.MINISTRY_COST) {
      addNotification('Tesouro insuficiente para criar ministério!', 'error');
      return;
    }

    if (nation.ministries.find(m => m.type === type)) {
      addNotification('Este ministério já existe!', 'warning');
      return;
    }

    const ministryData = MINISTRY_TYPES[type];
    if (!ministryData) {
      addNotification('Tipo de ministério inválido!', 'error');
      return;
    }

    const newMinistry = {
      id: Date.now(),
      type,
      ...ministryData,
      minister: null
    };

    setNation(prev => ({
      ...prev,
      ministries: [...prev.ministries, newMinistry],
      treasury: prev.treasury - GAME_CONFIG.MINISTRY_COST
    }));

    addNotification(`✅ Ministério de ${ministryData.name} criado com sucesso!`, 'success');
  };

  // Contratar Ministro
  const hireMinister = (ministryId, salary) => {
    if (!nation) return;

    const salaryNum = parseInt(salary);
    
    if (isNaN(salaryNum) || salaryNum < 5000) {
      addNotification('Salário mínimo do ministro: R$ 5.000', 'error');
      return;
    }

    if (nation.treasury < salaryNum) {
      addNotification('Tesouro insuficiente para pagar o salário do ministro!', 'error');
      return;
    }

    const ministry = nation.ministries.find(m => m.id === ministryId);
    if (!ministry) {
      addNotification('Ministério não encontrado!', 'error');
      return;
    }

    if (ministry.minister) {
      addNotification('Este ministério já tem um ministro!', 'warning');
      return;
    }

    setNation(prev => ({
      ...prev,
      ministries: prev.ministries.map(m =>
        m.id === ministryId
          ? { ...m, minister: { name: `Ministro ${m.name}`, salary: salaryNum } }
          : m
      ),
      treasury: prev.treasury - salaryNum
    }));

    addNotification(`👔 Ministro contratado com sucesso! Salário: R$ ${salaryNum.toLocaleString()}`, 'success');
  };

  // Atualizar Salário do Ministro
  const updateMinisterSalary = (ministryId, newSalary) => {
    if (!nation) return;

    const salaryNum = parseInt(newSalary);
    
    if (isNaN(salaryNum) || salaryNum < 5000) {
      addNotification('Salário mínimo do ministro: R$ 5.000', 'error');
      return;
    }

    const ministry = nation.ministries.find(m => m.id === ministryId);
    if (!ministry || !ministry.minister) {
      addNotification('Ministério ou ministro não encontrado!', 'error');
      return;
    }

    const oldSalary = ministry.minister.salary;
    const difference = salaryNum - oldSalary;

    if (difference > 0 && nation.treasury < difference) {
      addNotification('Tesouro insuficiente para aumentar o salário!', 'error');
      return;
    }

    setNation(prev => ({
      ...prev,
      ministries: prev.ministries.map(m =>
        m.id === ministryId
          ? { ...m, minister: { ...m.minister, salary: salaryNum } }
          : m
      ),
      treasury: prev.treasury - difference
    }));

    addNotification(
      `💵 Salário do Ministro de ${ministry.name} atualizado para R$ ${salaryNum.toLocaleString()}`,
      'success'
    );
  };

  // Criar Benfeitoria
  const createFacility = (ministryId, facilityData) => {
    if (!nation) return;

    if (nation.treasury < facilityData.cost) {
      addNotification(
        `💰 Tesouro insuficiente! Necessário R$ ${facilityData.cost.toLocaleString()}`,
        'error'
      );
      return;
    }

    const ministry = nation.ministries.find(m => m.id === ministryId);
    if (!ministry) {
      addNotification('Ministério não encontrado!', 'error');
      return;
    }

    if (!ministry.minister) {
      addNotification('Contrate um ministro antes de construir benfeitorias!', 'warning');
      return;
    }

    const newFacility = {
      id: Date.now() + Math.random(),
      ministryId,
      name: facilityData.name,
      cost: facilityData.cost,
      benefits: { ...(facilityData.benefits || {}) },
      researchSpeed: facilityData.researchSpeed || 0,
      resourceConsumption: { ...(facilityData.resourceConsumption || {}) },
      resourceProduction: { ...(facilityData.resourceProduction || {}) },
      jobs: facilityData.jobs.map(job => ({ 
        ...job, 
        filled: 0, 
        currentSalary: job.minSalary 
      })),
      appliedTechs: []
    };

    // Aplicar tecnologias já pesquisadas
    const updatedFacility = applyTechEffects(
      newFacility, 
      nation.technologies?.researched || []
    );

    setNation(prev => ({
      ...prev,
      facilities: [...prev.facilities, updatedFacility],
      treasury: prev.treasury - facilityData.cost
    }));

    addNotification(`🏗️ ${facilityData.name} construída com sucesso!`, 'success');
  };

  // Atualizar Salário de Cargo
  const updateJobSalary = (facilityId, role, newSalary) => {
    if (!nation) return;

    const facility = nation.facilities.find(f => f.id === facilityId);
    if (!facility) {
      addNotification('Benfeitoria não encontrada!', 'error');
      return;
    }

    const job = facility.jobs.find(j => j.role === role);
    if (!job) {
      addNotification('Cargo não encontrado!', 'error');
      return;
    }

    const salaryNum = parseInt(newSalary);
    
    if (isNaN(salaryNum) || salaryNum < job.minSalary) {
      addNotification(
        `⚠️ Salário abaixo do mínimo! Mínimo: R$ ${job.minSalary.toLocaleString()}`,
        'warning'
      );
      return;
    }

    setNation(prev => ({
      ...prev,
      facilities: prev.facilities.map(f =>
        f.id === facilityId
          ? {
              ...f,
              jobs: f.jobs.map(j =>
                j.role === role ? { ...j, currentSalary: salaryNum } : j
              )
            }
          : f
      )
    }));

    addNotification(
      `💵 Salário de ${role} atualizado para R$ ${salaryNum.toLocaleString()}`,
      'success'
    );
  };

  // Iniciar Pesquisa
  const startResearch = (techId) => {
    if (!nation) return;

    const { can, reason } = canResearch(techId, nation);
    
    if (!can) {
      addNotification(reason, 'error');
      return;
    }

    const currentResearching = nation.technologies?.researching?.length || 0;
    if (currentResearching >= GAME_CONFIG.TECHNOLOGY.MAX_SIMULTANEOUS_RESEARCH) {
      addNotification(
        `⚠️ Máximo de ${GAME_CONFIG.TECHNOLOGY.MAX_SIMULTANEOUS_RESEARCH} pesquisas simultâneas!`,
        'warning'
      );
      return;
    }

    const tech = TECHNOLOGIES[techId];
    const researchSpeed = calculateResearchSpeed(nation);
    const adjustedTime = Math.max(1, Math.ceil(tech.researchTime / researchSpeed));

    setNation(prev => ({
      ...prev,
      treasury: prev.treasury - tech.cost,
      technologies: {
        ...prev.technologies,
        researching: [
          ...(prev.technologies?.researching || []),
          {
            id: techId,
            progress: 0,
            total: adjustedTime,
            startMonth: prev.currentMonth
          }
        ]
      }
    }));

    addNotification(
      `🔬 Pesquisa de ${tech.name} iniciada! Conclusão em ${adjustedTime} mês(es). Velocidade: ${researchSpeed.toFixed(1)}x`,
      'success'
    );
  };

  // Completar Pesquisa
  const completeResearch = (techId) => {
    const tech = TECHNOLOGIES[techId];
    if (!tech) return;

    setNation(prev => {
      const updatedResearching = prev.technologies.researching.filter(r => r.id !== techId);
      const updatedResearched = [...(prev.technologies.researched || []), techId];
      const updatedFacilities = prev.facilities.map(facility => 
        applyTechEffects(facility, updatedResearched)
      );

      return {
        ...prev,
        technologies: {
          ...prev.technologies,
          researching: updatedResearching,
          researched: updatedResearched
        },
        facilities: updatedFacilities
      };
    });

    addNotification(
      `🎉 ${tech.name} concluída! Benefícios aplicados automaticamente às benfeitorias.`,
      'success'
    );
  };

  // Exportar Recursos
  const exportResource = (resource, amount) => {
    if (!nation || !nation.resourceStorage[resource] || nation.resourceStorage[resource] < amount) {
      addNotification('❌ Estoque insuficiente para exportação!', 'error');
      return;
    }

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

    const price = basePrices[resource] || 50;
    const totalValue = Math.floor(amount * price);

    setNation(prev => ({
      ...prev,
      treasury: prev.treasury + totalValue,
      resourceStorage: {
        ...prev.resourceStorage,
        [resource]: prev.resourceStorage[resource] - amount
      }
    }));

    addNotification(
      `💰 Exportação concluída! ${amount} unidades de ${resource} vendidas por R$ ${totalValue.toLocaleString()}`,
      'success'
    );
  };

  // Próximo Turno
  const nextTurn = () => {
    if (!nation) return;

    const finances = calculateFinances(nation);
    
    if (finances.balance < 0 && nation.treasury + finances.balance < 0) {
      addNotification(
        '🚨 ALERTA: Tesouro insuficiente para pagar despesas mensais! Ajuste suas finanças!',
        'error'
      );
      return;
    }

    const { happiness, stats } = calculateHappiness(nation);
    const populationGrowth = calculatePopulationGrowth(nation.population, happiness);
    const { updatedFacilities, newEmployed } = autoFillJobs(nation);

    // Armazenar recursos excedentes
    const { balance: resourceBalance } = calculateResourceBalance(nation);
    const updatedResourceStorage = { ...(nation.resourceStorage || {}) };
    
    Object.entries(resourceBalance).forEach(([resource, amount]) => {
      if (amount > 0) {
        // Armazenar 50% do excedente (os outros 50% são vendidos)
        updatedResourceStorage[resource] = (updatedResourceStorage[resource] || 0) + (amount * 0.5);
      }
    });

    let completedResearches = [];
    const updatedResearching = (nation.technologies?.researching || []).map(research => {
      const newProgress = research.progress + 1;
      
      if (newProgress >= research.total) {
        completedResearches.push(research.id);
        return null;
      }
      
      return { ...research, progress: newProgress };
    }).filter(Boolean);

    setNation(prev => ({
      ...prev,
      currentMonth: prev.currentMonth + 1,
      treasury: prev.treasury + finances.balance,
      population: prev.population + populationGrowth,
      happiness,
      stats,
      facilities: updatedFacilities,
      resourceStorage: updatedResourceStorage,
      workers: {
        common: prev.workers.common + populationGrowth,
        employed: newEmployed
      },
      technologies: {
        ...prev.technologies,
        researching: updatedResearching
      }
    }));

    completedResearches.forEach(techId => {
      setTimeout(() => completeResearch(techId), 500);
    });

    const newMonth = nation.currentMonth + 1;
    
    addNotification(
      `📅 Mês ${newMonth}: Balanço ${finances.balance >= 0 ? '+' : ''}R$ ${finances.balance.toLocaleString()}`,
      finances.balance >= 0 ? 'success' : 'warning'
    );

    if (populationGrowth > 0) {
      addNotification(
        `👥 População cresceu em ${populationGrowth.toLocaleString()} habitantes!`,
        'info'
      );
    }

    if (completedResearches.length > 0) {
      addNotification(
        `🔬 ${completedResearches.length} pesquisa(s) concluída(s) este mês!`,
        'success'
      );
    }

    if (happiness < GAME_CONFIG.HAPPINESS_THRESHOLD.POOR) {
      addNotification(
        '😢 Felicidade muito baixa! Construa benfeitorias de saúde e educação!',
        'warning'
      );
    }

    if (happiness >= GAME_CONFIG.HAPPINESS_THRESHOLD.EXCELLENT) {
      addNotification(
        '😊 População extremamente feliz! Ótimo trabalho!',
        'success'
      );
    }

    const employmentRate = (nation.workers.employed / nation.population);
    if (employmentRate < 0.1) {
      addNotification(
        '💼 Alto desemprego! Crie mais vagas de emprego construindo benfeitorias!',
        'info'
      );
    }

    if (employmentRate > 0.5) {
      addNotification(
        '👔 Ótima taxa de emprego! Sua economia está crescendo!',
        'success'
      );
    }

    if (nation.treasury < 1000000) {
      addNotification(
        '⚠️ Tesouro baixo! Cuidado com gastos excessivos!',
        'warning'
      );
    }

    if (updatedResearching.length > 0) {
      updatedResearching.forEach(r => {
        const remaining = r.total - r.progress;
        if (remaining === 1) {
          const tech = TECHNOLOGIES[r.id];
          addNotification(
            `🔬 ${tech.name} será concluída no próximo mês!`,
            'info'
          );
        }
      });
    }
  };

  return {
    gameState,
    president,
    nation,
    notifications,
    startGame,
    createMinistry,
    hireMinister,
    updateMinisterSalary,
    createFacility,
    updateJobSalary,
    nextTurn,
    startResearch,
    completeResearch,
    addNotification,
    exportResource
  };
};