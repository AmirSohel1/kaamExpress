import React from "react";

const AdminQuickActions = ({ quickActions, onNavigate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-10 bg-[var(--primary)] mb-8 animate-fade-in-up">
      {quickActions.map((action, i) => (
        <button
          key={action.label}
          className={`
            flex flex-col items-center justify-center gap-2 
            rounded-xl p-6 shadow transition 
            bg-[var(--card)] hover:bg-[var(--accent)]/10 ${action.bg}
            text-white animate-fade-in-up
          `}
          style={{ animationDelay: `${i * 0.1 + 0.2}s` }}
          onClick={() => onNavigate(action.to)}
        >
          <div className="text-2xl">{action.icon}</div>
          <span className="font-semibold mt-2">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default AdminQuickActions;
