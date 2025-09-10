import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { api, Student, Driver, Bus, Route } from '@/services/api';
import { 
  Users, 
  Bus as BusIcon, 
  MapPin, 
  Download, 
  Filter,
  Search,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loadAnalysis, setLoadAnalysis] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [filters, setFilters] = useState({
    department: 'all',
    year: 'all',
    route: 'all',
    busNo: 'all',
    search: ''
  });
  
  // Load analysis filters
  const [analysisFilters, setAnalysisFilters] = useState({
    year: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (analysisFilters.year) {
      loadBusAnalysis();
    }
  }, [analysisFilters]);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      const [studentsData, driversData, busesData, routesData] = await Promise.all([
        api.getAllStudents(),
        api.getDrivers(),
        api.getBuses(),
        api.getRoutes()
      ]);
      
      setStudents(studentsData);
      setDrivers(driversData);
      setBuses(busesData);
      setRoutes(routesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadBusAnalysis = async () => {
    try {
      const analysis = await api.getBusLoadAnalysis(analysisFilters.year);
      setLoadAnalysis(analysis);
    } catch (error) {
      console.error('Error loading bus analysis:', error);
    }
  };

  const filteredStudents = students.filter(student => {
    return (
      (filters.department === 'all' || student.Department === filters.department) &&
      (filters.year === 'all' || student.Year === filters.year) &&
      (filters.route === 'all' || student['Route Name'] === filters.route) &&
      (filters.busNo === 'all' || student['Bus No'] === filters.busNo) &&
      (filters.search === '' || 
       student.Name.toLowerCase().includes(filters.search.toLowerCase()) ||
       student['Roll No'].toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  const exportData = (data: any[], filename: string) => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(data[0]).join(",") + "\n" +
      data.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: `${filename} has been exported successfully.`,
    });
  };

  const getUniqueValues = (array: any[], key: string) => {
    return [...new Set(array.map(item => item[key]))].filter(Boolean);
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Admin Dashboard" subtitle="Loading management data...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Admin Dashboard" 
      subtitle="Bus Management & Analytics"
    >
      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all departments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Buses</CardTitle>
            <BusIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{buses.length}</div>
            <p className="text-xs text-muted-foreground">
              {buses.filter(b => b.Status === 'Running').length} currently running
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{drivers.length}</div>
            <p className="text-xs text-muted-foreground">
              Licensed drivers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Routes</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{routes.length}</div>
            <p className="text-xs text-muted-foreground">
              Active routes
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="buses">Buses</TabsTrigger>
          <TabsTrigger value="analysis">Load Analysis</TabsTrigger>
        </TabsList>

        {/* Students Management */}
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Student Management
                </CardTitle>
                <Button onClick={() => exportData(filteredStudents, 'students')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="grid gap-4 md:grid-cols-5 mb-4">
                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Name or Roll No"
                      value={filters.search}
                      onChange={(e) => setFilters({...filters, search: e.target.value})}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Department</Label>
                  <Select value={filters.department} onValueChange={(value) => setFilters({...filters, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {getUniqueValues(students, 'Department').map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Year</Label>
                  <Select value={filters.year} onValueChange={(value) => setFilters({...filters, year: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {getUniqueValues(students, 'Year').map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Route</Label>
                  <Select value={filters.route} onValueChange={(value) => setFilters({...filters, route: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Routes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Routes</SelectItem>
                      {getUniqueValues(students, 'Route Name').map(route => (
                        <SelectItem key={route} value={route}>{route}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Bus No</Label>
                  <Select value={filters.busNo} onValueChange={(value) => setFilters({...filters, busNo: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Buses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Buses</SelectItem>
                      {getUniqueValues(students, 'Bus No').map(busNo => (
                        <SelectItem key={busNo} value={busNo}>{busNo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Students Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Bus No</TableHead>
                      <TableHead>Route</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono">{student['Roll No']}</TableCell>
                        <TableCell className="font-medium">{student.Name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{student.Department}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{student.Year}</Badge>
                        </TableCell>
                        <TableCell className="font-mono">{student['Bus No']}</TableCell>
                        <TableCell>{student['Route Name']}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                Showing {filteredStudents.length} of {students.length} students
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bus Load Analysis */}
        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Bus Load Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Analysis Filters */}
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div>
                  <Label>Filter by Year</Label>
                  <Select value={analysisFilters.year} onValueChange={(value) => setAnalysisFilters({...analysisFilters, year: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {getUniqueValues(students, 'Year').map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={analysisFilters.date}
                    onChange={(e) => setAnalysisFilters({...analysisFilters, date: e.target.value})}
                  />
                </div>
                
                <div className="flex items-end">
                  <Button onClick={() => exportData(loadAnalysis, 'bus-load-analysis')}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Analysis
                  </Button>
                </div>
              </div>

              {/* Analysis Results */}
              {loadAnalysis.length > 0 && (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bus No</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Assigned Students</TableHead>
                        <TableHead>Occupancy %</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Recommendation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadAnalysis.map((analysis, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono">{analysis.busNo}</TableCell>
                          <TableCell>{analysis.capacity}</TableCell>
                          <TableCell>{analysis.assignedStudents}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{analysis.percentage}%</span>
                              <div className="w-16 bg-muted rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    analysis.status === 'error' ? 'bg-destructive' :
                                    analysis.status === 'warning' ? 'bg-warning' : 'bg-success'
                                  }`}
                                  style={{ width: `${Math.min(analysis.percentage, 100)}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={analysis.status} />
                          </TableCell>
                          <TableCell>{analysis.route}</TableCell>
                          <TableCell className="text-sm">{analysis.recommendation}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Drivers Management */}
        <TabsContent value="drivers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Driver Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Driver ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Bus No</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>License</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drivers.map((driver, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono">{driver['Driver ID']}</TableCell>
                        <TableCell className="font-medium">{driver.Name}</TableCell>
                        <TableCell>{driver.Contact}</TableCell>
                        <TableCell className="font-mono">{driver['Bus No']}</TableCell>
                        <TableCell>{driver.Route}</TableCell>
                        <TableCell className="font-mono text-xs">{driver['License No']}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Buses Management */}
        <TabsContent value="buses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BusIcon className="h-5 w-5" />
                Bus Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bus No</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {buses.map((bus, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono">{bus['Bus No']}</TableCell>
                        <TableCell>{bus.Capacity}</TableCell>
                        <TableCell>{bus['Route Name']}</TableCell>
                        <TableCell>{bus['Driver Assigned']}</TableCell>
                        <TableCell>
                          <StatusBadge 
                            status={bus.Status === 'Running' ? 'running' : 
                                    bus.Status === 'Stopped' ? 'stopped' : 'breakdown'} 
                            text={bus.Status}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminDashboard;