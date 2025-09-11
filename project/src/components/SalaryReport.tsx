import React, { useState, useEffect } from 'react';
import { Employee, SalaryCalculation } from '../types';
import { generateEmployeeSalaryReport } from '../utils/salary';
import { generatePDF } from '../utils/pdf';
import { DollarSign, Download, Calendar, Search, FileText } from 'lucide-react';

interface SalaryReportProps {
  employees: Employee[];
}

export const SalaryReport: React.FC<SalaryReportProps> = ({ employees }) => {
  const [fromDate, setFromDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  });
  
  const [toDate, setToDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  });
  
  const [salaryData, setSalaryData] = useState<SalaryCalculation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (employees.length > 0) {
      const data = generateEmployeeSalaryReport(fromDate, toDate);
      setSalaryData(data);
    }
  }, [employees, fromDate, toDate]);

  const filteredSalaryData = salaryData.filter(data =>
    data.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    data.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadPDF = () => {
    if (filteredSalaryData.length === 0) {
      alert('No data to export');
      return;
    }
    
    const period = `${new Date(fromDate).toLocaleDateString()} - ${new Date(toDate).toLocaleDateString()}`;
    generatePDF(filteredSalaryData, period);
  };

  const totals = filteredSalaryData.reduce((acc, data) => ({
    regularSalary: acc.regularSalary + data.regularSalary,
    offDayAmount: acc.offDayAmount + data.offDayAmount,
    totalSalary: acc.totalSalary + data.totalSalary,
    presentDays: acc.presentDays + data.presentDays,
    offDayWorkDays: acc.offDayWorkDays + data.offDayWorkDays
  }), { regularSalary: 0, offDayAmount: 0, totalSalary: 0, presentDays: 0, offDayWorkDays: 0 });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            Salary Report
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Search and Download */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by employee name or employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          
          <button
            onClick={handleDownloadPDF}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-blue-600 text-sm font-medium">Total Employees</div>
            <div className="text-2xl font-bold text-blue-800">{filteredSalaryData.length}</div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-green-600 text-sm font-medium">Regular Salary</div>
            <div className="text-2xl font-bold text-green-800">₹{totals.regularSalary.toLocaleString()}</div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-purple-600 text-sm font-medium">Off-Day Amount</div>
            <div className="text-2xl font-bold text-purple-800">₹{totals.offDayAmount.toLocaleString()}</div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-yellow-600 text-sm font-medium">Grand Total</div>
            <div className="text-2xl font-bold text-yellow-800">₹{totals.totalSalary.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Salary Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Salary Details - {new Date(fromDate).toLocaleDateString()} to {new Date(toDate).toLocaleDateString()}
          </h3>
        </div>

        {filteredSalaryData.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {employees.length === 0 ? 'No employees available' : 'No salary data found for the selected period'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Days</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Off-Day Work</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Regular Salary</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Off-Day Amount</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Salary</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSalaryData.map((data, index) => (
                  <tr key={data.employeeId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{data.employeeName}</div>
                        <div className="text-sm text-gray-500">ID: {data.employeeId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{data.totalDays}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-green-600 font-medium">{data.presentDays}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-red-600 font-medium">{data.absentDays}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-blue-600 font-medium">{data.offDayWorkDays}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-medium">₹{data.regularSalary.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-blue-600 font-medium">₹{data.offDayAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600 font-bold">₹{data.totalSalary.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};