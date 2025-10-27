export const MINISTRY_TYPES = {
  educacao: {
    name: 'Educação',
    icon: '📚',
    facilities: [
      {
        name: 'Creche',
        cost: 50000,
        jobs: [
          { role: 'Diretor', count: 1, minSalary: 3000 },
          { role: 'Educador', count: 8, minSalary: 1500 },
          { role: 'Auxiliar', count: 4, minSalary: 1200 },
          { role: 'Cozinheiro', count: 2, minSalary: 1400 }
        ],
        benefits: { education: 5, happiness: 3 }
      },
      {
        name: 'Escola',
        cost: 100000,
        jobs: [
          { role: 'Diretor', count: 1, minSalary: 4000 },
          { role: 'Professor', count: 20, minSalary: 2500 },
          { role: 'Coordenador', count: 3, minSalary: 3000 },
          { role: 'Auxiliar Administrativo', count: 5, minSalary: 1500 }
        ],
        benefits: { education: 10, happiness: 5 }
      },
      {
        name: 'Universidade',
        cost: 500000,
        jobs: [
          { role: 'Reitor', count: 1, minSalary: 10000 },
          { role: 'Professor Doutor', count: 50, minSalary: 6000 },
          { role: 'Pesquisador', count: 30, minSalary: 5000 },
          { role: 'Técnico', count: 20, minSalary: 3000 },
          { role: 'Administrativo', count: 15, minSalary: 2000 }
        ],
        benefits: { education: 30, happiness: 10, research: 20 }
      }
    ]
  },
  saude: {
    name: 'Saúde',
    icon: '🏥',
    facilities: [
      {
        name: 'Posto de Saúde',
        cost: 75000,
        jobs: [
          { role: 'Médico', count: 3, minSalary: 5000 },
          { role: 'Enfermeiro', count: 6, minSalary: 2500 },
          { role: 'Técnico de Enfermagem', count: 4, minSalary: 1800 },
          { role: 'Recepcionista', count: 2, minSalary: 1400 }
        ],
        benefits: { health: 10, happiness: 5 }
      },
      {
        name: 'Hospital',
        cost: 300000,
        jobs: [
          { role: 'Diretor Médico', count: 1, minSalary: 12000 },
          { role: 'Médico Especialista', count: 20, minSalary: 8000 },
          { role: 'Enfermeiro', count: 40, minSalary: 3000 },
          { role: 'Técnico', count: 30, minSalary: 2000 },
          { role: 'Administrativo', count: 10, minSalary: 1800 }
        ],
        benefits: { health: 30, happiness: 10 }
      },
      {
        name: 'Hospital Universitário',
        cost: 800000,
        jobs: [
          { role: 'Superintendente', count: 1, minSalary: 15000 },
          { role: 'Médico Pesquisador', count: 40, minSalary: 10000 },
          { role: 'Enfermeiro Especialista', count: 60, minSalary: 4000 },
          { role: 'Técnico', count: 50, minSalary: 2500 },
          { role: 'Pesquisador', count: 20, minSalary: 6000 }
        ],
        benefits: { health: 50, happiness: 15, research: 30 }
      }
    ]
  },
  defesa: {
    name: 'Defesa',
    icon: '🛡️',
    facilities: [
      {
        name: 'Base Militar',
        cost: 200000,
        jobs: [
          { role: 'Comandante', count: 1, minSalary: 8000 },
          { role: 'Oficial', count: 10, minSalary: 4000 },
          { role: 'Soldado', count: 100, minSalary: 2000 },
          { role: 'Suporte', count: 20, minSalary: 1800 }
        ],
        benefits: { security: 30, happiness: 5 }
      },
      {
        name: 'Academia Militar',
        cost: 400000,
        jobs: [
          { role: 'Diretor', count: 1, minSalary: 10000 },
          { role: 'Instrutor', count: 20, minSalary: 5000 },
          { role: 'Oficial Trainee', count: 50, minSalary: 3000 },
          { role: 'Suporte', count: 15, minSalary: 2000 }
        ],
        benefits: { security: 20, education: 15, happiness: 8 }
      },
      {
        name: 'Centro de Treinamento',
        cost: 150000,
        jobs: [
          { role: 'Coordenador', count: 1, minSalary: 6000 },
          { role: 'Instrutor', count: 15, minSalary: 3500 },
          { role: 'Soldado em Treinamento', count: 80, minSalary: 1800 }
        ],
        benefits: { security: 15, happiness: 5 }
      }
    ]
  },
  agricultura: {
    name: 'Agricultura',
    icon: '🌾',
    facilities: [
      {
        name: 'Fazenda Cooperativa',
        cost: 120000,
        jobs: [
          { role: 'Gerente', count: 1, minSalary: 4000 },
          { role: 'Agrônomo', count: 3, minSalary: 3500 },
          { role: 'Trabalhador Rural', count: 50, minSalary: 1500 },
          { role: 'Operador de Máquinas', count: 8, minSalary: 2000 }
        ],
        benefits: { food: 30, economy: 10, happiness: 5 }
      },
      {
        name: 'Centro de Distribuição',
        cost: 180000,
        jobs: [
          { role: 'Diretor de Logística', count: 1, minSalary: 6000 },
          { role: 'Coordenador', count: 5, minSalary: 3000 },
          { role: 'Motorista', count: 30, minSalary: 2200 },
          { role: 'Operador de Armazém', count: 40, minSalary: 1800 }
        ],
        benefits: { food: 20, economy: 20, happiness: 8 }
      },
      {
        name: 'Instituto de Pesquisa',
        cost: 350000,
        jobs: [
          { role: 'Diretor Científico', count: 1, minSalary: 12000 },
          { role: 'Pesquisador Sênior', count: 15, minSalary: 7000 },
          { role: 'Técnico de Laboratório', count: 20, minSalary: 3000 },
          { role: 'Assistente', count: 10, minSalary: 2000 }
        ],
        benefits: { food: 10, research: 40, economy: 15 }
      }
    ]
  },
  minasEnergia: {
    name: 'Minas e Energia',
    icon: '⚡',
    facilities: [
      {
        name: 'Mina',
        cost: 250000,
        jobs: [
          { role: 'Engenheiro de Minas', count: 5, minSalary: 8000 },
          { role: 'Supervisor', count: 10, minSalary: 4000 },
          { role: 'Minerador', count: 100, minSalary: 2500 },
          { role: 'Operador de Equipamento', count: 30, minSalary: 3000 }
        ],
        benefits: { economy: 40, resources: 50 }
      },
      {
        name: 'Refinaria',
        cost: 600000,
        jobs: [
          { role: 'Diretor de Operações', count: 1, minSalary: 15000 },
          { role: 'Engenheiro Químico', count: 20, minSalary: 9000 },
          { role: 'Técnico', count: 50, minSalary: 4000 },
          { role: 'Operador', count: 80, minSalary: 3500 }
        ],
        benefits: { economy: 60, resources: 30 }
      },
      {
        name: 'Usina de Energia',
        cost: 1000000,
        jobs: [
          { role: 'Superintendente', count: 1, minSalary: 18000 },
          { role: 'Engenheiro Elétrico', count: 30, minSalary: 10000 },
          { role: 'Técnico Especializado', count: 60, minSalary: 5000 },
          { role: 'Operador', count: 100, minSalary: 4000 },
          { role: 'Manutenção', count: 40, minSalary: 3500 }
        ],
        benefits: { economy: 80, energy: 100, happiness: 20 }
      } 
    ]
  },
  // Adicione isso ao MINISTRY_TYPES existente

  tecnologia: {
    name: 'Tecnologia',
    icon: '💻',
    facilities: [
      {
        name: 'Centro de Pesquisa Básica',
        cost: 300000,
        jobs: [
          { role: 'Diretor de Pesquisa', count: 1, minSalary: 10000 },
          { role: 'Pesquisador', count: 10, minSalary: 6000 },
          { role: 'Técnico de Laboratório', count: 8, minSalary: 3000 },
          { role: 'Assistente', count: 5, minSalary: 2000 }
        ],
        benefits: { research: 20, education: 10 },
        researchSpeed: 1 // Multiplica velocidade de pesquisa
      },
      {
        name: 'Instituto de Tecnologia Avançada',
        cost: 800000,
        jobs: [
          { role: 'Diretor Científico', count: 1, minSalary: 18000 },
          { role: 'Cientista Sênior', count: 20, minSalary: 12000 },
          { role: 'Engenheiro', count: 30, minSalary: 8000 },
          { role: 'Técnico Especializado', count: 25, minSalary: 5000 },
          { role: 'Suporte', count: 15, minSalary: 3000 }
        ],
        benefits: { research: 50, education: 20, economy: 15 },
        researchSpeed: 2
      },
      {
        name: 'Supercomputador Nacional',
        cost: 2000000,
        jobs: [
          { role: 'Superintendente', count: 1, minSalary: 25000 },
          { role: 'Cientista de Dados', count: 15, minSalary: 15000 },
          { role: 'Engenheiro de Sistemas', count: 20, minSalary: 10000 },
          { role: 'Operador', count: 30, minSalary: 6000 }
        ],
        benefits: { research: 100, education: 30, economy: 40 },
        researchSpeed: 4
      }
    ]
  }
  
};