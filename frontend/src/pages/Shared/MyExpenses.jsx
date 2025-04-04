import React, { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    Typography,
    Spinner,
    Button,
    IconButton,
} from "@material-tailwind/react";
import { DollarSign, Tag, Calendar, ChevronLeft, ChevronRight, RefreshCw, Filter, Plus } from "lucide-react";
import { getAllTransaction } from "../../apis/apiCalls";
import moment from "moment";
import { useLocation } from "react-router-dom";
import AnimatedDialog from "../../components/Dialog/AnimtedDialog";

export default function MyExpenses() {

    // get params from url
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");

    // console.log("Success:", success);

    const [showModal, setShowModal] = useState(false);

    // setTimeout for 3 seconds
    useEffect(() => {
        if (success) {
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
            }, 3000);
        }
    }, [success]);

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [refreshTimestamp, setRefreshTimestamp] = useState(Date.now());
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false); // Add missing state
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
        <>
            {showModal && (
                <div className="flex items-center justify-center  bg-opacity-90 z-100 w-40 h-40">
                    <video autoPlay className="w-40 h-40" onEnded={() => setShowModal(false)}>
                        <source src="../../assets/GoldenStar.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}

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
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 w-full">
                    {loading ? (
                        <div className="flex justify-center w-full">
                            <Spinner />
                        </div>
                    ) : currentTransactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center w-full h-full">
                            <div className="flex flex-col items-center justify-center py-10 w-full ">
                                <img src="data:image/png;base64,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" alt=""
                                    className="w-20 h-20 mb-4" />

                                <Typography variant="h6" className="text-gray-600">
                                    You don't have any transaction expense yet
                                </Typography>
                                {/* <Typography className="text-gray-500 mt-2 mb-4">
                                Create a group to start splitting expenses with friends
                            </Typography> */}
                                <Button
                                    color="dark"
                                    className="flex items-center gap-2 mt-3"
                                    onClick={() => setIsDialogOpen(true)}
                                >
                                    <Plus size={16} />
                                    Create Your First Expense
                                </Button>
                            </div>
                        </div>
                    ) : (
                        currentTransactions?.map((transaction) => (
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
                                        <span className={`text-lg font-semibold text-end w-full ${transaction.paymentType === "credit" ? "text-green-600" : "text-red-500"}`}>
                                            {transaction.paymentType === "credit" ? "+" : "-"} ₹{parseFloat(Math.round(transaction.amount * 100) / 100).toFixed(2)}
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
                                        <Typography variant="small">Date: {moment(transaction.created_at || transaction.date).format("DD MMM YYYY")}</Typography>
                                    </div>

                                    {/* Subscription Warning */}
                                    {transaction.category?.toLowerCase() === "subscription" && (
                                        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
                                            <Typography variant="small" className="text-blue-800 font-medium flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="text-blue-400 mr-1" width="15" height="15" viewBox="0 0 50 50">
                                                    <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z"></path>
                                                </svg>
                                                <span className="">Recurring Subscription</span>
                                            </Typography>
                                            <Typography variant="small" className="text-blue-400 mt-1">
                                                You can stop the auto-pay for this subscription to prevent future charges.
                                            </Typography>
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
                                {
                                    label: "Date (Newest First)",
                                    sortFn: (a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date)
                                },
                                {
                                    label: "Date (Oldest First)",
                                    sortFn: (a, b) => new Date(a.created_at || a.date) - new Date(b.created_at || b.date)
                                },
                                {
                                    label: "Amount (Highest First)",
                                    sortFn: (a, b) => parseFloat(b.amount) - parseFloat(a.amount)
                                },
                                {
                                    label: "Amount (Lowest First)",
                                    sortFn: (a, b) => parseFloat(a.amount) - parseFloat(b.amount)
                                }
                            ].map(({ label, sortFn }) => (
                                <Button
                                    key={label}
                                    onClick={() => {
                                        const sortedData = [...filteredTransactions].sort(sortFn);
                                        setFilteredTransactions(sortedData);
                                        setSelectedSort(label);
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

        </>
    );
}