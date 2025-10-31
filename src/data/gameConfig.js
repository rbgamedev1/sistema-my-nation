// src/data/gameConfig.js - ATUALIZADO COM PRODUTOS AGRÍCOLAS

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
  
  // Consumo per capita (por 1000 habitantes por mês) - EXPANDIDO
  POPULATION_CONSUMPTION: {
    // Recursos Críticos (essenciais para sobrevivência)
    agua: 15,        // Água
    energy: 8,       // Energia
    
    // ALIMENTOS BÁSICOS (críticos - grãos)
    rice: 8,         // Arroz - alimento base brasileiro
    beans: 5,        // Feijão - proteína vegetal essencial
    corn: 4,         // Milho - versátil
    
    // ALIMENTOS IMPORTANTES
    sugar: 2,        // Açúcar - energia rápida
    soy: 3,          // Soja - proteína e óleo
    
    // BEBIDAS
    coffee: 1.5,     // Café - consumo diário moderado
    
    // FRUTAS (variedade)
    banana: 2,       // Banana - mais consumida
    orange: 1.5,     // Laranja - vitamina C
    apple: 1,        // Maçã - saúde
    lemon: 0.5,      // Limão - tempero
    
    // ESPECIARIAS
    spices: 0.3,     // Especiarias - tempero
    
    // Recursos Secundários (mantidos)
    furniture: 1,
    fruits: 2,       // Frutas gerais (além das específicas)
    vegetables: 3,   // Vegetais gerais
    clothing: 0.5,
    medicine: 0.3,
    
    // Mantido para compatibilidade
    food: 10         // Alimentos gerais (será gradualmente substituído pelos específicos)
  },
  
  TECHNOLOGY: {
    BASE_RESEARCH_SPEED: 1,
    MAX_SIMULTANEOUS_RESEARCH: 3,
    RESEARCH_COST_MULTIPLIER: 1.0
  },
  
  // NOVOS: Sistema de Educação
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
  
  // NOVOS: Sistema de Cidadãos
  CITIZENS: {
    BUSINESS_CREATION_CHANCE: 0.05, // 5% por mês
    TAX_RATE: 0.15, // 15% de imposto sobre receita
    EXPANSION_COOLDOWN: 6, // Meses antes de poder expandir
    GOVERNMENT_SUBSIDY: 0.5 // Governo subsidia 50% do custo
  }
};

// Mapeamento de nomes de recursos
export const RESOURCE_NAMES = {
  // Recursos básicos
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
  
  // Novos produtos agrícolas
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
  critical: -12,  // -12% felicidade por recurso crítico
  important: -5,  // -5% felicidade por recurso importante
  comfort: -2,    // -2% felicidade por recurso de conforto
  health: -8,     // -8% felicidade por medicamentos
  industrial: 0   // Não afeta felicidade, apenas impede construções
};

// Notas sobre o sistema:
// 
// ALIMENTOS BÁSICOS:
// - Arroz (8/1k): Base da alimentação
// - Feijão (5/1k): Proteína essencial
// - Milho (4/1k): Alimento versátil
// - 1M habitantes = 8k arroz + 5k feijão + 4k milho = 17k alimentos básicos/mês
//
// SISTEMA DE CIDADÃOS:
// - Com educação básica: Pequenas plantações (2-5 funcionários)
// - Com educação intermediária: Fazendas médias (5-13 funcionários)
// - Com educação avançada: Grandes fazendas (15-40 funcionários)
// - Com educação superior: Agronegócio (50-130 funcionários)
//
// ECONOMIA ORGÂNICA:
// - Cidadãos criam negócios quando há demanda não atendida
// - Pagam 15% de imposto sobre receita
// - Geram empregos (conta para taxa de emprego)
// - Produção conta para necessidades da população
// - Jogador pode aprovar expansões ou destruir negócios