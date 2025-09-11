import React, { useState } from 'react';
import { Employee } from '../types';
import { storage } from '../utils/storage';
import { Search, Edit, Trash2, User, Mail, Phone, Calendar, Building, Car as IdCard, DollarSign } from 'lucide-react';

interface EmployeeListProps {
  employees: Employee[];
  onRefresh: () => void;
  onEdit: (employee: Employee) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({ employees, onRefresh, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.aadharNumber.includes(searchTerm)
  );

  const handleDelete = (employeeId: string) => {
    if (window.confirm('Are you sure you want to delete this employee? This will also delete all attendance records.')) {
      storage.deleteEmployee(employeeId);
      onRefresh();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600" />
          Employee List ({employees.length})
        </h2>
        
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, employee ID, email, department, or Aadhaar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
      </div>

      {filteredEmployees.length === 0 ? (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {employees.length === 0 ? 'No employees added yet' : 'No employees found matching your search'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredEmployees.map(employee => (
            <div key={employee.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-2">
                      <User className="w-5 h-5 text-blue-600" />
                      {employee.name}
                    </div>
                    <div className="text-sm text-gray-600">ID: {employee.employeeId}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      {employee.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      {employee.phone}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <IdCard className="w-4 h-4" />
                      {employee.aadharNumber}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building className="w-4 h-4" />
                      {employee.department}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      ₹{employee.dailySalary}/day
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      Joined: {new Date(employee.joiningDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(employee)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};