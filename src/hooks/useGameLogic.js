import { useState } from 'react';
import { GAME_CONFIG } from '../data/gameConfig';
import { MINISTRY_TYPES } from '../data/ministryTypes';
import { 
  generateTerritory, 
  calculateFinances, 
  calculateHappiness,
  calculatePopulationGrowth,
  autoFillJobs
} from '../utils/calculations';

export const useGameLogic = () => {
  const [gameState, setGameState] = useState('setup');
  const [president, setPresident] = useState({ name: '', nationName: '' });
  const [nation, setNation] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const startGame = (name, nationName) => {
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
      facilities: []
    };

    setPresident({ name, nationName });
    setNation(initialNation);
    setGameState('playing');
    addNotification('Bem-vindo! Sua nação foi fundada com sucesso!', 'success');
  };

  const createMinistry = (type) => {
    if (nation.treasury < GAME_CONFIG.MINISTRY_COST) {
      addNotification('Tesouro insuficiente para criar ministério!', 'error');
      return;
    }

    const ministryData = MINISTRY_TYPES[type];
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

    addNotification(`Ministério de ${ministryData.name} criado!`, 'success');
  };

  const hireMinister = (ministryId, salary) => {
    if (nation.treasury < salary) {
      addNotification('Tesouro insuficiente!', 'error');
      return;
    }

    setNation(prev => ({
      ...prev,
      ministries: prev.ministries.map(m =>
        m.id === ministryId
          ? { ...m, minister: { name: `Ministro ${m.name}`, salary } }
          : m
      ),
      treasury: prev.treasury - salary
    }));

    addNotification('Ministro contratado com sucesso!', 'success');
  };

  const createFacility = (ministryId, facilityData) => {
    if (nation.treasury < facilityData.cost) {
      addNotification(`Tesouro insuficiente! Necessário R$ ${facilityData.cost.toLocaleString()}`, 'error');
      return;
    }

    const newFacility = {
      id: Date.now(),
      ministryId,
      name: facilityData.name,
      cost: facilityData.cost,
      benefits: facilityData.benefits,
      jobs: facilityData.jobs.map(job => ({ ...job, filled: 0, currentSalary: job.minSalary }))
    };

    setNation(prev => ({
      ...prev,
      facilities: [...prev.facilities, newFacility],
      treasury: prev.treasury - facilityData.cost
    }));

    addNotification(`${facilityData.name} construída!`, 'success');
  };

  const updateJobSalary = (facilityId, role, newSalary) => {
    setNation(prev => ({
      ...prev,
      facilities: prev.facilities.map(f =>
        f.id === facilityId
          ? {
              ...f,
              jobs: f.jobs.map(j =>
                j.role === role ? { ...j, currentSalary: newSalary } : j
              )
            }
          : f
      )
    }));
    addNotification(`Salário de ${role} atualizado para R$ ${newSalary.toLocaleString()}`, 'success');
  };

  const nextTurn = () => {
    const finances = calculateFinances(nation);
    
    if (finances.balance < 0 && nation.treasury + finances.balance < 0) {
      addNotification('ALERTA: Tesouro insuficiente para pagar despesas!', 'error');
      return;
    }

    const { happiness, stats } = calculateHappiness(nation);
    const populationGrowth = calculatePopulationGrowth(nation.population, happiness);
    const { updatedFacilities, newEmployed } = autoFillJobs(nation);

    setNation(prev => ({
      ...prev,
      currentMonth: prev.currentMonth + 1,
      treasury: prev.treasury + finances.balance,
      population: prev.population + populationGrowth,
      happiness,
      stats,
      facilities: updatedFacilities,
      workers: {
        ...prev.workers,
        common: prev.workers.common + populationGrowth,
        employed: newEmployed
      }
    }));

    addNotification(
      `Mês ${nation.currentMonth + 1}: Balanço ${finances.balance >= 0 ? '+' : ''}R$ ${finances.balance.toLocaleString()}`,
      finances.balance >= 0 ? 'success' : 'warning'
    );
  };