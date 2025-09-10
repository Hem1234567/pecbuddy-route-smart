// API endpoints for Google Sheets integration
export const API_ENDPOINTS = {
  ADMIN: 'https://sheetdb.io/api/v1/0f6urid3bwu34',
  ROUTES: 'https://sheetdb.io/api/v1/8qa6al4l8k3m5',
  BUSES: 'https://sheetdb.io/api/v1/kg3nesuu85sc9',
  DRIVERS: 'https://sheetdb.io/api/v1/kkjjnms5jrxvg',
  STUDENTS_CSE: 'https://sheetdb.io/api/v1/dnwg7wehqdtue',
  STUDENTS_CSBS: 'https://sheetdb.io/api/v1/667d72shtkr7r',
};

// Data interfaces
export interface Student {
  'Serial No': number;
  Name: string;
  'Roll No': string;
  Department: string;
  Year: string;
  'Bus No': string;
  'Route Name': string;
  'Route Number': string;
}

export interface Driver {
  'Driver ID': string;
  Name: string;
  Contact: string;
  'Bus No': string;
  Route: string;
  'License No': string;
}

export interface Bus {
  'Bus No': string;
  Capacity: number;
  'Route Name': string;
  'Route Number': string;
  'Driver Assigned': string;
  Status: 'Running' | 'Stopped' | 'Breakdown' | 'Maintenance';
}

export interface Route {
  'Route Number': string;
  'Route Name': string;
  Stops: string;
  Distance: string;
  'Avg Time': string;
}

export interface Admin {
  'Admin ID': string;
  Name: string;
  Email: string;
  Role: string;
}

// Generic fetch function with error handling
async function fetchData<T>(endpoint: string): Promise<T[]> {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return [];
  }
}

// API functions
export const api = {
  // Fetch all students from multiple departments
  async getAllStudents(): Promise<Student[]> {
    try {
      const [cseStudents, csbsStudents] = await Promise.all([
        fetchData<Student>(API_ENDPOINTS.STUDENTS_CSE),
        fetchData<Student>(API_ENDPOINTS.STUDENTS_CSBS),
      ]);
      
      return [...cseStudents, ...csbsStudents];
    } catch (error) {
      console.error('Error fetching all students:', error);
      return [];
    }
  },

  // Fetch students by department
  async getStudentsByDepartment(department: 'CSE' | 'CSBS'): Promise<Student[]> {
    const endpoint = department === 'CSE' ? API_ENDPOINTS.STUDENTS_CSE : API_ENDPOINTS.STUDENTS_CSBS;
    return fetchData<Student>(endpoint);
  },

  // Fetch drivers
  async getDrivers(): Promise<Driver[]> {
    return fetchData<Driver>(API_ENDPOINTS.DRIVERS);
  },

  // Fetch buses
  async getBuses(): Promise<Bus[]> {
    return fetchData<Bus>(API_ENDPOINTS.BUSES);
  },

  // Fetch routes
  async getRoutes(): Promise<Route[]> {
    return fetchData<Route>(API_ENDPOINTS.ROUTES);
  },

  // Fetch admin data
  async getAdmins(): Promise<Admin[]> {
    return fetchData<Admin>(API_ENDPOINTS.ADMIN);
  },

  // Get student by roll number
  async getStudentByRollNo(rollNo: string): Promise<Student | null> {
    const students = await this.getAllStudents();
    return students.find(student => student['Roll No'] === rollNo) || null;
  },

  // Get driver by ID
  async getDriverById(driverId: string): Promise<Driver | null> {
    const drivers = await this.getDrivers();
    return drivers.find(driver => driver['Driver ID'] === driverId) || null;
  },

  // Get bus load analysis
  async getBusLoadAnalysis(filterYear?: string): Promise<any[]> {
    const [students, buses] = await Promise.all([
      this.getAllStudents(),
      this.getBuses(),
    ]);

    const filteredStudents = filterYear 
      ? students.filter(student => student.Year === filterYear)
      : students;

    // Group students by bus number
    const studentsByBus = filteredStudents.reduce((acc, student) => {
      const busNo = student['Bus No'];
      if (!acc[busNo]) acc[busNo] = [];
      acc[busNo].push(student);
      return acc;
    }, {} as Record<string, Student[]>);

    // Analyze each bus
    return buses.map(bus => {
      const assignedStudents = studentsByBus[bus['Bus No']] || [];
      const capacity = bus.Capacity;
      const occupancy = assignedStudents.length;
      const percentage = capacity > 0 ? (occupancy / capacity) * 100 : 0;

      let status: 'ok' | 'warning' | 'error' = 'ok';
      let recommendation = '';

      if (percentage > 90) {
        status = 'error';
        recommendation = 'Extra bus required - Overcrowded';
      } else if (percentage < 30) {
        status = 'warning';
        recommendation = 'Bus can be reduced - Underutilized';
      } else {
        status = 'ok';
        recommendation = 'Optimal capacity';
      }

      return {
        busNo: bus['Bus No'],
        capacity,
        assignedStudents: occupancy,
        percentage: Math.round(percentage),
        status,
        recommendation,
        route: bus['Route Name'],
        driver: bus['Driver Assigned'],
      };
    });
  },
};