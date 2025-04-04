import React, { useEffect, useRef, useState } from "react";
import {
    Typography,
    Button,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Avatar,
} from "@material-tailwind/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/Slices/userSlice";
import { Badge } from "@material-tailwind/react";
import {
    BellIcon,
    Plus,
    Search,
    SearchIcon,
    X,
    UserCircle,
    ChevronDown,
    LogOut,
    BarChart2,
    Bell
} from "lucide-react";

import moment from "moment";
import { showInfoToast } from "./ToastNotification";

// import CreateTask from '../pages/Shared Pages/Task/CreateTask'
import { getAllNotifications, readNotification, } from "../apis/apiCalls";
import AnimatedDialog from "./Dialog/AnimtedDialog";
import CreateExpense from "../pages/Shared/CreateExpense";


const profileMenuItems = [
    {
        label: "My Dashboard",
        icon: BarChart2,
        action: (navigate, role) => navigate(`/${role}/dashboard`),
    },
    {
        label: "My Profile",
        icon: UserCircle,
        action: (navigate, role) => navigate(`/${role}/my-profile`),
    },
    {
        label: "Sign Out",
        icon: LogOut,
        action: (handleLogout, navigate) => {
            handleLogout();
            navigate('/auth/sign-in');
        },
    },
];



function ProfileMenu({ handleLogout, navigate, role }) {

    const currentUser = useSelector((state) => state.user.user);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const closeMenu = () => setIsMenuOpen(false);

    const getPlaceholder = (name) => {
        const initials = name.charAt(0).toUpperCase();
        return (
            <div className="w-10 h-10 rounded-full mr-3 border border-gray-400 bg-gray-400 flex items-center justify-center text-lg font-semibold text-dark">
                {initials}
            </div>
        );
    };

    return (
        <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
            <MenuHandler>
                <Button
                    variant="text"
                    color="blue-gray"
                    className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
                >
                    <Avatar
                        variant="circular"
                        size="sm"
                        alt="user"
                        className="border  border-dark"
                        src={"data:image/png;base64,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"}
                    />

                    <ChevronDown
                        color="black"
                        size={15}
                        className={`transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
                    />
                </Button>
            </MenuHandler>
            <MenuList className="p-1">
                {profileMenuItems
                    .map(({ label, icon, action }, key) => {
                        const isLastItem = key === profileMenuItems.length - 1;
                        return (
                            <MenuItem
                                key={label}
                                onClick={() => {
                                    closeMenu();
                                    action(label === "Sign Out" ? handleLogout : navigate, role);
                                }}
                                className={`flex items-center gap-2 rounded ${isLastItem ? "" : ""}`}
                            >
                                {React.createElement(icon, {
                                    className: `h-4 w-4 ${isLastItem ? "text-red-500" : "text-dark"}`,
                                    strokeWidth: 2,
                                })}
                                <Typography
                                    as="span"
                                    variant="small"
                                    className="font-normal"
                                    color={isLastItem ? "red" : "black"}
                                >
                                    {label}
                                </Typography>
                            </MenuItem>
                        );
                    })}
            </MenuList>
        </Menu>
    );
}

export default function NavbarList({ title }) {
    const currentUser = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [notificationData, setNotificationData] = useState([]);
    const [recentNotifications, setRecentNotifications] = useState([]);
    const [allNotifications, setAllNotifications] = useState([]);
    const [activeTab, setActiveTab] = useState('recent');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const fetchNotifications = async () => {
        try {
            const response = await getAllNotifications();
            // console.log(response)
            const notifications = response.data.data || [];

            setNotificationData(notifications);
            setRecentNotifications(notifications.filter(notif => !notif.isRead));
            setAllNotifications(notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        if (currentUser?.id) {
            fetchNotifications();
        }
    }, [currentUser?.id]);

    const markAsRead = async (notificationId) => {
        try {
            const response = await readNotification(notificationId);

            if (response.status === 200) {
                setRecentNotifications(prev =>
                    prev.filter(notif => notif._id !== notificationId)
                );

                handleCloseModal();
                showInfoToast('Notification marked as read');
                fetchNotifications();
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const totalRecentNotifications = recentNotifications.length;

    const handleLogout = () => {
        dispatch(logout());
        dispatch(closeModal());
        navigate('/auth/sign-in');
    };

    const [isTaskModelOpen, setIsTaskModelOpen] = useState(false);


    const handleOpenModalExpense = () => {
        setIsTaskModelOpen(true);
        dispatch(openModal());
    };


    const handleCloseModalExpense = () => {
        setIsTaskModelOpen(false);
        dispatch(closeModal());
    };


    // Search Bar logic & implementation
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = async (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value.trim() === '') {
            setShowResults(false);
            return;
        }
    };

    const handleResultClick = (result) => {

        // history.push(`/path/to/${result.type}/${result.id}`);
        // setShowResults(false);
    };

    const divRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (divRef.current && !divRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);



    return (
        <div className="pr-[15px] md:pl-[15px] md:pr-[25px] flex items-center shadow-2xl md:shadow-none py-3 ">
            <div className="flex items-center justify-between w-full py-1 relative ">

                <h1 className="text-[18px] md:text-2xl lg:text-3xl font-bold truncate flex-shrink min-w-0 max-w-[150px] md:max-w-[200px] lg:max-w-[300px]
                                ">
                    {title}
                </h1>

                {showResults && (
                    <div ref={divRef} className="absolute z-40 h-96 top-full left-40 lg:w-[1000px] bg-white border border-gray-300 rounded-lg shadow-lg mt-2 backdrop-filter backdrop-blur-md overflow-hidden">
                        {/* Search Input Container */}
                        <div className="relative w-[200px] md:w-[300px] lg:w-[400px] mx-auto mt-4">
                            <input
                                type="search"
                                className="w-full border-2 border-gray-300 focus:shadow-lg  outline-none rounded-full py-2 px-4 pr-12 text-gray-700 placeholder:text-gray-400 shadow-sm"
                                placeholder="Search here"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <img
                                src={SearchIcon}
                                alt="search"
                                className="absolute top-1/2 right-4 transform -translate-y-1/2 w-5 h-5 text-gray-500"
                            />
                        </div>
                        {/* Search Results */}
                        <div className="mt-4 max-h-[300px] overflow-y-auto divide-y divide-gray-200">
                            {searchResults.length > 0 ? (
                                searchResults.map((result) => (
                                    <div
                                        key={result.id}
                                        className="p-4 hover:bg-gray-100 cursor-pointer transition-colors flex items-center"
                                        onClick={() => handleResultClick(result)}
                                    >
                                        {/* Result Name */}
                                        <span className="text-gray-700 font-medium">{result.name}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-gray-500 text-center">
                                    No results found.
                                </div>
                            )}
                        </div>
                    </div>
                )}


                {/* Action Section */}
                <div className="flex-shrink-0 flex items-center">
                    {!currentUser ? (
                        <Link to={'/auth/sign-in'}>
                            <Button size="sm" variant="gradient" color="dark">
                                Sign In
                            </Button>
                        </Link>
                    ) : (

                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="flex items-center gap-2 sm:gap-4 ">
                                <div className="flex items-center gap-[12px] ">
                                    {currentUser?.role !== 'super-admin' && (
                                        <>
                                            {/* Create Task Button */}
                                            <button
                                                className="flex items-center justify-center md:mr-1 gap-1 px-2 sm:px-4 md:w-[320px] lg:w-[256px] py-2 bg-dark text-white text-sm font-semibold uppercase rounded-full whitespace-nowrap"
                                                onClick={handleOpenModalExpense}
                                            >
                                                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                                <span className="text-xs md:text-base">Create Expense</span>
                                            </button>

                                            {/* Search Bar */}

                                            <div className="hidden sm:block relative w-[150px] md:w-[200px] lg:w-[308px]">
                                                <input
                                                    type="search"
                                                    className="w-full border-2 border-dark outline-none rounded-full py-1.5 px-4 pr-10"
                                                    placeholder="Search here"
                                                    // value={searchTerm}
                                                    // onChange={handleSearch}
                                                    onClick={() => setShowResults(true)}
                                                />
                                                {/* <img src={Search} alt="search" /> */}
                                                <Search className='absolute top-1/2 right-3 transform -translate-y-1/2 w-5 h-5 text-dark' />
                                            </div>

                                        </>
                                    )}
                                </div>

                                {/* Notification and Profile Section */}
                                <div className="flex items-center gap-3 md:gap-4">
                                    {currentUser?.role !== 'super-admin' && (
                                        <button className="flex-shrink-0 mt-2" onClick={handleOpenModal}>
                                            <Badge color="red" content={totalRecentNotifications} placement="top-end" className="text-xs">
                                                <Bell />
                                            </Badge>
                                        </button>
                                    )}

                                    <div className="flex-shrink-0">
                                        <ProfileMenu
                                            handleLogout={handleLogout}
                                            navigate={navigate}
                                            role={currentUser.role}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Notifications Dialog */}
                            <AnimatedDialog
                                isOpen={isModalOpen}
                                onClose={handleCloseModal}
                                roundedSize="lg"
                                className="bg-white max-w-xs md:max-w-3xl lg:max-w-3xl rounded-lg shadow-lg max-h-[600px] overflow-y-auto"
                            >
                                <div className="p-[25px]">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-2xl font-bold text-dark">Notifications</h2>
                                        <button className="p-3 hover:bg-gray-100 rounded-full" onClick={handleCloseModal}>
                                            <X />
                                        </button>
                                    </div>

                                    <div className="flex space-x-4 mb-4">
                                        <button
                                            className={`px-4 py-2 font-semibold ${activeTab === 'recent' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
                                            onClick={() => setActiveTab('recent')}
                                        >
                                            Recent
                                            <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-600 rounded-md text-xs">
                                                {totalRecentNotifications}
                                            </span>
                                        </button>
                                        <button
                                            className={`px-4 py-2 font-semibold ${activeTab === 'all' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
                                            onClick={() => setActiveTab('all')}
                                        >
                                            All
                                            <span className="ml-1 px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded-md text-xs">
                                                {allNotifications.length}
                                            </span>
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {(activeTab === 'recent' ? recentNotifications : allNotifications).map((notif) => (
                                            <div
                                                key={notif._id}
                                                className="p-4 bg-white shadow-md rounded-lg border border-gray-200"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-gray-800 font-semibold">Notification</span>
                                                    <span className="text-xs text-gray-500">
                                                        {moment(notif.updatedAt).format('MMMM Do YYYY')}
                                                    </span>
                                                </div>
                                                <div className="border-t border-gray-200 pt-4 ">
                                                    <p className="text-gray-800 mb-2 break-words overflow-wrap-break-word whitespace-normal">
                                                        <span className="font-semibold">Title:</span> {notif.title}
                                                    </p>
                                                    <p className="text-gray-800 mb-2">
                                                        <span className="font-semibold">Description:</span> {notif.description}
                                                    </p>
                                                    <div className="flex justify-end items-center">
                                                        {/* <span className="text-gray-600 text-sm">
                                                            <span className="font-semibold">Assigned by:</span> {notif.creator?.name || 'System'}
                                                        </span> */}
                                                        {activeTab === 'recent' && (
                                                            <button
                                                                onClick={() => markAsRead(notif._id)}
                                                                className="px-4 py-2 bg-dark text-white text-xs font-semibold rounded-lg shadow"
                                                            >
                                                                Mark as Read
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {activeTab === 'all' && allNotifications.length === 0 && (
                                        <p className="text-center text-gray-500 mt-4">No notifications available</p>
                                    )}
                                    {activeTab === 'recent' && recentNotifications.length === 0 && (
                                        <p className="text-center text-gray-500 mt-4">No recent notifications available</p>
                                    )}
                                </div>
                            </AnimatedDialog>
                        </div>

                    )}
                </div>
            </div>

            <AnimatedDialog
                isOpen={isTaskModelOpen}
                onClose={handleCloseModalExpense}
                className="max-w-xs md:max-w-4xl lg:max-w-5xl max-h-[700px] md:max-h-[790px] p-[25px] overflow-y-auto pb-4"
                roundedSize="lg"
            >
                <CreateExpense handleCloseModalExpense={handleCloseModalExpense} />
            </AnimatedDialog>
        </div>
    );
}