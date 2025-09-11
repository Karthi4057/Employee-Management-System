import { Employee, AttendanceRecord } from '../types';

const EMPLOYEES_KEY = 'employees';
const ATTENDANCE_KEY = 'attendance';

export const storage = {
  // Employee storage
  getEmployees(): Employee[] {
    const data = localStorage.getItem(EMPLOYEES_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveEmployees(employees: Employee[]): void {
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
  },

  addEmployee(employee: Employee): void {
    const employees = this.getEmployees();
    employees.push(employee);
    this.saveEmployees(employees);
  },

  updateEmployee(updatedEmployee: Employee): void {
    const employees = this.getEmployees();
    const index = employees.findIndex(emp => emp.id === updatedEmployee.id);
    if (index !== -1) {
      employees[index] = updatedEmployee;
      this.saveEmployees(employees);
    }
  },

  deleteEmployee(employeeId: string): void {
    const employees = this.getEmployees();
    const filteredEmployees = employees.filter(emp => emp.id !== employeeId);
    this.saveEmployees(filteredEmployees);
    
    // Also delete attendance records for this employee
    const attendance = this.getAttendance();
    const filteredAttendance = attendance.filter(att => att.employeeId !== employeeId);
    this.saveAttendance(filteredAttendance);
  },

  // Attendance storage
  getAttendance(): AttendanceRecord[] {
    const data = localStorage.getItem(ATTENDANCE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveAttendance(attendance: AttendanceRecord[]): void {
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attendance));
  },

  addAttendanceRecord(record: AttendanceRecord): void {
    const attendance = this.getAttendance();
    
    // Check if record already exists for this employee and date
    const existingIndex = attendance.findIndex(
      att => att.employeeId === record.employeeId && att.date === record.date
    );
    
    if (existingIndex !== -1) {
      attendance[existingIndex] = record;
    } else {
      attendance.push(record);
    }
    
    this.saveAttendance(attendance);
  },

  getEmployeeAttendance(employeeId: string, fromDate?: string, toDate?: string): AttendanceRecord[] {
    const attendance = this.getAttendance();
    let filtered = attendance.filter(att => att.employeeId === employeeId);
    
    if (fromDate) {
      filtered = filtered.filter(att => att.date >= fromDate);
    }
    
    if (toDate) {
      filtered = filtered.filter(att => att.date <= toDate);
    }
    
    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
};