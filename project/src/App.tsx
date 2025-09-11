import React, { useState, useEffect } from 'react';
import { Employee } from './types';
import { storage } from './utils/storage';
import { LoginForm } from './components/LoginForm';
import { EmployeeForm } from './components/EmployeeForm';
import { EmployeeList } from './components/EmployeeList';
import { AttendanceManager } from './components/AttendanceManager';
import { SalaryReport } from './components/SalaryReport';
import { Users, Calendar, DollarSign, Plus, LogOut } from 'lucide-react';

type Tab = 'employees' | 'attendance' | 'salary';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('employees');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    // Check if admin is already logged in
    const loggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    if (loggedIn) {
      loadEmployees();
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadEmployees();
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    loadEmployees();
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    setIsLoggedIn(false);
    setActiveTab('employees');
    setShowAddForm(false);
    setEditingEmployee(null);
  };

  const loadEmployees = () => {
    const loadedEmployees = storage.getEmployees();
    setEmployees(loadedEmployees);
  };

  const handleEmployeeAdded = () => {
    loadEmployees();
    setShowAddForm(false);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowAddForm(true);
  };

  const handleEditComplete = () => {
    setEditingEmployee(null);
    setShowAddForm(false);
    loadEmployees();
  };

  const tabs = [
    { id: 'employees' as Tab, label: 'Employees', icon: Users, count: employees.length },
    { id: 'attendance' as Tab, label: 'Attendance', icon: Calendar },
    { id: 'salary' as Tab, label: 'Salary Reports', icon: DollarSign }
  ];

  // Show login form if not authenticated
  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Employee Management System</h1>
                <p className="text-sm text-gray-500">Attendance & Salary Management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <nav className="flex space-x-1 p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      activeTab === tab.id ? 'bg-blue-500' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'employees' && (
          <div className="space-y-6">
            {!showAddForm && (
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  Add New Employee
                </button>
              </div>
            )}
            
            {showAddForm && (
              <EmployeeForm
                onEmployeeAdded={handleEmployeeAdded}
                editEmployee={editingEmployee}
                onEditComplete={handleEditComplete}
              />
            )}
            
            <EmployeeList
              employees={employees}
              onRefresh={loadEmployees}
              onEdit={handleEditEmployee}
            />
          </div>
        )}

        {activeTab === 'attendance' && (
          <AttendanceManager employees={employees} />
        )}

        {activeTab === 'salary' && (
          <SalaryReport employees={employees} />
        )}
      </div>
    </div>
  );
}

export default App;