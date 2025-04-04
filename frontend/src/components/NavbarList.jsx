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
    Bell,
    Menu as MenuIcon
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
    // {
    //     label: "My Profile",
    //     icon: UserCircle,
    //     action: (navigate, role) => navigate(`/${role}/my-profile`),
    // },
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
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const fetchNotifications = async () => {
        try {
            const response = await getAllNotifications();
            // console.log('Notifications:', response);
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
        // dispatch(openModal());
    };


    const handleCloseModalExpense = () => {
        setIsTaskModelOpen(false);
        // dispatch(closeModal());
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
                <div className="flex items-center gap-2">
                    <button
                        className="p-2 md:hidden"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-label="Toggle sidebar"
                    >
                        <MenuIcon size={24} />
                    </button>
                    <h1 className="text-[18px] md:text-2xl lg:text-3xl font-bold truncate flex-shrink min-w-0 max-w-[150px] md:max-w-[200px] lg:max-w-[300px]">
                        {title}
                    </h1>
                </div>

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

                                            {/* <div className="hidden sm:block relative w-[150px] md:w-[200px] lg:w-[308px]">
                                                <input
                                                    type="search"
                                                    className="w-full border-2 border-dark outline-none rounded-full py-1.5 px-4 pr-10"
                                                    placeholder="Search here"
                                                   
                                                    onClick={() => setShowResults(true)}
                                                />
                                             
                                                <Search className='absolute top-1/2 right-3 transform -translate-y-1/2 w-5 h-5 text-dark' />
                                            </div> */}

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
            {typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('sidebarToggle', { detail: { isOpen: sidebarOpen } }))}
        </div>
    );
}