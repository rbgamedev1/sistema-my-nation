// src/systems/citizenSystem.js

export class CitizenSystem {
  constructor(nation) {
    this.citizens = [];
    this.autonomousBusinesses = [];
    this.nextCitizenId = 1;
    this.nextBusinessId = 1;
    this.lastEventMonth = 0;
  }

  // Níveis de educação e suas capacidades
  getEducationLevels() {
    return {
      none: {
        canStartBusiness: false,
        businessTypes: [],
        employeeCapacity: 0
      },
      basic: {
        canStartBusiness: true,
        businessTypes: ['small_farm'],
        employeeCapacity: 5,
        businessSize: 'pequeno'
      },
      intermediate: {
        canStartBusiness: true,
        businessTypes: ['small_farm', 'medium_farm'],
        employeeCapacity: 15,
        businessSize: 'médio'
      },
      advanced: {
        canStartBusiness: true,
        businessTypes: ['small_farm', 'medium_farm', 'large_farm'],
        employeeCapacity: 50,
        businessSize: 'grande'
      },
      superior: {
        canStartBusiness: true,
        businessTypes: ['small_farm', 'medium_farm', 'large_farm', 'agribusiness'],
        employeeCapacity: 200,
        businessSize: 'corporativo'
      }
    };
  }

  // Produtos agrícolas e suas demandas
  getAgriculturalProducts() {
    return {
      rice: { name: 'Arroz', priority: 'critical', basePrice: 15, icon: '🍚' },
      beans: { name: 'Feijão', priority: 'critical', basePrice: 18, icon: '🫘' },
      corn: { name: 'Milho', priority: 'high', basePrice: 12, icon: '🌽' },
      sugar: { name: 'Açúcar', priority: 'high', basePrice: 25, icon: '🍬' },
      coffee: { name: 'Café', priority: 'medium', basePrice: 40, icon: '☕' },
      soy: { name: 'Soja', priority: 'high', basePrice: 20, icon: '🫛' },
      lemon: { name: 'Limão', priority: 'low', basePrice: 30, icon: '🍋' },
      apple: { name: 'Maçã', priority: 'low', basePrice: 35, icon: '🍎' },
      orange: { name: 'Laranja', priority: 'low', basePrice: 28, icon: '🍊' },
      banana: { name: 'Banana', priority: 'medium', basePrice: 22, icon: '🍌' },
      spices: { name: 'Especiarias', priority: 'low', basePrice: 100, icon: '🌶️' }
    };
  }

  // Gerar um cidadão com características únicas
  generateCitizen(educationLevel, economicStatus) {
    const firstNames = ['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Juliana', 'Lucas', 'Fernanda', 
                        'Ricardo', 'Patrícia', 'André', 'Beatriz', 'Fernando', 'Camila', 'Roberto'];
    const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Costa', 'Ferreira', 'Rodrigues', 
                       'Almeida', 'Nascimento', 'Lima', 'Araújo', 'Carvalho', 'Martins', 'Pereira'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    const citizen = {
      id: this.nextCitizenId++,
      name: `${firstName} ${lastName}`,
      educationLevel,
      economicStatus,
      wealth: this.calculateInitialWealth(economicStatus),
      experience: 0,
      sector: null,
      businessId: null,
      createdAt: Date.now()
    };

    this.citizens.push(citizen);
    return citizen;
  }

  calculateInitialWealth(economicStatus) {
    const wealthRanges = {
      poor: { min: 5000, max: 15000 },
      low: { min: 15000, max: 40000 },
      medium: { min: 40000, max: 100000 },
      good: { min: 100000, max: 250000 },
      excellent: { min: 250000, max: 500000 }
    };

    const range = wealthRanges[economicStatus] || wealthRanges.medium;
    return Math.floor(Math.random() * (range.max - range.min) + range.min);
  }

  // Calcular demanda de produtos
  calculateProductDemand(nation, populationNeeds) {
    if (!populationNeeds) return {};

    const needs = populationNeeds.calculateNeeds(nation.population);
    const available = nation.resources || {};
    const government_production = nation.production || {};

    const demand = {};
    const products = this.getAgriculturalProducts();

    Object.keys(products).forEach(product => {
      const needed = needs[product] || 0;
      const hasGovernment = (available[product] || 0) + (government_production[product] || 0);
      const deficit = Math.max(0, needed - hasGovernment);
      
      if (deficit > 0) {
        demand[product] = {
          deficit,
          priority: products[product].priority,
          potentialRevenue: deficit * products[product].basePrice * 0.7 // Cidadão paga 70% do preço de mercado
        };
      }
    });

    return demand;
  }

  // Tentar criar novo negócio autônomo
  tryCreateBusiness(nation, populationNeeds) {
    const educationCaps = this.getEducationLevels();
    const currentCaps = educationCaps[nation.educationLevel];

    if (!currentCaps.canStartBusiness) return null;

    // Chance base de criar negócio: 5% por mês
    if (Math.random() > 0.05) return null;

    // Calcular demanda
    const demand = this.calculateProductDemand(nation, populationNeeds);
    const demandProducts = Object.entries(demand)
      .sort((a, b) => b[1].deficit - a[1].deficit);

    if (demandProducts.length === 0) return null;

    // Selecionar produto com maior demanda
    const [product, demandInfo] = demandProducts[0];
    const productInfo = this.getAgriculturalProducts()[product];

    // Criar cidadão empreendedor
    const citizen = this.generateCitizen(nation.educationLevel, nation.economicStatus);
    citizen.sector = 'agriculture';

    // Determinar tamanho do negócio baseado em educação
    const businessSize = this.determineBusinessSize(nation.educationLevel, citizen.wealth);
    
    // Calcular custos
    const costs = this.calculateBusinessCosts(businessSize, product);

    // Verificar se tem recursos disponíveis
    if ((nation.resources.land || 0) < costs.land || 
        (nation.resources.water || 0) < costs.water) {
      return null;
    }

    // Cidadão paga parte do custo
    const citizenPayment = Math.min(citizen.wealth * 0.3, costs.money * 0.5);
    const governmentSupport = costs.money - citizenPayment;

    // Verificar se governo tem dinheiro
    if (nation.treasury < governmentSupport) return null;

    // Criar negócio
    const business = {
      id: this.nextBusinessId++,
      ownerId: citizen.id,
      name: `${productInfo.name} ${citizen.name}`,
      product,
      productName: productInfo.name,
      size: businessSize.name,
      employees: businessSize.employees,
      production: businessSize.production,
      monthlyTax: Math.floor(businessSize.production * productInfo.basePrice * 0.15), // 15% de imposto
      costs: costs,
      monthlyProfit: Math.floor(businessSize.production * productInfo.basePrice * 0.3),
      createdAt: Date.now(),
      expandable: false,
      monthsActive: 0
    };

    this.autonomousBusinesses.push(business);
    citizen.businessId = business.id;
    citizen.wealth -= citizenPayment;

    return {
      success: true,
      citizen,
      business,
      resourcesUsed: {
        land: costs.land,
        water: costs.water,
        money: governmentSupport,
        payment: citizenPayment
      },
      benefits: {
        jobs: business.employees,
        monthlyTax: business.monthlyTax,
        production: business.production
      }
    };
  }

  determineBusinessSize(educationLevel, wealth) {
    const sizes = {
      basic: {
        name: 'pequeno',
        employees: Math.floor(Math.random() * 3) + 2, // 2-5
        production: Math.floor(Math.random() * 50) + 30, // 30-80
        landSize: 10,
        waterUsage: 50
      },
      intermediate: {
        name: 'médio',
        employees: Math.floor(Math.random() * 8) + 5, // 5-13
        production: Math.floor(Math.random() * 100) + 80, // 80-180
        landSize: 30,
        waterUsage: 150
      },
      advanced: {
        name: 'grande',
        employees: Math.floor(Math.random() * 25) + 15, // 15-40
        production: Math.floor(Math.random() * 200) + 180, // 180-380
        landSize: 80,
        waterUsage: 400
      },
      superior: {
        name: 'corporativo',
        employees: Math.floor(Math.random() * 80) + 50, // 50-130
        production: Math.floor(Math.random() * 400) + 380, // 380-780
        landSize: 200,
        waterUsage: 1000
      }
    };

    return sizes[educationLevel] || sizes.basic;
  }

  calculateBusinessCosts(businessSize, product) {
    const baseCost = 50000;
    const employeeMultiplier = businessSize.employees * 5000;
    const landCost = businessSize.landSize * 1000;
    
    return {
      money: baseCost + employeeMultiplier,
      land: businessSize.landSize,
      water: businessSize.waterUsage
    };
  }

  // Verificar oportunidades de expansão
  checkBusinessExpansion(business, nation) {
    const owner = this.citizens.find(c => c.id === business.ownerId);
    if (!owner) return null;

    // Precisa estar ativo por pelo menos 6 meses
    if (business.monthsActive < 6) return null;

    // Já marcado como expandível
    if (!business.expandable) return null;

    const educationCaps = this.getEducationLevels();
    const currentCaps = educationCaps[owner.educationLevel];
    
    // Verificar se pode expandir baseado no nível de educação
    const sizeOrder = ['pequeno', 'médio', 'grande', 'corporativo'];
    const currentIndex = sizeOrder.indexOf(business.size);
    const maxIndex = sizeOrder.indexOf(currentCaps.businessSize);

    if (currentIndex >= maxIndex) return null;

    // Calcular custos de expansão
    const nextSize = this.determineBusinessSize(
      Object.keys(educationCaps).find(k => educationCaps[k].businessSize === sizeOrder[currentIndex + 1]),
      owner.wealth
    );

    const expansionCosts = {
      land: nextSize.landSize - business.costs.land,
      water: nextSize.waterUsage - business.costs.water,
      money: Math.floor((nextSize.employees - business.employees) * 8000)
    };

    return {
      businessId: business.id,
      currentSize: business.size,
      nextSize: sizeOrder[currentIndex + 1],
      costs: expansionCosts,
      benefits: {
        additionalEmployees: nextSize.employees - business.employees,
        additionalProduction: nextSize.production - business.production,
        additionalTax: Math.floor((nextSize.production - business.production) * 
                        this.getAgriculturalProducts()[business.product].basePrice * 0.15)
      }
    };
  }

  // Aprovar expansão de negócio
  approveExpansion(expansion, nation) {
    const business = this.autonomousBusinesses.find(b => b.id === expansion.businessId);
    if (!business) return { success: false, reason: 'Negócio não encontrado' };

    const owner = this.citizens.find(c => c.id === business.ownerId);
    if (!owner) return { success: false, reason: 'Proprietário não encontrado' };

    // Atualizar negócio
    const nextSize = this.determineBusinessSize(
      owner.educationLevel === 'basic' ? 'intermediate' :
      owner.educationLevel === 'intermediate' ? 'advanced' : 'superior',
      owner.wealth
    );

    business.size = expansion.nextSize;
    business.employees += expansion.benefits.additionalEmployees;
    business.production += expansion.benefits.additionalProduction;
    business.monthlyTax += expansion.benefits.additionalTax;
    business.costs.land += expansion.costs.land;
    business.costs.water += expansion.costs.water;
    business.expandable = false;
    business.monthsActive = 0;

    owner.experience += 50;
    owner.wealth += expansion.benefits.additionalTax * 6; // Bônus por expandir

    return {
      success: true,
      business,
      citizen: owner
    };
  }

  // Destruir negócio de cidadão
  destroyBusiness(businessId, nation) {
    const businessIndex = this.autonomousBusinesses.findIndex(b => b.id === businessId);
    if (businessIndex === -1) return { success: false, reason: 'Negócio não encontrado' };

    const business = this.autonomousBusinesses[businessIndex];
    const owner = this.citizens.find(c => c.id === business.ownerId);

    // Remover negócio
    this.autonomousBusinesses.splice(businessIndex, 1);

    // Atualizar proprietário
    if (owner) {
      owner.businessId = null;
      owner.wealth += Math.floor(business.monthlyProfit * 3); // Compensação
    }

    // Retornar recursos (50% do investimento)
    return {
      success: true,
      jobsLost: business.employees,
      returnedResources: {
        land: business.costs.land,
        water: business.costs.water,
        money: Math.floor(business.costs.money * 0.5)
      }
    };
  }

  // Processar turno
  processTurn(nation) {
    const events = [];
    let taxRevenue = 0;
    let totalJobs = 0;
    let productionAdded = {};
    const expansionOpportunities = [];

    // Atualizar negócios existentes
    this.autonomousBusinesses.forEach(business => {
      business.monthsActive++;
      
      // Arrecadar impostos
      taxRevenue += business.monthlyTax;
      totalJobs += business.employees;

      // Adicionar produção
      productionAdded[business.product] = (productionAdded[business.product] || 0) + business.production;

      // Aumentar riqueza do proprietário
      const owner = this.citizens.find(c => c.id === business.ownerId);
      if (owner) {
        owner.wealth += business.monthlyProfit;
        owner.experience += 5;
      }

      // Verificar oportunidade de expansão
      if (business.monthsActive >= 6 && business.monthsActive % 6 === 0) {
        business.expandable = true;
        const expansion = this.checkBusinessExpansion(business, nation);
        if (expansion) {
          expansionOpportunities.push({
            business,
            expansion,
            owner
          });
        }
      }
    });

    // Tentar criar novo negócio (máximo 1 por turno)
    const newBusiness = this.tryCreateBusiness(nation, nation.populationNeeds);
    if (newBusiness) {
      events.push({
        type: 'citizen_business_created',
        ...newBusiness
      });
    }

    return {
      taxRevenue,
      totalJobs,
      productionAdded,
      events,
      expansionOpportunities,
      totalBusinesses: this.autonomousBusinesses.length,
      totalCitizens: this.citizens.length
    };
  }

  // Obter estatísticas
  getStatistics() {
    const byEducation = {};
    const bySector = {};
    let totalWealth = 0;

    this.citizens.forEach(citizen => {
      byEducation[citizen.educationLevel] = (byEducation[citizen.educationLevel] || 0) + 1;
      if (citizen.sector) {
        bySector[citizen.sector] = (bySector[citizen.sector] || 0) + 1;
      }
      totalWealth += citizen.wealth;
    });

    return {
      totalCitizens: this.citizens.length,
      totalBusinesses: this.autonomousBusinesses.length,
      byEducation,
      bySector,
      averageWealth: this.citizens.length > 0 ? Math.floor(totalWealth / this.citizens.length) : 0,
      totalJobs: this.autonomousBusinesses.reduce((sum, b) => sum + b.employees, 0),
      totalProduction: this.autonomousBusinesses.reduce((sum, b) => sum + b.production, 0)
    };
  }
}