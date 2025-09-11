import { Employee, AttendanceRecord, SalaryCalculation } from '../types';
import { storage } from './storage';

const OFF_DAY_RATE = 500; // Off-day work rate

export const calculateSalary = (
  employee: Employee,
  fromDate: string,
  toDate: string
): SalaryCalculation => {
  const attendance = storage.getEmployeeAttendance(employee.id, fromDate, toDate);
  
  const presentDays = attendance.filter(att => att.status === 'present').length;
  const absentDays = attendance.filter(att => att.status === 'absent').length;
  const offDayWorkDays = attendance.filter(att => att.status === 'off-day-work').length;
  
  const regularSalary = presentDays * employee.dailySalary;
  const offDayAmount = offDayWorkDays * OFF_DAY_RATE;
  const totalSalary = regularSalary + offDayAmount;
  
  // Calculate total days in period
  const startDate = new Date(fromDate);
  const endDate = new Date(toDate);
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  return {
    employeeId: employee.employeeId,
    employeeName: employee.name,
    totalDays,
    presentDays,
    absentDays,
    offDayWorkDays,
    regularSalary,
    offDayAmount,
    totalSalary,
    period: `${fromDate} to ${toDate}`
  };
};

export const generateEmployeeSalaryReport = (
  fromDate: string,
  toDate: string
): SalaryCalculation[] => {
  const employees = storage.getEmployees();
  return employees.map(emp => calculateSalary(emp, fromDate, toDate));
};