"use client"

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X } from 'lucide-react';
import LoginModal from '../common/loginModal';
import { Brand } from '@/data/data';
import LoginButton from '../home/loginButton';
import NavLink from '../home/navLink';
import LogoutButton from '../profile/logoutButton';
import LogoutConfirmDialog from '../profile/logoutConfirmDialog';

const Navbar = ({ setCurrentPage, currentPage,status }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  const navItems = status === 'authenticated' ? [
    { label: 'Bookings', page: 'bookings' },
    { label: 'Refunds', page: 'refunds' },
  ] : [
    { label: 'Home', page: 'home' },
    { label: 'About us', page: 'about' },
  ];

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setIsMobileOpen(false);
  };

  const handleLoginClick = () => {
    setShowLogin(true);
    setIsMobileOpen(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  // Skeleton loader for navigation items and button
  const renderSkeleton = () => (
    <>
      {/* Desktop skeleton */}
      <div className="hidden md:flex items-center space-x-8">
        <div className="h-10 w-20 bg-gray-300 rounded animate-pulse" />
        <div className="h-10 w-20 bg-gray-300 rounded animate-pulse" />
        <div className="h-10 w-20 bg-gray-300 rounded animate-pulse" />
      </div>
      {/* Mobile skeleton (when menu is open) */}
      {isMobileOpen && (
        <div className="md:hidden bg-gray-100 border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <div className="h-8 w-full bg-gray-300 rounded animate-pulse" />
            <div className="h-8 w-full bg-gray-300 rounded animate-pulse" />
            <div className="px-3 py-2">
              <div className="h-10 w-full bg-gray-300 rounded animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <nav className="bg-red-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand/Logo (left side, hidden on mobile if needed) */}
          <div className="flex-shrink-0">
            <span className="text-xl font-bold text-blue-500">{Brand.brandName}</span>
          </div>

          {/* Desktop Navigation (hidden on mobile) */}
          {status === 'loading' ? (
            renderSkeleton()
          ) : (
            <>
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
                {status === 'authenticated' ? (
                  <LogoutButton onClick={handleLogoutClick} />
                ) : (
                  <LoginButton onClick={handleLoginClick} />
                )}
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
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu (drawer-like, slides down) */}
      {status !== 'loading' && isMobileOpen && (
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
              {status === 'authenticated' ? (
                <LogoutButton
                  onClick={handleLogoutClick}
                  className="w-full"
                />
              ) : (
                <LoginButton onClick={handleLoginClick} className="w-full" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <LogoutConfirmDialog
          onConfirm={() => signOut({ callbackUrl: '/' })}
          onCancel={() => setShowLogoutDialog(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;