// src/data/ministryTypes.js

export const MINISTRY_TYPES = {
  educacao: {
    name: 'Educação',
    icon: '📚',
    facilities: [
      {
        name: 'Creche',
        cost: 150000,
        jobs: [
          { role: 'Diretor', count: 1, minSalary: 3000 },
          { role: 'Educador', count: 8, minSalary: 1500 },
          { role: 'Auxiliar', count: 4, minSalary: 1200 },
          { role: 'Cozinheiro', count: 2, minSalary: 1400 }
        ],
        benefits: { education: 5, happiness: 3 },
        resourceConsumption: { agua: 50, energy: 30, food: 20 }
      },
      {
        name: 'Escola',
        cost: 300000,
        jobs: [
          { role: 'Diretor', count: 1, minSalary: 4000 },
          { role: 'Professor', count: 20, minSalary: 2500 },
          { role: 'Coordenador', count: 3, minSalary: 3000 },
          { role: 'Auxiliar Administrativo', count: 5, minSalary: 1500 }
        ],
        benefits: { education: 10, happiness: 5 },
        resourceConsumption: { agua: 100, energy: 50, furniture: 10 }
      },
      {
        name: 'Universidade',
        cost: 1500000,
        jobs: [
          { role: 'Reitor', count: 1, minSalary: 10000 },
          { role: 'Professor Doutor', count: 50, minSalary: 6000 },
          { role: 'Pesquisador', count: 30, minSalary: 5000 },
          { role: 'Técnico', count: 20, minSalary: 3000 },
          { role: 'Administrativo', count: 15, minSalary: 2000 }
        ],
        benefits: { education: 30, happiness: 10, research: 20 },
        resourceConsumption: { agua: 200, energy: 150, furniture: 30 }
      }
    ]
  },
  
  saude: {
    name: 'Saúde',
    icon: '🏥',
    facilities: [
      {
        name: 'Posto de Saúde',
        cost: 200000,
        jobs: [
          { role: 'Médico', count: 3, minSalary: 5000 },
          { role: 'Enfermeiro', count: 6, minSalary: 2500 },
          { role: 'Técnico de Enfermagem', count: 4, minSalary: 1800 },
          { role: 'Recepcionista', count: 2, minSalary: 1400 }
        ],
        benefits: { health: 10, happiness: 5 },
        resourceConsumption: { agua: 100, energy: 40, medicine: 50 }
      },
      {
        name: 'Hospital',
        cost: 800000,
        jobs: [
          { role: 'Diretor Médico', count: 1, minSalary: 12000 },
          { role: 'Médico Especialista', count: 20, minSalary: 8000 },
          { role: 'Enfermeiro', count: 40, minSalary: 3000 },
          { role: 'Técnico', count: 30, minSalary: 2000 },
          { role: 'Administrativo', count: 10, minSalary: 1800 }
        ],
        benefits: { health: 30, happiness: 10 },
        resourceConsumption: { agua: 300, energy: 200, medicine: 200 }
      },
      {
        name: 'Fábrica de Medicamentos',
        cost: 1200000,
        jobs: [
          { role: 'Diretor', count: 1, minSalary: 15000 },
          { role: 'Farmacêutico', count: 20, minSalary: 7000 },
          { role: 'Químico', count: 15, minSalary: 6000 },
          { role: 'Operador', count: 40, minSalary: 3000 }
        ],
        benefits: { health: 20, economy: 30 },
        resourceConsumption: { agua: 200, energy: 300 },
        resourceProduction: { medicine: 500 }
      }
    ]
  },
  
  defesa: {
    name: 'Defesa',
    icon: '🛡️',
    facilities: [
      {
        name: 'Base Militar',
        cost: 600000,
        jobs: [
          { role: 'Comandante', count: 1, minSalary: 8000 },
          { role: 'Oficial', count: 10, minSalary: 4000 },
          { role: 'Soldado', count: 100, minSalary: 2000 },
          { role: 'Suporte', count: 20, minSalary: 1800 }
        ],
        benefits: { security: 30, happiness: 5 },
        resourceConsumption: { agua: 200, food: 150, ferro: 100, energy: 100 }
      },
      {
        name: 'Academia Militar',
        cost: 1000000,
        jobs: [
          { role: 'Diretor', count: 1, minSalary: 10000 },
          { role: 'Instrutor', count: 20, minSalary: 5000 },
          { role: 'Oficial Trainee', count: 50, minSalary: 3000 },
          { role: 'Suporte', count: 15, minSalary: 2000 }
        ],
        benefits: { security: 20, education: 15, happiness: 8 },
        resourceConsumption: { agua: 150, food: 100, ferro: 50, energy: 80 }
      }
    ]
  },
  
  agricultura: {
    name: 'Agricultura',
    icon: '🌾',
    facilities: [
      {
        name: 'Fazenda de Grãos',
        cost: 400000,
        jobs: [
          { role: 'Gerente', count: 1, minSalary: 4000 },
          { role: 'Agrônomo', count: 3, minSalary: 3500 },
          { role: 'Trabalhador Rural', count: 50, minSalary: 1500 },
          { role: 'Operador de Máquinas', count: 8, minSalary: 2000 }
        ],
        benefits: { food: 30, economy: 10, happiness: 5 },
        resourceConsumption: { agua: 500, terrasAraveis: 100, energy: 50 },
        resourceProduction: { food: 1000 }
      },
      {
        name: 'Fazenda de Frutas',
        cost: 350000,
        jobs: [
          { role: 'Gerente', count: 1, minSalary: 4000 },
          { role: 'Agrônomo', count: 2, minSalary: 3500 },
          { role: 'Trabalhador Rural', count: 40, minSalary: 1500 }
        ],
        benefits: { food: 20, economy: 15, happiness: 8 },
        resourceConsumption: { agua: 400, terrasAraveis: 80, energy: 30 },
        resourceProduction: { fruits: 800 }
      },
      {
        name: 'Fazenda de Vegetais',
        cost: 300000,
        jobs: [
          { role: 'Gerente', count: 1, minSalary: 4000 },
          { role: 'Agrônomo', count: 2, minSalary: 3500 },
          { role: 'Trabalhador Rural', count: 35, minSalary: 1500 }
        ],
        benefits: { food: 15, economy: 15, happiness: 7 },
        resourceConsumption: { agua: 350, terrasAraveis: 70, energy: 25 },
        resourceProduction: { vegetables: 700 }
      },
      {
        name: 'Centro de Distribuição',
        cost: 500000,
        jobs: [
          { role: 'Diretor de Logística', count: 1, minSalary: 6000 },
          { role: 'Coordenador', count: 5, minSalary: 3000 },
          { role: 'Motorista', count: 30, minSalary: 2200 },
          { role: 'Operador de Armazém', count: 40, minSalary: 1800 }
        ],
        benefits: { food: 20, economy: 20, happiness: 8 },
        resourceConsumption: { agua: 100, energy: 150, fuel: 200 }
      }
    ]
  },

  industria: {
    name: 'Indústria',
    icon: '🏭',
    facilities: [
      {
        name: 'Serraria',
        cost: 400000,
        jobs: [
          { role: 'Gerente', count: 1, minSalary: 5000 },
          { role: 'Supervisor', count: 3, minSalary: 3500 },
          { role: 'Operador de Serra', count: 20, minSalary: 2500 },
          { role: 'Auxiliar', count: 15, minSalary: 1800 }
        ],
        benefits: { economy: 30, resources: 20 },
        resourceConsumption: { floresta: 200, energy: 150 },
        resourceProduction: { madeira: 600 }
      },
      {
        name: 'Fábrica de Móveis',
        cost: 600000,
        jobs: [
          { role: 'Diretor', count: 1, minSalary: 8000 },
          { role: 'Designer', count: 5, minSalary: 5000 },
          { role: 'Marceneiro', count: 30, minSalary: 3000 },
          { role: 'Montador', count: 40, minSalary: 2200 }
        ],
        benefits: { economy: 50, happiness: 10 },
        resourceConsumption: { madeira: 300, energy: 200, ferro: 50 },
        resourceProduction: { furniture: 400 }
      },
      {
        name: 'Fábrica de Roupas',
        cost: 500000,
        jobs: [
          { role: 'Diretor', count: 1, minSalary: 7000 },
          { role: 'Estilista', count: 5, minSalary: 4500 },
          { role: 'Costureiro', count: 50, minSalary: 2500 },
          { role: 'Operador', count: 30, minSalary: 2000 }
        ],
        benefits: { economy: 40, happiness: 15 },
        resourceConsumption: { energy: 180 },
        resourceProduction: { clothing: 500 }
      }
    ]
  },
  
  minasEnergia: {
    name: 'Minas e Energia',
    icon: '⚡',
    facilities: [
      {
        name: 'Poço Artesiano',
        cost: 250000,
        jobs: [
          { role: 'Engenheiro Hidráulico', count: 2, minSalary: 6000 },
          { role: 'Técnico de Perfuração', count: 5, minSalary: 3000 },
          { role: 'Operador', count: 8, minSalary: 2200 }
        ],
        benefits: { health: 10, happiness: 15 },
        resourceConsumption: { energy: 50 },
        resourceProduction: { agua: 1000 }
      },
      {
        name: 'Mina',
        cost: 800000,
        jobs: [
          { role: 'Engenheiro de Minas', count: 5, minSalary: 8000 },
          { role: 'Supervisor', count: 10, minSalary: 4000 },
          { role: 'Minerador', count: 100, minSalary: 2500 },
          { role: 'Operador de Equipamento', count: 30, minSalary: 3000 }
        ],
        benefits: { economy: 40, resources: 50 },
        resourceConsumption: { agua: 200, energy: 300 },
        resourceProduction: { ferro: 500, ouro: 50, cobre: 300 }
      },
      {
        name: 'Refinaria',
        cost: 1800000,
        jobs: [
          { role: 'Diretor de Operações', count: 1, minSalary: 15000 },
          { role: 'Engenheiro Químico', count: 20, minSalary: 9000 },
          { role: 'Técnico', count: 50, minSalary: 4000 },
          { role: 'Operador', count: 80, minSalary: 3500 }
        ],
        benefits: { economy: 60, resources: 30 },
        resourceConsumption: { agua: 300, petroleo: 200, energy: 200 },
        resourceProduction: { fuel: 500 }
      },
      {
        name: 'Usina de Energia',
        cost: 3000000,
        jobs: [
          { role: 'Superintendente', count: 1, minSalary: 18000 },
          { role: 'Engenheiro Elétrico', count: 30, minSalary: 10000 },
          { role: 'Técnico Especializado', count: 60, minSalary: 5000 },
          { role: 'Operador', count: 100, minSalary: 4000 },
          { role: 'Manutenção', count: 40, minSalary: 3500 }
        ],
        benefits: { economy: 80, energy: 100, happiness: 20 },
        resourceConsumption: { agua: 1000, petroleo: 300 },
        resourceProduction: { energy: 2000 }
      },
      {
        name: 'Poço de Petróleo',
        cost: 1500000,
        jobs: [
          { role: 'Engenheiro de Petróleo', count: 5, minSalary: 12000 },
          { role: 'Supervisor', count: 10, minSalary: 6000 },
          { role: 'Operador de Plataforma', count: 50, minSalary: 4000 },
          { role: 'Técnico', count: 20, minSalary: 3500 }
        ],
        benefits: { economy: 100, resources: 80 },
        resourceConsumption: { agua: 200, energy: 250 },
        resourceProduction: { petroleo: 1000, gas: 500 }
      }
    ]
  },
  
  tecnologia: {
    name: 'Tecnologia',
    icon: '💻',
    facilities: [
      {
        name: 'Centro de Pesquisa Básica',
        cost: 1000000,
        jobs: [
          { role: 'Diretor de Pesquisa', count: 1, minSalary: 10000 },
          { role: 'Pesquisador', count: 10, minSalary: 6000 },
          { role: 'Técnico de Laboratório', count: 8, minSalary: 3000 },
          { role: 'Assistente', count: 5, minSalary: 2000 }
        ],
        benefits: { research: 20, education: 10 },
        researchSpeed: 1,
        resourceConsumption: { agua: 100, energy: 200, furniture: 15 }
      },
      {
        name: 'Instituto de Tecnologia Avançada',
        cost: 2500000,
        jobs: [
          { role: 'Diretor Científico', count: 1, minSalary: 18000 },
          { role: 'Cientista Sênior', count: 20, minSalary: 12000 },
          { role: 'Engenheiro', count: 30, minSalary: 8000 },
          { role: 'Técnico Especializado', count: 25, minSalary: 5000 },
          { role: 'Suporte', count: 15, minSalary: 3000 }
        ],
        benefits: { research: 50, education: 20, economy: 15 },
        researchSpeed: 2,
        resourceConsumption: { agua: 200, energy: 500, furniture: 30 }
      },
      {
        name: 'Supercomputador Nacional',
        cost: 6000000,
        jobs: [
          { role: 'Superintendente', count: 1, minSalary: 25000 },
          { role: 'Cientista de Dados', count: 15, minSalary: 15000 },
          { role: 'Engenheiro de Sistemas', count: 20, minSalary: 10000 },
          { role: 'Operador', count: 30, minSalary: 6000 }
        ],
        benefits: { research: 100, education: 30, economy: 40 },
        researchSpeed: 4,
        resourceConsumption: { agua: 300, energy: 1000 }
      }
    ]
  },

  infraestrutura: {
    name: 'Infraestrutura',
    icon: '🏗️',
    facilities: [
      {
        name: 'Estação de Tratamento de Água',
        cost: 800000,
        jobs: [
          { role: 'Engenheiro Ambiental', count: 3, minSalary: 7000 },
          { role: 'Técnico Químico', count: 10, minSalary: 3500 },
          { role: 'Operador', count: 20, minSalary: 2500 }
        ],
        benefits: { health: 20, happiness: 15 },
        resourceConsumption: { energy: 200 },
        resourceProduction: { agua: 2000 }
      },
      {
        name: 'Rede de Esgoto',
        cost: 1200000,
        jobs: [
          { role: 'Engenheiro Civil', count: 5, minSalary: 8000 },
          { role: 'Técnico', count: 15, minSalary: 3500 },
          { role: 'Operário', count: 40, minSalary: 2200 }
        ],
        benefits: { health: 30, happiness: 20 },
        resourceConsumption: { agua: 100, energy: 150 }
      },
      {
        name: 'Rede Elétrica',
        cost: 2000000,
        jobs: [
          { role: 'Engenheiro Eletricista', count: 10, minSalary: 9000 },
          { role: 'Eletricista', count: 50, minSalary: 4000 },
          { role: 'Técnico', count: 30, minSalary: 3000 }
        ],
        benefits: { happiness: 25, economy: 30 },
        resourceConsumption: { energy: 100, ferro: 50, cobre: 100 }
      },
      {
        name: 'Rede de Transporte Público',
        cost: 1500000,
        jobs: [
          { role: 'Gerente de Operações', count: 1, minSalary: 10000 },
          { role: 'Motorista', count: 100, minSalary: 3000 },
          { role: 'Mecânico', count: 30, minSalary: 3500 },
          { role: 'Atendente', count: 50, minSalary: 2000 }
        ],
        benefits: { happiness: 30, economy: 25 },
        resourceConsumption: { fuel: 500, energy: 100 }
      },
      {
        name: 'Centro de Reciclagem',
        cost: 600000,
        jobs: [
          { role: 'Coordenador', count: 2, minSalary: 5000 },
          { role: 'Operador', count: 40, minSalary: 2200 },
          { role: 'Motorista', count: 20, minSalary: 2800 }
        ],
        benefits: { happiness: 15, economy: 10, health: 10 },
        resourceConsumption: { agua: 50, energy: 100 }
      }
    ]
  },

  justica: {
    name: 'Justiça',
    icon: '⚖️',
    facilities: [
      {
        name: 'Tribunal de Justiça',
        cost: 1000000,
        jobs: [
          { role: 'Juiz', count: 10, minSalary: 15000 },
          { role: 'Promotor', count: 15, minSalary: 12000 },
          { role: 'Defensor Público', count: 20, minSalary: 10000 },
          { role: 'Escrivão', count: 30, minSalary: 3500 },
          { role: 'Oficial de Justiça', count: 25, minSalary: 4000 }
        ],
        benefits: { security: 25, happiness: 15 },
        resourceConsumption: { agua: 100, energy: 150, furniture: 20 }
      },
      {
        name: 'Delegacia de Polícia',
        cost: 500000,
        jobs: [
          { role: 'Delegado', count: 1, minSalary: 12000 },
          { role: 'Investigador', count: 10, minSalary: 6000 },
          { role: 'Policial', count: 50, minSalary: 4000 },
          { role: 'Escrivão', count: 8, minSalary: 3000 }
        ],
        benefits: { security: 20, happiness: 10 },
        resourceConsumption: { agua: 80, energy: 100, fuel: 100 }
      },
      {
        name: 'Presídio',
        cost: 1500000,
        jobs: [
          { role: 'Diretor', count: 1, minSalary: 10000 },
          { role: 'Agente Penitenciário', count: 100, minSalary: 4500 },
          { role: 'Psicólogo', count: 10, minSalary: 5000 },
          { role: 'Assistente Social', count: 15, minSalary: 4000 }
        ],
        benefits: { security: 30 },
        resourceConsumption: { agua: 300, energy: 200, food: 500 }
      }
    ]
  },

  cultura: {
    name: 'Cultura',
    icon: '🎭',
    facilities: [
      {
        name: 'Biblioteca Pública',
        cost: 400000,
        jobs: [
          { role: 'Diretor', count: 1, minSalary: 6000 },
          { role: 'Bibliotecário', count: 10, minSalary: 3500 },
          { role: 'Assistente', count: 8, minSalary: 2000 }
        ],
        benefits: { education: 15, happiness: 20, culture: 25 },
        resourceConsumption: { agua: 50, energy: 80, furniture: 15 }
      },
      {
        name: 'Museu Nacional',
        cost: 2000000,
        jobs: [
          { role: 'Curador', count: 5, minSalary: 8000 },
          { role: 'Historiador', count: 10, minSalary: 6000 },
          { role: 'Guia', count: 20, minSalary: 2500 },
          { role: 'Segurança', count: 15, minSalary: 2800 }
        ],
        benefits: { education: 25, happiness: 30, culture: 40 },
        resourceConsumption: { agua: 100, energy: 200, furniture: 30 }
      },
      {
        name: 'Teatro Municipal',
        cost: 1500000,
        jobs: [
          { role: 'Diretor Artístico', count: 1, minSalary: 10000 },
          { role: 'Ator/Atriz', count: 30, minSalary: 4000 },
          { role: 'Técnico', count: 20, minSalary: 3000 },
          { role: 'Produtor', count: 5, minSalary: 5000 }
        ],
        benefits: { happiness: 35, culture: 45 },
        resourceConsumption: { agua: 80, energy: 250, furniture: 20 }
      },
      {
        name: 'Centro Cultural',
        cost: 800000,
        jobs: [
          { role: 'Coordenador', count: 2, minSalary: 6000 },
          { role: 'Instrutor', count: 20, minSalary: 3500 },
          { role: 'Assistente', count: 10, minSalary: 2200 }
        ],
        benefits: { education: 10, happiness: 25, culture: 30 },
        resourceConsumption: { agua: 60, energy: 120, furniture: 15 }
      },
      {
        name: 'Estádio Esportivo',
        cost: 3000000,
        jobs: [
          { role: 'Diretor', count: 1, minSalary: 15000 },
          { role: 'Treinador', count: 20, minSalary: 8000 },
          { role: 'Atleta', count: 100, minSalary: 5000 },
          { role: 'Manutenção', count: 50, minSalary: 2500 }
        ],
        benefits: { happiness: 40, culture: 35, health: 20 },
        resourceConsumption: { agua: 500, energy: 400, furniture: 40 }
      }
    ]
  }
};