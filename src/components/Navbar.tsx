import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

const BRAND = "The 28 Day Standard";

const loggedInLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/tracker", label: "Tracker" },
  { to: "/nutrition", label: "Nutrition" },
  { to: "/photos", label: "Photos" },
  { to: "/settings", label: "Settings" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-op-black/95 backdrop-blur border-b border-op-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <span className="w-2.5 h-2.5 bg-op-orange" />
          <span className="font-display uppercase stencil-tracking text-lg text-op-off-white group-hover:text-op-orange transition-colors">
            {BRAND}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {user ? (
            loggedInLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `mono-label text-xs px-3 py-2 transition-colors ${
                    isActive ? "text-op-orange" : "text-op-off-white-dim hover:text-op-off-white"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))
          ) : (
            <>
              <a href="/#what-is-it" className="mono-label text-xs px-3 py-2 text-op-off-white-dim hover:text-op-off-white">
                The Challenge
              </a>
              <a href="/#weeks" className="mono-label text-xs px-3 py-2 text-op-off-white-dim hover:text-op-off-white">
                The Plan
              </a>
              <NavLink
                to="/pricing"
                className={({ isActive }) =>
                  `mono-label text-xs px-3 py-2 transition-colors ${
                    isActive ? "text-op-orange" : "text-op-off-white-dim hover:text-op-off-white"
                  }`
                }
              >
                Pricing
              </NavLink>
            </>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Log Out
            </Button>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="primary" size="sm">
                  Start the Challenge
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-op-off-white p-2"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M2 5H20M2 11H20M2 17H20" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-op-line bg-op-black px-4 py-4 flex flex-col gap-1">
          {user ? (
            <>
              {loggedInLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `mono-label text-xs px-2 py-3 border-b border-op-line ${
                      isActive ? "text-op-orange" : "text-op-off-white-dim"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <Button variant="ghost" size="sm" className="mt-3" onClick={handleLogout}>
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="mono-label text-xs px-2 py-3 border-b border-op-line text-op-off-white-dim">
                Log In
              </Link>
              <Link to="/pricing" onClick={() => setOpen(false)} className="mono-label text-xs px-2 py-3 border-b border-op-line text-op-off-white-dim">
                Pricing
              </Link>
              <Link to="/pricing" onClick={() => setOpen(false)} className="mt-3">
                <Button variant="primary" fullWidth>
                  Start the Challenge
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
