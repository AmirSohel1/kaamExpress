import React from "react";

const AdminRecentActivities = ({ activities }) => {
  return (
    <div className="bg-[var(--secondary)] rounded-2xl p-6 shadow flex flex-col animate-fade-in-up">
      <span className="text-lg font-semibold mb-4">Recent Activities</span>
      {activities.length > 0 ? (
        <ul className="list-disc pl-5 space-y-1 animate-fade-in-up">
          {activities.map((activity, index) => (
            <li key={index} className="text-base text-cyan-200">
              {activity}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-400 text-sm">No recent activities.</div>
      )}
    </div>
  );
};

export default AdminRecentActivities;
