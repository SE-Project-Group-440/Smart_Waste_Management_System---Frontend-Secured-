import baseURL from '../Hooks/BaseUrl';
import jsPDF from 'jspdf';
import React, { useState } from 'react';
import Navbar from '../Components/AdminNav/Navbar';

const UserPaymentReport: React.FC = () => {
  const [month, setMonth] = useState(''); // Hold the selected month
  const [payments, setPayments] = useState<any[]>([]);

  // Array of month options
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Fetch user payments based on selected month
  const fetchUserPayments = async () => {
    try {
      const response = await baseURL.get(`/reports/payments?month=${month}`);
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching user payments:', error);
    }
  };

  // Handle PDF download
  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('User Payment Report', 10, 10);
    doc.setFontSize(12);

    let yOffset = 30;

    doc.text('Total Amount', 50, yOffset);
    doc.text('Payment Status', 100, yOffset);

    doc.text('Created At', 150, yOffset);
    yOffset += 10;

    payments.forEach((payment) => {

      doc.text(`${payment.totalAmount}`, 50, yOffset);
      doc.text(payment.paymentStatus, 100, yOffset);

      doc.text(new Date(payment.createdAt).toLocaleDateString(), 150, yOffset);
      yOffset += 10;
    });

    doc.save('user_payments_report.pdf');
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-4">
        <h2 className="text-2xl font-bold mb-4 text-center">User Payment Report</h2>

        {/* Month Selector */}
        <div className="mb-4">
          <label htmlFor="month" className="block text-sm font-medium text-gray-700">
            Select Month:
          </label>
          <select
            id="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="" disabled>Select a month</option>
            {months.map((m, index) => (
              <option key={index} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Search & Download Buttons */}
        <div className="flex space-x-4 mb-4">
          <button
            onClick={fetchUserPayments}
            className="w-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800"
          >
            Search
          </button>
          <button
            onClick={handleDownload}
            disabled={payments.length === 0}
            className={`w-full ${payments.length === 0 ? 'bg-black' : 'bg-black'} text-white font-semibold py-2 rounded-lg shadow hover:${payments.length === 0 ? 'bg-gray-400' : 'bg-green-600'} transition duration-200`}
          >
            Download PDF
          </button>
        </div>

        {/* Payment Data Table */}
        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>

                  <th className="px-4 py-2 border border-gray-300 text-left">Total Amount</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Payment Status</th>

                  <th className="px-4 py-2 border border-gray-300 text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr key={index}>

                    <td className="px-4 py-2 border border-gray-300">{payment.totalAmount}</td>
                    <td className="px-4 py-2 border border-gray-300">{payment.paymentStatus}</td>

                    <td className="px-4 py-2 border border-gray-300">
                      {new Date(payment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No payments found for this month.</p>
        )}
      </div>
    </div>
  );
};

export default UserPaymentReport;
