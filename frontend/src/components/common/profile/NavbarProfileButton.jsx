import React from "react";
import Avatar from "react-avatar";

const NavbarProfileButton = React.forwardRef(({ profile, onClick }, ref) => (
  <button
    className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[var(--secondary)] hover:bg-[var(--card)] transition focus:outline-none border border-[var(--accent)]/20 min-w-0"
    onClick={onClick}
    ref={ref}
    style={{ minWidth: 0 }}
  >
    <Avatar
      name={profile.name}
      size="26"
      round={true}
      fgColor="#fff"
      className="shadow"
    />
    <div className="hidden md:flex flex-col items-start text-left max-w-[80px] truncate">
      <span className="font-semibold text-white leading-tight text-xs truncate">
        {profile.name}
      </span>
      <span className="text-[10px] text-gray-400 truncate">
        {profile.email}
      </span>
    </div>
  </button>
));

export default NavbarProfileButton;
