import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/ui/status-badge';
import { useAuth } from '@/contexts/AuthContext';
import { api, Student, Driver, Bus } from '@/services/api';
import { 
  MapPin, 
  Bus as BusIcon, 
  User, 
  Phone, 
  Clock, 
  Route, 
  MessageSquare,
  Navigation,
  Calendar,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PreLoader from '../PreLoader';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [driverData, setDriverData] = useState<Driver | null>(null);
  const [busData, setBusData] = useState<Bus | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStudentInfo();
  }, [user]);

  const loadStudentInfo = async () => {
    if (!user?.rollNo) return;

    try {
      setIsLoading(true);
      const student = await api.getStudentByRollNo(user.rollNo);
      
      if (student) {
        setStudentData(student);
        
        // Load related driver and bus data
        const [drivers, buses] = await Promise.all([
          api.getDrivers(),
          api.getBuses()
        ]);
        
        const assignedDriver = drivers.find(d => d['Bus No'] === student['Bus No']);
        const assignedBus = buses.find(b => b['Bus No'] === student['Bus No']);
        
        setDriverData(assignedDriver || null);
        setBusData(assignedBus || null);
      } else {
        toast({
          title: "Student Not Found",
          description: "No student record found for the provided roll number.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading student info:', error);
      toast({
        title: "Error",
        description: "Failed to load student information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackSubmit = () => {
    if (!feedback.trim()) return;
    
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback. It has been recorded.",
    });
    setFeedback('');
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Student Dashboard" subtitle="Loading your bus information...">
        <div className="flex items-center justify-center h-64">
          <PreLoader/>
        </div>
      </DashboardLayout>
    );
  }

  if (!studentData) {
    return (
      <DashboardLayout title="Student Dashboard" subtitle="Student information not found">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              No student record found for roll number: {user?.rollNo}
            </p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Student Dashboard" 
      subtitle={`Welcome ${studentData.Name}`}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Student Info */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-lg font-semibold">{studentData.Name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Roll Number</p>
              <p className="font-mono">{studentData['Roll No']}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Department</p>
                <Badge variant="outline">{studentData.Department}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Year</p>
                <Badge variant="outline">{studentData.Year}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bus Information */}
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
              <p className="text-2xl font-bold text-primary">{studentData['Bus No']}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Route</p>
              <p className="font-semibold">{studentData['Route Name']}</p>
              <p className="text-sm text-muted-foreground">Route #{studentData['Route Number']}</p>
            </div>
            {busData && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <StatusBadge 
                  status={busData.Status === 'Running' ? 'running' : 
                          busData.Status === 'Stopped' ? 'stopped' : 'breakdown'} 
                  text={busData.Status}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Driver Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Driver Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {driverData ? (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Driver Name</p>
                  <p className="font-semibold">{driverData.Name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contact</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="font-mono">{driverData.Contact}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">License Number</p>
                  <p className="font-mono text-sm">{driverData['License No']}</p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Driver information not available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Live Tracking */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Live Bus Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 rounded-lg p-8 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">Bus Tracking Map</p>
              <p className="text-muted-foreground mb-4">
                Real-time location tracking for Bus {studentData['Bus No']}
              </p>
              <Button className="bg-gradient-to-r from-primary to-accent">
                <Navigation className="mr-2 h-4 w-4" />
                Track Bus Live
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card className="md:col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="bg-warning-light border border-warning/20 rounded-lg p-3">
                <p className="text-sm font-medium text-warning-foreground">Saturday Schedule</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Limited bus service on Saturdays. Only final-year student buses will operate.
                </p>
              </div>
              <div className="bg-success-light border border-success/20 rounded-lg p-3">
                <p className="text-sm font-medium text-success-foreground">Regular Service</p>
                <p className="text-sm text-muted-foreground mt-1">
                  All bus routes are running on schedule today.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Share your feedback about bus service..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
            <Button 
              onClick={handleFeedbackSubmit}
              className="w-full"
              disabled={!feedback.trim()}
            >
              Submit Feedback
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;