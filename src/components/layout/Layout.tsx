import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { PageTransition } from '../ui/PageTransition';
import { useThemeStore } from '../../store/theme';
import { cn } from '../../lib/utils';

export function Layout() {
  const { isDark, setTheme } = useThemeStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Force dark mode for minimalist design
  React.useEffect(() => {
    if (!isDark) {
      setTheme(true);
    }
    document.documentElement.classList.add('dark');
  }, [isDark, setTheme]);

  const handleMenuClick = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && !(event.target as Element).closest('.mobile-menu')) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="lg:pl-64">
        <Header onMenuClick={handleMenuClick} />
        <main className="py-8 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </main>
      </div>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
            onClick={closeMobileMenu}
          />
          
          {/* Mobile Menu Panel */}
          <div 
            className={cn(
              "mobile-menu relative flex flex-col w-80 max-w-xs bg-dark-900 border-r border-dark-800 shadow-2xl transform transition-transform duration-300 ease-in-out",
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <Sidebar onItemClick={closeMobileMenu} isMobile />
          </div>
        </div>
      )}
    </div>
  );
}