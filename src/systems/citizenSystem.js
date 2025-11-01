// src/systems/citizenSystem.js - NEGÓCIOS ALEATÓRIOS DE TODOS OS TIPOS

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
        rice: { name: 'Arroz', icon: '🍚', basePrice: 15, produces: 'rice', ministryRequired: 'agricultura' },
        beans: { name: 'Feijão', icon: '🫘', basePrice: 18, produces: 'beans', ministryRequired: 'agricultura' },
        corn: { name: 'Milho', icon: '🌽', basePrice: 12, produces: 'corn', ministryRequired: 'agricultura' },
        sugar: { name: 'Açúcar', icon: '🍬', basePrice: 25, produces: 'sugar', ministryRequired: 'agricultura' },
        coffee: { name: 'Café', icon: '☕', basePrice: 40, produces: 'coffee', ministryRequired: 'agricultura' },
        soy: { name: 'Soja', icon: '🫛', basePrice: 20, produces: 'soy', ministryRequired: 'agricultura' },
        banana: { name: 'Banana', icon: '🍌', basePrice: 22, produces: 'banana', ministryRequired: 'agricultura' },
        orange: { name: 'Laranja', icon: '🍊', basePrice: 28, produces: 'orange', ministryRequired: 'agricultura' },
        apple: { name: 'Maçã', icon: '🍎', basePrice: 35, produces: 'apple', ministryRequired: 'agricultura' },
        lemon: { name: 'Limão', icon: '🍋', basePrice: 30, produces: 'lemon', ministryRequired: 'agricultura' },
        spices: { name: 'Especiarias', icon: '🌶️', basePrice: 100, produces: 'spices', ministryRequired: 'agricultura' }
      },
      education: {
        creche: { name: 'Creche', icon: '👶', basePrice: 80, produces: 'education', ministryRequired: 'educacao' },
        escola: { name: 'Escola', icon: '📚', basePrice: 100, produces: 'education', ministryRequired: 'educacao' }
      },
      health: {
        clinica: { name: 'Clínica', icon: '🏥', basePrice: 120, produces: 'health', ministryRequired: 'saude' }
      },
      industry: {
        moveis: { name: 'Móveis', icon: '🪑', basePrice: 150, produces: 'furniture', ministryRequired: 'industria' },
        roupas: { name: 'Roupas', icon: '👕', basePrice: 120, produces: 'clothing', ministryRequired: 'industria' }
      },
      culture: {
        biblioteca: { name: 'Biblioteca', icon: '📚', basePrice: 90, produces: 'culture', ministryRequired: 'cultura' }
      }
    };
  }

  getTotalEmployeesInBusinesses() {
    return this.autonomousBusinesses.reduce((sum, b) => sum + b.employees, 0);
  }

  getAvailableWorkers(nation) {
    const unemployed = nation.workers.common - nation.workers.employed;
    const inAutonomousBusinesses = this.getTotalEmployeesInBusinesses();
    const available = unemployed - inAutonomousBusinesses;
    
    console.log(`[CitizenSystem] População: ${nation.population}, Empregados: ${nation.workers.employed}, Desempregados: ${unemployed}, Em negócios: ${inAutonomousBusinesses}, Disponíveis: ${available}`);
    
    return Math.max(0, available);
  }

  // NOVO: Verifica quais ministérios existem
  getAvailableBusinessTypes(nation) {
    const allBusinessTypes = this.getBusinessTypes();
    const availableTypes = [];

    Object.entries(allBusinessTypes).forEach(([category, businesses]) => {
      Object.entries(businesses).forEach(([productId, businessInfo]) => {
        // Verifica se o ministério necessário existe
        const ministryExists = nation.ministries.some(m => m.type === businessInfo.ministryRequired);
        
        if (ministryExists) {
          availableTypes.push({
            category,
            productId,
            ...businessInfo
          });
        }
      });
    });

    console.log(`[CitizenSystem] ${availableTypes.length} tipos de negócios disponíveis baseado nos ministérios`);
    return availableTypes;
  }

  tryCreateBusiness(nation) {
    const educationCaps = this.getEducationLevels();
    const currentCaps = educationCaps[nation.educationLevel];

    if (!currentCaps.canStartBusiness) {
      console.log('[CitizenSystem] Educação insuficiente para criar negócios');
      return null;
    }
    
    if (Math.random() > 0.30) {
      console.log('[CitizenSystem] Chance de criação não atingida (30%)');
      return null;
    }

    const availableWorkers = this.getAvailableWorkers(nation);
    
    if (availableWorkers < 5) {
      console.log('[CitizenSystem] Trabalhadores insuficientes para criar novo negócio');
      return null;
    }

    // NOVO: Obter tipos de negócios disponíveis baseado nos ministérios
    const availableBusinessTypes = this.getAvailableBusinessTypes(nation);
    
    if (availableBusinessTypes.length === 0) {
      console.log('[CitizenSystem] Nenhum tipo de negócio disponível (faltam ministérios)');
      return null;
    }

    // NOVO: Escolher um tipo ALEATÓRIO
    const randomBusiness = availableBusinessTypes[Math.floor(Math.random() * availableBusinessTypes.length)];
    const { category, productId, name, icon, basePrice, produces, ministryRequired } = randomBusiness;

    console.log(`[CitizenSystem] Tipo de negócio escolhido: ${name} (categoria: ${category}, ministério: ${ministryRequired})`);

    // Gerar cidadão empreendedor
    const citizen = this.generateCitizen(nation.educationLevel);
    const maxEmployees = currentCaps.maxEmployees;
    
    const minEmployees = 5;
    const maxForLevel = Math.min(maxEmployees * 0.3, availableWorkers);
    const desiredEmployees = Math.floor(Math.random() * (maxForLevel - minEmployees + 1)) + minEmployees;
    
    const employees = Math.min(desiredEmployees, availableWorkers);
    
    if (employees < minEmployees) {
      this.citizens.pop();
      console.log('[CitizenSystem] Não há trabalhadores suficientes para criar negócio viável');
      return null;
    }
    
    // Calcular produção e custos
    const productionPerEmployee = category === 'agriculture' ? 20 : 15;
    const production = employees * productionPerEmployee;
    const totalCost = employees * 10000;

    if (citizen.wealth < totalCost) {
      this.citizens.pop();
      console.log('[CitizenSystem] Cidadão sem recursos para investir');
      return null;
    }

    // Criar negócio
    const business = {
      id: this.nextBusinessId++,
      ownerId: citizen.id,
      name: `${name} ${citizen.name}`,
      product: produces,
      productName: name,
      category,
      employees,
      production,
      monthlyRevenue: production * basePrice,
      monthlyTax: Math.floor(production * basePrice * 0.15),
      monthlyProfit: Math.floor(production * basePrice * 0.3),
      monthlyOperatingCost: employees * 2000,
      createdAt: Date.now(),
      expandable: false,
      monthsActive: 0,
      icon
    };

    this.autonomousBusinesses.push(business);
    citizen.businessId = business.id;
    citizen.wealth -= totalCost;

    console.log(`[CitizenSystem] Negócio criado: ${business.name}, Tipo: ${name}, Funcionários: ${employees}, Produção: ${production}`);

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
    const firstNames = ['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Juliana', 'Lucas', 'Fernanda', 'Ricardo', 'Beatriz', 'Paulo', 'Amanda', 'Marcos', 'Patrícia', 'Rafael', 'Camila'];
    const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Costa', 'Ferreira', 'Rodrigues', 'Almeida', 'Nascimento', 'Lima', 'Araújo', 'Carvalho'];
    
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

    const availableWorkers = this.getAvailableWorkers(nation);
    
    const expansionRate = 0.3 + (Math.random() * 0.2);
    const desiredExpansion = Math.floor(business.employees * expansionRate);
    const newEmployees = Math.min(
      desiredExpansion,
      currentMaxEmployees - business.employees,
      availableWorkers
    );

    if (newEmployees < 1) {
      console.log(`[CitizenSystem] Sem trabalhadores disponíveis para expansão de ${business.name}`);
      return null;
    }

    const expansionCost = newEmployees * 10000;

    if (owner.wealth < expansionCost) {
      console.log(`[CitizenSystem] Dono sem recursos para expansão de ${business.name}`);
      return null;
    }

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
      return { success: false, reason: 'Recursos insuficientes' };
    }

    const availableWorkers = this.getAvailableWorkers(nation);
    
    if (availableWorkers < expansion.newEmployees) {
      console.log(`[CitizenSystem] Expansão cancelada: trabalhadores insuficientes`);
      return { success: false, reason: 'Trabalhadores insuficientes' };
    }

    business.employees += expansion.newEmployees;
    business.production += expansion.additionalProduction;
    business.monthlyTax += expansion.additionalTax;
    
    const businessTypes = this.getBusinessTypes();
    let basePrice = 50;
    for (const category of Object.values(businessTypes)) {
      const found = Object.values(category).find(b => b.produces === business.product);
      if (found) {
        basePrice = found.basePrice;
        break;
      }
    }
    
    business.monthlyRevenue = business.production * basePrice;
    business.monthlyProfit = Math.floor(business.monthlyRevenue * 0.3);
    business.monthlyOperatingCost = business.employees * 2000;
    business.expandable = false;
    business.monthsActive = 0;

    owner.wealth -= expansion.expansionCost;

    console.log(`[CitizenSystem] Negócio expandido: ${business.name}, +${expansion.newEmployees} funcionários, Total: ${business.employees}, Nova produção: ${business.production}`);

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