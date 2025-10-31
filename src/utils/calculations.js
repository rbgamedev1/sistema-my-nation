// src/utils/calculations.js - ATUALIZADO COM NOVOS RECURSOS

import { GAME_CONFIG, RESOURCE_CATEGORIES, DEFICIT_PENALTIES } from '../data/gameConfig';

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

// Calcula consumo de recursos pela população
export const calculatePopulationResourceConsumption = (population) => {
  const consumption = {};
  
  Object.entries(GAME_CONFIG.POPULATION_CONSUMPTION).forEach(([resource, amountPer1000]) => {
    consumption[resource] = (population / 1000) * amountPer1000;
  });
  
  return consumption;
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

  // Adicionar produção de cidadãos autônomos (se existir)
  if (nation.production) {
    Object.entries(nation.production).forEach(([resource, amount]) => {
      production[resource] = (production[resource] || 0) + amount;
    });
  }

  // Consumo da população
  const populationConsumption = calculatePopulationResourceConsumption(nation.population);
  Object.entries(populationConsumption).forEach(([resource, amount]) => {
    consumption[resource] = (consumption[resource] || 0) + amount;
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

  return { production, consumption, balance, populationConsumption };
};

export const calculateFinances = (nation) => {
  if (!nation) return { 
    revenue: 0, 
    taxRevenue: 0,
    expenses: 0,
    salaryExpenses: 0,
    balance: 0 
  };

  // Receita de impostos - APENAS EMPREGADOS PAGAM
  const employedWorkers = nation.workers.employed;
  const taxRevenue = employedWorkers * GAME_CONFIG.BASE_WORKER_SALARY * GAME_CONFIG.EMPLOYMENT_TAX_RATE;
  
  const revenue = taxRevenue;
  
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

  const expenses = salaryExpenses;

  return { 
    revenue: Math.floor(revenue),
    taxRevenue: Math.floor(taxRevenue),
    expenses: Math.floor(expenses),
    salaryExpenses: Math.floor(salaryExpenses),
    balance: Math.floor(revenue - expenses) 
  };
};

// Determinar categoria de um recurso
const getResourceCategory = (resource) => {
  for (const [category, resources] of Object.entries(RESOURCE_CATEGORIES)) {
    if (resources.includes(resource)) {
      return category;
    }
  }
  return 'other';
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
  happiness += (stats.culture || 0) * 0.15;

  // PENALIDADES BALANCEADAS POR RECURSOS EM DÉFICIT
  const { balance: resourceBalance } = calculateResourceBalance(nation);
  
  Object.entries(resourceBalance).forEach(([resource, amount]) => {
    if (amount < 0) {
      const category = getResourceCategory(resource);
      const penalty = DEFICIT_PENALTIES[category] || 0;
      happiness += penalty; // Penalidades são negativas
    }
  });
  
  return { happiness: Math.min(100, Math.max(0, happiness)), stats };
};

export const calculatePopulationGrowth = (population, happiness) => {
  const growthRate = (happiness / 100) * GAME_CONFIG.POPULATION_GROWTH_RATE;
  const newPopulation = Math.floor(population * (1 + growthRate));
  return newPopulation - population;
};

export const autoFillJobs = (nation) => {
  let availableWorkers = nation.workers.common - nation.workers.employed;
  let totalEmployed = 0;

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
          totalEmployed += (currentFilled + toFill);
          return { ...job, filled: currentFilled + toFill };
        }
      }

      totalEmployed += currentFilled;
      return job;
    })
  }));

  return { updatedFacilities, newEmployed: totalEmployed };
};