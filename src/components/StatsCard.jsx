// src/components/StatsCard.jsx

import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <Icon className={color} size={32} />
    </div>
  </div>
);

export default StatsCard;