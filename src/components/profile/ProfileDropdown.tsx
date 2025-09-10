import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { User, LogOut, Settings, HelpCircle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const ProfileDropdown: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: "Logged out successfully",
      description: "You have been signed out of your account.",
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-500';
      case 'driver': return 'bg-green-500';
      case 'admin': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'student': return { icon: User, label: 'Student' };
      case 'driver': return { icon: Shield, label: 'Driver' };
      case 'admin': return { icon: Shield, label: 'Administrator' };
      default: return { icon: User, label: 'User' };
    }
  };

  const roleInfo = getRoleBadge(user?.role || '');
  const RoleIcon = roleInfo.icon;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarFallback className={`${getRoleColor(user?.role || '')} text-white`}>
                {user ? getInitials(user.name) : 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-64" align="end" forceMount>
          <div className="flex flex-col space-y-2 p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className={`${getRoleColor(user?.role || '')} text-white`}>
                  {user ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <RoleIcon className="h-3 w-3 text-muted-foreground" />
                  <p className="text-xs leading-none text-muted-foreground">
                    {roleInfo.label}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-1 text-xs text-muted-foreground">
              {user?.rollNo && (
                <p>Roll No: <span className="font-mono">{user.rollNo}</span></p>
              )}
              {user?.driverId && (
                <p>Driver ID: <span className="font-mono">{user.driverId}</span></p>
              )}
              {user?.email && (
                <p>Email: {user.email}</p>
              )}
              {user?.department && (
                <p>Department: {user.department}</p>
              )}
              {user?.year && (
                <p>Year: {user.year}</p>
              )}
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setShowProfile(true)}>
            <User className="mr-2 h-4 w-4" />
            <span>View Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => toast({ title: "Settings", description: "Settings panel coming soon!" })}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => toast({ title: "Help", description: "Help documentation coming soon!" })}>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleLogout} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Details Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Profile Details</DialogTitle>
            <DialogDescription>
              Your account information and role details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className={`${getRoleColor(user?.role || '')} text-white text-xl`}>
                  {user ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{user?.name}</h3>
                <div className="flex items-center gap-2">
                  <RoleIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{roleInfo.label}</span>
                </div>
              </div>
            </div>
            
            <div className="grid gap-4">
              {user?.rollNo && (
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-sm font-medium">Roll Number:</span>
                  <span className="col-span-2 font-mono text-sm">{user.rollNo}</span>
                </div>
              )}
              {user?.driverId && (
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-sm font-medium">Driver ID:</span>
                  <span className="col-span-2 font-mono text-sm">{user.driverId}</span>
                </div>
              )}
              {user?.email && (
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-sm font-medium">Email:</span>
                  <span className="col-span-2 text-sm">{user.email}</span>
                </div>
              )}
              {user?.department && (
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-sm font-medium">Department:</span>
                  <span className="col-span-2 text-sm">{user.department}</span>
                </div>
              )}
              {user?.year && (
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-sm font-medium">Year:</span>
                  <span className="col-span-2 text-sm">{user.year}</span>
                </div>
              )}
              {user?.busNo && (
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-sm font-medium">Bus Number:</span>
                  <span className="col-span-2 font-mono text-sm">{user.busNo}</span>
                </div>
              )}
              {user?.routeName && (
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-sm font-medium">Route:</span>
                  <span className="col-span-2 text-sm">{user.routeName}</span>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileDropdown;