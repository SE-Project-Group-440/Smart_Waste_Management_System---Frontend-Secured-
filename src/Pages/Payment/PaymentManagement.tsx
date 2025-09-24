import React, { useState, useEffect } from 'react';
import { PaymentService, Payment } from '../../Services/PaymentSevice';
import { UserService } from '../../Services/UserService';
import { UserPaymentServcie, Userpayment } from '../../Services/UserPayment';
import Modal from '../../Components/Model';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../Components/AdminNav/Navbar';
import { WasteCollectionService, WasteRecord } from '../../Services/WasteCollectionService';
import DOMPurify from 'dompurify';

const PaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [flatFee, setFlatFee] = useState<number>(0);
  const [paybackFee, setPaybackFee] = useState<number>(0);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [paymentDetails, setPaymentDetails] = useState<Userpayment[]>([]);
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>([]);

  useEffect(() => {
    loadPayments();
    loadUsers();
    loadWasteRecords();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await PaymentService.fetchAllPayments();
      // Sanitize API response
      const cleanData = data.map((p: Payment) => ({
        ...p,
        fname: DOMPurify.sanitize(p.fname),
        lname: DOMPurify.sanitize(p.lname),
        status: DOMPurify.sanitize(p.status),
      }));
      setPayments(cleanData);
    } catch (err) {
      showError('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const userData = await UserService.fetchAllUsers();
      // sanitize names
      const cleanUsers = userData.map((u: any) => ({
        ...u,
        fname: DOMPurify.sanitize(u.fname),
        lname: DOMPurify.sanitize(u.lname),
      }));
      setUsers(cleanUsers);
    } catch (err) {
      showError('Failed to load users');
    }
  };

  const showError = (message: string) => {
    setError(message);
    toast.error(message);
  };

  const showSuccess = (message: string) => {
    toast.success(message);
  };

  const loadWasteRecords = async () => {
    try {
      setLoading(true);
      const data = await WasteCollectionService.fetchAllWasteRecords();
      setWasteRecords(data);
    } catch (err) {
      showError('Failed to load waste collection data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (userId: string) => {
    try {
      const userPayments = await UserPaymentServcie.fetchAllUserPayment();
      const filteredPayments = userPayments
        .filter(payment => payment.userId === userId)
        .map((p) => ({
          ...p,
          paymentStatus: DOMPurify.sanitize(p.paymentStatus),
          totalAmount: DOMPurify.sanitize(p.totalAmount),
        }));
      setPaymentDetails(filteredPayments);
      setIsDetailsModalOpen(true);
    } catch (error) {
      showError('Failed to load payment details');
    }
  };

  const handleAddPayment = async () => {
    if (!editingPayment) {
      const existingPayment = payments.find(payment =>
        payment.fname === selectedUser?.fname && payment.lname === selectedUser?.lname
      );

      if (existingPayment) {
        showError('This user already has a payment entry.');
        window.location.reload();
        return;
      }
    }

    const totalBill = flatFee * 30;

    const newPayment: Payment = {
      _id: editingPayment ? editingPayment._id : '',
      userId: selectedUser?._id || editingPayment?.userId || '',
      fname: DOMPurify.sanitize(selectedUser?.fname || editingPayment?.fname || ''),
      lname: DOMPurify.sanitize(selectedUser?.lname || editingPayment?.lname || ''),
      flatFee,
      paybackFee,
      totalBill,
      status: 'pending',
      date: new Date().toISOString(),
    };

    try {
      if (editingPayment) {
        await PaymentService.updatePayment(editingPayment._id, newPayment);
        showSuccess('Payment updated successfully');
      } else {
        await PaymentService.createPayment(newPayment);
        showSuccess('Payment added successfully');
      }

      resetForm();
      loadPayments();
      setIsModalOpen(false);
    } catch (err) {
      showError('Failed to add/update payment');
    }
  };

  const resetForm = () => {
    setSelectedUser(null);
    setFlatFee(0);
    setPaybackFee(0);
    setEditingPayment(null);
    setError(null);
  };

  const handleDeletePayment = async (id: string) => {
    try {
      await PaymentService.deletePayment(id);
      loadPayments();
      showSuccess('Payment deleted successfully');
    } catch (err) {
      showError('Failed to delete payment');
    }
  };

  const handleEditPayment = (payment: Payment) => {
    const user = users.find(u => u.fname === payment.fname && u.lname === payment.lname);
    if (user) {
      setSelectedUser(user);
    }
    setEditingPayment(payment);
    setFlatFee(payment.flatFee);
    setPaybackFee(payment.paybackFee);
    setIsModalOpen(true);
  };

  const getWasteTypeForUser = (userId: string) => {
    const user = users.find(u => u._id === userId);
    if (!user) return 'No data';

    const userWasteRecord = wasteRecords.find(record => record.residenceId === user.residenceId);
    return userWasteRecord ? DOMPurify.sanitize(userWasteRecord.wasteType) : 'Not collected';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-5 md:p-10">
        <h1 className="text-3xl font-bold mb-5 text-center">Payment Management</h1>

        {loading ? (
          <p className="text-center">Loading payments...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <>
            <button
              className="mb-4 bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition w-full md:w-auto"
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
            >
              New User
            </button>

            <table className="table-auto w-full mb-5">
              <thead>
                <tr>
                  <th className="px-4 py-2">First Name</th>
                  <th className="px-4 py-2">Last Name</th>
                  <th className="px-4 py-2">Waste Type</th>
                  <th className="px-4 py-2">Flat Fee</th>
                  <th className="px-4 py-2">Payback Fee</th>
                  <th className="px-4 py-2">Total Bill</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => {
                  return (
                    <tr key={payment._id}>
                      <td className="border px-4 py-2">{payment.fname}</td>
                      <td className="border px-4 py-2">{payment.lname}</td>
                      <td className="border px-4 py-2">{getWasteTypeForUser(payment.userId)}</td>
                      <td className="border px-4 py-2">{payment.flatFee}</td>
                      <td className="border px-4 py-2">{payment.paybackFee}</td>
                      <td className="border px-4 py-2">{payment.totalBill}</td>
                      <td className="border px-4 py-2 flex justify-center">
                        <div className="flex space-x-2">
                          <button
                            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                            onClick={() => handleEditPayment(payment)}
                          >
                            Update
                          </button>
                          <button
                            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                            onClick={() => handleViewDetails(payment.userId)}
                          >
                            View Details
                          </button>
                          <button
                            className="p-2 bg-red-500 text-white rounded ml-2 hover:bg-red-600 transition"
                            onClick={() => handleDeletePayment(payment._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Modal for Add/Update Payment */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingPayment ? 'Update Payment' : 'Add Payment'}>
              <select
                className="p-2 border rounded mb-2 w-full"
                value={selectedUser?.fname || ''}
                onChange={(e) => {
                  const user = users.find(user => user.fname === e.target.value);
                  setSelectedUser(user || null);
                }}
              >
                <option value="">Select User</option>
                {users.map(user => (
                  <option key={user._id} value={user.fname}>
                    {user.fname} {user.lname}
                  </option>
                ))}
              </select>

              <input
                className="p-2 border rounded mb-2 w-full"
                placeholder="Flat Fee"
                type="number"
                value={flatFee}
                onChange={(e) => setFlatFee(parseFloat(e.target.value))}
              />
              <input
                className="p-2 border rounded mb-2 w-full"
                placeholder="Payback Fee"
                type="number"
                value={paybackFee}
                onChange={(e) => setPaybackFee(parseFloat(e.target.value))}
              />
              <button
                className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition w-full"
                onClick={handleAddPayment}
              >
                {editingPayment ? 'Update Payment' : 'Add Payment'}
              </button>
            </Modal>

            {/* Modal for Viewing Payment Details */}
            <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="Payment Details">
              <table className="min-w-full bg-white divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Total Amount</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Payment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paymentDetails.length > 0 ? (
                    paymentDetails.map(payment => (
                      <tr key={payment._id}>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-lg text-green-600">
                          ${parseFloat(payment.totalAmount).toLocaleString()}
                        </td>
                        <td className={`py-3 px-4 text-lg ${payment.paymentStatus === 'Completed' ? 'text-green-600' : 'text-red-600'}`}>
                          {payment.paymentStatus}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-3 px-4 text-sm text-gray-500 text-center">No payments found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Modal>

            <ToastContainer />
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;
