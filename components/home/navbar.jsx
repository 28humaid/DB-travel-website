"use client"

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import NavLink from './navLink';
import LoginButton from './loginButton';
import LoginModal from '../common/loginModal';
import { Brand } from '@/data/data';

const Navbar = ({ setCurrentPage, currentPage }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  const navItems = [
    { label: 'Home', page: 'home' },
    { label: 'About us', page: 'about' },
  ];

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setIsMobileOpen(false); // Close mobile menu on selection
  };

  const handleLoginClick = () => {
    setShowLogin(true);
    setIsMobileOpen(false); // Close mobile menu if open
  };

  return (
    <nav className="bg-red-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand/Logo (left side, hidden on mobile if needed) */}
          <div className="flex-shrink-0">
            <span className="text-xl font-bold text-blue-500">{Brand.brandName}</span>
          </div>

          {/* Desktop Navigation (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                active={currentPage === item.page}
              >
                {item.label}
              </NavLink>
            ))}
            <LoginButton onClick={handleLoginClick} />
          </div>

          {/* Mobile menu button (hamburger) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobile}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (drawer-like, slides down) */}
      {isMobileOpen && (
        <div className="md:hidden bg-gray-100 border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-200 hover:text-gray-900 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {item.label}
              </button>
            ))}
            <div className="px-3 py-2">
              <LoginButton onClick={handleLoginClick} className="w-full" />
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </nav>
  );
};

export default Navbar;