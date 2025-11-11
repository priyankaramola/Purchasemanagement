import React from 'react';

const DeleteModal = ({ isDeleteModalOpen, setIsDeleteModalOpen, item, handleDelete, itemName }) => {
    if (!item) return null; // Ensure item is available before accessing its properties

    return (
        isDeleteModalOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg w-1/3">
                    <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                    <p>
                        Are you sure you want to delete the {itemName}: <strong>{item.name}</strong>?
                    </p>
                    <div className="flex justify-between mt-4">
                        <button 
                            onClick={() => setIsDeleteModalOpen(false)} 
                            className="bg-gray-500 text-white px-4 py-2 rounded">
                            Cancel
                        </button>
                        <button 
                            onClick={() => handleDelete(item.id)} // Pass the domain ID to handleDelete
                            className="bg-red-500 text-white px-4 py-2 rounded">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default DeleteModal;
