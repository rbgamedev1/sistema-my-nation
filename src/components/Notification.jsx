import React from 'react';

const Notification = ({ notifications }) => (
  <div className="fixed top-20 right-4 z-50 space-y-2">
    {notifications.map(notif => (
      <div
        key={notif.id}
        className={`px-4 py-3 rounded shadow-lg ${
          notif.type === 'success' ? 'bg-green-500' :
          notif.type === 'error' ? 'bg-red-500' :
          notif.type === 'warning' ? 'bg-yellow-500' :
          'bg-blue-500'
        } text-white animate-slide-in`}
      >
        {notif.message}
      </div>
    ))}
  </div>
);

export default Notification;