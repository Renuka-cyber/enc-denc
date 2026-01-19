"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Lock, Unlock, Eye, EyeOff, Search, Bell, Settings } from 'lucide-react'; // Added Search, Bell, Settings
import { ThemeToggle } from './ThemeToggle';

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full bg-card shadow-sm border-b border-border/30 dark:border-border/15 py-4 px-6 flex justify-center sticky top-0 z-50">
      <nav className="flex items-center space-x-4 max-w-4xl w-full">
        {/* App Name/Logo */}
        <Link to="/" className="flex items-center font-bold text-xl text-primary dark:text-primary-foreground mr-4">
          HESS
        </Link>

        {/* Navigation Links */}
        <Button asChild variant={isActive('/') ? 'default' : 'ghost'}>
          <Link to="/" className="flex items-center">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Home
          </Link>
        </Button>
        <Button asChild variant={isActive('/encrypt') ? 'default' : 'ghost'}>
          <Link to="/encrypt" className="flex items-center">
            <Lock className="mr-2 h-4 w-4" />
            Encryption
          </Link>
        </Button>
        <Button asChild variant={isActive('/decrypt') ? 'default' : 'ghost'}>
          <Link to="/decrypt" className="flex items-center">
            <Unlock className="mr-2 h-4 w-4" />
            Decryption
          </Link>
        </Button>
        <Button asChild variant={isActive('/steganography/embed') ? 'default' : 'ghost'}>
          <Link to="/steganography/embed" className="flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            Embed Text
          </Link>
        </Button>
        <Button asChild variant={isActive('/steganography/extract') ? 'default' : 'ghost'}>
          <Link to="/steganography/extract" className="flex items-center">
            <EyeOff className="mr-2 h-4 w-4" />
            Extract Text
          </Link>
        </Button>
        
        {/* Quick Actions and Theme Toggle */}
        <div className="ml-auto flex items-center space-x-2"> {/* Added flex items-center and space-x-2 */}
          <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
            <Search className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
            <Bell className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
            <Settings className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Settings</span>
          </Button>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Header;