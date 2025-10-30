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
  educacao_inclusiva: {
    name: 'Educação Inclusiva',
    description: 'Programas especializados para alunos com necessidades especiais',
    category: 'educacao',
    cost: 600000,
    researchTime: 4,
    icon: '♿',
    requirements: ['educacao_digital'],
    effects: {
      facilities: ['Creche', 'Escola'],
      benefits: { education: 8, happiness: 10 },
      efficiency: 1.25
    }
  },
  gamificacao_ensino: {
    name: 'Gamificação do Ensino',
    description: 'Uso de jogos e realidade virtual no ensino',
    category: 'educacao',
    cost: 800000,
    researchTime: 4,
    icon: '🎮',
    requirements: ['educacao_digital'],
    effects: {
      facilities: ['Escola', 'Universidade'],
      benefits: { education: 10, happiness: 8 },
      efficiency: 1.3,
      costReduction: 0.85
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
      facilities: ['Hospital'],
      benefits: { health: 20, research: 5 },
      efficiency: 1.6,
      unlockJobs: [
        { role: 'Cirurgião Robótico', count: 5, minSalary: 15000 }
      ]
    }
  },
  medicina_preventiva: {
    name: 'Medicina Preventiva',
    description: 'Programas de prevenção e saúde pública',
    category: 'saude',
    cost: 500000,
    researchTime: 3,
    icon: '🩺',
    requirements: [],
    effects: {
      facilities: ['Posto de Saúde', 'Hospital'],
      benefits: { health: 12, happiness: 6 },
      efficiency: 1.2,
      costReduction: 0.8
    }
  },
  terapia_genica: {
    name: 'Terapia Gênica',
    description: 'Tratamento de doenças através da modificação genética',
    category: 'saude',
    cost: 2000000,
    researchTime: 7,
    icon: '🧬',
    requirements: ['cirurgia_robotica'],
    effects: {
      facilities: ['Hospital', 'Fábrica de Medicamentos'],
      benefits: { health: 30, research: 15 },
      efficiency: 1.8
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
      facilities: ['Fazenda de Grãos', 'Fazenda de Frutas', 'Fazenda de Vegetais'],
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
      facilities: ['Fazenda de Grãos', 'Fazenda de Frutas', 'Fazenda de Vegetais'],
      benefits: { food: 30, research: 10 },
      efficiency: 2.0,
      unlockJobs: [
        { role: 'Geneticista Agrícola', count: 8, minSalary: 9000 }
      ]
    }
  },
  hidroponia_avancada: {
    name: 'Hidroponia Avançada',
    description: 'Cultivo sem solo com alta eficiência',
    category: 'agricultura',
    cost: 900000,
    researchTime: 4,
    icon: '💧',
    requirements: ['agricultura_precisao'],
    effects: {
      facilities: ['Fazenda de Vegetais', 'Fazenda de Frutas'],
      benefits: { food: 20 },
      efficiency: 1.6,
      costReduction: 0.7
    }
  },
  agricultura_vertical: {
    name: 'Agricultura Vertical',
    description: 'Fazendas em prédios de múltiplos andares',
    category: 'agricultura',
    cost: 1500000,
    researchTime: 6,
    icon: '🏢',
    requirements: ['hidroponia_avancada', 'ogm_avancado'],
    effects: {
      facilities: ['Fazenda de Grãos', 'Fazenda de Frutas', 'Fazenda de Vegetais'],
      benefits: { food: 40, economy: 20 },
      efficiency: 2.5,
      costReduction: 0.6
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
      facilities: ['Base Militar', 'Academia Militar'],
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
  drones_militares: {
    name: 'Drones Militares',
    description: 'Veículos aéreos não tripulados para vigilância e defesa',
    category: 'defesa',
    cost: 1200000,
    researchTime: 5,
    icon: '🚁',
    requirements: ['defesa_cibernetica'],
    effects: {
      facilities: ['Base Militar'],
      benefits: { security: 25 },
      efficiency: 1.5,
      costReduction: 0.85
    }
  },
  sistemas_antimisseis: {
    name: 'Sistemas Antimísseis',
    description: 'Defesa avançada contra ataques aéreos',
    category: 'defesa',
    cost: 2500000,
    researchTime: 8,
    icon: '🎯',
    requirements: ['armamento_moderno', 'drones_militares'],
    effects: {
      facilities: ['Base Militar'],
      benefits: { security: 50 },
      efficiency: 2.0
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
  perfuracao_profunda: {
    name: 'Perfuração Profunda',
    description: 'Acesso a recursos em grandes profundidades',
    category: 'minasEnergia',
    cost: 1200000,
    researchTime: 5,
    icon: '🔧',
    requirements: ['extracao_inteligente'],
    effects: {
      facilities: ['Mina', 'Poço de Petróleo', 'Poço Artesiano'],
      benefits: { resources: 35, economy: 20 },
      efficiency: 1.7,
      costReduction: 0.8
    }
  },
  supercondutores: {
    name: 'Supercondutores',
    description: 'Transmissão de energia sem perdas',
    category: 'minasEnergia',
    cost: 2000000,
    researchTime: 7,
    icon: '⚡',
    requirements: ['energia_renovavel'],
    effects: {
      facilities: ['Usina de Energia', 'Rede Elétrica'],
      benefits: { energy: 40, economy: 30 },
      efficiency: 1.8,
      costReduction: 0.6
    }
  },
  
  // INDÚSTRIA
  automacao_industrial: {
    name: 'Automação Industrial',
    description: 'Robôs e IA na produção',
    category: 'industria',
    cost: 1000000,
    researchTime: 5,
    icon: '🤖',
    requirements: [],
    effects: {
      facilities: ['Serraria', 'Fábrica de Móveis', 'Fábrica de Roupas'],
      benefits: { economy: 30 },
      efficiency: 1.6,
      costReduction: 0.7
    }
  },
  impressao_3d_industrial: {
    name: 'Impressão 3D Industrial',
    description: 'Produção rápida e personalizada',
    category: 'industria',
    cost: 1500000,
    researchTime: 6,
    icon: '🖨️',
    requirements: ['automacao_industrial'],
    effects: {
      facilities: ['Fábrica de Móveis', 'Fábrica de Roupas'],
      benefits: { economy: 40 },
      efficiency: 2.0,
      costReduction: 0.6
    }
  },
  materiais_avancados: {
    name: 'Materiais Avançados',
    description: 'Ligas e compostos de alta performance',
    category: 'industria',
    cost: 1200000,
    researchTime: 5,
    icon: '⚗️',
    requirements: [],
    effects: {
      facilities: ['Serraria', 'Fábrica de Móveis'],
      benefits: { economy: 25, resources: 15 },
      efficiency: 1.5,
      costReduction: 0.8
    }
  },

  // INFRAESTRUTURA
  cidades_inteligentes: {
    name: 'Cidades Inteligentes',
    description: 'IoT e automação urbana',
    category: 'infraestrutura',
    cost: 2000000,
    researchTime: 7,
    icon: '🌆',
    requirements: [],
    effects: {
      facilities: ['Rede Elétrica', 'Rede de Transporte Público', 'Estação de Tratamento de Água'],
      benefits: { happiness: 30, economy: 25 },
      efficiency: 1.6,
      costReduction: 0.7
    }
  },
  transporte_sustentavel: {
    name: 'Transporte Sustentável',
    description: 'Veículos elétricos e híbridos',
    category: 'infraestrutura',
    cost: 1500000,
    researchTime: 6,
    icon: '🚇',
    requirements: ['energia_renovavel'],
    effects: {
      facilities: ['Rede de Transporte Público'],
      benefits: { happiness: 25, economy: 20 },
      efficiency: 1.5,
      costReduction: 0.65
    }
  },
  gestao_residuos_avancada: {
    name: 'Gestão de Resíduos Avançada',
    description: 'Reciclagem e conversão de lixo em energia',
    category: 'infraestrutura',
    cost: 1000000,
    researchTime: 5,
    icon: '♻️',
    requirements: [],
    effects: {
      facilities: ['Centro de Reciclagem'],
      benefits: { happiness: 20, economy: 15, health: 10 },
      efficiency: 2.0,
      costReduction: 0.6
    }
  },

  // JUSTIÇA
  justica_digital: {
    name: 'Justiça Digital',
    description: 'Processos eletrônicos e audiências virtuais',
    category: 'justica',
    cost: 800000,
    researchTime: 4,
    icon: '💻',
    requirements: [],
    effects: {
      facilities: ['Tribunal de Justiça'],
      benefits: { security: 15 },
      efficiency: 1.5,
      costReduction: 0.7
    }
  },
  sistema_penitenciario_moderno: {
    name: 'Sistema Penitenciário Moderno',
    description: 'Reabilitação e reinserção social',
    category: 'justica',
    cost: 1200000,
    researchTime: 5,
    icon: '🏛️',
    requirements: [],
    effects: {
      facilities: ['Presídio'],
      benefits: { security: 25, happiness: 15 },
      efficiency: 1.4,
      costReduction: 0.8
    }
  },
  policiamento_inteligente: {
    name: 'Policiamento Inteligente',
    description: 'Análise preditiva e vigilância por IA',
    category: 'justica',
    cost: 1000000,
    researchTime: 5,
    icon: '🚔',
    requirements: ['justica_digital'],
    effects: {
      facilities: ['Delegacia de Polícia'],
      benefits: { security: 30 },
      efficiency: 1.6,
      costReduction: 0.75
    }
  },

  // CULTURA
  realidade_virtual_cultural: {
    name: 'Realidade Virtual Cultural',
    description: 'Experiências imersivas em museus e teatros',
    category: 'cultura',
    cost: 1000000,
    researchTime: 4,
    icon: '🥽',
    requirements: [],
    effects: {
      facilities: ['Museu Nacional', 'Teatro Municipal'],
      benefits: { culture: 25, happiness: 20 },
      efficiency: 1.5,
      costReduction: 0.8
    }
  },
  preservacao_digital: {
    name: 'Preservação Digital',
    description: 'Digitalização e conservação do patrimônio cultural',
    category: 'cultura',
    cost: 800000,
    researchTime: 4,
    icon: '💾',
    requirements: [],
    effects: {
      facilities: ['Biblioteca Pública', 'Museu Nacional'],
      benefits: { culture: 20, education: 15 },
      efficiency: 1.3
    }
  },
  esportes_alta_performance: {
    name: 'Esportes de Alta Performance',
    description: 'Ciência do esporte e treinamento avançado',
    category: 'cultura',
    cost: 1200000,
    researchTime: 5,
    icon: '🏅',
    requirements: [],
    effects: {
      facilities: ['Estádio Esportivo'],
      benefits: { culture: 30, happiness: 25, health: 15 },
      efficiency: 1.6
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
  
  if (nation.technologies?.researched?.includes(techId)) {
    return { can: false, reason: 'Já pesquisada' };
  }
  
  if (nation.technologies?.researching?.some(r => r.id === techId)) {
    return { can: false, reason: 'Já em pesquisa' };
  }
  
  if (nation.treasury < tech.cost) {
    return { can: false, reason: `Necessário R$ ${tech.cost.toLocaleString()}` };
  }
  
  for (const reqId of tech.requirements) {
    if (!nation.technologies?.researched?.includes(reqId)) {
      return { 
        can: false, 
        reason: `Requer: ${TECHNOLOGIES[reqId].name}` 
      };
    }
  }
  
  const hasTechMinistry = nation.ministries?.some(m => m.type === 'tecnologia' && m.minister);
  if (!hasTechMinistry) {
    return { 
      can: false, 
      reason: 'Requer Ministério de Tecnologia com ministro' 
    };
  }
  
  return { can: true };
};

export const calculateResearchSpeed = (nation) => {
  let speed = 1;
  
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

export const applyTechEffects = (facility, researchedTechs) => {
  let modifiedFacility = { ...facility };
  
  if (!researchedTechs || researchedTechs.length === 0) {
    return modifiedFacility;
  }
  
  researchedTechs.forEach(techId => {
    const tech = TECHNOLOGIES[techId];
    if (!tech) return;
    
    const applies = tech.effects.facilities === 'ALL' || 
                   (Array.isArray(tech.effects.facilities) && tech.effects.facilities.includes(facility.name));
    
    if (applies) {
      if (tech.effects.benefits) {
        modifiedFacility.benefits = modifiedFacility.benefits || {};
        Object.entries(tech.effects.benefits).forEach(([key, val]) => {
          modifiedFacility.benefits[key] = (modifiedFacility.benefits[key] || 0) + val;
        });
      }
      
      modifiedFacility.appliedTechs = modifiedFacility.appliedTechs || [];
      if (!modifiedFacility.appliedTechs.includes(techId)) {
        modifiedFacility.appliedTechs.push(techId);
      }
    }
  });
  
  return modifiedFacility;
};