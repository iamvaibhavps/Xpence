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
                        src={currentUser?.profilePicture && currentUser?.profilePicture.startsWith('http')
                            ? currentUser?.profilePicture
                            : `${import.meta.env.VITE_IMAGE_UPLOAD_URL}/${currentUser?.profilePicture}`}
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

            const notifications = response.data.notifications;

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
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600 text-sm">
                                                            <span className="font-semibold">Assigned by:</span> {notif.creator?.name || 'System'}
                                                        </span>
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