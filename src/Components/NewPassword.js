import React from 'react';
import axios from 'axios';

const PasswordResetPopup = ({ email, onClose, onOtpSent }) => { // Added onOtpSent as a prop
  const handleSendOtp = async () => {
    try {
      await axios.post('http://13.204.15.86:3002/request-otp', { email });
      onOtpSent(); // Call the callback function after sending OTP
    } catch (err) {
      console.error('Error sending OTP:', err);
      alert('Failed to send OTP.');
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-md shadow-lg">
        <h3 className="text-2xl font-bold mb-4">Change Password</h3>
        <p className="mb-4">You are in the process of changing your password.</p>
        <input type="text" value={email} disabled className="w-full p-2 border rounded-lg bg-gray-100 text-gray-700" />
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mr-2">
            Cancel
          </button>
          <button onClick={handleSendOtp} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
            Send OTP
          </button>
        </div>
      </div>
    </div>
  );
};
export default PasswordResetPopup;