/*********************NEW CODE*************************** */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './Sidebar/HRMSidebar';
import ProfileDropdown from './ProfileDropdown';
import { FaHome } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes, faContactCard } from '@fortawesome/free-solid-svg-icons';
import { Country, State, City } from "country-state-city";
import axios from 'axios';
import "./App.css";
import Swal from 'sweetalert2';
import API from './api';

const Profile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        customer_name: '',
        landline_num: '',
        email_id: '',
        address: '',
        country: '',
        state: '',
        city: '',
        pincode: '',
        tan_number: '',
        gst_number: '',
        pan_no: ''
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [contactDetails, setContactDetails] = useState([]);
    const [loadingContacts, setLoadingContacts] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [newContact, setNewContact] = useState({
        contact_person: '',
        email_id: '',
        phone_num: '',
        address: '',
        country: '',
        state: '',
        city: '',
        pincode: '',
        department: '',
        designation: '',
        date_of_start: '',
        date_of_end: '',
        status: ''
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentCustomerIndex, setCurrentCustomerIndex] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [gstError, setGstError] = useState('');
    const [panError, setPanError] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [isEditModalOpen1, setIsEditModalOpen1] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [userData, setUserData] = useState(null);
    const [deleteErrorMessage, setDeleteErrorMessage] = useState('');

    const getToken = () => {
        const token = sessionStorage.getItem('token');
        return token;
    };
    const token = getToken();
    console.log('Retrieved token:', token);

    const verifyToken = async () => {
        if (!token) {
            navigate('/');
            return;
        }
        try {
            const response = await axios.post(`${API.API_BASE}/users/verify-token`, {
                token: token
            });
            console.log('Token is valid:', response.data);
            navigate('/Profile');
        } catch (error) {
            console.error('Token verification failed:', error.response ? error.response.data : error.message);
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('tokenExpiry');
            navigate('/');
        }
    };

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        console.log('UserId:', userId); 
        if (userId) {
            const fetchUserData = async () => {
                try {
                    console.log('Fetching data for userId:', userId); 
                    const response = await axios.get(`${API.API_BASE}/users/id_user/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log('API Response:', response);
                    if (response.data) {
                        const user = response.data;
                        console.log('User:', user);
                        setUserData(user);
                    } else {
                        console.log('No user data found');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };
            fetchUserData();
        }
    },
        [token, userId]);

    useEffect(() => {
        verifyToken();
        fetchCustomers();
    }, []);

    useEffect(() => {
        const fetchContactDetails = async () => {
            const token = sessionStorage.getItem('token');
            setLoadingContacts(true);

            if (!token) {
                console.error('Token is missing');
                navigate('/');
                return;
            }
            try {
                const response = await fetch(`http://13.204.15.86:3002/contacts`, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        setContactDetails(data);
                    } else {
                        console.error('Expected an array but received:', data);
                        setContactDetails([]);
                    }
                } else {
                    console.error('Failed to fetch contact details. Status:', response.status);
                }
            } catch (error) {
                console.error('An error occurred while fetching contact details:', error);
            } finally {
                setLoadingContacts(false);
            }
        };
        fetchContactDetails();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer((prevCustomer) => ({
            ...prevCustomer,
            [name]: value
        }));
    };

    const handleChange1 = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'radio') {
            setNewContact((prevContact) => ({
                ...prevContact,
                [name]: value
            }));
        } else {
            setNewContact((prevContact) => ({
                ...prevContact,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const [hasAMSAccessCustomer, setHasAMSAccessCustomer] = useState(false);
    const [hasAMSAccessContact, setHasAMSAccessContact] = useState(false);
    const [hasAMSAccessEdit, setHasAMSAccessEdit] = useState(false);
    const [hasAMSAccessDelete, setHasAMSAccessDelete] = useState(false);
    const [hasAMSAccessEditContact, setHasAMSAccessEditContact] = useState(false);
    const [hasAMSAccessDeleteContact, setHasAMSAccessDeleteContact] = useState(false);

    const handleAddContact = async (e) => {
        e.preventDefault();
            if (!newContact.contact_person && !newContact.phone_num && !newContact.email_id) {
            setErrorMessage('At least Contact Person, Phone Number, or Email ID is required.');
            return;
        }
    
        const contactData = {
            customer_id: selectedCustomerId,
            contact_person: newContact.contact_person || "",
            email_id: newContact.email_id || "",
            phone_num: newContact.phone_num || "",
            address: newContact.address || "",
            country: newContact.country || "",
            state: newContact.state || "",
            city: newContact.city || "",
            pincode: newContact.pincode || "",
            department: newContact.department || "",
            designation: newContact.designation || "",
            date_of_start: newContact.date_of_start || "",
            date_of_end: newContact.date_of_end || "",
            status: newContact.status || "active"
        };
    
        try {
            let token = sessionStorage.getItem('token');
            if (!token) {
                setErrorMessage('Token does not exist.');
                return;
            }
            const response = await fetch('http://13.204.15.86:3002/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(contactData)
            });
    
            if (response.status === 403) {
                setErrorMessage('Access denied. You do not have permission to access this API.');
                return;
            }
    
            if (response.ok) {
                const savedContact = await response.json();
                setContacts([...contacts, savedContact]);
    
                // Reset form
                setNewContact({
                    contact_person: '',
                    email_id: '',
                    phone_num: '',
                    address: '',
                    country: '',
                    state: '',
                    city: '',
                    pincode: '',
                    department: '',
                    designation: '',
                    date_of_start: '',
                    date_of_end: '',
                    status: 'active'
                });
    
                setErrorMessage('');
    
                Swal.fire({
                    title: 'Success!',
                    text: 'Contact added successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
    
                setIsModalOpen1(false);
            } else {
                const errorData = await response.json();
                if (errorData && errorData.message) {
                    if (errorData.message.includes('already exists')) {
                        if (errorData.message.includes('phone_num')) {
                            setErrorMessage('Phone number already exists. Please use a different phone number.');
                        } else if (errorData.message.includes('email_id')) {
                            setErrorMessage('Email ID already exists. Please use a different email.');
                        } else {
                            setErrorMessage(errorData.message);
                        }
                    } else {
                        setErrorMessage('Failed to save the contact. Please try again.');
                    }
                } else {
                    setErrorMessage('Failed to save the contact. Please try again.');
                }
            }
        } catch (error) {
            console.error('An error occurred while saving the contact:', error);
            setErrorMessage('An unexpected error occurred. Please try again.');
        }
    };
    
    const handleEditContact = (contactId) => {
        const contactToEdit = contactDetails.find(contact => contact.contact_id === contactId);
        if (contactToEdit) {
            setEditingContact(contactToEdit);
            setIsEditModalOpen(true);
        }
    };

    const handleDelete = async (contactId) => {
        try {
            console.log(contactId)
            let token = sessionStorage.getItem('token');
            if (!token) {
                alert('Token does not exist.');
                return;
            }
            const url = `http://13.204.15.86:3002/contacts/${contactId}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`,

                },
            });
            if (response.status === 403) {
                setErrorMessage('Access denied. You do not have permission to access this API.');
                return;
            }
            if (!response.ok) {
                throw new Error(`Failed to delete contact: ${response.statusText}`);
            }
            setContactDetails(contactDetails.filter(contact => contact.Id !== contactId));
        } catch (error) {
            console.error("Failed to delete contact:", error);
        }
    };

    const handleEditCustomer = (index) => {
        setNewCustomer(customers[index]);
        setIsEditMode(true);
        setCurrentCustomerIndex(index);
        setIsEditModalOpen1(true);
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        let valid = true;

        // Validate GST Number
        if (newCustomer.gst_number && !validateGST(newCustomer.gst_number)) {
            setGstError('Invalid GST Number. It must be a 15-character alphanumeric code.');
            valid = false;
        } else {
            setGstError('');
        }

        // Validate PAN Number
        if (newCustomer.pan_no && !validatePAN(newCustomer.pan_no)) {
            setPanError('Invalid PAN Number. It must be in the format ABCDE1234F.');
            valid = false;
        } else {
            setPanError('');
        }

        if (!valid) return;

        try {
            const customerId = customers[currentCustomerIndex].customer_id;
            const token = sessionStorage.getItem('token');
            if (!token) {
                alert('Token does not exist.');
                return;
            }

            const response = await fetch(`http://13.204.15.86:3002/customers/${customerId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customer_name: newCustomer.customer_name,
                    landline_num: newCustomer.landline_num,
                    email_id: newCustomer.email_id,
                    address: newCustomer.address,
                    country: newCustomer.country,
                    state: newCustomer.state,
                    city: newCustomer.city,
                    pincode: newCustomer.pincode,
                    gst_number: newCustomer.gst_number,
                    pan_no: newCustomer.pan_no,
                    tan_number: newCustomer.tan_number,
                }),
            });

            if (response.status === 403) {
                setErrorMessage('Access denied. You do not have permission to access this API.');
                return;
            }

            if (response.status === 200) {
                // Show success message with SweetAlert2
                Swal.fire({
                    icon: 'success',
                    title: 'Customer Updated',
                    text: 'Customer data has been successfully updated.',
                    confirmButtonText: 'OK',
                }).then(() => {
                    setIsEditModalOpen1(false); // Close the modal
                    fetchCustomers(); // Fetch updated customer data (no page refresh needed)
                    resetForm(); // Reset the form
                });
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            // Show error message with SweetAlert2
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'There was an error updating the customer: ' + error.message,
                confirmButtonText: 'OK',
            });
        }
    };

    /***************************CUSTOMER DETAILS API **************************/
    const handleAddCustomer = async (event) => {
        event.preventDefault();
    
        setGstError('');
        setPanError('');
        setErrorMessage('');
    
        if (!newCustomer.customer_name) {
            setErrorMessage('Customer name is required.');
            return;
        }
    
        if (!newCustomer.email_id && !newCustomer.landline_num) {
            setErrorMessage('Either Email or Landline number is required.');
            return;
        }
    
        const isValidGST = !newCustomer.gst_number || validateGST(newCustomer.gst_number);
        const isValidPAN = !newCustomer.pan_no || validatePAN(newCustomer.pan_no);
    
        if (newCustomer.gst_number && !isValidGST) {
            setGstError('Invalid GST Number. It must be a 15-character alphanumeric code.');
        }
    
        if (newCustomer.pan_no && !isValidPAN) {
            setPanError('Invalid PAN Number. It must be in the format ABCDE1234F.');
        }
    
        if (!isValidGST || !isValidPAN) return;
    
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                setErrorMessage('Token does not exist.');
                return;
            }
    
            const payload = {
                customer_name: newCustomer.customer_name,
                landline_num: newCustomer.landline_num || "",
                email_id: newCustomer.email_id || "",
                address: newCustomer.address || "",
                country: newCustomer.country || "",
                state: newCustomer.state || "",
                city: newCustomer.city || "",
                pincode: newCustomer.pincode || "",
                tan_number: newCustomer.tan_number || "",
                gst_number: newCustomer.gst_number || "",
                pan_no: newCustomer.pan_no || "",
                lead_field: "Sales Team"
            };
            const response = await fetch('http://13.204.15.86:3002/customers', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            if (response.status === 403) {
                setErrorMessage('Access denied. You do not have permission to access this API.');
                return;
            }
    
            const result = await response.json();
    
            if (!response.ok) {
                throw new Error(result.message || 'Something went wrong');
            }
    
            if (result.message === "Customer created successfully") {
                Swal.fire({
                    icon: 'success',
                    title: 'Customer Created',
                    html: `
                        <p><strong>Customer Name:</strong> ${result.customer.customer_name}</p>
                        <p><strong>GST Number:</strong> ${result.customer.gst_number || 'N/A'}</p>
                        <p><strong>Email:</strong> ${result.customer.email_id || 'N/A'}</p>
                    `,
                    confirmButtonText: 'OK',
                }).then(() => {
                    setIsModalOpen(false);
                    fetchCustomers();
                    resetForm();
                });
            } else {
                setErrorMessage(result.message || 'An error occurred');
            }
    
        } catch (error) {
            console.error('Message:', error.message);
            setErrorMessage(error.message);
        }
    };    
    
    const handleOpenDeleteModal = (index) => {
        setCustomerToDelete(index);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteCustomer = async () => {
        try {
            const customerId = customers[customerToDelete].customer_id;
            const token = sessionStorage.getItem('token');
            if (!token) {
                setDeleteErrorMessage('Token does not exist.');
                return;
            }
            const response = await axios.delete(`http://13.204.15.86:3002/customers/${customerId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                fetchCustomers();
                setIsDeleteModalOpen(false); // Close the delete modal
            } else if (response.status === 403) {
                // Extract and handle the specific error message from the response body
                const errorData = response.data; // Assuming response.data contains the error message
                setDeleteErrorMessage(errorData.error || 'Access denied. You do not have permission to access this API.');
            } else {
                // Handle other errors
                setDeleteErrorMessage('Failed to delete customer: ' + response.statusText);
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                // Handle 403 error if thrown by axios
                const errorData = error.response.data; // Assuming error.response.data contains the error message
                setDeleteErrorMessage(errorData.error || 'Access denied. You do not have permission to access this API.');
            } else {
                // Handle other errors
                setDeleteErrorMessage('Error: ' + (error.response ? error.response.data.error : error.message));
            }
        }
    };

    const resetForm = () => {
        setNewCustomer({
            customer_name: '',
            landline_num: '',
            email_id: '',
            address: '',
            gst_number: '',
            pan_no: ''
        });
        setIsEditMode(false);
        setCurrentCustomerIndex(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleAddCustomer(e);
    };

    const fetchCustomers = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            console.error('Token is missing');
            navigate('/');
            return;
        }
        try {
            console.log('➕', token)
            const response = await fetch('http://13.204.15.86:3002/customers', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const sortedData = data.sort((a, b) => a.customerId - b.customerId);
            setCustomers(sortedData);
        } catch (error) {
            console.error('Failed to fetch customers:', error);
        }
    };

    const handleSubmit1 = async (e) => {
        e.preventDefault();
        await handleAddContact(e);
    };

    const validateGST = (gst) => {
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/;
        return gstRegex.test(gst);
    };

    const validatePAN = (pan) => {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        return panRegex.test(pan);
    };

    const handleCustomerClick = (customer) => {
        setSelectedCustomer(customer);
        setIsDetailModalOpen(true);
    };

    const updateContactDetails = async (contactId, updatedContactData) => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                setErrorMessage('Token does not exist.');
                return;
            }

            const response = await fetch(`http://13.204.15.86:3002/contacts/${contactId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedContactData),
            });

            if (response.status === 403) {
                setErrorMessage('Access denied. You do not have permission to access this API.');
                return;
            }

            if (response.ok) {
                const updatedContact = await response.json();
                setContactDetails((prevDetails) =>
                    prevDetails.map((contact) =>
                        contact.contact_id === contactId ? updatedContact : contact
                    )
                );
                setIsEditModalOpen(false); // Close the modal or similar
                setErrorMessage(''); // Clear any existing error messages

                // SweetAlert for successful update
                Swal.fire({
                    title: 'Success!',
                    text: 'Contact updated successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });

            } else {
                const errorData = await response.json();
                if (response.status === 403) {
                    setErrorMessage(errorData.error || 'Access denied. You do not have permission to access this API.');
                } else {
                    setErrorMessage(errorData.message || 'Failed to update contact details');
                }
            }
        } catch (error) {
            console.error('An error occurred while updating the contact details:', error);
            setErrorMessage('Error: ' + error.message);
        }
    };

    useEffect(() => {
        const handlePopState = () => {
            navigate('/Cards');
        };
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    useEffect(() => {
        const checkAMSAccess = async () => {
            setLoading(true);
            try {
                const userId = sessionStorage.getItem('userId'); // Fetch userId from sessionStorage
                setUserId(userId);

                // Make API call using userId
                const response = await axios.get(`${API.API_BASE}/access/access/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    },
                });
                const userAccess = response.data;
                const hasCustomerAccess = userAccess.some(access => access.api_name === 'create_customer');
                const hasContactAccess = userAccess.some(access => access.api_name === 'create_contact');
                const hasEditAccess = userAccess.some(access => access.api_name === 'update_customer');
                const hasDeleteAccess = userAccess.some(access => access.api_name === 'delete_customer');
                const hasEditContactAccess = userAccess.some(access => access.api_name === 'update_contact');
                const hasDeleteContactAccess = userAccess.some(access => access.api_name === 'delete_contact');

                // Set states for access
                setHasAMSAccessCustomer(hasCustomerAccess);
                setHasAMSAccessContact(hasContactAccess);
                setHasAMSAccessEdit(hasEditAccess);
                setHasAMSAccessDelete(hasDeleteAccess);
                setHasAMSAccessEditContact(hasEditContactAccess);
                setHasAMSAccessDeleteContact(hasDeleteContactAccess);
            } catch (error) {
                console.error('Error fetching access rights:', error);
                setHasAMSAccessCustomer(false);
                setHasAMSAccessContact(false);
                setHasAMSAccessDelete(false);
                setHasAMSAccessEditContact(false);
                setHasAMSAccessDeleteContact(false);
            } finally {
                setLoading(false);
            }
        };
        checkAMSAccess();
    }, []);

    const handleHome = () => {
        navigate('/Cards');
    };

    const handleContactClick = (contact) => {
        setSelectedContact(contact);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedContact(null);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    /************ COUNTRY,STATE AND CITY********** */
    const handleCountryChange = (e) => {
        const selectedCountry = e.target.value;
        setNewCustomer({
            ...newCustomer,
            country: selectedCountry,
            state: '',
            city: '',
        });
    };

    const handleStateChange = (e) => {
        const selectedState = e.target.value;
        setNewCustomer({
            ...newCustomer,
            state: selectedState,
            city: '',
        });
    };

    const handleCityChange = (e) => {
        setNewCustomer({
            ...newCustomer,
            city: e.target.value,
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer({ ...newCustomer, [name]: value });
    };
    /*************** END**************/
    const [landlineError, setLandlineError] = useState('');
    const handleLandlineChange = (event) => {
        const { value } = event.target;
        if (!/^\d*$/.test(value)) return;
        setNewCustomer((prevState) => ({
            ...prevState,
            landline_num: value,
        }));
        if (value && (value.length < 10 || value.length > 10)) {
            setLandlineError('Landline number must be exactly 10 digits.');
        } else {
            setLandlineError('');
        }
    };

    const [emailError, setEmailError] = useState('');
    const handleEmailChange = (event) => {
        const { value } = event.target;
        setNewCustomer((prevState) => ({
            ...prevState,
            email_id: value,
        }));
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
            setEmailError('Invalid email format. Please enter a valid email address.');
        } else {
            setEmailError('');
        }
    };

    const resetForm1 = () => {
        setNewContact({
            contact_person: '',
            phone_num: '',
            email_id: '',
            address: '',
            country: '',
            state: '',
            city: '',
            pincode: '',
            department: '',
            designation: '',
            date_of_start: '',
            date_of_end: '',
            status: 'active', // Default status if needed
        });
        setErrorMessage('');
    };

    return (
        <div className='flex flex-col overflow-hidden'>
            <div className='flex'>
                <div className=" w-full">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                        {hasAMSAccessCustomer && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-gray-700 w-[13%] text-white px-4 py-2 rounded-2xl mb-4 mt-4"
                            >
                                Add Customer
                            </button>
                        )}
                        {/* <div className="flex-grow">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearch}
                                placeholder="Search"
                                className="w-30 border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <button
                            onClick={handleDownloadExcel}
                            className="text-green-500 flex-shrink-0 sm:w-auto w-full sm:w-[10%] text-center"
                        >
                            <img src={excel} alt="logo" className="w-8 h-8 mx-auto" />
                        </button> */}
                    </div>
                    {/****************** CUSTOMER DETAILS ****************** */}
                    {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                            <div className="bg-white p-5 rounded-2xl w-full max-w-lg sm:max-w-md md:max-w-xl lg:max-w-xl h-auto sm:h-auto md:h-auto custom-scrollbar overflow-auto">
                                <h2 className="text-xl font-bold mb-2 ml-7">{isEditMode ? 'Edit Customer' : 'Create Customer'}</h2>
                                {errorMessage && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl relative mb-4">
                                        <strong className="font-bold">Message:</strong>
                                        <span className="block sm:inline">{errorMessage}</span>
                                    </div>
                                )}
                                <form onSubmit={handleAddCustomer} className="grid grid-cols-1 gap-4 w-full">
                                    <div className="ml-4 sm:ml-7">
                                        <div className="grid gap-4 mb-2 md:grid-cols-2">
                                            <div className="flex flex-col">
                                                <label className="text-[10px] sm:text-base">Customer Name: <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    name="customer_name"
                                                    value={newCustomer.customer_name}
                                                    onChange={handleChange}
                                                    placeholder='Enter Customer Name'
                                                    required
                                                    className="p-1 sm:p-2 border border-black rounded text-sm sm:text-base"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-sm sm:text-base">Phone no.: <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    name="landline_num"
                                                    value={newCustomer.landline_num}
                                                    onChange={handleLandlineChange}
                                                    placeholder='Enter Landline number'
                                                    required
                                                    className="p-1 sm:p-2 border border-black rounded text-sm sm:text-base"
                                                />
                                                {landlineError && (
                                                    <p className="text-red-500 text-[10px] sm:text-sm mt-1">{landlineError}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid gap-4 mb-2 md:grid-cols-2">
                                            <div className="flex flex-col">
                                                <label className="mb-1 text-sm sm:text-base">E-mail: <span className="text-red-500">*</span></label>
                                                <input
                                                    type="email"
                                                    name="email_id"
                                                    value={newCustomer.email_id}
                                                    onChange={handleEmailChange}
                                                    placeholder='Enter Email '
                                                    required
                                                    className={`p-1 sm:p-2 border ${emailError ? 'border-red-500' : 'border-black'} rounded text-sm sm:text-base`}
                                                />
                                                {emailError && (
                                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{emailError}</p>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="mb-1 text-sm sm:text-base">Address:</label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={newCustomer.address}
                                                    onChange={handleChange}
                                                    placeholder='Enter Address'
                                                    className="p-1 sm:p-2 border border-black rounded text-sm sm:text-base"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-4 mb-2 md:grid-cols-2">
                                            <div className="flex flex-col">
                                                <label className="mb-1 text-sm sm:text-base">Country: </label>
                                                <select
                                                    name="country"
                                                    value={newCustomer.country}
                                                    onChange={handleCountryChange}
                    
                                                    className="p-1 sm:p-2 border border-black rounded text-sm sm:text-base"
                                                >
                                                    <option value="">Select Country</option>
                                                    {Country.getAllCountries().map((country) => (
                                                        <option key={country.isoCode} value={country.name}>
                                                            {country.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="mb-1 text-sm sm:text-base">State:</label>
                                                <select
                                                    name="state"
                                                    value={newCustomer.state}
                                                    onChange={handleStateChange}
                    
                                                    className="p-1 sm:p-2 border border-black rounded text-sm sm:text-base"
                                                    disabled={!newCustomer.country}
                                                >
                                                    <option value="">Select State</option>
                                                    {newCustomer.country &&
                                                        State.getStatesOfCountry(
                                                            Country.getAllCountries().find((c) => c.name === newCustomer.country).isoCode
                                                        ).map((state) => (
                                                            <option key={state.isoCode} value={state.name}>
                                                                {state.name}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid gap-4 mb-2 md:grid-cols-2">
                                            <div className="flex flex-col">
                                                <label className="mb-1 text-sm sm:text-base"> City:</label>
                                                <select
                                                    name="city"
                                                    value={newCustomer.city}
                                                    onChange={handleCityChange}
                                                    className="p-1 sm:p-2 border border-black rounded text-sm sm:text-base"
                                                    disabled={!newCustomer.state}
                                                >
                                                    <option value="">Select City</option>
                                                    {newCustomer.state &&
                                                        City.getCitiesOfState(
                                                            Country.getAllCountries().find((c) => c.name === newCustomer.country).isoCode,
                                                            State.getStatesOfCountry(
                                                                Country.getAllCountries().find((c) => c.name === newCustomer.country).isoCode
                                                            ).find((s) => s.name === newCustomer.state).isoCode
                                                        ).map((city) => (
                                                            <option key={city.name} value={city.name}>
                                                                {city.name}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="mb-1 text-sm sm:text-base">
                                                    Pincode:
                                                </label>
                                                <input
                                                    type="text"
                                                    name="pincode"
                                                    value={newCustomer.pincode}
                                                    onChange={handleInputChange}
                                                    placeholder='Enter Pincode'
                                                    className="p-1 sm:p-2 border border-black rounded text-sm sm:text-base"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-4 mb-2 md:grid-cols-2">
                                            <div className="flex flex-col">
                                                <label className="mb-1 text-sm sm:text-base">GST Number:</label>
                                                <input
                                                    type="text"
                                                    name="gst_number"
                                                    value={newCustomer.gst_number}
                                                    onChange={handleChange}
                                                    placeholder='Enter GST number'
                                                    className="p-1 sm:p-2 border border-black rounded text-sm sm:text-base"
                                                    required
                                                />
                                                {gstError && <p className="text-red-500 text-sm">{gstError}</p>}
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="mb-1 text-sm sm:text-base">PAN Number: </label>
                                                <input
                                                    type="text"
                                                    name="pan_no"
                                                    value={newCustomer.pan_no}
                                                    onChange={handleChange}
                                                    placeholder='Enter PAN number'
                                                    className="p-1 sm:p-2 border border-black rounded text-sm sm:text-base"
                                                />
                                                {panError && <p className="text-red-500 text-sm">{panError}</p>}
                                            </div>
                                        </div>
                                        <div className="grid gap-4 mb-2 md:grid-cols-2">
                                            <div className="flex flex-col">
                                                <label className="mb-1 text-sm sm:text-base">TAN Number:</label>
                                                <input
                                                    type="text"
                                                    name="tan_number"
                                                    value={newCustomer.tan_number}
                                                    onChange={handleChange}
                                                    placeholder='Enter TAN number'
                                                    className="p-1 sm:p-2 border border-black rounded text-sm sm:text-base"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end ">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsModalOpen(false); // Close the modal
                                                resetForm(); // Reset the form fields
                                                setErrorMessage(''); // Clear the error message
                                            }}
                                            className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                                        >
                                            <FontAwesomeIcon icon={faTimes} className="mr-2" />
                                            Cancel
                                        </button>
                                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded"
                                            onClick={handleSubmit}>
                                            <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                            Add
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {isEditModalOpen1 && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                            <div className="bg-white p-5 rounded w-full max-w-[30%] h-[80%] custom-scrollbar overflow-auto">
                                {errorMessage && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                                        <strong className="font-bold">Message:</strong>
                                        <span className="block sm:inline">{errorMessage}</span>
                                    </div>
                                )}
                                <h2 className="text-2xl font-bold mb-4 ml-7">Edit Customer</h2>
                                <form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4 w-full">
                                    <div className='ml-7'>
                                        <h3 className="text-l font-bold mb-4">Customer Details</h3>
                                        <div className="flex flex-col mb-2">
                                            <label className="mb-2">Customer Name: <span className='text-red-500'>*</span></label>
                                            <input
                                                type="text"
                                                name="customer_name"
                                                value={newCustomer.customer_name}
                                                onChange={handleChange}
                                                required
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-2">
                                            <label>Landline Number: <span className='text-red-500'>*</span></label>
                                            <input
                                                type="text"
                                                name="landline_num"
                                                value={newCustomer.landline_num}
                                                onChange={handleLandlineChange}
                                                required
                                                className={`p-2 border ${landlineError ? 'border-red-500' : 'border-black'} rounded`}
                                            />
                                            {landlineError && <p className="text-red-500 text-sm">{landlineError}</p>}
                                        </div>
                                        <div className="flex flex-col mb-2">
                                            <label className="">E-mail: <span className='text-red-500'>*</span></label>
                                            <input
                                                type="email"
                                                name="email_id"
                                                value={newCustomer.email_id}
                                                onChange={handleEmailChange}
                                                required
                                                className={`p-2 border ${emailError ? 'border-red-500' : 'border-black'} rounded`}
                                            />
                                            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                                        </div>
                                        <div className="flex flex-col mb-2">
                                            <label className="mb-2">Address:</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={newCustomer.address}
                                                onChange={handleChange}
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-2">
                                            <label className="mb-2">Country:</label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={newCustomer.country}
                                                onChange={handleChange}
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-2">
                                            <label className="mb-2">State:</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={newCustomer.state}
                                                onChange={handleChange}
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-2">
                                            <label className="mb-2">City:</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={newCustomer.city}
                                                onChange={handleChange}
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-2">
                                            <label className="mb-2">Pincode:</label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={newCustomer.pincode}
                                                onChange={handleChange}
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-2">
                                            <label className="mb-2">GST Number:</label>
                                            <input
                                                type="text"
                                                name="gst_number"
                                                value={newCustomer.gst_number}
                                                onChange={handleChange}
                                                className="p-2 border border-black rounded"
                                            />
                                            {gstError && <p className="text-red-500 text-sm">{gstError}</p>}
                                        </div>
                                        <div className="flex flex-col mb-2">
                                            <label className="mb-2">PAN Number:</label>
                                            <input
                                                type="text"
                                                name="pan_no"
                                                value={newCustomer.pan_no}
                                                onChange={handleChange}
                                                className="p-2 border border-black rounded"
                                            />
                                            {panError && <p className="text-red-500 text-sm">{panError}</p>}
                                        </div>
                                        <div className="flex flex-col mb-2">
                                            <label className="mb-2">TAN Number:</label>
                                            <input
                                                type="text"
                                                name="tan_number"
                                                value={newCustomer.tan_number}
                                                onChange={handleChange}
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <button
                                            type="button"
                                            onClick={() => { setIsEditModalOpen1(false); resetForm(); }}
                                            className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                                        >
                                            <FontAwesomeIcon icon={faTimes} className="mr-2" />
                                            Cancel
                                        </button>
                                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded"
                                            onclick={handleEditCustomer}>
                                            <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                            Update
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {isDeleteModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                            <div className="bg-white p-5 rounded w-1/3">
                                {deleteErrorMessage && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                                        <strong className="font-bold">Message:</strong>
                                        <span className="block sm:inline">{deleteErrorMessage}</span>
                                    </div>
                                )}
                                <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                                <p>Are you sure you want to delete this customer?</p>
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteCustomer}
                                        className="px-4 py-2 bg-red-500 text-white rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/****************** CONTACT  DETAILS ****************** */}
                    {isModalOpen1 && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                            <div className="bg-white p-5 rounded w-full max-w-md h-[80%] overflow-y-auto relative">
                                {/* Close Button */}
                                <button
                                    onClick={() => {
                                        setIsModalOpen1(false); // Close the modal
                                        resetForm1(); // Reset the form fields
                                    }}
                                    className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                                >
                                    ✖
                                </button>
                                <h2 className="text-xl font-bold mb-4">Create Contact</h2>
                                <form onSubmit={handleAddContact} className="grid grid-cols-1 gap-4 w-full">
                                    {/* Contact Person Details */}
                                    <div>
                                        <h3 className="text-sm font-bold mb-4">Contact Person Details</h3>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">Contact Person:<text className=' text-red-500'>*</text></label>
                                            <input
                                                type="text"
                                                name="contact_person"
                                                value={newContact.contact_person}
                                                onChange={handleChange1}
                                                required
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">Phone:<span className='text-red-500'>*</span></label>
                                            <input
                                                type="text"
                                                name="phone_num"
                                                value={newContact.phone_num}
                                                onChange={handleChange1}
                                                required
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">E-mail: <text className=' text-red-500'>*</text></label>
                                            <input
                                                type="email"
                                                name="email_id"
                                                value={newContact.email_id}
                                                onChange={handleChange1}
                                                required
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">Address:</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={newContact.address}
                                                onChange={handleChange1}
                                                required
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">Country:</label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={newContact.country}
                                                onChange={handleChange1}
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">State:</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={newContact.state}
                                                onChange={handleChange1}
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">City:</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={newContact.city}
                                                onChange={handleChange1}
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">Pincode:</label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={newContact.pincode}
                                                onChange={handleChange1}
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">Department:</label>
                                            <input
                                                type="text"
                                                name="department"
                                                value={newContact.department}
                                                onChange={handleChange1}
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">Designation:</label>
                                            <input
                                                type="text"
                                                name="designation"
                                                value={newContact.designation}
                                                onChange={handleChange1}
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">Date of Start:</label>
                                            <input
                                                type="Date"
                                                name="date_of_start"
                                                value={newContact.date_of_start}
                                                onChange={handleChange1}
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">Date of End:</label>
                                            <input
                                                type="Date"
                                                name="date_of_end"
                                                value={newContact.date_of_end}
                                                onChange={handleChange1}
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">Status:</label>
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="active"
                                                    checked={newContact.status === 'active'}
                                                    onChange={handleChange1}
                                                    className="mr-2"
                                                />
                                                <label className="mr-4">Active</label>
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="inactive"
                                                    checked={newContact.status === 'inactive'}
                                                    onChange={handleChange1}
                                                    className="mr-2"
                                                />
                                                <label>Inactive</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center items-end col-span-2">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-500 text-white w-40 rounded mr-2 hover:bg-blue-600 hover:font-semibold hover:scale-105 transition-all ease-in-out shadow-md hover:shadow-xl"
                                            onClick={handleSubmit1}
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setNewContact({
                                                    contact_person: '',
                                                    phone_num: '',
                                                    email_id: '',
                                                    address: '',
                                                    country: '',
                                                    state: '',
                                                    city: '',
                                                    pincode: '',
                                                    department: '',
                                                    designation: '',
                                                    date_of_start: '',
                                                    date_of_end: '',
                                                    status: 'active', // Default status if needed
                                                });
                                                setIsModalOpen1(false);
                                            }}
                                            className="px-4 py-2 bg-red-500 text-white w-40 rounded hover:bg-red-600 hover:font-semibold hover:scale-105 transition-all ease-in-out shadow-md hover:shadow-xl"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                    {errorMessage && (
                                        <div className="text-red-500 px-4 py-3 rounded relative">
                                            <span className="block sm:inline">{errorMessage}</span>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    )}

                    {isEditModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                            <div className="bg-white p-5 rounded w-full max-w-md h-[80%] overflow-y-auto relative">
                                {/* Close Button */}
                                <button
                                    onClick={() => { setIsEditModalOpen(false); }}
                                    className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                                >
                                    ✖
                                </button>
                                <h2 className="text-xl font-bold mb-4">Edit Contact</h2>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        updateContactDetails(editingContact.contact_id, editingContact);
                                    }}
                                >
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Contact Person:</label>
                                        <input
                                            type="text"
                                            value={editingContact.contact_person}
                                            onChange={(e) =>
                                                setEditingContact({ ...editingContact, contact_person: e.target.value })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Phone:</label>
                                        <input
                                            type="phone"
                                            value={editingContact.phone_num}
                                            onChange={(e) =>
                                                setEditingContact({ ...editingContact, phone_num: e.target.value })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Email ID:</label>
                                        <input
                                            type="email"
                                            value={editingContact.email_id}
                                            onChange={(e) =>
                                                setEditingContact({ ...editingContact, email_id: e.target.value })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Address:</label>
                                        <input
                                            type="text"
                                            value={editingContact.address}
                                            onChange={(e) =>
                                                setEditingContact({ ...editingContact, address: e.target.value })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Country:</label>
                                        <input
                                            type="text"
                                            value={editingContact.country}
                                            onChange={(e) =>
                                                setEditingContact({ ...editingContact, country: e.target.value })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">State:</label>
                                        <input
                                            type="text"
                                            value={editingContact.state}
                                            onChange={(e) =>
                                                setEditingContact({ ...editingContact, state: e.target.value })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">City:</label>
                                        <input
                                            type="text"
                                            value={editingContact.city}
                                            onChange={(e) =>
                                                setEditingContact({ ...editingContact, city: e.target.value })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Pincode:</label>
                                        <input
                                            type="text"
                                            value={editingContact.pincode}
                                            onChange={(e) =>
                                                setEditingContact({ ...editingContact, pincode: e.target.value })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Department:</label>
                                        <input
                                            type="text"
                                            value={editingContact.department}
                                            onChange={(e) =>
                                                setEditingContact({ ...editingContact, department: e.target.value })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Designation:</label>
                                        <input
                                            type="text"
                                            value={editingContact.designation}
                                            onChange={(e) =>
                                                setEditingContact({ ...editingContact, designation: e.target.value })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Status:</label>
                                        <input
                                            type="text"
                                            value={editingContact.status}
                                            onChange={(e) =>
                                                setEditingContact({ ...editingContact, status: e.target.value })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                                            onClick={() => setIsEditModalOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-500 text-white rounded"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {isDetailModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                            <div className="bg-white p-5 rounded-2xl w-[55%] max-h-[100vh] overflow-auto relative">
                                <h2 className="text-xl font-bold mb-4">Customer Details</h2>
                                <div className="flex justify-between">
                                    <p className="text-sm font-bold text-black w-1/3">Customer Name:</p>
                                    <p className="text-gray-800 w-2/3">{selectedCustomer.customer_name}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm font-bold text-black w-1/3">Landline no.:</p>
                                    <p className="text-gray-800 w-2/3">{selectedCustomer.landline_num}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm font-bold text-black w-1/3">Email Id:</p>
                                    <p className="text-gray-800 w-2/3">{selectedCustomer.email_id}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm font-bold text-black w-1/3">Address:</p>
                                    <p className="text-gray-800 w-2/3">{selectedCustomer.address}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm font-bold text-black w-1/3">Country:</p>
                                    <p className="text-gray-800 w-2/3">{selectedCustomer.country}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm font-bold text-black w-1/3">State:</p>
                                    <p className="text-gray-800 w-2/3">{selectedCustomer.state}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm font-bold text-black w-1/3">City:</p>
                                    <p className="text-gray-800 w-2/3">{selectedCustomer.city}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm font-bold text-black w-1/3">Pincode:</p>
                                    <p className="text-gray-800 w-2/3">{selectedCustomer.pincode}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm font-bold text-black w-1/3">Tan number:</p>
                                    <p className="text-gray-800 w-2/3">{selectedCustomer.tan_number || 'NA'}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm font-bold text-black w-1/3">GST number:</p>
                                    <p className="text-gray-800 w-2/3">{selectedCustomer.gst_number || 'NA'}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm font-bold text-black w-1/3">PAN number:</p>
                                    <p className="text-gray-800 w-2/3">{selectedCustomer.pan_no || 'NA'}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm font-bold text-black w-1/3">Lead:</p>
                                    <p className="text-gray-800 w-2/3">{selectedCustomer.lead}</p>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-xl font-semibold mb-2">Contact Details</h3>
                                    {loadingContacts ? (
                                        <p>Loading contact details...</p>
                                    ) : (
                                        Array.isArray(contactDetails) && contactDetails.length > 0 ? (
                                            <div className="overflow-x-auto bg-white">
                                                <table className="min-w-full table-auto border-collapse">
                                                    <thead >
                                                        <tr>
                                                            <th className="py-3 px-4 border-b text-center font-semibold text-black">S.No.</th>
                                                            <th className="py-3 px-4 border-b text-center font-semibold text-black">Contact Person</th>
                                                            <th className="py-3 px-4 border-b text-center font-semibold text-black">Email ID</th>
                                                            <th className="py-3 px-4 border-b text-center font-semibold text-black">Phone Number</th>
                                                            <th className="py-3 px-4 border-b text-center font-semibold text-black">Status</th>
                                                            <th className="py-3 px-4 border-b text-center font-semibold text-black">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {contactDetails
                                                            .filter((contact) => contact.customer_id === selectedCustomer.customer_id)
                                                            .map((contact, index) => (
                                                                <tr key={index} className="hover:bg-gray-100">
                                                                    <td className="py-3 px-4 text-center">{index + 1}</td>
                                                                    <td className="py-3 px-4 text-center text-blue-500 hover:text-blue-700 cursor-pointer"
                                                                        onClick={() => handleContactClick(contact)}
                                                                    >
                                                                        {contact.contact_person}
                                                                    </td>
                                                                    <td className="py-3 px-4 text-center">{contact.email_id}</td>
                                                                    <td className="py-3 px-4 text-center">{contact.phone_num}</td>
                                                                    <td className="py-3 px-4 text-center">{contact.status}</td>
                                                                    <td className="py-3 px-4 text-center">
                                                                        <div className="flex justify-center space-x-2">
                                                                            {hasAMSAccessEditContact && (
                                                                                <button
                                                                                    className="text-blue-500 hover:text-blue-700"
                                                                                    onClick={() => handleEditContact(contact.contact_id)}
                                                                                    aria-label="Edit Contact"
                                                                                >
                                                                                    <FontAwesomeIcon icon={faEdit} />
                                                                                </button>
                                                                            )}
                                                                            {hasAMSAccessDeleteContact && (
                                                                                <button
                                                                                    className="text-red-500 hover:text-red-700"
                                                                                    onClick={() => handleDelete(contact.contact_id)}
                                                                                    aria-label="Delete Contact"
                                                                                >
                                                                                    <FontAwesomeIcon icon={faTrash} />
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <p>No contact details available.</p>
                                        )
                                    )}
                                </div>
                                <div className="flex justify-end mt-4">
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded"
                                        onClick={() => setIsDetailModalOpen(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isPopupOpen && selectedContact && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                                <h2 className="text-xl font-bold mb-4">Contact Details</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <p className="font-medium text-black w-1/3">Contact ID:</p>
                                        <p className="text-gray-800 w-2/3">{selectedContact.contact_id}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-medium text-black w-1/3">Contact Person:</p>
                                        <p className="text-gray-800 w-2/3">{selectedContact.contact_person}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-medium text-black w-1/3">Email ID:</p>
                                        <p className="text-gray-800 w-2/3">{selectedContact.email_id}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-medium text-black w-1/3">Phone No.:</p>
                                        <p className="text-gray-800 w-2/3">{selectedContact.phone_num}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-medium text-black w-1/3">Address:</p>
                                        <p className="text-gray-800 w-2/3">{selectedContact.address}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-medium text-black w-1/3">Country:</p>
                                        <p className="text-gray-800 w-2/3">{selectedContact.country}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-medium text-black w-1/3">State:</p>
                                        <p className="text-gray-800 w-2/3">{selectedContact.state}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-medium text-black w-1/3">City:</p>
                                        <p className="text-gray-800 w-2/3">{selectedContact.city}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-medium text-black w-1/3">Pincode:</p>
                                        <p className="text-gray-800 w-2/3">{selectedContact.pincode}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-medium text-black w-1/3">Department:</p>
                                        <p className="text-gray-800 w-2/3">{selectedContact.department}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-medium text-black w-1/3">Designation:</p>
                                        <p className="text-gray-800 w-2/3">{selectedContact.designation}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-medium text-black w-1/3">Date of Start:</p>
                                        <p className="text-gray-800 w-2/3">{selectedContact.date_of_start}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-medium text-black w-1/3">Date of End:</p>
                                        <p className="text-gray-800 w-2/3">{selectedContact.date_of_end}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-medium text-black w-1/3">Status:</p>
                                        <p className="text-gray-800 w-2/3">{selectedContact.status}</p>
                                    </div>
                                </div>
                                <button
                                    className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    onClick={closePopup}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="overflow-x-auto max-h-96 rounded-lg">
                        <table className="min-w-full table-auto border-collapse text-sm">
                            <thead className="bg-gray-200 sticky top-0 z-10">
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">S.no.</th>
                                    <th className="py-2 px-4 border-b text-left">Customer Name</th>
                                    <th className="py-2 px-4 border-b text-left">Landline no.</th>
                                    <th className="py-2 px-4 border-b text-left">Email</th>
                                    <th className="py-2 px-4 border-b text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.length > 0 ? (
                                    customers.map((customer, index) => (
                                        <tr key={index} className={`border-t ${index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}`}>
                                            <td className="p-3 border-b text-left">{index + 1} </td>
                                            <td className="p-3 border-b text-left text-blue-600 cursor-pointer" onClick={() => handleCustomerClick(customer)}   >
                                                {customer.customer_name}</td>
                                            <td className="p-3 border-b text-left">{customer.landline_num || 'NA'}</td>
                                            <td className="p-3 border-b text-left">{customer.email_id}</td>
                                            <td className="p-3 border-b text-left">
                                                {hasAMSAccessEdit && (
                                                    <button
                                                        className="text-blue-500 hover:text-blue-700 mr-2"
                                                        onClick={() => handleEditCustomer(index)}
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                )}
                                                {hasAMSAccessDelete && (
                                                    <button
                                                        className="text-red-500 hover:text-red-700 mr-2"
                                                        onClick={() => handleOpenDeleteModal(index)}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                )}
                                                {hasAMSAccessContact && (
                                                    <button
                                                        className="text-blue-500 hover:text-blue-700"
                                                        onClick={() => {
                                                            setSelectedCustomerId(customer.customer_id);
                                                            setIsModalOpen1(true);
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faContactCard} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="p-3 text-center text-gray-500">
                                            No matching found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* <div className="flex justify-center items-center p-4">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div> */}
                    </div>
                </div >
            </div >
        </div >
    );
};
export default Profile;