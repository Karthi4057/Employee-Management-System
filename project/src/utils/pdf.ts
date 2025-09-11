import { SalaryCalculation } from '../types';

export const generatePDF = async (salaryData: SalaryCalculation[], period: string) => {
  try {
    // Dynamic import for better bundle splitting
    const { jsPDF } = await import('jspdf');
    
    // Create new PDF document
    const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation
    
    // Set up colors and fonts
    const primaryColor = [59, 130, 246]; // Blue
    const textColor = [31, 41, 55]; // Dark gray
    const headerBg = [239, 246, 255]; // Light blue
    
    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 297, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Employee Management System', 148.5, 10, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Salary Report', 148.5, 18, { align: 'center' });
    
    // Period and date
    doc.setTextColor(...textColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Period: ${period}`, 20, 35);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, 20, 42);
    
    // Summary section
    const totals = salaryData.reduce((acc, data) => ({
      employees: salaryData.length,
      presentDays: acc.presentDays + data.presentDays,
      absentDays: acc.absentDays + data.absentDays,
      offDayWorkDays: acc.offDayWorkDays + data.offDayWorkDays,
      regularSalary: acc.regularSalary + data.regularSalary,
      offDayAmount: acc.offDayAmount + data.offDayAmount,
      totalSalary: acc.totalSalary + data.totalSalary
    }), { employees: 0, presentDays: 0, absentDays: 0, offDayWorkDays: 0, regularSalary: 0, offDayAmount: 0, totalSalary: 0 });
    
    // Summary box
    doc.setFillColor(...headerBg);
    doc.rect(20, 50, 257, 25, 'F');
    doc.setDrawColor(59, 130, 246);
    doc.rect(20, 50, 257, 25, 'S');
    
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('SUMMARY OVERVIEW', 22, 57);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Employees: ${totals.employees}`, 22, 63);
    doc.text(`Present Days: ${totals.presentDays}`, 80, 63);
    doc.text(`Off-Day Work: ${totals.offDayWorkDays}`, 140, 63);
    doc.text(`Regular Salary: ₹${totals.regularSalary.toLocaleString('en-IN')}`, 22, 69);
    doc.text(`Off-Day Amount: ₹${totals.offDayAmount.toLocaleString('en-IN')}`, 100, 69);
    doc.text(`Grand Total: ₹${totals.totalSalary.toLocaleString('en-IN')}`, 180, 69);
    
    // Table headers
    const startY = 85;
    const rowHeight = 8;
    const colWidths = [45, 20, 20, 20, 20, 25, 30, 30, 35];
    let currentX = 20;
    
    // Header background
    doc.setFillColor(...primaryColor);
    doc.rect(20, startY, 257, rowHeight, 'F');
    
    // Header text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    
    const headers = ['Employee', 'Total Days', 'Present', 'Absent', 'Off-Day', 'Daily Rate', 'Regular Salary', 'Off-Day Amount', 'Total Salary'];
    
    headers.forEach((header, index) => {
      doc.text(header, currentX + colWidths[index]/2, startY + 5, { align: 'center' });
      currentX += colWidths[index];
    });
    
    // Table rows
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    
    salaryData.forEach((data, index) => {
      const y = startY + rowHeight + (index * rowHeight);
      currentX = 20;
      
      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(20, y, 257, rowHeight, 'F');
      }
      
      // Employee name and ID
      doc.setFont('helvetica', 'bold');
      doc.text(data.employeeName, currentX + 2, y + 3);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text(`ID: ${data.employeeId}`, currentX + 2, y + 6);
      doc.setFontSize(8);
      currentX += colWidths[0];
      
      // Other columns
      const values = [
        data.totalDays.toString(),
        data.presentDays.toString(),
        data.absentDays.toString(),
        data.offDayWorkDays.toString(),
        `₹${(data.regularSalary / Math.max(data.presentDays, 1)).toLocaleString('en-IN')}`,
        `₹${data.regularSalary.toLocaleString('en-IN')}`,
        `₹${data.offDayAmount.toLocaleString('en-IN')}`,
        `₹${data.totalSalary.toLocaleString('en-IN')}`
      ];
      
      values.forEach((value, colIndex) => {
        if (colIndex === values.length - 1) {
          doc.setFont('helvetica', 'bold');
        }
        doc.text(value, currentX + colWidths[colIndex + 1]/2, y + 4, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        currentX += colWidths[colIndex + 1];
      });
    });
    
    // Total row
    const totalY = startY + rowHeight + (salaryData.length * rowHeight);
    doc.setFillColor(...primaryColor);
    doc.rect(20, totalY, 257, rowHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    
    currentX = 20;
    const totalValues = [
      'TOTAL',
      totals.presentDays + totals.absentDays + totals.offDayWorkDays,
      totals.presentDays,
      totals.absentDays,
      totals.offDayWorkDays,
      '-',
      `₹${totals.regularSalary.toLocaleString('en-IN')}`,
      `₹${totals.offDayAmount.toLocaleString('en-IN')}`,
      `₹${totals.totalSalary.toLocaleString('en-IN')}`
    ];
    
    totalValues.forEach((value, index) => {
      const align = index === 0 ? 'left' : 'center';
      const x = index === 0 ? currentX + 2 : currentX + colWidths[index]/2;
      doc.text(value.toString(), x, totalY + 5, { align });
      currentX += colWidths[index];
    });
    
    // Footer
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('This is a computer-generated document. No signature required.', 148.5, totalY + 20, { align: 'center' });
    doc.text('For any queries, please contact the HR Department.', 148.5, totalY + 25, { align: 'center' });
    
    // Save the PDF
    const fileName = `Salary_Report_${period.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};