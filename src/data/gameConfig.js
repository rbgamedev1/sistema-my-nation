// src/data/gameConfig.js

export const GAME_CONFIG = {
  INITIAL_POPULATION: 1000000,
  INITIAL_TREASURY: 50000000,
  BASE_WORKER_SALARY: 200,
  TAX_RATE: 0.15,
  MINISTRY_COST: 100000,
  DAYS_PER_TURN: 30,
  POPULATION_GROWTH_RATE: 0.002, // 0.2% por mês
  HAPPINESS_THRESHOLD: {
    EXCELLENT: 80,
    GOOD: 60,
    AVERAGE: 40,
    POOR: 20
  },
  // Configurações de Tecnologia
  TECHNOLOGY: {
    BASE_RESEARCH_SPEED: 1,
    MAX_SIMULTANEOUS_RESEARCH: 3, // Máximo de pesquisas simultâneas
    RESEARCH_COST_MULTIPLIER: 1.0 // Multiplicador de custo de pesquisa
  }
};