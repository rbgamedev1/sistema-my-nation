// src/data/gameConfig.js

export const GAME_CONFIG = {
  INITIAL_POPULATION: 1000000,
  INITIAL_TREASURY: 5000000,
  BASE_WORKER_SALARY: 2000,
  EMPLOYMENT_TAX_RATE: 0.15,
  UNEMPLOYMENT_TAX_RATE: 0,
  MINISTRY_COST: 500000,
  DAYS_PER_TURN: 30,
  POPULATION_GROWTH_RATE: 0.002,
  HAPPINESS_THRESHOLD: {
    EXCELLENT: 80,
    GOOD: 60,
    AVERAGE: 40,
    POOR: 20
  },
  // Consumo per capita (por 1000 habitantes por mês)
  POPULATION_CONSUMPTION: {
    agua: 50,
    food: 30,
    energy: 20,
    furniture: 5,
    fruits: 10,
    vegetables: 10,
    clothing: 3,
    medicine: 2
  },
  TECHNOLOGY: {
    BASE_RESEARCH_SPEED: 1,
    MAX_SIMULTANEOUS_RESEARCH: 3,
    RESEARCH_COST_MULTIPLIER: 1.0
  }
};