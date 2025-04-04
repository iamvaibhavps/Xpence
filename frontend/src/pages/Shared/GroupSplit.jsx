import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Card,
    Typography,
    Button,
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    Checkbox,
    IconButton,
    Spinner,
    Avatar,
    Chip
} from "@material-tailwind/react";
import {
    Plus,
    Users,
    DollarSign,
    ChevronLeft,
    Receipt,
    Split as SplitIcon,
    Check,
    ChevronsUpDown,
    Calendar,
    Clock,
    Send,
    User,
    X,
    MessageCircle,
    DeleteIcon,
    Trash,
    CheckCircle,
    XCircle,
    Circle
} from 'lucide-react';
import { showErrorToast, showSuccessToast } from '../../components/ToastNotification';
import Input from '../../components/Form_Components/Input';
import TextArea from '../../components/Form_Components/TextArea';
import AnimatedDialog from '../../components/Dialog/AnimtedDialog';
import SelectInput from '../../components/Dropdown/SelectInput';
import { useSelector } from 'react-redux';
import { createSplitTransaction, deleteGroup, getAllGroups, getAllSplits, updateSplitPaymentStatus } from '../../apis/apiCalls';
import Chat from '../../components/Chat';
// import Chat from '../../components/Chat';

export default function GroupSplit() {
    const location = useLocation();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user.user);

    const queryParams = new URLSearchParams(location.search);
    const groupId = queryParams.get('groupId');
    const createdById = queryParams.get('createdBy') || currentUser.id;

    const [loading, setLoading] = useState(false);
    const [group, setGroup] = useState(null);
    const [splits, setSplits] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [splitType, setSplitType] = useState('equal');
    const [currency, setCurrency] = useState('INR');
    const [selectedSplit, setSelectedSplit] = useState(null);
    const [viewSplitDialog, setViewSplitDialog] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [showChat, setShowChat] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        description: '',
        category: 'other',
        selectedMembers: []
    });

    const currencies = [
        { value: 'INR', label: 'Indian Rupee (₹)' },
        { value: 'USD', label: 'US Dollar ($)' },
        { value: 'EUR', label: 'Euro (€)' },
        { value: 'GBP', label: 'British Pound (£)' },
        { value: 'JPY', label: 'Japanese Yen (¥)' },
        { value: 'AUD', label: 'Australian Dollar (A$)' }
    ];

    const categories = [
        { value: 'food', label: 'Food & Drinks' },
        { value: 'transportation', label: 'Transportation' },
        { value: 'accommodation', label: 'Accommodation' },
        { value: 'entertainment', label: 'Entertainment' },
        { value: 'shopping', label: 'Shopping' },
        { value: 'utilities', label: 'Utilities' },
        { value: 'other', label: 'Other' }
    ];

    const convertToINR = (amount, currency) => {
        const exchangeRates = {
            USD: 85.32, // 1 USD = 85.32 INR
            EUR: 92.44, // 1 EUR = 92.44 INR
            GBP: 110.42, // 1 GBP = 110.42 INR
            JPY: 0.57, // 1 JPY = 0.57 INR
            AUD: 53.34, // 1 AUD = 53.34 INR
        };

        const upperCaseCurrency = currency ? currency.toUpperCase() : null;

        if (!amount || !exchangeRates[upperCaseCurrency]) {
            throw new Error("Invalid input or exchange rate not available.");
        }

        return (amount * exchangeRates[upperCaseCurrency]).toFixed(2);
    };

    // Calculate amount per member
    const calculateSplitAmount = () => {
        if (!formData.amount || formData.selectedMembers.length === 0) return 0;

        let convertedAmount = formData.amount;
        if (currency !== 'INR') {
            try {
                convertedAmount = convertToINR(parseFloat(formData.amount), currency);
            } catch (error) {
                console.error("Currency conversion error:", error);
                return 0;
            }
        }

        return (parseFloat(convertedAmount) / formData.selectedMembers.length).toFixed(2);
    };

    // Fetch group details and splits
    const fetchGroupDetails = async () => {
        if (!groupId) return;

        try {
            setLoading(true);

            const response = await getAllSplits();
            // console.log("Group Splits Response:", response);
            if (response.status === 200 && response.data) {
                // Filter splits for the current group
                const groupSplits = response.data.data.filter(split => split.group === groupId);
                setSplits(groupSplits);

                // Fetch group details separately if needed
                const groupsResponse = await getAllGroups();
                if (groupsResponse.data) {
                    const foundGroup = groupsResponse.data.data.find(g => g._id === groupId);
                    if (foundGroup) {
                        setGroup(foundGroup);
                    } else {
                        showErrorToast("Group not found");
                        navigate('/my-groups');
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching group details:", error);
            showErrorToast("Failed to fetch group details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroupDetails();
    }, [groupId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMemberToggle = (memberId) => {
        setFormData(prev => {
            const selectedMembers = [...prev.selectedMembers];
            const memberIndex = selectedMembers.indexOf(memberId);

            if (memberIndex === -1) {
                selectedMembers.push(memberId);
            } else {
                selectedMembers.splice(memberIndex, 1);
            }

            return {
                ...prev,
                selectedMembers
            };
        });
    };

    const handleCreateSplit = async () => {
        try {
            if (!formData.title) {
                showErrorToast("Title is required");
                return;
            }

            if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
                showErrorToast("Please enter a valid amount");
                return;
            }

            if (formData.selectedMembers.length === 0) {
                showErrorToast("Please select at least one member to split with");
                return;
            }

            setLoading(true);

            // Convert amount if needed
            let amountInINR = formData.amount;
            if (currency !== 'INR') {
                try {
                    amountInINR = convertToINR(parseFloat(formData.amount), currency);
                } catch (error) {
                    showErrorToast("Error converting currency");
                    return;
                }
            }

            // Prepare data for API call
            const splitData = {
                title: formData.title,
                amount: parseFloat(amountInINR),
                category: formData.category,
                description: formData.description,
                date: new Date().toISOString(),
                group: groupId,
                splitBetween: formData.selectedMembers,
                // Include the current user in the split chat
                chatMembers: [...formData.selectedMembers, currentUser.id]
            };

            // Make API call to create split
            const response = await createSplitTransaction(splitData);

            if (response.status === 201) {
                showSuccessToast(response.data.message || "Split created successfully!");
                setIsDialogOpen(false);
                resetForm();
                fetchGroupDetails(); // Refresh group details to show new split
            } else {
                showErrorToast(response.data.message || "Failed to create split");
            }

        } catch (error) {
            console.error("Error creating split:", error);
            showErrorToast(error.response?.data?.message || "Failed to create split");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            amount: '',
            description: '',
            category: 'other',
            selectedMembers: []
        });
        setSplitType('equal');
        setCurrency('INR');
    };

    const footerButtons = [
        {
            label: "Cancel",
            onClick: () => {
                resetForm();
                setIsDialogOpen(false);
            },
            color: "red",
            variant: "text"
        },
        {
            label: loading ? "Creating..." : "Create Split",
            onClick: handleCreateSplit,
            color: "dark",
            disabled: loading
        }
    ];

    const handleBack = () => {
        navigate('/my-groups');
    };

    const handleViewSplit = (split) => {
        setSelectedSplit(split);
        setViewSplitDialog(true);
        // Here you would fetch chat messages for this split
        // For now, we'll use dummy data
        setChatMessages([
            { sender: "John Smith", message: "I've paid this amount", time: "10:30 AM", isCurrentUser: false },
            { sender: "You", message: "Thanks for paying!", time: "10:32 AM", isCurrentUser: true },
            { sender: "Jane Doe", message: "I'll transfer my part soon", time: "10:35 AM", isCurrentUser: false },
        ]);
    };

    const handleSendMessage = () => {
        if (!chatMessage.trim()) return;

        const newMessage = {
            sender: "You",
            message: chatMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isCurrentUser: true
        };

        setChatMessages([...chatMessages, newMessage]);
        setChatMessage('');
    };

    const getCategoryIcon = (category) => {
        const icons = {
            food: "🍔",
            transportation: "🚗",
            accommodation: "🏠",
            entertainment: "🎬",
            shopping: "🛍️",
            utilities: "💡",
            other: "📦"
        };
        return icons[category] || icons.other;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getCategoryLabel = (categoryValue) => {
        const category = categories.find(c => c.value === categoryValue);
        return category ? category.label : "Other";
    };

    if (loading && !group) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner className="h-12 w-12" />
            </div>
        );
    }

    const handleDeleteGroup = async (groupId) => {
        try {
            setLoading(true);
            const response = await deleteGroup(groupId);
            if (response.data) {
                showSuccessToast("Group deleted successfully!");
                navigate(`/${currentUser.role}/my-groups`);
            } else {
                showErrorToast(response.data.message || "Failed to delete group");
            }
        } catch (error) {
            console.error("Error deleting group:", error);
            showErrorToast(error.response?.data?.message || "Failed to delete group");
        } finally {
            setLoading(false);
        }
    };


    const handlePaymentStatus = async (memberId, splitId) => {
        try {
            setLoading(true);
            const paymentData = {
                splitId: splitId,
                memberId: memberId
            };

            const response = await updateSplitPaymentStatus(paymentData);

            if (response.data) {
                showSuccessToast("Payment status updated successfully!");
                fetchGroupDetails();
                setViewSplitDialog(false);
            } else {
                showErrorToast(response.data?.message || "Failed to update payment status");
            }
        } catch (error) {
            console.log(error);
            console.error("Error updating payment status:", error);
            showErrorToast(error.response?.data?.message || "Failed to update payment status");
        } finally {
            setLoading(false);
        }
    };


    const hasPaymentDone = () => {
        return selectedSplit.splitBetween.some((detail) => detail.hasPaid);
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between ">
                <div className="flex items-center mb-6">
                    {/* <IconButton
                        color="gray"
                        variant="text"
                        onClick={handleBack}
                        className="mr-2"
                    >
                        <ChevronLeft />
                    </IconButton> */}
                    <Typography variant="h4" className="font-bold text-gray-800">
                        {group?.name || "Group Splits"}
                    </Typography>
                </div>

                {createdById === currentUser.id && (
                    <div className='flex justify-end px-4 py-2 hover:bg-red-50 rounded-lg cursor-pointer'
                        onClick={() => handleDeleteGroup(groupId)}
                    >
                        <Trash className='text-red-500 cursor-pointer ml-auto' size={24} />
                        <span className='text-red-500 cursor-pointer ml-2' >
                            Delete
                        </span>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center mb-6">
                <div>
                    <Typography variant="h6" className="text-gray-700">
                        Manage Expenses & Splits
                    </Typography>
                    <div className="flex items-center text-gray-600 mt-1">
                        <Users size={16} className="mr-1" />
                        <Typography variant="small">
                            {group?.members?.length || 0} members
                        </Typography>
                    </div>
                </div>
                <Button
                    color="dark"
                    className="flex items-center gap-2"
                    onClick={() => setIsDialogOpen(true)}
                >
                    <Plus size={16} />
                    Create Split
                </Button>
            </div>

            {splits.length === 0 ? (
                <Card className="p-8 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <SplitIcon size={24} className="text-blue-600" />
                    </div>
                    <Typography variant="h5" className="mb-2">No Splits Yet</Typography>
                    <Typography variant="paragraph" className="text-gray-600 mb-6">
                        Create your first split expense to start tracking who owes what.
                    </Typography>
                    <Button
                        color="dark"
                        className="mx-auto flex items-center gap-2"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <Plus size={16} />
                        Create Split
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {splits.map(split => (
                        <Card
                            key={split._id}
                            className="p-5 rounded-2xl shadow-md hover:shadow-xl transition-all bg-white border border-gray-200 cursor-pointer"
                            onClick={() => handleViewSplit(split)}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                        <span className="text-lg">{getCategoryIcon(split.expense.category)}</span>
                                    </div>
                                    <Typography variant="h6" className="font-semibold text-gray-800">
                                        {split.expense.title}
                                    </Typography>
                                </div>
                                <Typography
                                    variant="small"
                                    className="text-white bg-blue-500 px-2 py-1 rounded-full text-xs font-medium"
                                >
                                    ₹{split.expense.amount}
                                </Typography>
                            </div>

                            <Typography variant="small" className="text-gray-600 mb-4">
                                {split.expense.description || `Split equally among ${split.splitBetween.length} people`}
                            </Typography>

                            <div className="mb-4">
                                <div className="flex flex-wrap gap-2">
                                    {split.splitBetween.slice(0, 3).map(person => (
                                        <div
                                            key={person._id}
                                            className={`px-2 py-1 rounded-full text-xs flex items-center ${person.hasPaid
                                                ? "bg-green-50 text-green-700"
                                                : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {person.hasPaid && <Check size={12} className="mr-1" />}
                                            {person.member.name.split(' ')[0]} (₹{Math.round(person.amount).toFixed(2)})
                                        </div>
                                    ))}
                                    {split.splitBetween.length > 3 && (
                                        <div className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                            +{split.splitBetween.length - 3} more
                                        </div>
                                    )}
                                </div>
                                {/* <div className="flex flex-wrap gap-2">
                                    {split.splitBetween.slice(0, 3).map(person => (
                                        <div key={person._id} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                            {person.member.name.split(' ')[0]} (₹{person.amount})
                                        </div>
                                    ))}
                                    {split.splitBetween.length > 3 && (
                                        <div className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                            +{split.splitBetween.length - 3} more
                                        </div>
                                    )}
                                </div> */}
                            </div>

                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                                <div className="flex items-center text-xs text-gray-500">
                                    <Calendar size={14} className="mr-1" />
                                    {formatDate(split.expense.date)}
                                </div>
                                <Button
                                    size="sm"
                                    variant="text"
                                    className="text-blue-500 hover:bg-blue-50 p-2"
                                >
                                    Details
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <AnimatedDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    resetForm();
                    setIsDialogOpen(false);
                }}
                title="Create Split"
                footerButtons={footerButtons}
                className="max-w-4xl mx-auto p-4 max-h-[80vh] overflow-y-auto"
            >
                <div className="space-y-4">
                    <Typography variant="h5" className="font-bold text-center mb-4">
                        Create New Split
                    </Typography>

                    <div>
                        <Typography variant="small" className="font-medium mb-1">
                            Title*
                        </Typography>
                        <Input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="What is this expense for?"
                            className="w-full"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Typography variant="small" className="font-medium mb-1">
                                Amount*
                            </Typography>
                            <Input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                className="w-full"
                                required
                            />
                        </div>
                        <div>
                            <Typography variant="small" className="font-medium mb-1">
                                Currency
                            </Typography>
                            <SelectInput
                                options={currencies}
                                value={currencies.find(c => c.value === currency)}
                                onChange={(selected) => setCurrency(selected.value)}
                                placeholder="Select Currency"
                                borderRadius="0.5rem"
                            />
                        </div>
                    </div>

                    <div>
                        <Typography variant="small" className="font-medium mb-1">
                            Category
                        </Typography>
                        <SelectInput
                            options={categories}
                            value={categories.find(c => c.value === formData.category)}
                            onChange={(selected) => setFormData(prev => ({ ...prev, category: selected.value }))}
                            placeholder="Select Category"
                            borderRadius="0.5rem"
                            className='z-30'
                        />
                    </div>

                    <div>
                        <Typography variant="small" className="font-medium mb-1">
                            Description
                        </Typography>
                        <TextArea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Add details about this expense"
                            className="w-full"
                            rows={2}
                        />
                    </div>

                    <div>
                        <Typography variant="small" className="font-medium mb-2">
                            Split Type
                        </Typography>
                        <Tabs value={splitType} className="w-full">
                            <TabsHeader>
                                <Tab value="equal" onClick={() => setSplitType('equal')}>
                                    Equal Split
                                </Tab>
                                {/* <Tab value="custom" onClick={() => setSplitType('custom')}>
                                    Custom Split
                                </Tab> */}
                            </TabsHeader>
                        </Tabs>
                    </div>

                    <div>
                        <Typography variant="small" className="font-medium mb-1">
                            Split With*
                        </Typography>
                        <div className="border border-gray-300 rounded-md overflow-hidden divide-y">
                            {group?.members?.map((member) => (
                                <div
                                    key={member._id}
                                    className="flex items-center justify-between p-3 hover:bg-gray-50"
                                >
                                    <div className="flex items-center">
                                        <Checkbox
                                            checked={formData.selectedMembers.includes(member._id)}
                                            onChange={() => handleMemberToggle(member._id)}
                                            className="mr-2"
                                        />
                                        <Typography variant="paragraph">
                                            {member.name} {member._id === currentUser.id ? "(You)" : ""}
                                        </Typography>
                                    </div>

                                    {splitType === 'equal' && formData.selectedMembers.includes(member._id) ? (
                                        <Typography variant="small" className="text-gray-600">
                                            ₹{calculateSplitAmount()}
                                        </Typography>
                                    ) : splitType === 'custom' && formData.selectedMembers.includes(member._id) ? (
                                        <Input
                                            type="number"
                                            placeholder="Amount"
                                            className="w-24 h-8 text-sm"
                                        // This would need more functionality for custom splits
                                        />
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-md">
                        <Typography variant="small" className="font-medium">
                            Summary
                        </Typography>
                        <div className="flex justify-between mt-1">
                            <Typography variant="small" className="text-gray-600">
                                Total amount:
                            </Typography>
                            <Typography variant="small" className="font-medium">
                                {currency} {formData.amount || "0.00"}
                                {currency !== 'INR' && formData.amount && (
                                    <span className="ml-1 text-xs text-gray-500">
                                        (₹{convertToINR(parseFloat(formData.amount || 0), currency)})
                                    </span>
                                )}
                            </Typography>
                        </div>
                        <div className="flex justify-between">
                            <Typography variant="small" className="text-gray-600">
                                Split type:
                            </Typography>
                            <Typography variant="small">
                                {splitType === 'equal' ? 'Equal' : 'Custom'}
                            </Typography>
                        </div>
                        <div className="flex justify-between">
                            <Typography variant="small" className="text-gray-600">
                                Members selected:
                            </Typography>
                            <Typography variant="small">
                                {formData.selectedMembers.length}
                            </Typography>
                        </div>
                    </div>
                </div>
            </AnimatedDialog>

            {/* Split Details Dialog */}
            <AnimatedDialog
                isOpen={viewSplitDialog}
                onClose={() => setViewSplitDialog(false)}
                title="Split Details"
                className="max-w-sm md:max-w-6xl mx-auto p-0 max-h-[85vh] overflow-hidden"
            >
                {selectedSplit && (
                    <div className="flex flex-col md:flex-row h-[75vh] relative">

                        <button
                            className="md:hidden absolute top-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg"
                            onClick={() => setShowChat(!showChat)}
                        >
                            {showChat ? <X size={20} /> : <MessageCircle size={20} />}
                        </button>


                        {!showChat && (
                            <div className="w-full md:w-2/3 p-6 overflow-y-auto border-r border-gray-200">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {selectedSplit.expense.title}
                                    </h2>
                                    <div className="flex items-center mt-2 text-gray-600">
                                        <span className="text-2xl mr-2">
                                            {getCategoryIcon(selectedSplit.expense.category)}
                                        </span>
                                        <p className="text-gray-600">{getCategoryLabel(selectedSplit.expense.category)}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="p-4 bg-blue-50 rounded-lg shadow">
                                        <h3 className="text-lg font-semibold text-blue-800">Amount</h3>
                                        <p className="text-2xl font-bold text-blue-900">
                                            ₹{Math.round(selectedSplit.expense.amount)}
                                        </p>
                                        <p className="text-sm text-blue-700 mt-1">
                                            {selectedSplit.expense.unit}
                                        </p>
                                    </div>

                                    <div className="p-4 bg-green-50 rounded-lg shadow">
                                        <h3 className="text-lg font-semibold text-green-800">Paid By</h3>
                                        <div className="flex items-center mt-2">
                                            <div className="w-10 h-10 flex items-center justify-center bg-green-600 text-white rounded-full text-lg font-semibold">
                                                {selectedSplit.splitPayer.name.charAt(0)}
                                            </div>
                                            <div className="ml-3">
                                                <h4 className="text-lg font-bold text-green-900">
                                                    {selectedSplit.splitPayer.name}

                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-3">Description</h3>
                                    <div className="p-4 bg-gray-50 rounded-lg shadow">
                                        <p className="text-gray-600">
                                            {selectedSplit.expense.description || "No description provided"}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-lg font-semibold">Split Between</h3>
                                        <div className="flex items-center text-gray-600">
                                            <Calendar size={16} className="mr-1" />
                                            <p className="text-sm">{formatDate(selectedSplit.expense.date)}</p>
                                        </div>
                                    </div>

                                    <div className="overflow-hidden bg-white rounded-lg shadow-md">
                                        <div className="divide-y divide-gray-200">
                                            {selectedSplit.splitBetween.map((person) => {
                                                const isCurrentUser = person.member._id === selectedSplit?.splitPayer._id;
                                                return (
                                                    <div
                                                        key={person._id}
                                                        className="flex-col md:flex-row items-center justify-between p-4 hover:bg-gray-50"
                                                    >
                                                        <div className="flex items-center">
                                                            <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full text-sm font-semibold">
                                                                {person.member.name.charAt(0)}
                                                            </div>
                                                            <div className="ml-3">
                                                                <h4 className="text-md font-medium">
                                                                    {person.member.name} {isCurrentUser && "(You)"}
                                                                </h4>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between ">
                                                            <h4 className="text-md font-bold mr-3">₹{Math.round(person.amount).toFixed(2)}</h4>
                                                            
                                                            <div className='flex items-center'>
                                                                <span
                                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${isCurrentUser || person.hasPaid
                                                                        ? "bg-green-100 text-green-800"
                                                                        : "bg-gray-100 text-gray-800"
                                                                        }`}
                                                                >
                                                                    {isCurrentUser || person.hasPaid ? "Paid" : "Pending"} {" "}
                                                                    
                                                                </span>
                                                                <span>
                                                                    {selectedSplit.splitPayer._id === currentUser.id && (
                                                                        <button
                                                                            className={`ml-2 p-1 rounded-full ${person.hasPaid ? 'bg-green-100' : 'bg-green-50 hover:bg-green-100'} text-green-600 transition-colors`}
                                                                            onClick={(e) => {
                                                                                if (!person.hasPaid) {
                                                                                    e.stopPropagation();
                                                                                    handlePaymentStatus(
                                                                                        person.member._id,
                                                                                        selectedSplit._id,
                                                                                    );
                                                                                }
                                                                            }}
                                                                            disabled={person.hasPaid}
                                                                            title={person.hasPaid ? "Payment received" : "Mark as paid"}
                                                                        >
                                                                            {person.hasPaid ? (
                                                                                // <CheckCircle size={16} />
                                                                                <span></span>
                                                                            ) : (
                                                                                !isCurrentUser && <Circle size={16} />
                                                                            )}
                                                                        </button>
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {showChat === false && (
                            <Chat selectedChat={selectedSplit.chatId} />
                        )}
                    </div>
                )}
            </AnimatedDialog>

        </div>
    );
}
