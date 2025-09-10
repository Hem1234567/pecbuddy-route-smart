import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Bus, User, Shield, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [credentials, setCredentials] = useState({
    identifier: '',
    password: '',
    role: 'student' as UserRole,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await login(credentials);
      
      if (success) {
        toast({
          title: "Login Successful",
          description: `Welcome to PEC-BUS ${credentials.role} dashboard!`,
        });
        
        // Role-based redirection
        switch (credentials.role) {
          case 'student':
            navigate('/dashboard/student');
            break;
          case 'driver':
            navigate('/dashboard/driver');
            break;
          case 'admin':
            navigate('/dashboard/admin');
            break;
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please check your details and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleConfig = {
    student: {
      title: 'Student Login',
      description: 'Enter your roll number to access your bus details',
      placeholder: 'Roll Number (e.g., 21CSE001)',
      icon: User,
    },
    driver: {
      title: 'Driver Login',
      description: 'Enter your driver ID to access your route details',
      placeholder: 'Driver ID (e.g., DR001)',
      icon: Bus,
    },
    admin: {
      title: 'Admin Login',
      description: 'Enter your email to access the management dashboard',
      placeholder: 'Email Address',
      icon: Shield,
    },
  };

  const config = roleConfig[credentials.role];
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-primary rounded-lg p-2">
              <Bus className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PEC-BUS
            </h1>
          </div>
          <p className="text-muted-foreground">
            College Bus Tracking & Management System
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-2">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">{config.title}</CardTitle>
            <CardDescription>{config.description}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs 
              value={credentials.role} 
              onValueChange={(value) => setCredentials({...credentials, role: value as UserRole})}
              className="mb-4"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="driver">Driver</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">
                  {credentials.role === 'admin' ? 'Email' : 
                   credentials.role === 'driver' ? 'Driver ID' : 'Roll Number'}
                </Label>
                <Input
                  id="identifier"
                  type={credentials.role === 'admin' ? 'email' : 'text'}
                  placeholder={config.placeholder}
                  value={credentials.identifier}
                  onChange={(e) => setCredentials({...credentials, identifier: e.target.value})}
                  required
                  className="text-center"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  required
                  className="text-center"
                />
              </div>

              <div className="bg-muted/50 rounded-lg p-3 text-sm text-center">
                <p className="text-muted-foreground">
                  Default password: <span className="font-mono bg-muted px-2 py-1 rounded">admin@0704</span>
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  `Sign In as ${config.title.split(' ')[0]}`
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>© 2024 PEC-BUS Management System</p>
        </div>
      </div>
    </div>
  );
};

export default Login;