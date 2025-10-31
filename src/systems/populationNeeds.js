// src/systems/populationNeeds.js

export class PopulationNeedsSystem {
  constructor() {
    this.consumptionRates = this.getConsumptionRates();
  }

  // Taxas de consumo por 1000 habitantes/mês
  getConsumptionRates() {
    return {
      // ALIMENTOS BÁSICOS (críticos)
      rice: 8,        // Arroz - alimento base
      beans: 5,       // Feijão - proteína vegetal
      corn: 4,        // Milho - versátil
      
      // ALIMENTOS IMPORTANTES
      sugar: 2,       // Açúcar - energia rápida
      soy: 3,         // Soja - proteína
      
      // BEBIDAS
      coffee: 1.5,    // Café - consumo diário moderado
      
      // FRUTAS (variedade)
      banana: 2,      // Banana - mais consumida
      orange: 1.5,    // Laranja - vitamina C
      apple: 1,       // Maçã - saúde
      lemon: 0.5,     // Limão - tempero
      
      // ESPECIARIAS
      spices: 0.3,    // Especiarias - tempero
      
      // RECURSOS BÁSICOS (mantidos do original)
      agua: 15,
      energy: 8,
      
      // RECURSOS SECUNDÁRIOS
      furniture: 1,
      fruits: 2,      // Frutas gerais (além das específicas)
      vegetables: 3,  // Vegetais gerais
      clothing: 0.5,
      medicine: 0.3
    };
  }

  // Categorias de necessidades
  getCategories() {
    return {
      critical: ['rice', 'beans', 'agua', 'energy'],
      important: ['corn', 'sugar', 'soy', 'coffee', 'vegetables'],
      comfort: ['banana', 'orange', 'apple', 'lemon', 'spices', 'fruits', 'furniture', 'clothing'],
      health: ['medicine']
    };
  }

  // Calcular necessidades da população
  calculateNeeds(population) {
    const needs = {};
    const populationInThousands = population / 1000;

    Object.entries(this.consumptionRates).forEach(([resource, ratePerThousand]) => {
      needs[resource] = populationInThousands * ratePerThousand;
    });

    return needs;
  }

  // Calcular satisfação baseada no atendimento das necessidades
  calculateSatisfaction(population, availableResources, autonomousProduction, educationLevel, economicStatus) {
    const needs = this.calculateNeeds(population);
    const categories = this.getCategories();
    
    // Combinar recursos governamentais + produção autônoma
    const totalAvailable = { ...availableResources };
    Object.entries(autonomousProduction).forEach(([resource, amount]) => {
      totalAvailable[resource] = (totalAvailable[resource] || 0) + amount;
    });

    const satisfaction = {
      critical: { met: 0, total: 0, percentage: 0 },
      important: { met: 0, total: 0, percentage: 0 },
      comfort: { met: 0, total: 0, percentage: 0 },
      health: { met: 0, total: 0, percentage: 0 },
      overallSatisfaction: 0,
      criticalShortages: [],
      surpluses: []
    };

    // Avaliar cada categoria
    Object.entries(categories).forEach(([category, resources]) => {
      let categoryMet = 0;
      let categoryTotal = 0;

      resources.forEach(resource => {
        const needed = needs[resource] || 0;
        const available = totalAvailable[resource] || 0;
        const fulfillment = needed > 0 ? Math.min(available / needed, 1) : 1;

        categoryMet += fulfillment;
        categoryTotal += 1;

        // Identificar escassez crítica
        if (category === 'critical' && fulfillment < 0.5) {
          satisfaction.criticalShortages.push({
            item: resource,
            needed: needed.toFixed(1),
            available: available.toFixed(1),
            deficit: (needed - available).toFixed(1),
            fulfillment: (fulfillment * 100).toFixed(0) + '%'
          });
        }

        // Identificar excedentes
        if (available > needed * 1.2) {
          satisfaction.surpluses.push({
            item: resource,
            surplus: (available - needed).toFixed(1)
          });
        }
      });

      if (categoryTotal > 0) {
        satisfaction[category].met = categoryMet;
        satisfaction[category].total = categoryTotal;
        satisfaction[category].percentage = (categoryMet / categoryTotal) * 100;
      }
    });

    // Calcular satisfação geral (pesos diferentes por categoria)
    const weights = {
      critical: 0.50,    // 50% do peso
      important: 0.25,   // 25% do peso
      comfort: 0.15,     // 15% do peso
      health: 0.10       // 10% do peso
    };

    let weightedSum = 0;
    Object.entries(weights).forEach(([category, weight]) => {
      weightedSum += satisfaction[category].percentage * weight;
    });

    satisfaction.overallSatisfaction = Math.round(weightedSum);

    // Modificadores baseados em educação e economia
    const educationBonus = this.getEducationBonus(educationLevel);
    const economicBonus = this.getEconomicBonus(economicStatus);
    
    satisfaction.overallSatisfaction = Math.min(100, 
      satisfaction.overallSatisfaction + educationBonus + economicBonus
    );

    return satisfaction;
  }

  getEducationBonus(educationLevel) {
    const bonuses = {
      none: 0,
      basic: 2,
      intermediate: 5,
      advanced: 8,
      superior: 12
    };
    return bonuses[educationLevel] || 0;
  }

  getEconomicBonus(economicStatus) {
    const bonuses = {
      poor: -5,
      low: -2,
      medium: 0,
      good: 3,
      excellent: 7
    };
    return bonuses[economicStatus] || 0;
  }

  // Calcular efeitos na economia baseado na satisfação
  calculateEconomicEffects(satisfactionLevel) {
    const effects = {
      productivity: 1.0,
      taxCompliance: 1.0,
      growth: 1.0,
      happiness: 0
    };

    if (satisfactionLevel >= 90) {
      effects.productivity = 1.15;
      effects.taxCompliance = 1.10;
      effects.growth = 1.20;
      effects.happiness = 10;
    } else if (satisfactionLevel >= 75) {
      effects.productivity = 1.10;
      effects.taxCompliance = 1.05;
      effects.growth = 1.10;
      effects.happiness = 5;
    } else if (satisfactionLevel >= 60) {
      effects.productivity = 1.05;
      effects.taxCompliance = 1.00;
      effects.growth = 1.05;
      effects.happiness = 0;
    } else if (satisfactionLevel >= 40) {
      effects.productivity = 0.95;
      effects.taxCompliance = 0.95;
      effects.growth = 0.90;
      effects.happiness = -5;
    } else if (satisfactionLevel >= 20) {
      effects.productivity = 0.85;
      effects.taxCompliance = 0.85;
      effects.growth = 0.70;
      effects.happiness = -10;
    } else {
      effects.productivity = 0.70;
      effects.taxCompliance = 0.70;
      effects.growth = 0.50;
      effects.happiness = -20;
    }

    return effects;
  }

  // Gerar relatório completo
  generateReport(population, availableResources, autonomousProduction, educationLevel, economicStatus) {
    const needs = this.calculateNeeds(population);
    const satisfaction = this.calculateSatisfaction(
      population, 
      availableResources, 
      autonomousProduction, 
      educationLevel, 
      economicStatus
    );
    const effects = this.calculateEconomicEffects(satisfaction.overallSatisfaction);

    return {
      population,
      needs,
      satisfaction,
      effects,
      recommendations: this.generateRecommendations(satisfaction, needs, availableResources, autonomousProduction)
    };
  }

  // Gerar recomendações
  generateRecommendations(satisfaction, needs, availableResources, autonomousProduction) {
    const recommendations = [];
    const totalAvailable = { ...availableResources };
    Object.entries(autonomousProduction).forEach(([resource, amount]) => {
      totalAvailable[resource] = (totalAvailable[resource] || 0) + amount;
    });

    // Recomendações para recursos críticos
    if (satisfaction.criticalShortages.length > 0) {
      satisfaction.criticalShortages.forEach(shortage => {
        recommendations.push({
          priority: 'URGENTE',
          type: 'deficit',
          resource: shortage.item,
          message: `Falta crítica de ${shortage.item}! Déficit de ${shortage.deficit} unidades. Construa fazendas imediatamente!`,
          action: 'build_farm'
        });
      });
    }

    // Recomendações por categoria
    Object.entries(satisfaction).forEach(([category, data]) => {
      if (category === 'critical' || category === 'important') {
        if (data.percentage < 70) {
          recommendations.push({
            priority: category === 'critical' ? 'ALTA' : 'MÉDIA',
            type: 'low_satisfaction',
            category,
            message: `Satisfação ${category === 'critical' ? 'CRÍTICA' : 'IMPORTANTE'} baixa (${data.percentage.toFixed(0)}%). Aumente produção de alimentos.`,
            action: 'increase_production'
          });
        }
      }
    });

    // Recomendações para excedentes
    if (satisfaction.surpluses.length > 3) {
      recommendations.push({
        priority: 'BAIXA',
        type: 'surplus',
        message: `Você tem ${satisfaction.surpluses.length} recursos em excesso. Considere exportar para gerar receita.`,
        action: 'export_resources'
      });
    }

    // Recomendação de educação
    if (satisfaction.overallSatisfaction < 60) {
      recommendations.push({
        priority: 'MÉDIA',
        type: 'education',
        message: 'Invista em educação para permitir que cidadãos criem seus próprios negócios e ajudem na economia.',
        action: 'upgrade_education'
      });
    }

    return recommendations;
  }

  // Obter informações de um recurso específico
  getResourceInfo(resource) {
    const products = {
      rice: { name: 'Arroz', icon: '🍚', category: 'critical', description: 'Alimento básico essencial' },
      beans: { name: 'Feijão', icon: '🫘', category: 'critical', description: 'Fonte de proteína vegetal' },
      corn: { name: 'Milho', icon: '🌽', category: 'important', description: 'Alimento versátil' },
      sugar: { name: 'Açúcar', icon: '🍬', category: 'important', description: 'Adoçante e energia' },
      coffee: { name: 'Café', icon: '☕', category: 'important', description: 'Bebida popular' },
      soy: { name: 'Soja', icon: '🫛', category: 'important', description: 'Proteína e óleo' },
      lemon: { name: 'Limão', icon: '🍋', category: 'comfort', description: 'Tempero e vitamina C' },
      apple: { name: 'Maçã', icon: '🍎', category: 'comfort', description: 'Fruta saudável' },
      orange: { name: 'Laranja', icon: '🍊', category: 'comfort', description: 'Rica em vitamina C' },
      banana: { name: 'Banana', icon: '🍌', category: 'comfort', description: 'Fruta energética' },
      spices: { name: 'Especiarias', icon: '🌶️', category: 'comfort', description: 'Temperos variados' }
    };

    return products[resource] || { name: resource, icon: '📦', category: 'other', description: 'Recurso' };
  }
}