// src/utils/calculations.js

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

export const calculateFinances = (nation) => {
  if (!nation) return { revenue: 0, expenses: 0, balance: 0 };

  const employedWorkers = nation.workers.common - nation.workers.employed;
  const revenue = employedWorkers * GAME_CONFIG.BASE_WORKER_SALARY * GAME_CONFIG.TAX_RATE;
  
  let expenses = 0;
  nation.ministries.forEach(ministry => {
    if (ministry.minister) expenses += ministry.minister.salary;
  });
  
  nation.facilities.forEach(facility => {
    facility.jobs.forEach(job => {
      const filled = job.filled || 0;
      expenses += filled * (job.currentSalary || job.minSalary);
    });
  });

  return { revenue, expenses, balance: revenue - expenses };
};

export const calculateHappiness = (nation) => {
  let happiness = 50;
  const stats = { ...nation.stats };
  
  nation.facilities.forEach(f => {
    Object.entries(f.benefits).forEach(([key, value]) => {
      stats[key] = (stats[key] || 0) + value;
    });
  });

  happiness += stats.education * 0.2;
  happiness += stats.health * 0.3;
  happiness += stats.security * 0.1;
  happiness += stats.food * 0.2;
  
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