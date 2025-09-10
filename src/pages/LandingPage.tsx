import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { 
  Bus, 
  Users, 
  MapPin, 
  BarChart3, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight,
  Zap
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "Student Management",
      description: "Comprehensive student database with department-wise organization and bus assignments.",
      color: "text-blue-500"
    },
    {
      icon: Bus,
      title: "Real-time Tracking", 
      description: "Live bus location tracking with route optimization and status updates.",
      color: "text-green-500"
    },
    {
      icon: BarChart3,
      title: "Load Analysis",
      description: "Smart analytics to prevent overcrowding and optimize bus utilization.",
      color: "text-purple-500"
    },
    {
      icon: Shield,
      title: "Role-based Access",
      description: "Secure access control for students, drivers, and administrators.",
      color: "text-orange-500"
    }
  ];

  const benefits = [
    "Prevent bus overcrowding on special days",
    "Data-driven bus allocation decisions",
    "Real-time communication between all stakeholders", 
    "Comprehensive reporting and analytics",
    "Mobile-friendly responsive design",
    "Secure role-based authentication"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-primary rounded-lg p-2">
              <Bus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                PEC-BUS
              </h1>
              <p className="text-xs text-muted-foreground">Management System</p>
            </div>
          </div>
          
          <Button 
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-primary to-primary-hover"
          >
            Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Smart Bus Management for Modern Colleges
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Solve bus overcrowding with data-driven insights. PEC-BUS provides comprehensive tracking, 
              load analysis, and management tools for efficient college transportation.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-primary to-accent text-lg px-8 py-6 h-auto"
            >
              <Zap className="mr-2 h-5 w-5" />
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6 h-auto"
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">The Saturday Problem</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                On special days like Saturdays, when only final-year students attend classes, 
                college buses often run without proper load analysis.
              </p>
              <p>
                This leads to overcrowded buses on some routes while others run nearly empty, 
                creating safety concerns and resource wastage.
              </p>
            </div>
            
            <div className="bg-destructive-light border border-destructive/20 rounded-lg p-4">
              <h4 className="font-semibold text-destructive-foreground mb-2">Current Issues:</h4>
              <ul className="text-sm space-y-1 text-destructive-foreground">
                <li>• Bus allocation based on guesswork</li>
                <li>• Safety risks from overcrowding</li>
                <li>• Inefficient resource utilization</li>
                <li>• Student complaints and dissatisfaction</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Our Solution</h2>
            <p className="text-muted-foreground">
              PEC-BUS provides data-driven insights to optimize bus allocation, 
              prevent overcrowding, and ensure safe, comfortable travel for all students.
            </p>
            
            <div className="bg-success-light border border-success/20 rounded-lg p-4">
              <h4 className="font-semibold text-success-foreground mb-2">Smart Features:</h4>
              <ul className="text-sm space-y-1 text-success-foreground">
                <li>• Real-time load analysis</li>
                <li>• Automated recommendations</li>
                <li>• Route optimization</li>
                <li>• Comprehensive reporting</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need for comprehensive bus management in one integrated system.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Icon className={`h-12 w-12 mx-auto mb-4 ${feature.color}`} />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose PEC-BUS?</h2>
            <p className="text-xl text-muted-foreground">
              Transform your college transportation with intelligent management
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                <span className="text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-accent py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Modernize Your Bus Management?
            </h2>
            <p className="text-xl opacity-90">
              Join the revolution in college transportation management. 
              Start using PEC-BUS today and experience the difference.
            </p>
            <Button 
              size="lg"
              variant="secondary"
              onClick={() => navigate('/login')}
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-primary rounded-lg p-2">
                <Bus className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-primary">PEC-BUS</h3>
                <p className="text-xs text-muted-foreground">Management System</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground">
                © 2024 PEC-BUS Management System. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;