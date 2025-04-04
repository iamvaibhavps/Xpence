import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Form_Components/Input';
import TextArea from '../../components/Form_Components/TextArea';
import SelectInput from '../../components/Dropdown/SelectInput';
import { FaCalendarAlt, FaDollarSign, FaFileAlt, FaTags, FaInfoCircle, FaExchangeAlt, FaRulerVertical } from 'react-icons/fa';
import { X } from 'lucide-react';
import { createTransaction, verifyDuplicateTransaction } from '../../apis/apiCalls';
import { useSelector } from 'react-redux';
import { showSuccessToast, showErrorToast } from '../../components/ToastNotification';

export default function CreateExpense({ handleCloseModalExpense, groupId }) {
    const currentUser = useSelector((state) => state.user.user);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        unit: { value: 'inr', label: 'Indian Rupees (INR)' },
        date: new Date(),
        category: null,
        customCategory: '',
        description: '',
        // attachments: null,
        paymentType: { value: 'debit', label: 'Debit' },
        group: currentUser?.groupId
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(true);
    const [duplicateTransactions, setDuplicateTransactions] = useState([]);
    const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);

    const categoryOptions = [
        { value: 'travel', label: 'Travel' },
        { value: 'food', label: 'Food & Dining' },
        { value: 'accommodation', label: 'Accommodation' },
        { value: 'supplies', label: 'Office Supplies' },
        { value: 'utilities', label: 'Utilities' },
        { value: 'subscription', label: 'Subscription' },
        { value: 'other', label: 'Other' }
    ];

    const unitOptions = [
        { value: 'usd', label: 'US Dollars (USD)' },
        { value: 'eur', label: 'Euros (EUR)' },
        { value: 'inr', label: 'Indian Rupees (INR)' },
        { value: 'gbp', label: 'British Pounds (GBP)' },
        { value: 'jpy', label: 'Japanese Yen (JPY)' },
        { value: 'aud', label: 'Australian Dollars (AUD)' }
    ];

    const paymentTypeOptions = [
        { value: 'debit', label: 'Debit' },
        { value: 'credit', label: 'Credit' }
    ];

    const handleCloseModal = () => {
        handleCloseModalExpense(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSelectChange = (selectedOption, { name }) => {
        setFormData({ ...formData, [name]: selectedOption });

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, attachments: e.target.files[0] });

        if (errors.attachments) {
            setErrors({ ...errors, attachments: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.amount) {
            newErrors.amount = 'Amount is required';
        } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Amount must be a positive number';
        }

        if (!formData.date) {
            newErrors.date = 'Date is required';
        }

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        if (formData.category?.value === 'other' && !formData.customCategory.trim()) {
            newErrors.customCategory = 'Custom category is required';
        }

        if (!formData.paymentType) {
            newErrors.paymentType = 'Payment type is required';
        }

        if (!formData.group) {
            newErrors.group = 'Group is required';
        }

        if (!formData.unit) {
            newErrors.unit = 'Unit is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(null);

        if (validateForm()) {
            setIsSubmitting(true);

            const expenseData = {
                title: formData.title,
                amount: parseFloat(formData.amount),
                unit: formData.unit.value,
                date: formData.date,
                category: formData.category.value === 'other' ? formData.customCategory : formData.category.value,
                description: formData.description,
                paymentType: formData.paymentType.value,
                group: formData.group
            };

            try {
                // First check for duplicate transactions
                const duplicateData = {
                    title: formData.title,
                    amount: parseFloat(formData.amount),
                    date: formData.date,
                    user: currentUser.id
                };

                const duplicateResponse = await verifyDuplicateTransaction(duplicateData);

                if (duplicateResponse.data.isDuplicate) {
                    setDuplicateTransactions(duplicateResponse.data.duplicates);
                    setShowDuplicateWarning(true);
                    showErrorToast('Duplicate transaction detected!');
                    setIsSubmitting(false);
                    return; // Stop the submission process
                }

                // If no duplicates found, proceed with creating the transaction
                const response = await createTransaction(expenseData);
                console.log('Transaction created successfully:', response.data);
                showSuccessToast('Transaction created successfully!');
                setShowSuccess(true);
                handleCloseModal();
                navigate('my-transactions?success=true', { state: { refresh: true } });
            } catch (error) {
                console.error('Error creating transaction:', error);
                setApiError(
                    error.response?.data?.message ||
                    'Failed to create transaction. Please try again.'
                );
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // Fix the fetchDuplicateTransactions function
    const fetchDuplicateTransactions = async () => {
        // Only check if we have the minimum required fields
        if (!formData.title || !formData.amount || !formData.date) {
            return;
        }

        try {
            const duplicateData = {
                title: formData.title,
                amount: parseFloat(formData.amount),
                date: formData.date,
                user: currentUser._id
            };

            const response = await verifyDuplicateTransaction(duplicateData);

            if (response.data.isDuplicate) {
                setDuplicateTransactions(response.data.duplicates);
                setShowDuplicateWarning(true);
            } else {
                setDuplicateTransactions([]);
                setShowDuplicateWarning(false);
            }
        } catch (error) {
            console.error("Error checking for duplicate transactions:", error);
            // Silently fail - don't block the user from submitting
        }
    };

    // Add a proper handleCreateAnyway function
    const handleCreateAnyway = async () => {
        setIsSubmitting(true);

        const expenseData = {
            title: formData.title,
            amount: parseFloat(formData.amount),
            unit: formData.unit.value,
            date: formData.date,
            category: formData.category.value === 'other' ? formData.customCategory : formData.category.value,
            description: formData.description,
            paymentType: formData.paymentType.value,
            group: formData.group
        };

        try {
            const response = await createTransaction(expenseData);
            console.log('Transaction created successfully:', response.data);
            showSuccessToast('Transaction created successfully!');
            setShowSuccess(true);
            handleCloseModal();
            navigate('my-transactions?success=true', { state: { refresh: true } });
        } catch (error) {
            console.error('Error creating transaction:', error);
            setApiError(
                error.response?.data?.message ||
                'Failed to create transaction. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
            setShowDuplicateWarning(false);
        }
    };

    return (
        <div className="p-3 rounded-lg w-full pb-4 max-h-[80vh]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Create New Expense</h2>
                <button
                    onClick={handleCloseModal}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <X />
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                {apiError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-md">
                        {apiError}
                    </div>
                )}

                {showDuplicateWarning && duplicateTransactions.length > 0 && (
                    <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-md">
                        <div className="font-medium mb-1">Potential duplicate expense detected!</div>
                        <p className="text-sm mb-2">The following similar expense(s) were found:</p>
                        <ul className="text-sm list-disc pl-5">
                            {duplicateTransactions.map((tx, index) => (
                                <li key={index}>
                                    "{tx.title}" - ₹{tx.amount} on {new Date(tx.date).toLocaleDateString()}
                                </li>
                            ))}
                        </ul>
                        <p className="text-sm mt-2 font-medium">Do you want to continue creating this expense?</p>
                        <div className="mt-2 flex space-x-2">
                            <button
                                type="button"
                                onClick={handleCreateAnyway}
                                className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700">
                                Yes, Create Anyway
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowDuplicateWarning(false)}
                                className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Title Field */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Expense Title*
                        </label>
                        <Input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter expense title"
                            icon={<FaFileAlt />}
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                    </div>

                    {/* Amount Field */}
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                            Amount (₹)*
                        </label>
                        <Input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            placeholder="Enter amount"
                            icon={<FaDollarSign />}
                        />
                        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
                    </div>

                    {/* Unit Field */}
                    <div>
                        <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                            Unit*
                        </label>
                        <SelectInput
                            id="unit"
                            options={unitOptions}
                            value={formData.unit || { value: 'Indian Rupees', label: 'Indian Rupees' }}
                            onChange={(option) => handleSelectChange(option, { name: 'unit' })}
                            placeholder="Select unit"
                            icon={<FaRulerVertical />}
                        />
                        {errors.unit && <p className="mt-1 text-sm text-red-600">{errors.unit}</p>}
                    </div>

                    {/* Date Field */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                            Date*
                        </label>
                        <Input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            icon={<FaCalendarAlt />}
                        />
                        {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
                    </div>

                    {/* Category Field */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Category*
                        </label>
                        <SelectInput
                            id="category"
                            options={categoryOptions}
                            value={formData.category}
                            onChange={(option) => handleSelectChange(option, { name: 'category' })}
                            placeholder="Select category"
                            icon={<FaTags />}
                        />
                        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                        {formData.category?.value === 'other' && (
                            <div className="mt-2">
                                <Input
                                    type="text"
                                    id="customCategory"
                                    name="customCategory"
                                    value={formData.customCategory}
                                    onChange={handleInputChange}
                                    placeholder="Enter custom category"
                                    icon={<FaTags />}
                                />
                                {errors.customCategory && <p className="mt-1 text-sm text-red-600">{errors.customCategory}</p>}
                            </div>
                        )}
                    </div>

                    {/* Payment Type Field */}
                    <div>
                        <label htmlFor="paymentType" className="block text-sm font-medium text-gray-700 mb-1">
                            Payment Type*
                        </label>
                        <SelectInput
                            id="paymentType"
                            options={paymentTypeOptions}
                            value={formData.paymentType}
                            onChange={(option) => handleSelectChange(option, { name: 'paymentType' })}
                            placeholder="Select payment type"
                            icon={<FaExchangeAlt />}
                        />
                        {errors.paymentType && <p className="mt-1 text-sm text-red-600">{errors.paymentType}</p>}
                    </div>

                    {/* Description Field - Takes full width */}
                    <div className="md:col-span-3">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description (Optional)
                        </label>
                        <TextArea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter expense description (optional)"
                            rows={4}
                            icon={<FaInfoCircle />}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-end space-x-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-dark hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Expense'}
                    </button>
                </div>


            </form>
        </div>

    );
}
