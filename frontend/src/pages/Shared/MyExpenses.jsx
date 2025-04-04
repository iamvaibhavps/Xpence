import React, { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    Typography,
    Spinner,
    Button,
    IconButton,
} from "@material-tailwind/react";
import { DollarSign, Tag, Calendar, ChevronLeft, ChevronRight, RefreshCw, Filter } from "lucide-react";
import { getAllTransaction } from "../../apis/apiCalls";
import moment from "moment";
import { useLocation } from "react-router-dom";
import AnimatedDialog from "../../components/Dialog/AnimtedDialog";

export default function MyExpenses() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [refreshTimestamp, setRefreshTimestamp] = useState(Date.now());
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState(""); // Add state for tracking selected sort
    const location = useLocation();
    const transactionsPerPage = 6;

    useEffect(() => {
        if (location.state?.refresh) {
            setRefreshTimestamp(Date.now());
        }
    }, [location.state]);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            try {
                const response = await getAllTransaction();
                setTransactions(response.data.data || []);
                setFilteredTransactions(response.data.data || []);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [refreshTimestamp]);

    const handleRefresh = () => {
        setRefreshTimestamp(Date.now());
    };

    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

    const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

    return (
        <div className="p-5">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-5 gap-3">
                {/* Title */}
                <Typography variant="h4" className="text-gray-800 font-bold flex-shrink-0">📊 My Expenses</Typography>

                {/* Search & Buttons Container */}
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="🔍 Search transactions..."
                        className="border border-gray-400 w-full md:w-96 rounded-md px-4 py-2 outline-none placeholder-gray-500"
                        onChange={(e) => {
                            const searchTerm = e.target.value.toLowerCase();
                            const filtered = transactions.filter((transaction) =>
                                transaction.title?.toLowerCase().includes(searchTerm) ||
                                transaction.category?.toLowerCase().includes(searchTerm) ||
                                transaction.paymentType?.toLowerCase().includes(searchTerm)
                            );
                            setFilteredTransactions(filtered);
                            setCurrentPage(1);
                        }}
                    />

                    {/* Buttons Group */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            className="bg-green-500 hover:bg-green-600 transition-all flex items-center px-4 py-2 rounded-lg shadow-md w-full sm:w-auto"
                            onClick={handleRefresh}
                        >
                            <RefreshCw size={18} className="mr-1" />
                            Refresh
                        </Button>

                        <Button
                            className="bg-blue-500 hover:bg-blue-600 transition-all flex items-center px-4 py-2 rounded-lg shadow-md w-full sm:w-auto"
                            onClick={() => setIsSortOpen(true)}
                        >
                            <Filter size={18} className="mr-1" />
                            Sort
                        </Button>
                    </div>
                </div>
            </div>


            {/* Transactions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {loading ? (
                    <div className="flex justify-center w-full">
                        <Spinner />
                    </div>
                ) : (
                    currentTransactions.map((transaction) => (
                        <Card
                            key={transaction.id}
                            className="shadow-lg border border-gray-200 p-5 transition-transform transform hover:scale-105 hover:shadow-2xl rounded-lg bg-white"
                        >
                            <CardBody>
                                {/* Title & Amount */}
                                <div className="flex justify-between items-center mb-3">
                                    <Typography variant="h6" className="text-gray-800 font-semibold">
                                        {transaction.title}
                                    </Typography>
                                    <span className={`text-lg font-semibold ${transaction.paymentType === "credit" ? "text-green-600" : "text-red-500"}`}>
                                        {transaction.paymentType === "credit" ? "+" : "-"} ₹{transaction.amount}
                                    </span>
                                </div>

                                {/* Category & Type */}
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Tag size={20} className="text-blue-500" />
                                    <Typography variant="small">Category: {transaction.category}</Typography>
                                </div>

                                {/* Date */}
                                <div className="flex items-center gap-3 mt-2 text-gray-600">
                                    <Calendar size={20} className="text-red-500" />
                                    <Typography variant="small">Date: {moment(transaction.date).format("DD MMM YYYY")}</Typography>
                                </div>

                                {/* Subscription Warning */}
                                {transaction.category?.toLowerCase() === "subscription" && (
                                    <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-md">
                                        <Typography variant="small" className="text-amber-800 font-medium flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            Recurring Subscription
                                        </Typography>
                                        <Typography variant="small" className="text-red-400 mt-1">
                                            You can stop the auto-pay for this subscription to prevent future charges.
                                        </Typography>
                                        {/* <div className="mt-2 flex gap-2">
                                            <button className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                                                Pause Autopay
                                            </button>
                                            <button className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">
                                                Stop Subscription
                                            </button>
                                        </div> */}
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-4">
                    <IconButton disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                        <ChevronLeft />
                    </IconButton>
                    <Typography variant="body2" className="text-gray-700">
                        Page {currentPage} of {totalPages}
                    </Typography>
                    <IconButton disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                        <ChevronRight />
                    </IconButton>
                </div>
            )}

            {/* Sort Dialog */}
            <AnimatedDialog
                isOpen={isSortOpen}
                onClose={() => setIsSortOpen(false)}
                title="Sort Transactions"
                className="max-w-md p-6"
            >
                <div className="space-y-5">
                    <Typography variant="h5" className="text-gray-900 font-bold">
                        Sort Transactions By
                    </Typography>

                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { label: "Date (Newest First)", sortFn: (a, b) => new Date(b.date) - new Date(a.date) },
                            { label: "Date (Oldest First)", sortFn: (a, b) => new Date(a.date) - new Date(b.date) },
                            { label: "Amount (Highest First)", sortFn: (a, b) => b.amount - a.amount },
                            { label: "Amount (Lowest First)", sortFn: (a, b) => a.amount - b.amount },
                            { label: "Category (A-Z)", sortFn: (a, b) => a.category.localeCompare(b.category) },
                            {
                                label: "Type (Credit First)",
                                sortFn: (a, b) => (a.paymentType === "credit" && b.paymentType !== "credit") ? -1 :
                                    (a.paymentType !== "credit" && b.paymentType === "credit") ? 1 : 0
                            }
                        ].map(({ label, sortFn }) => (
                            <Button
                                key={label}
                                onClick={() => {
                                    setFilteredTransactions([...filteredTransactions].sort(sortFn));
                                    setSelectedSort(label); // Update the selected sort
                                    setIsSortOpen(false);
                                }}
                                className={`w-full py-3 rounded-lg transition-all duration-300 
                        ${selectedSort === label ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-blue-100"}`}
                                fullWidth
                            >
                                {label}
                            </Button>
                        ))}
                    </div>

                    <Button
                        onClick={() => setIsSortOpen(false)}
                        className="w-full py-3 rounded-lg text-gray-600 hover:bg-gray-200 transition"
                    >
                        Cancel
                    </Button>
                </div>
            </AnimatedDialog>

        </div>
    );
}