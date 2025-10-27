// Utilitários para agrupar e processar benfeitorias

export const groupFacilities = (facilities) => {
  const grouped = {};

  facilities.forEach(facility => {
    const key = facility.name;
    
    if (!grouped[key]) {
      grouped[key] = {
        name: facility.name,
        cost: facility.cost,
        count: 0,
        totalInvestment: 0,
        facilities: [],
        benefits: {},
        appliedTechs: new Set(),
        jobs: {}
      };
    }

    grouped[key].count++;
    grouped[key].totalInvestment += facility.cost;
    grouped[key].facilities.push(facility);

    // Agregar benefícios
    if (facility.benefits) {
      Object.entries(facility.benefits).forEach(([key, value]) => {
        grouped[key].benefits[key] = (grouped[key].benefits[key] || 0) + value;
      });
    }

    // Coletar tecnologias aplicadas
    if (facility.appliedTechs) {
      facility.appliedTechs.forEach(tech => grouped[key].appliedTechs.add(tech));
    }

    // Agregar jobs
    facility.jobs.forEach(job => {
      if (!grouped[key].jobs[job.role]) {
        grouped[key].jobs[job.role] = {
          role: job.role,
          minSalary: job.minSalary,
          totalCount: 0,
          totalFilled: 0,
          avgSalary: 0,
          salaries: []
        };
      }

      const jobGroup = grouped[key].jobs[job.role];
      jobGroup.totalCount += job.count;
      jobGroup.totalFilled += (job.filled || 0);
      jobGroup.salaries.push(job.currentSalary || job.minSalary);
    });
  });

  // Calcular salário médio para cada cargo
  Object.values(grouped).forEach(group => {
    Object.values(group.jobs).forEach(job => {
      if (job.salaries.length > 0) {
        job.avgSalary = Math.round(
          job.salaries.reduce((sum, s) => sum + s, 0) / job.salaries.length
        );
      }
    });
    
    // Converter Set para Array
    group.appliedTechs = Array.from(group.appliedTechs);
  });

  return Object.values(grouped);
};

export const calculateGroupTotals = (group) => {
  const totalVacancies = Object.values(group.jobs).reduce(
    (sum, job) => sum + job.totalCount, 
    0
  );
  
  const filledVacancies = Object.values(group.jobs).reduce(
    (sum, job) => sum + job.totalFilled, 
    0
  );

  const totalMonthlyCost = Object.values(group.jobs).reduce(
    (sum, job) => sum + (job.totalFilled * job.avgSalary),
    0
  );

  const fillRate = totalVacancies > 0 
    ? (filledVacancies / totalVacancies) * 100 
    : 0;

  return {
    totalVacancies,
    filledVacancies,
    totalMonthlyCost,
    fillRate
  };
};