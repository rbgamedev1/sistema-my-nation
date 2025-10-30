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
  // Consumo per capita (por 1000 habitantes por mês) - REBALANCEADO
  POPULATION_CONSUMPTION: {
    // Recursos Críticos (essenciais para sobrevivência)
    agua: 15,        // Reduzido de 50 para 15 (mais realista)
    food: 10,        // Reduzido de 30 para 10 (alimentos básicos)
    energy: 8,       // Reduzido de 20 para 8 (energia residencial)
    
    // Recursos Secundários (qualidade de vida)
    furniture: 1,    // Reduzido de 5 para 1 (não compra todo mês)
    fruits: 3,       // Reduzido de 10 para 3 (complemento alimentar)
    vegetables: 3,   // Reduzido de 10 para 3 (complemento alimentar)
    clothing: 0.5,   // Reduzido de 3 para 0.5 (não compra todo mês)
    medicine: 0.3    // Reduzido de 2 para 0.3 (uso ocasional)
  },
  TECHNOLOGY: {
    BASE_RESEARCH_SPEED: 1,
    MAX_SIMULTANEOUS_RESEARCH: 3,
    RESEARCH_COST_MULTIPLIER: 1.0
  }
};

// Notas sobre o rebalanceamento:
// 
// ÁGUA (15/1k hab):
// - 1M habitantes = 15k unidades/mês
// - 1 Poço Artesiano produz 1000 = precisa de ~15 poços
// - 1 Estação de Tratamento produz 2000 = precisa de ~8 estações
// - Mais realista e gerenciável
//
// ALIMENTOS (10/1k hab):
// - 1M habitantes = 10k unidades/mês
// - 1 Fazenda de Grãos produz 1000 = precisa de ~10 fazendas
// - Complementado por frutas (3) e vegetais (3) = total ~16/1k
// - Balanceado entre quantidade e variedade
//
// ENERGIA (8/1k hab):
// - 1M habitantes = 8k unidades/mês
// - 1 Usina produz 2000 = precisa de ~4 usinas
// - Consumo residencial realista
//
// FRUTAS/VEGETAIS (3 cada):
// - São complementos alimentares, não necessidade crítica
// - Déficit não deveria ser tão severo quanto alimentos básicos
// - 1M habitantes = 3k de cada = ~4 fazendas de cada tipo
//
// MÓVEIS (1/1k):
// - Pessoas não compram móveis todo mês
// - 1M habitantes = 1k/mês
// - ~3 fábricas de móveis suficientes
//
// ROUPAS (0.5/1k):
// - Compra ocasional, não mensal
// - 1M habitantes = 500/mês
// - ~1 fábrica de roupas suficiente
//
// MEDICAMENTOS (0.3/1k):
// - Uso ocasional/preventivo
// - 1M habitantes = 300/mês
// - ~1 fábrica de medicamentos suficiente