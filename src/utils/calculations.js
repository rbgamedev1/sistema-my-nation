// src/utils/calculations.js - CORRIGIDO (Exportando função que faltava)

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
    resources.agua = Math.floor(Math.random() * 100000) + 50000;
    resources.ferro = Math.floor(Math.random() * 200000);
  }

  return { x, y, size: Math.floor(Math.random() * 50) + 50, resources };
};

// CORRIGIDO: Exportada a função que estava faltando
export const calculatePopulationResourceConsumption = (population) => {
  const consumption = {};
  
  Object.entries(GAME_CONFIG.POPULATION_CONSUMPTION).forEach(([resource, amountPer1000]) => {
    consumption[resource] = (population / 1000) * amountPer1000;
  });
  
  return consumption;
};

// Função para obter produção autônoma dos cidadãos
export const getAutonomousProduction = (citizenSystem) => {
  if (!citizenSystem || !citizenSystem.autonomousBusinesses) return {};
  
  const production = {};
  for (const business of citizenSystem.autonomousBusinesses) {
    production[business.product] = (production[business.product] || 0) + business.production;
  }
  return production;
};

// CORRIGIDO: Adicionar produção autônoma ao cálculo
export const calculateResourceBalance = (nation, citizenSystem = null) => {
  const production = {};
  const consumption = {};
  const balance = {};

  // Recursos do território
  if (nation.territory?.resources) {
    Object.entries(nation.territory.resources).forEach(([resource, amount]) => {
      production[resource] = amount;
    });
  }

  // Produção das benfeitorias
  nation.facilities.forEach(facility => {
    if (facility.resourceProduction) {
      Object.entries(facility.resourceProduction).forEach(([resource, amount]) => {
        production[resource] = (production[resource] || 0) + amount;
      });
    }

    if (facility.resourceConsumption) {
      Object.entries(facility.resourceConsumption).forEach(([resource, amount]) => {
        consumption[resource] = (consumption[resource] || 0) + amount;
      });
    }
  });

  // Produção dos recursos do nation.production (incluindo produção autônoma)
  if (nation.production) {
    Object.entries(nation.production).forEach(([resource, amount]) => {
      production[resource] = (production[resource] || 0) + amount;
    });
  }

  // NOVO: Adicionar produção autônoma explicitamente
  if (citizenSystem) {
    const autonomousProduction = getAutonomousProduction(citizenSystem);
    Object.entries(autonomousProduction).forEach(([resource, amount]) => {
      production[resource] = (production[resource] || 0) + amount;
    });
  }

  // CORRIGIDO: Recalcular consumo da população SEMPRE com a população atual
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

  // Receita de impostos apenas de empregados
  const employedWorkers = nation.workers.employed || 0;
  const taxRevenue = employedWorkers * GAME_CONFIG.BASE_WORKER_SALARY * GAME_CONFIG.EMPLOYMENT_TAX_RATE;
  
  const revenue = taxRevenue;
  
  // Despesas com salários
  let salaryExpenses = 0;
  
  // Salários dos ministros
  nation.ministries.forEach(ministry => {
    if (ministry.minister) {
      salaryExpenses += ministry.minister.salary || 0;
    }
  });
  
  // Salários dos funcionários das benfeitorias
  nation.facilities.forEach(facility => {
    facility.jobs.forEach(job => {
      const filled = job.filled || 0;
      const salary = job.currentSalary || job.minSalary || 0;
      salaryExpenses += filled * salary;
    });
  });

  const expenses = salaryExpenses;

  return { 
    revenue: Math.floor(revenue) || 0,
    taxRevenue: Math.floor(taxRevenue) || 0,
    expenses: Math.floor(expenses) || 0,
    salaryExpenses: Math.floor(salaryExpenses) || 0,
    balance: Math.floor(revenue - expenses) || 0
  };
};

const getResourceCategory = (resource) => {
  for (const [category, resources] of Object.entries(RESOURCE_CATEGORIES)) {
    if (resources.includes(resource)) {
      return category;
    }
  }
  return 'other';
};

// CORRIGIDO: Felicidade agora considera produção autônoma via resourceBalance
export const calculateHappiness = (nation, citizenSystem = null) => {
  let happiness = 50; // Base
  const stats = { ...nation.stats };
  
  // Resetar stats
  Object.keys(stats).forEach(key => {
    stats[key] = 0;
  });
  
  // Somar benefícios das benfeitorias
  nation.facilities.forEach(facility => {
    if (facility.benefits) {
      Object.entries(facility.benefits).forEach(([key, value]) => {
        stats[key] = (stats[key] || 0) + value;
      });
    }
  });

  // Calcular felicidade baseada nos stats com pesos corretos
  happiness += stats.education * 0.2;   // 20% de peso
  happiness += stats.health * 0.3;      // 30% de peso
  happiness += stats.security * 0.1;    // 10% de peso
  happiness += stats.food * 0.2;        // 20% de peso
  happiness += (stats.culture || 0) * 0.15; // 15% de peso

  // CORRIGIDO: Passar citizenSystem para incluir produção autônoma
  const { balance: resourceBalance } = calculateResourceBalance(nation, citizenSystem);
  
  console.log('[calculateHappiness] Resource Balance:', resourceBalance);
  
  // Penalidades por déficit de recursos
  Object.entries(resourceBalance).forEach(([resource, amount]) => {
    if (amount < 0) {
      const category = getResourceCategory(resource);
      const penalty = DEFICIT_PENALTIES[category] || 0;
      console.log(`[calculateHappiness] Déficit de ${resource} (${category}): ${amount.toFixed(1)}, Penalidade: ${penalty}%`);
      happiness += penalty; // penalty já é negativo
    }
  });
  
  console.log(`[calculateHappiness] Felicidade Final: ${happiness.toFixed(1)}%`);
  
  return { 
    happiness: Math.min(100, Math.max(0, happiness)), 
    stats 
  };
};

export const calculatePopulationGrowth = (population, happiness) => {
  // Taxa de natalidade realista: 5 a 12 nascimentos por 1000 habitantes por mês
  let birthRatePer1000 = 5;
  
  if (happiness >= 90) {
    birthRatePer1000 = 12;
  } else if (happiness >= 75) {
    birthRatePer1000 = 10;
  } else if (happiness >= 60) {
    birthRatePer1000 = 8;
  } else if (happiness >= 40) {
    birthRatePer1000 = 7;
  } else if (happiness >= 20) {
    birthRatePer1000 = 6;
  }
  
  const populationInThousands = population / 1000;
  const growth = Math.floor(populationInThousands * birthRatePer1000);
  
  console.log(`[PopulationGrowth] População: ${population.toLocaleString()}, Felicidade: ${happiness.toFixed(1)}%, Taxa: ${birthRatePer1000}/1000/mês, Crescimento: ${growth}`);
  
  return growth;
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
        // Taxa de preenchimento baseada na atratividade do salário
        const fillRate = Math.min(attractiveness, 2) * 0.15; // 15% a 30% por turno
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