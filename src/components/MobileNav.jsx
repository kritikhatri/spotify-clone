import { NavLink } from "react-router-dom";
import { FiHome, FiSearch, FiBookOpen } from "react-icons/fi";
import "./MobileNav.css";

const links = [
  { to: "/", label: "Home", icon: <FiHome />, end: true },
  { to: "/search", label: "Search", icon: <FiSearch /> },
  { to: "/library", label: "Library", icon: <FiBookOpen /> },
];

const MobileNav = () => (
  <nav className="mobile-nav" aria-label="Main">
    {links.map(({ to, label, icon, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        className={({ isActive }) => `mobile-nav-link${isActive ? " active" : ""}`}
      >
        {icon}
        <span>{label}</span>
      </NavLink>
    ))}
  </nav>
);

export default MobileNav;
