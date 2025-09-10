import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { useAuth } from '@/contexts/AuthContext';
import { api, Driver, Bus, Route } from '@/services/api';
import { 
  Bus as BusIcon, 
  MapPin, 
  Play, 
  Square, 
  AlertTriangle, 
  Navigation,
  Users,
  Clock,
  Loader2,
  Phone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DriverDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [driverData, setDriverData] = useState<Driver | null>(null);
  const [busData, setBusData] = useState<Bus | null>(null);
  const [routeData, setRouteData] = useState<Route | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tripStatus, setTripStatus] = useState<'idle' | 'started' | 'completed'>('idle');

  useEffect(() => {
    loadDriverInfo();
  }, [user]);

  const loadDriverInfo = async () => {
    if (!user?.driverId) return;

    try {
      setIsLoading(true);
      const driver = await api.getDriverById(user.driverId);
      
      if (driver) {
        setDriverData(driver);
        
        // Load related bus and route data
        const [buses, routes] = await Promise.all([
          api.getBuses(),
          api.getRoutes()
        ]);
        
        const assignedBus = buses.find(b => b['Bus No'] === driver['Bus No']);
        const assignedRoute = routes.find(r => r['Route Name'] === driver.Route);
        
        setBusData(assignedBus || null);
        setRouteData(assignedRoute || null);
      } else {
        toast({
          title: "Driver Not Found",
          description: "No driver record found for the provided driver ID.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading driver info:', error);
      toast({
        title: "Error",
        description: "Failed to load driver information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTrip = () => {
    setTripStatus('started');
    toast({
      title: "Trip Started",
      description: "Your trip has been marked as started. Drive safely!",
    });
  };

  const handleEndTrip = () => {
    setTripStatus('completed');
    toast({
      title: "Trip Completed",
      description: "Your trip has been marked as completed.",
    });
  };

  const handleEmergencyAlert = () => {
    toast({
      title: "Emergency Alert Sent",
      description: "Emergency notification has been sent to the admin team.",
      variant: "destructive",
    });
  };

  const updateBusStatus = (status: Bus['Status']) => {
    if (busData) {
      setBusData({ ...busData, Status: status });
      toast({
        title: "Status Updated",
        description: `Bus status updated to ${status}`,
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Driver Dashboard" subtitle="Loading your route information...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!driverData) {
    return (
      <DashboardLayout title="Driver Dashboard" subtitle="Driver information not found">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              No driver record found for driver ID: {user?.driverId}
            </p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Driver Dashboard" 
      subtitle={`Welcome ${driverData.Name}`}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Driver Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BusIcon className="h-5 w-5" />
              Driver Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-lg font-semibold">{driverData.Name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Driver ID</p>
              <p className="font-mono">{driverData['Driver ID']}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contact</p>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="font-mono">{driverData.Contact}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">License</p>
              <p className="font-mono text-sm">{driverData['License No']}</p>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Bus */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BusIcon className="h-5 w-5" />
              Assigned Bus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bus Number</p>
              <p className="text-2xl font-bold text-primary">{driverData['Bus No']}</p>
            </div>
            {busData && (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Capacity</p>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <p className="font-semibold">{busData.Capacity} passengers</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Status</p>
                  <StatusBadge 
                    status={busData.Status === 'Running' ? 'running' : 
                            busData.Status === 'Stopped' ? 'stopped' : 'breakdown'} 
                    text={busData.Status}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Route Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Route Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Route</p>
              <p className="font-semibold">{driverData.Route}</p>
            </div>
            {routeData && (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Distance</p>
                  <p className="font-semibold">{routeData.Distance}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Time</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="font-semibold">{routeData['Avg Time']}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Stops</p>
                  <p className="text-sm text-muted-foreground">{routeData.Stops}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Trip Controls */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Trip Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleStartTrip}
                disabled={tripStatus === 'started' || tripStatus === 'completed'}
                className="flex-1 bg-gradient-to-r from-success to-success hover:from-success/90 hover:to-success/90"
              >
                <Play className="mr-2 h-4 w-4" />
                {tripStatus === 'idle' ? 'Start Trip' : 'Trip Started'}
              </Button>
              
              <Button 
                onClick={handleEndTrip}
                disabled={tripStatus !== 'started'}
                variant="outline"
                className="flex-1"
              >
                <Square className="mr-2 h-4 w-4" />
                End Trip
              </Button>
              
              <Button 
                onClick={handleEmergencyAlert}
                variant="destructive"
                className="flex-1"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Emergency Alert
              </Button>
            </div>
            
            {tripStatus !== 'idle' && (
              <div className="mt-4 p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium">
                  Current Status: 
                  <Badge variant={tripStatus === 'started' ? 'default' : 'secondary'} className="ml-2">
                    {tripStatus === 'started' ? 'Trip in Progress' : 'Trip Completed'}
                  </Badge>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bus Status Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Update Bus Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                onClick={() => updateBusStatus('Running')}
                className="w-full justify-start"
                variant={busData?.Status === 'Running' ? 'default' : 'outline'}
              >
                <Play className="mr-2 h-4 w-4" />
                Running
              </Button>
              <Button 
                onClick={() => updateBusStatus('Stopped')}
                className="w-full justify-start"
                variant={busData?.Status === 'Stopped' ? 'default' : 'outline'}
              >
                <Square className="mr-2 h-4 w-4" />
                Stopped
              </Button>
              <Button 
                onClick={() => updateBusStatus('Breakdown')}
                className="w-full justify-start"
                variant={busData?.Status === 'Breakdown' ? 'destructive' : 'outline'}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Breakdown
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Route Map */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Route Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 rounded-lg p-8 text-center">
              <Navigation className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">Interactive Route Map</p>
              <p className="text-muted-foreground mb-4">
                View your route, stops, and real-time navigation
              </p>
              <Button className="bg-gradient-to-r from-primary to-accent">
                <Navigation className="mr-2 h-4 w-4" />
                Open Route Navigation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DriverDashboard;