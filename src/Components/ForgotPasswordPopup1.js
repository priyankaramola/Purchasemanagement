import React from 'react';
import axios from 'axios';

const ForgotPasswordPopup = ({ email, onClose, onOtpSent }) => {
  const handleSendOtp = async () => {
    try {
      const token = sessionStorage.getItem('token');
      
      await axios.post('http://13.204.15.86:3002/request-otp', 
        { email },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      onOtpSent(); 
    } catch (err) {
      console.error('Error sending OTP:', err);
      alert('Failed to send OTP.');
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-md shadow-lg">
        <h3 className="text-2xl font-bold mb-4">Forgot Password</h3>
        <p className="mb-4">Please enter your registered email to receive an OTP for password reset.</p>
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

export default ForgotPasswordPopup;
