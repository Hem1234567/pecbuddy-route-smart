import React from 'react';
import { Bus } from 'lucide-react';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import ProfileDropdown from '@/components/profile/ProfileDropdown';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title, subtitle }) => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 sticky top-0 z-50">
        <div className="flex h-16 items-center px-4 md:px-6">
          {/* Logo */}
          <div className="flex items-center space-x-2 mr-6">
            <img src="/image (1).png" alt="Logo" className="h-10 w-auto" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-primary">PEC-BUS</h1>
              <p className="text-xs text-muted-foreground">Management System</p>
            </div>
          </div>

          {/* Title */}
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{title}</h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <NotificationDropdown />

            {/* User Profile */}
            <ProfileDropdown />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 space-y-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;