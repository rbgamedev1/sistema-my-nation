// src/systems/citizenSystem.js - CORRIGIDO (Limite populacional)

export class CitizenSystem {
  constructor(nation) {
    this.citizens = [];
    this.autonomousBusinesses = [];
    this.nextCitizenId = 1;
    this.nextBusinessId = 1;
    this.lastEventMonth = 0;
  }

  getEducationLevels() {
    return {
      none: { canStartBusiness: false, maxEmployees: 0 },
      basic: { canStartBusiness: true, maxEmployees: 10 },
      intermediate: { canStartBusiness: true, maxEmployees: 100 },
      advanced: { canStartBusiness: true, maxEmployees: 1000 },
      superior: { canStartBusiness: true, maxEmployees: 10000 }
    };
  }

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
      }
    };
  }

  // CORRIGIDO: Calcular total de empregos já criados
  getTotalEmployeesInBusinesses() {
    return this.autonomousBusinesses.reduce((sum, b) => sum + b.employees, 0);
  }

  // CORRIGIDO: Calcular trabalhadores disponíveis
  getAvailableWorkers(nation) {
    // Total de trabalhadores desempregados
    const unemployed = nation.workers.common - nation.workers.employed;
    
    // Total de funcionários em negócios autônomos
    const inAutonomousBusinesses = this.getTotalEmployeesInBusinesses();
    
    // Trabalhadores disponíveis = desempregados - já alocados em negócios
    const available = unemployed - inAutonomousBusinesses;
    
    console.log(`[CitizenSystem] População: ${nation.population}, Empregados: ${nation.workers.employed}, Desempregados: ${unemployed}, Em negócios: ${inAutonomousBusinesses}, Disponíveis: ${available}`);
    
    return Math.max(0, available);
  }

  calculateDemand(nation) {
    const demand = {};
    const consumption = {
      rice: 8, beans: 5, corn: 4, sugar: 2, soy: 3, coffee: 1.5,
      banana: 2, orange: 1.5, apple: 1, lemon: 0.5, spices: 0.3
    };
    const populationInThousands = nation.population / 1000;

    Object.entries(consumption).forEach(([resource, rate]) => {
      const needed = populationInThousands * rate;
      const available = (nation.resources?.[resource] || 0) + (nation.production?.[resource] || 0);
      const deficit = Math.max(0, needed - available);

      if (deficit > 0) {
        demand[resource] = { deficit, needed, currentProduction: available };
      }
    });

    return demand;
  }

  tryCreateBusiness(nation) {
    const educationCaps = this.getEducationLevels();
    const currentCaps = educationCaps[nation.educationLevel];

    if (!currentCaps.canStartBusiness) return null;
    if (Math.random() > 0.30) return null;

    // CORRIGIDO: Verificar trabalhadores disponíveis
    const availableWorkers = this.getAvailableWorkers(nation);
    
    if (availableWorkers < 5) {
      console.log('[CitizenSystem] Trabalhadores insuficientes para criar novo negócio');
      return null;
    }

    const demand = this.calculateDemand(nation);
    const demandProducts = Object.entries(demand).sort((a, b) => b[1].deficit - a[1].deficit);

    if (demandProducts.length === 0) return null;

    const [product, demandInfo] = demandProducts[0];
    const businessTypes = this.getBusinessTypes();
    let productInfo = null;
    let category = null;

    for (const [cat, products] of Object.entries(businessTypes)) {
      if (products[product]) {
        productInfo = products[product];
        category = cat;
        break;
      }
    }

    if (!productInfo) return null;

    const citizen = this.generateCitizen(nation.educationLevel);
    const maxEmployees = currentCaps.maxEmployees;
    
    // CORRIGIDO: Limitar número de funcionários aos trabalhadores disponíveis
    const desiredEmployees = Math.min(
      Math.floor(Math.random() * (maxEmployees * 0.3)) + Math.floor(maxEmployees * 0.1),
      maxEmployees
    );
    
    const employees = Math.min(desiredEmployees, availableWorkers);
    
    if (employees < 5) {
      this.citizens.pop();
      console.log('[CitizenSystem] Não há trabalhadores suficientes para criar negócio viável');
      return null;
    }
    
    const productionPerEmployee = 20;
    const production = employees * productionPerEmployee;
    const totalCost = employees * 10000;

    if (citizen.wealth < totalCost) {
      this.citizens.pop();
      return null;
    }

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
    citizen.wealth -= totalCost;

    console.log(`[CitizenSystem] Negócio criado: ${business.name}, Funcionários: ${employees}, Disponíveis agora: ${availableWorkers - employees}`);

    return {
      success: true,
      citizen,
      business,
      resourcesUsed: {
        money: 0,
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

  checkBusinessExpansion(business, nation) {
    const owner = this.citizens.find(c => c.id === business.ownerId);
    if (!owner) return null;
    if (business.monthsActive < 6) return null;
    if (!business.expandable) return null;

    const educationCaps = this.getEducationLevels();
    const currentMaxEmployees = educationCaps[owner.educationLevel].maxEmployees;
    
    if (business.employees >= currentMaxEmployees * 0.8) return null;

    // CORRIGIDO: Verificar trabalhadores disponíveis para expansão
    const availableWorkers = this.getAvailableWorkers(nation);
    
    const desiredExpansion = Math.floor(business.employees * 0.5);
    const newEmployees = Math.min(
      desiredExpansion,
      currentMaxEmployees - business.employees,
      availableWorkers // LIMITE DE TRABALHADORES DISPONÍVEIS
    );

    if (newEmployees < 1) {
      console.log(`[CitizenSystem] Sem trabalhadores disponíveis para expansão de ${business.name}`);
      return null;
    }

    const expansionCost = newEmployees * 10000;

    return {
      businessId: business.id,
      newEmployees,
      expansionCost,
      additionalProduction: Math.floor(business.production * (newEmployees / business.employees)),
      additionalTax: Math.floor(business.monthlyTax * (newEmployees / business.employees))
    };
  }

  approveExpansion(expansion, nation) {
    const business = this.autonomousBusinesses.find(b => b.id === expansion.businessId);
    if (!business) return { success: false };

    const owner = this.citizens.find(c => c.id === business.ownerId);
    if (!owner || owner.wealth < expansion.expansionCost) {
      return { success: false };
    }

    // CORRIGIDO: Verificar novamente trabalhadores disponíveis no momento da expansão
    const availableWorkers = this.getAvailableWorkers(nation);
    
    if (availableWorkers < expansion.newEmployees) {
      console.log(`[CitizenSystem] Expansão cancelada: trabalhadores insuficientes`);
      return { success: false, reason: 'Trabalhadores insuficientes' };
    }

    business.employees += expansion.newEmployees;
    business.production += expansion.additionalProduction;
    business.monthlyTax += expansion.additionalTax;
    business.monthlyRevenue = business.production * this.getBusinessTypes().agriculture[business.product].basePrice;
    business.monthlyProfit = Math.floor(business.monthlyRevenue * 0.3);
    business.expandable = false;
    business.monthsActive = 0;

    owner.wealth -= expansion.expansionCost;

    console.log(`[CitizenSystem] Negócio expandido: ${business.name}, +${expansion.newEmployees} funcionários, Total: ${business.employees}`);

    return { success: true, business, citizen: owner };
  }

  processTurn(nation) {
    const events = [];
    let taxRevenue = 0;
    let totalJobs = 0;
    let productionAdded = {};
    const expansionOpportunities = [];

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