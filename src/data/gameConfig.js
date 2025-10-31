// src/data/gameConfig.js - CORRIGIDO

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
  
  // Consumo per capita (por 1000 habitantes por mês) - PRODUTOS EM PORTUGUÊS
  POPULATION_CONSUMPTION: {
    // Recursos Críticos
    agua: 15,
    energy: 8,
    
    // ALIMENTOS BÁSICOS (críticos)
    rice: 8,
    beans: 5,
    corn: 4,
    
    // ALIMENTOS IMPORTANTES
    sugar: 2,
    soy: 3,
    
    // BEBIDAS
    coffee: 1.5,
    
    // FRUTAS
    banana: 2,
    orange: 1.5,
    apple: 1,
    lemon: 0.5,
    
    // ESPECIARIAS
    spices: 0.3,
    
    // Recursos Secundários
    furniture: 1,
    fruits: 2,
    vegetables: 3,
    clothing: 0.5,
    medicine: 0.3,
    food: 10
  },
  
  TECHNOLOGY: {
    BASE_RESEARCH_SPEED: 1,
    MAX_SIMULTANEOUS_RESEARCH: 3,
    RESEARCH_COST_MULTIPLIER: 1.0
  },
  
  EDUCATION: {
    COSTS: {
      basic: 50000,
      intermediate: 200000,
      advanced: 800000,
      superior: 3000000
    },
    SCHOOL_REQUIREMENTS: {
      basic: 1,
      intermediate: 3,
      advanced: 5,
      superior: 10
    }
  },
  
  CITIZENS: {
    BUSINESS_CREATION_CHANCE: 0.15, // 15% por mês (aumentado)
    TAX_RATE: 0.15,
    EXPANSION_COOLDOWN: 6,
    GOVERNMENT_SUBSIDY: 0.5
  }
};

// Mapeamento de nomes de recursos - TUDO EM PORTUGUÊS
export const RESOURCE_NAMES = {
  agua: 'Água',
  petroleo: 'Petróleo',
  gas: 'Gás Natural',
  ferro: 'Ferro',
  ouro: 'Ouro',
  cobre: 'Cobre',
  terrasAraveis: 'Terras Aráveis',
  energy: 'Energia',
  fuel: 'Combustível',
  madeira: 'Madeira',
  furniture: 'Móveis',
  clothing: 'Roupas',
  medicine: 'Medicamentos',
  floresta: 'Floresta',
  
  // Alimentos gerais
  food: 'Alimentos',
  fruits: 'Frutas',
  vegetables: 'Vegetais',
  
  // Grãos e básicos
  rice: 'Arroz',
  beans: 'Feijão',
  corn: 'Milho',
  sugar: 'Açúcar',
  soy: 'Soja',
  
  // Bebidas
  coffee: 'Café',
  
  // Frutas específicas
  banana: 'Banana',
  orange: 'Laranja',
  apple: 'Maçã',
  lemon: 'Limão',
  
  // Especiarias
  spices: 'Especiarias'
};

// Ícones de recursos
export const RESOURCE_ICONS = {
  agua: '💧',
  petroleo: '🛢️',
  gas: '💨',
  ferro: '⚙️',
  ouro: '🏆',
  cobre: '🔶',
  terrasAraveis: '🌾',
  food: '🍞',
  energy: '⚡',
  fuel: '⛽',
  madeira: '🪵',
  furniture: '🪑',
  fruits: '🍎',
  vegetables: '🥕',
  clothing: '👕',
  medicine: '💊',
  floresta: '🌲',
  
  rice: '🍚',
  beans: '🫘',
  corn: '🌽',
  sugar: '🍬',
  coffee: '☕',
  soy: '🫛',
  lemon: '🍋',
  apple: '🍎',
  orange: '🍊',
  banana: '🍌',
  spices: '🌶️'
};

// Categorias de recursos
export const RESOURCE_CATEGORIES = {
  critical: ['agua', 'rice', 'beans', 'energy'],
  important: ['corn', 'sugar', 'soy', 'coffee', 'vegetables', 'food'],
  comfort: ['banana', 'orange', 'apple', 'lemon', 'spices', 'fruits', 'furniture', 'clothing'],
  health: ['medicine'],
  industrial: ['petroleo', 'gas', 'ferro', 'ouro', 'cobre', 'madeira', 'fuel', 'floresta', 'terrasAraveis']
};

// Penalidades por déficit
export const DEFICIT_PENALTIES = {
  critical: -12,
  important: -5,
  comfort: -2,
  health: -8,
  industrial: 0
};