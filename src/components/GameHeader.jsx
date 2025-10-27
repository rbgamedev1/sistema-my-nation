// src/components/GameHeader.jsx

import React from 'react';

const GameHeader = ({ nation, president }) => (
  <div className="bg-blue-900 text-white p-4 shadow-lg">
    <div className="container mx-auto flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">{president.nationName}</h1>
        <p className="text-blue-200">Presidente {president.name}</p>
      </div>
      <div className="flex gap-6">
        <div className="text-right">
          <p className="text-sm text-blue-200">Tesouro</p>
          <p className="text-xl font-bold">R$ {nation.treasury.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-blue-200">População</p>
          <p className="text-xl font-bold">{nation.population.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-blue-200">Felicidade</p>
          <p className="text-xl font-bold">{nation.happiness.toFixed(1)}%</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-blue-200">Mês</p>
          <p className="text-xl font-bold">{nation.currentMonth}</p>
        </div>
      </div>
    </div>
  </div>
);

export default GameHeader;