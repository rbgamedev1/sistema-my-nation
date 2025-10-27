import React from 'react';
import { MapPin } from 'lucide-react';

const TerritoryTab = ({ nation }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Território e Recursos</h2>
      
      <div className="mb-6">
        <div className="relative bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-8 h-64 overflow-hidden">
          <div 
            className="absolute bg-yellow-400 rounded-full opacity-70"
            style={{
              left: `${nation.territory.x}%`,
              top: `${nation.territory.y}%`,
              width: `${nation.territory.size}px`,
              height: `${nation.territory.size}px`,
              transform: 'translate(-50%, -50%)'
            }}
          />
          <MapPin 
            className="absolute text-red-600"
            size={32}
            style={{
              left: `${nation.territory.x}%`,
              top: `${nation.territory.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>
      </div>

      <h3 className="text-xl font-bold mb-3">Recursos Naturais</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(nation.territory.resources).map(([resource, amount]) => (
          <div key={resource} className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 capitalize">
              {resource.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </p>
            <p className="text-lg font-bold">{amount.toLocaleString()} ton</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TerritoryTab;