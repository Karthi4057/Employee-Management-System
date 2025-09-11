import React, { useState } from 'react';
import { Employee } from '../types';
import { storage } from '../utils/storage';
import { User, Mail, Phone, MapPin, CreditCard, Calendar, Briefcase, Building, Car as IdCard, DollarSign } from 'lucide-react';

interface EmployeeFormProps {
  onEmployeeAdded: () => void;
  editEmployee?: Employee | null;
  onEditComplete?: () => void;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({ 
  onEmployeeAdded, 
  editEmployee, 
  onEditComplete 
}) => {
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    name: editEmployee?.name || '',
    employeeId: editEmployee?.employeeId || '',
    email: editEmployee?.email || '',
    phone: editEmployee?.phone || '',
    address: editEmployee?.address || '',
    aadharNumber: editEmployee?.aadharNumber || '',
    accountName: editEmployee?.accountName || '',
    accountNumber: editEmployee?.accountNumber || '',
    joiningDate: editEmployee?.joiningDate || '',
    position: editEmployee?.position || '',
    department: editEmployee?.department || '',
    dailySalary: editEmployee?.dailySalary || 1000
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editEmployee) {
      storage.updateEmployee({ ...formData, id: editEmployee.id });
      onEditComplete?.();
    } else {
      const newEmployee: Employee = {
        ...formData,
        id: Date.now().toString()
      };
      storage.addEmployee(newEmployee);
    }
    
    // Reset form
    setFormData({
      name: '',
      employeeId: '',
      email: '',
      phone: '',
      address: '',
      aadharNumber: '',
      accountName: '',
      accountNumber: '',
      joiningDate: '',
      position: '',
      department: '',
      dailySalary: 1000
    });
    
    onEmployeeAdded();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <User className="w-6 h-6 text-blue-600" />
        {editEmployee ? 'Edit Employee' : 'Add New Employee'}
      </h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-1" />
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <IdCard className="w-4 h-4 inline mr-1" />
            Employee ID
          </label>
          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter employee ID (e.g., EMP001)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-1" />
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-1" />
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <IdCard className="w-4 h-4 inline mr-1" />
            Aadhaar Number
          </label>
          <input
            type="text"
            name="aadharNumber"
            value={formData.aadharNumber}
            onChange={handleChange}
            required
            maxLength={12}
            pattern="[0-9]{12}"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter 12-digit Aadhaar number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Briefcase className="w-4 h-4 inline mr-1" />
            Position
          </label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter position"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building className="w-4 h-4 inline mr-1" />
            Department
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="">Select Department</option>
            <option value="HR">Human Resources</option>
            <option value="IT">Information Technology</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Daily Salary (₹)
          </label>
          <input
            type="number"
            name="dailySalary"
            value={formData.dailySalary}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter daily salary amount"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Joining Date
          </label>
          <input
            type="date"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter complete address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CreditCard className="w-4 h-4 inline mr-1" />
            Account Holder Name
          </label>
          <input
            type="text"
            name="accountName"
            value={formData.accountName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter account holder name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CreditCard className="w-4 h-4 inline mr-1" />
            Account Number
          </label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter account number"
          />
        </div>

        <div className="md:col-span-2 flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {editEmployee ? 'Update Employee' : 'Add Employee'}
          </button>
          
          {editEmployee && (
            <button
              type="button"
              onClick={onEditComplete}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};