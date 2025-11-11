import React from 'react';
const SuccessModal = ({ success, setSuccess, message }) => {
    if (!success) return null;
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-black text-xl">{message}</h2>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 bg-custome-blue text-white px-4 py-2 rounded"
                >
                    Ok
                </button>
            </div>
        </div>
    );
};
export default SuccessModal;