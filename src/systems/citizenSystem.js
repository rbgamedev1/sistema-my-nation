// src/systems/citizenSystem.js - CORRIGIDO

export class CitizenSystem {
  constructor(nation) {
    this.citizens = [];
    this.autonomousBusinesses = [];
    this.nextCitizenId = 1;
    this.nextBusinessId = 1;
    this.lastEventMonth = 0;
  }

  // Níveis de educação e suas capacidades - CORRIGIDO
  getEducationLevels() {
    return {
      none: {
        canStartBusiness: false,
        maxEmployees: 0
      },
      basic: {
        canStartBusiness: true,
        maxEmployees: 10
      },
      intermediate: {
        canStartBusiness: true,
        maxEmployees: 100
      },
      advanced: {
        canStartBusiness: true,
        maxEmployees: 1000
      },
      superior: {
        canStartBusiness: true,
        maxEmployees: 10000
      }
    };
  }

  // Tipos de negócios disponíveis
  getBusinessTypes() {
    return {
      agriculture: {
        rice: { name: 'Arroz', icon: '🍚', basePrice: 15, produces: 'rice' },
        beans: { name: 'Feijão', icon: '🫘', basePrice: 18, produces: 'beans' },
        corn: { name: 'Milho', icon: '🌽', basePrice: 12, produces: 'corn' },
        sugar: { name: 'Açúcar', icon: '🍬', basePrice: 25, produces: 'sugar' },
        coffee: { name: 'Café', icon: '☕', basePrice: 40, produces: 'coffee' },
        soy: { name: 'Soja', icon: '🫛', basePrice: 20, produces: 'soy' },
        banana: { name: 'Banana', icon: '🍌', basePrice: 22, produces: 'banana' },
        orange: { name: 'Laranja', icon: '🍊', basePrice: 28, produces: 'orange' },
        apple: { name: 'Maçã', icon: '🍎', basePrice: 35, produces: 'apple' },
        lemon: { name: 'Limão', icon: '🍋', basePrice: 30, produces: 'lemon' },
        spices: { name: 'Especiarias', icon: '🌶️', basePrice: 100, produces: 'spices' }
      },
      manufacturing: {
        furniture: { name: 'Móveis', icon: '🪑', basePrice: 150, produces: 'furniture' },
        clothing: { name: 'Roupas', icon: '👕', basePrice: 120, produces: 'clothing' }
      },
      services: {
        medicine: { name: 'Medicamentos', icon: '💊', basePrice: 200, produces: 'medicine' }
      }
    };
  }

  // Calcular demanda de produtos
  calculateDemand(nation) {
    const demand = {};
    const consumption = {
      rice: 8, beans: 5, corn: 4, sugar: 2, soy: 3, coffee: 1.5,
      banana: 2, orange: 1.5, apple: 1, lemon: 0.5, spices: 0.3,
      furniture: 1, clothing: 0.5, medicine: 0.3
    };
    const populationInThousands = nation.population / 1000;

    Object.entries(consumption).forEach(([resource, rate]) => {
      const needed = populationInThousands * rate;
      const available = (nation.resources?.[resource] || 0) + (nation.production?.[resource] || 0);
      const deficit = Math.max(0, needed - available);

      if (deficit > 0) {
        demand[resource] = {
          deficit,
          needed,
          currentProduction: available
        };
      }
    });

    return demand;
  }

  // Tentar criar novo negócio - CORRIGIDO: 30% chance, 100% privado
  tryCreateBusiness(nation) {
    const educationCaps = this.getEducationLevels();
    const currentCaps = educationCaps[nation.educationLevel];

    if (!currentCaps.canStartBusiness) return null;
    if (Math.random() > 0.30) return null; // 30% chance

    const demand = this.calculateDemand(nation);
    const demandProducts = Object.entries(demand).sort((a, b) => b[1].deficit - a[1].deficit);

    if (demandProducts.length === 0) return null;

    const [product, demandInfo] = demandProducts[0];
    const businessTypes = this.getBusinessTypes();
    let productInfo = null;
    let category = null;

    // Encontrar categoria e produto
    for (const [cat, products] of Object.entries(businessTypes)) {
      if (products[product]) {
        productInfo = products[product];
        category = cat;
        break;
      }
    }

    if (!productInfo) return null;

    // Criar cidadão
    const citizen = this.generateCitizen(nation.educationLevel);
    
    // Determinar tamanho do negócio baseado em educação
    const maxEmployees = currentCaps.maxEmployees;
    const employees = Math.min(
      Math.floor(Math.random() * (maxEmployees * 0.3)) + Math.floor(maxEmployees * 0.1),
      maxEmployees
    );
    
    const productionPerEmployee = category === 'agriculture' ? 20 : 
                                   category === 'manufacturing' ? 5 : 3;
    const production = employees * productionPerEmployee;

    // CUSTOS 100% PRIVADOS - governo não subsidia
    const totalCost = employees * 10000;

    // Verificar se cidadão tem dinheiro suficiente
    if (citizen.wealth < totalCost) {
      this.citizens.pop();
      return null;
    }

    // Criar negócio
    const business = {
      id: this.nextBusinessId++,
      ownerId: citizen.id,
      name: `${productInfo.name} ${citizen.name}`,
      product,
      productName: productInfo.name,
      category,
      employees,
      production,
      monthlyRevenue: production * productInfo.basePrice,
      monthlyTax: Math.floor(production * productInfo.basePrice * 0.15),
      monthlyProfit: Math.floor(production * productInfo.basePrice * 0.3),
      monthlyOperatingCost: employees * 2000,
      createdAt: Date.now(),
      expandable: false,
      monthsActive: 0
    };

    this.autonomousBusinesses.push(business);
    citizen.businessId = business.id;
    citizen.wealth -= totalCost; // Cidadão paga 100%

    return {
      success: true,
      citizen,
      business,
      resourcesUsed: {
        money: 0, // Governo não subsidia
        citizenPaid: totalCost
      },
      benefits: {
        jobs: business.employees,
        monthlyTax: business.monthlyTax,
        production: business.production
      }
    };
  }

  generateCitizen(educationLevel) {
    const firstNames = ['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Juliana', 'Lucas', 'Fernanda'];
    const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Costa', 'Ferreira'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    const wealthRanges = {
      none: { min: 5000, max: 15000 },
      basic: { min: 50000, max: 150000 },
      intermediate: { min: 500000, max: 1500000 },
      advanced: { min: 5000000, max: 15000000 },
      superior: { min: 50000000, max: 150000000 }
    };

    const range = wealthRanges[educationLevel] || wealthRanges.basic;
    const wealth = Math.floor(Math.random() * (range.max - range.min) + range.min);

    const citizen = {
      id: this.nextCitizenId++,
      name: `${firstName} ${lastName}`,
      educationLevel,
      wealth,
      businessId: null,
      createdAt: Date.now()
    };

    this.citizens.push(citizen);
    return citizen;
  }

  // Verificar expansão
  checkBusinessExpansion(business, nation) {
    const owner = this.citizens.find(c => c.id === business.ownerId);
    if (!owner) return null;
    if (business.monthsActive < 6) return null;
    if (!business.expandable) return null;

    const educationCaps = this.getEducationLevels();
    const currentMaxEmployees = educationCaps[owner.educationLevel].maxEmployees;
    
    if (business.employees >= currentMaxEmployees * 0.8) return null;

    const newEmployees = Math.min(
      Math.floor(business.employees * 0.5),
      currentMaxEmployees - business.employees
    );

    const expansionCost = newEmployees * 10000;

    return {
      businessId: business.id,
      newEmployees,
      expansionCost,
      additionalProduction: Math.floor(business.production * 0.5),
      additionalTax: Math.floor(business.monthlyTax * 0.5)
    };
  }

  approveExpansion(expansion, nation) {
    const business = this.autonomousBusinesses.find(b => b.id === expansion.businessId);
    if (!business) return { success: false };

    const owner = this.citizens.find(c => c.id === business.ownerId);
    if (!owner || owner.wealth < expansion.expansionCost) {
      return { success: false };
    }

    business.employees += expansion.newEmployees;
    business.production += expansion.additionalProduction;
    business.monthlyTax += expansion.additionalTax;
    business.monthlyProfit = Math.floor(business.production * 0.3);
    business.expandable = false;
    business.monthsActive = 0;

    owner.wealth -= expansion.expansionCost;

    return { success: true, business, citizen: owner };
  }

  destroyBusiness(businessId) {
    const index = this.autonomousBusinesses.findIndex(b => b.id === businessId);
    if (index === -1) return { success: false };

    const business = this.autonomousBusinesses[index];
    const owner = this.citizens.find(c => c.id === business.ownerId);

    this.autonomousBusinesses.splice(index, 1);

    if (owner) {
      owner.businessId = null;
      owner.wealth += Math.floor(business.monthlyProfit * 6);
    }

    return {
      success: true,
      jobsLost: business.employees,
      returnedResources: { money: 0 } // Governo não recupera nada
    };
  }

  processTurn(nation) {
    const events = [];
    let taxRevenue = 0;
    let totalJobs = 0;
    let productionAdded = {};
    const expansionOpportunities = [];

    // Atualizar negócios existentes
    this.autonomousBusinesses.forEach(business => {
      business.monthsActive++;
      taxRevenue += business.monthlyTax;
      totalJobs += business.employees;
      productionAdded[business.product] = (productionAdded[business.product] || 0) + business.production;

      const owner = this.citizens.find(c => c.id === business.ownerId);
      if (owner) {
        owner.wealth += business.monthlyProfit;
      }

      if (business.monthsActive >= 6 && business.monthsActive % 6 === 0) {
        business.expandable = true;
        const expansion = this.checkBusinessExpansion(business, nation);
        if (expansion) {
          expansionOpportunities.push({ business, expansion, owner });
        }
      }
    });

    // Tentar criar novo negócio
    const newBusiness = this.tryCreateBusiness(nation);
    if (newBusiness) {
      events.push({ type: 'citizen_business_created', ...newBusiness });
    }

    return {
      taxRevenue,
      totalJobs,
      productionAdded,
      events,
      expansionOpportunities,
      totalBusinesses: this.autonomousBusinesses.length
    };
  }

  getStatistics() {
    return {
      totalCitizens: this.citizens.length,
      totalBusinesses: this.autonomousBusinesses.length,
      totalJobs: this.autonomousBusinesses.reduce((sum, b) => sum + b.employees, 0),
      totalProduction: this.autonomousBusinesses.reduce((sum, b) => sum + b.production, 0)
    };
  }
}