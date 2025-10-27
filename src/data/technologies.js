// src/data/technologies.js

export const TECHNOLOGIES = {
  // EDUCAÇÃO
  educacao_digital: {
    name: 'Educação Digital',
    description: 'Implementa tablets e computadores nas escolas',
    category: 'educacao',
    cost: 500000,
    researchTime: 3,
    icon: '💻',
    requirements: [],
    effects: {
      facilities: ['Escola', 'Universidade'],
      benefits: { education: 5, happiness: 2 },
      efficiency: 1.2,
      costReduction: 0.9
    }
  },
  ensino_superior_avancado: {
    name: 'Ensino Superior Avançado',
    description: 'Programas de mestrado e doutorado',
    category: 'educacao',
    cost: 1000000,
    researchTime: 5,
    icon: '🎓',
    requirements: ['educacao_digital'],
    effects: {
      facilities: ['Universidade'],
      benefits: { education: 15, research: 10 },
      efficiency: 1.5,
      unlockJobs: [
        { role: 'Professor Pós-Doutor', count: 10, minSalary: 8000 }
      ]
    }
  },
  
  // SAÚDE
  telemedicina: {
    name: 'Telemedicina',
    description: 'Consultas médicas remotas',
    category: 'saude',
    cost: 600000,
    researchTime: 4,
    icon: '📱',
    requirements: [],
    effects: {
      facilities: ['Posto de Saúde', 'Hospital'],
      benefits: { health: 8, happiness: 3 },
      efficiency: 1.3,
      costReduction: 0.85
    }
  },
  cirurgia_robotica: {
    name: 'Cirurgia Robótica',
    description: 'Cirurgias assistidas por robôs',
    category: 'saude',
    cost: 1500000,
    researchTime: 6,
    icon: '🤖',
    requirements: ['telemedicina'],
    effects: {
      facilities: ['Hospital', 'Hospital Universitário'],
      benefits: { health: 20, research: 5 },
      efficiency: 1.6,
      unlockJobs: [
        { role: 'Cirurgião Robótico', count: 5, minSalary: 15000 }
      ]
    }
  },
  
  // AGRICULTURA
  agricultura_precisao: {
    name: 'Agricultura de Precisão',
    description: 'Uso de drones e sensores na agricultura',
    category: 'agricultura',
    cost: 700000,
    researchTime: 4,
    icon: '🚁',
    requirements: [],
    effects: {
      facilities: ['Fazenda Cooperativa'],
      benefits: { food: 15, economy: 10 },
      efficiency: 1.4,
      costReduction: 0.8
    }
  },
  ogm_avancado: {
    name: 'OGM Avançado',
    description: 'Organismos geneticamente modificados de alta produtividade',
    category: 'agricultura',
    cost: 1200000,
    researchTime: 5,
    icon: '🧬',
    requirements: ['agricultura_precisao'],
    effects: {
      facilities: ['Fazenda Cooperativa', 'Instituto de Pesquisa'],
      benefits: { food: 30, research: 10 },
      efficiency: 2.0,
      unlockJobs: [
        { role: 'Geneticista Agrícola', count: 8, minSalary: 9000 }
      ]
    }
  },
  
  // DEFESA
  defesa_cibernetica: {
    name: 'Defesa Cibernética',
    description: 'Proteção contra ataques digitais',
    category: 'defesa',
    cost: 800000,
    researchTime: 4,
    icon: '🛡️',
    requirements: [],
    effects: {
      facilities: ['Base Militar', 'Centro de Treinamento'],
      benefits: { security: 15, economy: 5 },
      efficiency: 1.3,
      unlockJobs: [
        { role: 'Especialista em Cibersegurança', count: 20, minSalary: 7000 }
      ]
    }
  },
  armamento_moderno: {
    name: 'Armamento Moderno',
    description: 'Equipamento militar de última geração',
    category: 'defesa',
    cost: 2000000,
    researchTime: 7,
    icon: '⚔️',
    requirements: ['defesa_cibernetica'],
    effects: {
      facilities: ['Base Militar', 'Academia Militar'],
      benefits: { security: 40 },
      efficiency: 1.8,
      costReduction: 1.2
    }
  },
  
  // MINAS E ENERGIA
  extracao_inteligente: {
    name: 'Extração Inteligente',
    description: 'Mineração automatizada e eficiente',
    category: 'minasEnergia',
    cost: 900000,
    researchTime: 5,
    icon: '⛏️',
    requirements: [],
    effects: {
      facilities: ['Mina'],
      benefits: { resources: 25, economy: 15 },
      efficiency: 1.5,
      costReduction: 0.75
    }
  },
  energia_renovavel: {
    name: 'Energia Renovável',
    description: 'Solar, eólica e hidrelétrica avançadas',
    category: 'minasEnergia',
    cost: 1500000,
    researchTime: 6,
    icon: '🌞',
    requirements: [],
    effects: {
      facilities: ['Usina de Energia'],
      benefits: { energy: 50, happiness: 15, economy: 20 },
      efficiency: 1.4,
      costReduction: 0.7,
      unlockJobs: [
        { role: 'Engenheiro de Energias Renováveis', count: 25, minSalary: 8000 }
      ]
    }
  },
  fusao_nuclear: {
    name: 'Fusão Nuclear',
    description: 'Energia limpa e praticamente ilimitada',
    category: 'minasEnergia',
    cost: 5000000,
    researchTime: 12,
    icon: '⚛️',
    requirements: ['energia_renovavel', 'ensino_superior_avancado'],
    effects: {
      facilities: ['Usina de Energia'],
      benefits: { energy: 200, happiness: 30, economy: 80, research: 40 },
      efficiency: 3.0,
      costReduction: 0.5
    }
  },
  
  // TECNOLOGIAS GERAIS
  inteligencia_artificial: {
    name: 'Inteligência Artificial',
    description: 'IA aplicada em todos os setores',
    category: 'geral',
    cost: 3000000,
    researchTime: 8,
    icon: '🤖',
    requirements: ['educacao_digital', 'telemedicina'],
    effects: {
      facilities: 'ALL',
      benefits: { research: 30, economy: 40, efficiency: 10 },
      efficiency: 1.3,
      costReduction: 0.8
    }
  },
  nanotecnologia: {
    name: 'Nanotecnologia',
    description: 'Manipulação de matéria em escala atômica',
    category: 'geral',
    cost: 4000000,
    researchTime: 10,
    icon: '🔬',
    requirements: ['inteligencia_artificial', 'cirurgia_robotica'],
    effects: {
      facilities: 'ALL',
      benefits: { research: 50, health: 25, economy: 50 },
      efficiency: 1.5,
      costReduction: 0.7
    }
  },
  computacao_quantica: {
    name: 'Computação Quântica',
    description: 'Processamento de dados em velocidade quântica',
    category: 'tecnologia',
    cost: 6000000,
    researchTime: 15,
    icon: '⚡',
    requirements: ['nanotecnologia', 'fusao_nuclear'],
    effects: {
      facilities: 'ALL',
      benefits: { research: 100, economy: 100, education: 50 },
      efficiency: 2.0,
      costReduction: 0.6
    }
  }
};

// Função para verificar se uma tecnologia pode ser pesquisada
export const canResearch = (techId, nation) => {
  const tech = TECHNOLOGIES[techId];
  if (!tech) return { can: false, reason: 'Tecnologia não encontrada' };
  
  // Verificar se já foi pesquisada
  if (nation.technologies?.researched?.includes(techId)) {
    return { can: false, reason: 'Já pesquisada' };
  }
  
  // Verificar se está sendo pesquisada
  if (nation.technologies?.researching?.some(r => r.id === techId)) {
    return { can: false, reason: 'Já em pesquisa' };
  }
  
  // Verificar dinheiro
  if (nation.treasury < tech.cost) {
    return { can: false, reason: `Necessário R$ ${tech.cost.toLocaleString()}` };
  }
  
  // Verificar requisitos
  for (const reqId of tech.requirements) {
    if (!nation.technologies?.researched?.includes(reqId)) {
      return { 
        can: false, 
        reason: `Requer: ${TECHNOLOGIES[reqId].name}` 
      };
    }
  }
  
  // Verificar se tem Ministério de Tecnologia
  const hasTechMinistry = nation.ministries?.some(m => m.type === 'tecnologia' && m.minister);
  if (!hasTechMinistry) {
    return { 
      can: false, 
      reason: 'Requer Ministério de Tecnologia com ministro' 
    };
  }
  
  return { can: true };
};

// Função para calcular velocidade de pesquisa
export const calculateResearchSpeed = (nation) => {
  let speed = 1;
  
  // Somar velocidade de todas as instalações de tecnologia
  if (nation.facilities) {
    nation.facilities
      .filter(f => f.researchSpeed && f.researchSpeed > 0)
      .forEach(f => {
        const totalJobs = f.jobs.reduce((sum, j) => sum + j.count, 0);
        const filledJobs = f.jobs.reduce((sum, j) => sum + (j.filled || 0), 0);
        const employmentRate = totalJobs > 0 ? filledJobs / totalJobs : 0;
        speed += f.researchSpeed * employmentRate;
      });
  }
  
  return speed;
};

// Função para aplicar efeitos de tecnologia em uma benfeitoria
export const applyTechEffects = (facility, researchedTechs) => {
  let modifiedFacility = { ...facility };
  
  if (!researchedTechs || researchedTechs.length === 0) {
    return modifiedFacility;
  }
  
  researchedTechs.forEach(techId => {
    const tech = TECHNOLOGIES[techId];
    if (!tech) return;
    
    // Verificar se a tecnologia se aplica a esta benfeitoria
    const applies = tech.effects.facilities === 'ALL' || 
                   (Array.isArray(tech.effects.facilities) && tech.effects.facilities.includes(facility.name));
    
    if (applies) {
      // Aplicar benefícios adicionais
      if (tech.effects.benefits) {
        modifiedFacility.benefits = modifiedFacility.benefits || {};
        Object.entries(tech.effects.benefits).forEach(([key, val]) => {
          modifiedFacility.benefits[key] = (modifiedFacility.benefits[key] || 0) + val;
        });
      }
      
      // Marcar tecnologias aplicadas
      modifiedFacility.appliedTechs = modifiedFacility.appliedTechs || [];
      if (!modifiedFacility.appliedTechs.includes(techId)) {
        modifiedFacility.appliedTechs.push(techId);
      }
    }
  });
  
  return modifiedFacility;
};