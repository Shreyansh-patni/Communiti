import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  MessageCircle, 
  Settings,
  TrendingUp,
  Search,
  X,
  LogIn,
  LogOut
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/auth';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Groups', href: '/groups', icon: Users },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Chat', href: '/chat', icon: MessageCircle },
  { name: 'Trending', href: '/trending', icon: TrendingUp },
];

interface SidebarProps {
  onItemClick?: () => void;
  isMobile?: boolean;
}

export function Sidebar({ onItemClick, isMobile = false }: SidebarProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleNavClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  const handleLogin = () => {
    navigate('/login');
    handleNavClick();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleNavClick();
  };

  const handleProfileClick = () => {
    if (user) {
      navigate(`/profile/${user.username}`);
      handleNavClick();
    }
  };

  return (
    <div className={cn(
      "flex flex-col bg-dark-900",
      isMobile 
        ? "h-full w-full" 
        : "hidden lg:flex lg:w-64 lg:fixed lg:inset-y-0 z-30 h-screen border-r border-dark-800"
    )}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between p-6 border-b border-dark-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">@</span>
            </div>
            <span className="text-xl font-bold text-white">Communiti</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onItemClick}
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}
      
      {/* User Profile - Simplified */}
      {isAuthenticated && user && (
        <div className="p-6">
          <div 
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-800/50 cursor-pointer transition-colors group"
            onClick={handleProfileClick}
          >
            <Avatar
              src={user.avatar}
              alt={user.displayName}
              size="sm"
              fallback={user.displayName?.charAt(0)}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.displayName}
              </p>
              <p className="text-xs text-dark-400 truncate">
                @{user.username}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Navigation - Simplified */}
      <div className="flex-1 px-6">
        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/'}
              onClick={handleNavClick}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary-500/10 text-primary-400'
                    : 'text-dark-300 hover:bg-dark-800/50 hover:text-white'
                )
              }
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      
      {/* Bottom Actions - Simplified */}
      <div className="p-6 border-t border-dark-800">
        {isAuthenticated ? (
          <div className="space-y-1">
            <NavLink
              to="/settings"
              onClick={handleNavClick}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary-500/10 text-primary-400'
                    : 'text-dark-300 hover:bg-dark-800/50 hover:text-white'
                )
              }
            >
              <Settings className="mr-3 h-4 w-4" />
              Settings
            </NavLink>
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-dark-300 hover:bg-dark-800/50 hover:text-white"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={handleLogin}
              className="flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-dark-300 hover:bg-dark-800/50 hover:text-white"
            >
              <LogIn className="mr-3 h-4 w-4" />
              Login
            </button>
            
            <Button
              onClick={() => {
                navigate('/signup');
                handleNavClick();
              }}
              className="w-full justify-start text-sm"
              size="sm"
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}