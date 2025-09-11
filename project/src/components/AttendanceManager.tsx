import React, { useState, useEffect } from 'react';
import { Employee, AttendanceRecord } from '../types';
import { storage } from '../utils/storage';
import { Calendar, Clock, Users, CheckCircle, XCircle, Coffee } from 'lucide-react';

interface AttendanceManagerProps {
  employees: Employee[];
}

export const AttendanceManager: React.FC<AttendanceManagerProps> = ({ employees }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<{ [employeeId: string]: AttendanceRecord }>({});

  useEffect(() => {
    loadAttendance();
  }, [selectedDate, employees]);

  const loadAttendance = () => {
    const attendanceData: { [employeeId: string]: AttendanceRecord } = {};
    
    employees.forEach(employee => {
      const existingRecord = storage.getAttendance().find(
        att => att.employeeId === employee.id && att.date === selectedDate
      );
      
      if (existingRecord) {
        attendanceData[employee.id] = existingRecord;
      } else {
        attendanceData[employee.id] = {
          id: `${employee.id}-${selectedDate}`,
          employeeId: employee.id,
          date: selectedDate,
          status: 'absent',
          amount: 0
        };
      }
    });
    
    setAttendance(attendanceData);
  };

  const updateAttendance = (employeeId: string, status: 'present' | 'absent' | 'off-day-work') => {
    const employee = employees.find(emp => emp.id === employeeId);
    const amount = status === 'present' 
      ? Number(employee?.dailySalary || 1000) 
      : status === 'off-day-work' ? 500 : 0;
    
    const record: AttendanceRecord = {
      id: `${employeeId}-${selectedDate}`,
      employeeId,
      date: selectedDate,
      status,
      amount
    };
    
    storage.addAttendanceRecord(record);
    
    setAttendance(prev => ({
      ...prev,
      [employeeId]: record
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-200';
      case 'off-day-work': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4" />;
      case 'off-day-work': return <Coffee className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  const todayStats = {
    present: Object.values(attendance).filter(att => att.status === 'present').length,
    absent: Object.values(attendance).filter(att => att.status === 'absent').length,
    offDayWork: Object.values(attendance).filter(att => att.status === 'off-day-work').length,
    totalAmount: Object.values(attendance).reduce((sum, att) => sum + Number(att.amount || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header with Date Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Attendance Management
          </h2>
          
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>

        {/* Daily Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Present</p>
                <p className="text-2xl font-bold text-green-800">{todayStats.present}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Absent</p>
                <p className="text-2xl font-bold text-red-800">{todayStats.absent}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Off-Day Work</p>
                <p className="text-2xl font-bold text-blue-800">{todayStats.offDayWork}</p>
              </div>
              <Coffee className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Total Amount</p>
                <p className="text-2xl font-bold text-yellow-800">₹{todayStats.totalAmount.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Employee Attendance List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Employee Attendance - {new Date(selectedDate).toLocaleDateString()}
        </h3>

        {employees.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No employees available. Please add employees first.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {employees.map(employee => {
              const currentAttendance = attendance[employee.id];
              return (
                <div key={employee.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-800">{employee.name}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(currentAttendance?.status || 'absent')}`}>
                          {getStatusIcon(currentAttendance?.status || 'absent')}
                          {currentAttendance?.status?.replace('-', ' ').toUpperCase() || 'ABSENT'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="mr-4">ID: {employee.employeeId}</span>
                        <span className="mr-4">Department: {employee.department}</span>
                        <span className="mr-4">Daily Rate: ₹{employee.dailySalary}</span>
                        <span className="font-medium text-green-600">
                          Amount: ₹{currentAttendance?.amount || 0}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateAttendance(employee.id, 'present')}
                        className={`px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-1 ${
                          currentAttendance?.status === 'present'
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Present
                      </button>
                      
                      <button
                        onClick={() => updateAttendance(employee.id, 'off-day-work')}
                        className={`px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-1 ${
                          currentAttendance?.status === 'off-day-work'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        <Coffee className="w-4 h-4" />
                        Off-Day
                      </button>
                      
                      <button
                        onClick={() => updateAttendance(employee.id, 'absent')}
                        className={`px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-1 ${
                          currentAttendance?.status === 'absent'
                            ? 'bg-red-600 text-white'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                        Absent
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};