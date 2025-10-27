// src/utils/calculations.js - COMPLETO CORRIGIDO

import { GAME_CONFIG } from '../data/gameConfig';

export const generateTerritory = () => {
  const x = Math.floor(Math.random() * 100);
  const y = Math.floor(Math.random() * 100);
  
  const resources = {};
  
  if (y < 33) {
    resources.petroleo = Math.floor(Math.random() * 1000000) + 500000;
    resources.gas = Math.floor(Math.random() * 800000) + 300000;
    resources.ferro = Math.floor(Math.random() * 300000);
  } else if (y < 66) {
    resources.ouro = Math.floor(Math.random() * 100000);
    resources.ferro = Math.floor(Math.random() * 800000) + 400000;
    resources.cobre = Math.floor(Math.random() * 500000);
    resources.petroleo = Math.floor(Math.random() * 300000);
  } else {
    resources.terrasAraveis = Math.floor(Math.random() * 500000) + 300000;
    resources.agua = Math.floor(Math.random() * 1000000) + 500000;
    resources.ferro = Math.floor(Math.random() * 200000);
  }

  return { x, y, size: Math.floor(Math.random() * 50) + 50, resources };
};

// Calcula balanço de recursos (produção vs consumo)
export const calculateResourceBalance = (nation) => {
  const production = {};
  const consumption = {};
  const balance = {};

  // Produção base do território
  if (nation.territory?.resources) {
    Object.entries(nation.territory.resources).forEach(([resource, amount]) => {
      production[resource] = amount;
    });
  }

  // Processar benfeitorias
  nation.facilities.forEach(facility => {
    // Produção de recursos
    if (facility.resourceProduction) {
      Object.entries(facility.resourceProduction).forEach(([resource, amount]) => {
        production[resource] = (production[resource] || 0) + amount;
      });
    }

    // Consumo de recursos
    if (facility.resourceConsumption) {
      Object.entries(facility.resourceConsumption).forEach(([resource, amount]) => {
        consumption[resource] = (consumption[resource] || 0) + amount;
      });
    }
  });

  // Calcular balanço
  const allResources = new Set([
    ...Object.keys(production),
    ...Object.keys(consumption)
  ]);

  allResources.forEach(resource => {
    const prod = production[resource] || 0;
    const cons = consumption[resource] || 0;
    balance[resource] = prod - cons;
  });

  return { production, consumption, balance };
};

// Preços de mercado para recursos
const RESOURCE_PRICES = {
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

export const calculateFinances = (nation) => {
  if (!nation) return { 
    revenue: 0, 
    taxRevenue: 0,
    resourceRevenue: 0,
    expenses: 0,
    salaryExpenses: 0,
    resourcePenalty: 0,
    balance: 0 
  };

  // Receita de impostos - APENAS EMPREGADOS PAGAM
  const employedWorkers = nation.workers.employed;
  const taxRevenue = employedWorkers * GAME_CONFIG.BASE_WORKER_SALARY * GAME_CONFIG.EMPLOYMENT_TAX_RATE;
  
  // Calcular receita/penalidade de recursos
  const { balance: resourceBalance } = calculateResourceBalance(nation);
  let resourceRevenue = 0;
  let resourcePenalty = 0;

  Object.entries(resourceBalance).forEach(([resource, amount]) => {
    const price = RESOURCE_PRICES[resource] || 0;
    
    if (amount > 0) {
      // Excedente: vender 50% no mercado
      resourceRevenue += (amount * 0.5) * price;
    } else if (amount < 0) {
      // Déficit: importar a preço cheio + 20% de taxa
      resourcePenalty += Math.abs(amount) * price * 1.2;
    }
  });

  const revenue = taxRevenue + resourceRevenue;
  
  let salaryExpenses = 0;
  
  // Despesas com ministros
  nation.ministries.forEach(ministry => {
    if (ministry.minister) {
      salaryExpenses += ministry.minister.salary;
    }
  });
  
  // Despesas com funcionários das benfeitorias
  nation.facilities.forEach(facility => {
    facility.jobs.forEach(job => {
      const filled = job.filled || 0;
      salaryExpenses += filled * (job.currentSalary || job.minSalary);
    });
  });

  const expenses = salaryExpenses + resourcePenalty;

  return { 
    revenue: Math.floor(revenue),
    taxRevenue: Math.floor(taxRevenue),
    resourceRevenue: Math.floor(resourceRevenue),
    expenses: Math.floor(expenses),
    salaryExpenses: Math.floor(salaryExpenses),
    resourcePenalty: Math.floor(resourcePenalty),
    balance: Math.floor(revenue - expenses) 
  };
};

export const calculateHappiness = (nation) => {
  let happiness = 50;
  const stats = { ...nation.stats };
  
  // Resetar stats para recalcular
  Object.keys(stats).forEach(key => {
    stats[key] = 0;
  });
  
  // Somar benefícios de todas as benfeitorias
  nation.facilities.forEach(facility => {
    if (facility.benefits) {
      Object.entries(facility.benefits).forEach(([key, value]) => {
        stats[key] = (stats[key] || 0) + value;
      });
    }
  });

  // Calcular felicidade baseada nos stats
  happiness += stats.education * 0.2;
  happiness += stats.health * 0.3;
  happiness += stats.security * 0.1;
  happiness += stats.food * 0.2;

  // Penalidade por recursos em déficit
  const { balance: resourceBalance } = calculateResourceBalance(nation);
  const deficitCount = Object.values(resourceBalance).filter(v => v < 0).length;
  happiness -= deficitCount * 5; // -5% por recurso em déficit
  
  return { happiness: Math.min(100, Math.max(0, happiness)), stats };
};

export const calculatePopulationGrowth = (population, happiness) => {
  const growthRate = (happiness / 100) * GAME_CONFIG.POPULATION_GROWTH_RATE;
  const newPopulation = Math.floor(population * (1 + growthRate));
  return newPopulation - population;
};

export const autoFillJobs = (nation) => {
  let availableWorkers = nation.workers.common - nation.workers.employed;
  let newEmployed = nation.workers.employed;

  const updatedFacilities = nation.facilities.map(facility => ({
    ...facility,
    jobs: facility.jobs.map(job => {
      const currentSalary = job.currentSalary || job.minSalary;
      const attractiveness = currentSalary / job.minSalary;
      const currentFilled = job.filled || 0;
      const vacancies = job.count - currentFilled;

      if (vacancies > 0 && availableWorkers > 0 && attractiveness >= 1) {
        const fillRate = Math.min(attractiveness, 2) * 0.1;
        const toFill = Math.min(
          Math.ceil(vacancies * fillRate),
          vacancies,
          availableWorkers
        );

        if (toFill > 0) {
          availableWorkers -= toFill;
          newEmployed += toFill;
          return { ...job, filled: currentFilled + toFill };
        }
      }

      return job;
    })
  }));

  return { updatedFacilities, newEmployed };
};