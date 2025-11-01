// src/systems/populationNeeds.js - CORRIGIDO

export class PopulationNeedsSystem {
  constructor() {
    this.consumptionRates = this.getConsumptionRates();
  }

  getConsumptionRates() {
    return {
      // Alimentos críticos
      rice: 8,
      beans: 5,
      corn: 4,
      
      // Alimentos importantes
      sugar: 2,
      soy: 3,
      coffee: 1.5,
      
      // Frutas (conforto)
      banana: 2,
      orange: 1.5,
      apple: 1,
      lemon: 0.5,
      spices: 0.3,
      
      // Recursos básicos
      agua: 15,
      energy: 8,
      
      // Outros
      furniture: 1,
      fruits: 2,
      vegetables: 3,
      clothing: 0.5,
      medicine: 0.3
    };
  }

  getCategories() {
    return {
      critical: ['rice', 'beans', 'agua', 'energy'],
      important: ['corn', 'sugar', 'soy', 'coffee', 'vegetables'],
      comfort: ['banana', 'orange', 'apple', 'lemon', 'spices', 'fruits', 'furniture', 'clothing'],
      health: ['medicine']
    };
  }

  calculateNeeds(population) {
    const needs = {};
    const populationInThousands = population / 1000;

    Object.entries(this.consumptionRates).forEach(([resource, ratePerThousand]) => {
      needs[resource] = populationInThousands * ratePerThousand;
    });

    return needs;
  }

  calculateSatisfaction(population, availableResources, autonomousProduction, educationLevel, economicStatus) {
    const needs = this.calculateNeeds(population);
    const categories = this.getCategories();
    
    // Combinar TODOS os recursos disponíveis (estoque + produção autônoma)
    const totalAvailable = {};
    
    // Adicionar recursos disponíveis (do estoque do governo)
    Object.entries(availableResources).forEach(([resource, amount]) => {
      totalAvailable[resource] = amount;
    });
    
    // Adicionar produção autônoma dos cidadãos
    Object.entries(autonomousProduction).forEach(([resource, amount]) => {
      totalAvailable[resource] = (totalAvailable[resource] || 0) + amount;
    });

    console.log('[PopulationNeeds] Recursos Totais Disponíveis:', totalAvailable);
    console.log('[PopulationNeeds] Necessidades:', needs);

    const satisfaction = {
      critical: { met: 0, total: 0, percentage: 0 },
      important: { met: 0, total: 0, percentage: 0 },
      comfort: { met: 0, total: 0, percentage: 0 },
      health: { met: 0, total: 0, percentage: 0 },
      overallSatisfaction: 0,
      criticalShortages: [],
      surpluses: []
    };

    // Calcular satisfação por categoria
    Object.entries(categories).forEach(([category, resources]) => {
      let categoryMet = 0;
      let categoryTotal = 0;

      resources.forEach(resource => {
        const needed = needs[resource] || 0;
        const available = totalAvailable[resource] || 0;
        const fulfillment = needed > 0 ? Math.min(available / needed, 1) : 1;

        console.log(`[PopulationNeeds] ${resource}: needed=${needed.toFixed(1)}, available=${available.toFixed(1)}, fulfillment=${(fulfillment*100).toFixed(1)}%`);

        categoryMet += fulfillment;
        categoryTotal += 1;

        // Registrar escassez crítica
        if (category === 'critical' && fulfillment < 0.5) {
          satisfaction.criticalShortages.push({
            item: resource,
            needed: needed.toFixed(1),
            available: available.toFixed(1),
            deficit: (needed - available).toFixed(1),
            fulfillment: (fulfillment * 100).toFixed(0) + '%'
          });
        }

        // Registrar excedentes
        if (available > needed * 1.5) {
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

    // Calcular satisfação geral com pesos
    const weights = {
      critical: 0.50,   // 50% do peso
      important: 0.25,  // 25% do peso
      comfort: 0.15,    // 15% do peso
      health: 0.10      // 10% do peso
    };

    let weightedSum = 0;
    Object.entries(weights).forEach(([category, weight]) => {
      weightedSum += satisfaction[category].percentage * weight;
    });

    satisfaction.overallSatisfaction = Math.round(weightedSum);

    // Aplicar bônus de educação e economia
    const educationBonus = this.getEducationBonus(educationLevel);
    const economicBonus = this.getEconomicBonus(economicStatus);
    
    satisfaction.overallSatisfaction = Math.min(100, 
      Math.max(0, satisfaction.overallSatisfaction + educationBonus + economicBonus)
    );

    console.log(`[PopulationNeeds] Satisfação Final: ${satisfaction.overallSatisfaction}% (base: ${Math.round(weightedSum)}%, educação: +${educationBonus}%, economia: +${economicBonus}%)`);

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

  generateRecommendations(satisfaction, needs, availableResources, autonomousProduction) {
    const recommendations = [];
    const totalAvailable = { ...availableResources };
    Object.entries(autonomousProduction).forEach(([resource, amount]) => {
      totalAvailable[resource] = (totalAvailable[resource] || 0) + amount;
    });

    // Recomendações para escassez crítica
    if (satisfaction.criticalShortages.length > 0) {
      satisfaction.criticalShortages.forEach(shortage => {
        const farmTypes = {
          rice: 'Fazenda de Arroz',
          beans: 'Fazenda de Feijão',
          agua: 'Poço Artesiano ou Estação de Tratamento',
          energy: 'Usina de Energia'
        };
        
        recommendations.push({
          priority: 'URGENTE',
          type: 'deficit',
          resource: shortage.item,
          message: `Falta crítica de ${shortage.item}! Déficit de ${shortage.deficit} unidades. Construa ${farmTypes[shortage.item] || 'fazendas'} imediatamente!`,
          action: 'build_farm'
        });
      });
    }

    // Recomendações para categorias com satisfação baixa
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

    // Recomendações para educação
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
      spices: { name: 'Especiarias', icon: '🌶️', category: 'comfort', description: 'Temperos variados' },
      agua: { name: 'Água', icon: '💧', category: 'critical', description: 'Essencial para vida' },
      energy: { name: 'Energia', icon: '⚡', category: 'critical', description: 'Eletricidade' }
    };

    return products[resource] || { name: resource, icon: '📦', category: 'other', description: 'Recurso' };
  }
}