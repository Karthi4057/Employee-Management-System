export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  aadharNumber: string;
  accountName: string;
  accountNumber: string;
  joiningDate: string;
  position: string;
  department: string;
  dailySalary: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: 'present' | 'absent' | 'off-day-work';
  amount: number;
  notes?: string;
}

export interface SalaryCalculation {
  employeeId: string;
  employeeName: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  offDayWorkDays: number;
  regularSalary: number;
  offDayAmount: number;
  totalSalary: number;
  period: string;
}