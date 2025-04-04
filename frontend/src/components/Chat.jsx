import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { deleteAllMessages, getAllMessages, sendMessage } from '../apis/apiCalls';
import { Avatar, Button, Collapse, ListItem, Menu, MenuHandler, MenuItem, MenuList, Typography } from '@material-tailwind/react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDownIcon, ChevronUpIcon, DeleteIcon, Paperclip, PowerIcon, UserCheckIcon, UserCircleIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/Slices/userSlice';
import { TbDotsVertical, TbForbid } from 'react-icons/tb';
// import chatImage from '../../assets/chat.png';
import { toast } from 'react-toastify';
import { showErrorToast, showSuccessToast } from './ToastNotification';

import { Send } from "lucide-react";
import Input from './Form_Components/Input';

const socket = io('http://localhost:5000');

function ProfileMenu({ handleDeleteChat,  }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openNestedMenuUnblock, setopenNestedMenuUnblock] = useState(false);
    const [openNestedMenuBlock, setopenNestedMenuBlock] = useState(false);

    const renderItems = (list, handleAction) => {
        if (list.length > 0) {
            return list.map((user) => (
                <MenuItem key={user.userId._id} onClick={() => handleAction(user.userId._id)}>
                    {user.userId.name}
                </MenuItem>
            ));
        } else {
            return <MenuItem>No users in the list</MenuItem>;
        }
    };

    return (
        <React.Fragment >
            <Menu
                open={isMenuOpen}
                handler={setIsMenuOpen}
                // placement="bottom-end"
                // allowHover={true}
                className='z-50 '
            >
                <MenuHandler>
                    <Button
                        variant="text"
                        color="blue-gray"
                        className="flex items-center   gap-1 rounded-full py-0.5 pr-1 pl-0.5 justify-end"
                        selected={isMenuOpen || isMobileMenuOpen}
                        onClick={() => setIsMobileMenuOpen((cur) => !cur)}
                    >
                        <TbDotsVertical className="h-6 w-6 text-dark" />
                    </Button>
                </MenuHandler>

                <MenuList className=" rounded-xl lg:block">
                    <MenuItem
                        key={"Clear Chat"}
                        onClick={() => handleDeleteChat()}
                        className={`px-2 flex items-center gap-2 rounded`}
                    >
                        {React.createElement(DeleteIcon, {
                            className: `h-4 w-4 `,
                            strokeWidth: 2,
                        })}
                        <Typography
                            as="span"
                            variant="small"
                            className="font-normal"
                            color={"inherit"}
                        >
                            Clear Chat
                        </Typography>
                    </MenuItem>

                </MenuList>
            </Menu>
            <div className="block lg:hidden">
                <Collapse open={isMobileMenuOpen}>
                    <MenuItem
                        key={"Clear Chat"}
                        onClick={() => handleDeleteChat()}
                        className={`px-2 flex items-center gap-2 rounded ${""}`}
                    >
                        {React.createElement(DeleteIcon, {
                            className: `h-4 w-4 ${""}`,
                            strokeWidth: 2,
                        })}
                        <Typography
                            as="span"
                            variant="small"
                            className="font-normal"
                            color={"inherit"}
                        >
                            Clear Chat
                        </Typography>
                    </MenuItem>

                </Collapse>
            </div>
        </React.Fragment>
    );
}

export default function Chat({ selectedChat }) {
    const currentUser = useSelector((state) => state.user.user);
    const [curr, setCurr] = useState(null);
    const [unblockedList, setUnblockedList] = useState([]);
    const [blockedList, setBlockedList] = useState([]);
    const [isManager, setIsManager] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const messageEndRef = useRef(null);

    const handleDeleteChat = async () => {
        try {
            await deleteAllMessages(selectedChat);
            showSuccessToast("Chat cleared successfully");
            setMessages([]);
        } catch (error) {
            showErrorToast("Failed to clear chat");
        }
    };

    // const handleBlockUser = async (userId) => {
    //     const blockData = { chatId: selectedChat, userId };
    //     try {
    //         await blockUser(blockData);
    //         showSuccessToast("User blocked successfully");
    //     } catch (error) {
    //         showErrorToast("Failed to block user");
    //     }
    // };

    // const handleUnblockUser = async (userId) => {
    //     const unblockData = { chatId: selectedChat, userId };
    //     try {
    //         await unblockUser(unblockData);
    //         showSuccessToast("User unblocked successfully");
    //     } catch (error) {
    //         showErrorToast("Failed to unblock user");
    //     }
    // };

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSendMessage = async () => {
        if (!message.trim()) {
            showErrorToast("Empty message cannot be sent");
            return;
        }

        const newMessage = { sender: currentUser.id, content: message, chatId: selectedChat };

        try {
            const response = await sendMessage(newMessage);
            const sentMessage = response.data.data;
            socket.emit('sendMessage', sentMessage);
            if (!sentMessage.createdAt) {
                sentMessage.createdAt = new Date().toISOString();
            }
            setMessages((prevMessages) => [...prevMessages, sentMessage]);
            setMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const formatTime = (dateString) => {
        const options = { hour: 'numeric', minute: 'numeric' };
        return new Date(dateString).toLocaleTimeString(undefined, options);
    };

    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedChat) {
                try {
                    const response = await getAllMessages(selectedChat, currentUser);
                    setCurr(response.data.data.members.find(member => member?.userId?._id === currentUser?.id));
                    // if (response.data?.data?.managerId?._id === currentUser.id || currentUser.role === "owner") {
                    //     setIsManager(true);
                    // }
                    

                    setMessages(response.data.data.messages);
                    socket.emit('joinChat', selectedChat);
                } catch (error) {
                    console.error('Failed to fetch messages:', error);
                }
            }
        };

        fetchMessages();
    }, [selectedChat]);

    useEffect(() => {
        const handleReceiveMessage = (newMessage) => {
            if (newMessage.chatId._id && currentUser.id !== newMessage.sender._id === selectedChat) {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
        };

        socket.on('receiveMessage', handleReceiveMessage);

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
        };
    }, [selectedChat]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col w-full md:w-[700px] lg:w-full h-full rounded-lg ml-2 overflow-hidden relative z-30 mt-4">
            <div className="flex items-center justify-between text-dark border-b-2 pb-2">
                <div className="flex items-center">
                    <img
                        src={'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o='}
                        alt="User Avatar"
                        className="w-14 h-14 rounded-full border-2 border-white shadow-sm"
                    />
                    <div className="font-semibold text-xl">Chat</div>
                </div>
                {/** */}
                <div className="w-12 md:w-10 lg:w-8">
                    {isManager === false && (
                        <ProfileMenu
                            handleDeleteChat={handleDeleteChat}
                            className="z-40"
                        />
                    )}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[450px] p-6 bg-white relative">
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex w-full mb-4 ${msg.sender._id === currentUser.id ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.sender._id !== currentUser.id && (
                                <div className="flex items-start space-x-2">
                                    <img
                                        src={'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o='}
                                        alt={msg.sender.name}
                                        className="w-8 h-8 rounded-full border border-gray-400 shadow-sm flex-shrink-0"
                                    />
                                    <div className="relative max-w-[75%] p-3 rounded-lg shadow-md bg-gray-100 text-gray-900 rounded-tl-none rounded-tr-lg rounded-br-lg">
                                        <div className="text-xs font-medium text-purple-700 mb-1">
                                            {msg.sender.name}
                                        </div>
                                        <div className="text-sm break-words">{msg.content}</div>
                                        <div className="flex justify-end mt-1 text-[10px] text-gray-500">
                                            {formatTime(msg.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {msg.sender._id === currentUser.id && (
                                <div className="relative max-w-[75%] p-3 rounded-lg shadow-md bg-green-600 text-white rounded-tr-none rounded-tl-lg rounded-bl-lg">
                                    <div className="text-sm break-words">{msg.content}</div>
                                    <div className="flex justify-end mt-1 text-[10px] text-white/80">
                                        {formatTime(msg.createdAt)}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-sm text-gray-600 bg-gray-100 p-4 rounded-lg text-center shadow-inner animate-pulse">
                        Start a conversation by sending a message.
                    </div>
                )}
                {curr && curr.leaveDate !== null && (
                    <div className="text-xs text-center text-gray-600 bg-gray-100 p-3 rounded-lg shadow-sm mt-4">
                        You have been removed from the chat due to violations of the organization guidelines.
                    </div>
                )}
                <div ref={messageEndRef}></div>
            </div>
            <div className="p-2">
                <div className="flex items-center space-x-3">
                    <Input
                        type="text"
                        placeholder="Add a comment"
                        value={message}
                        className="w-full placeholder:text-gray-600 focus:ring-2 focus:ring-dark focus:border-transparent pr-12"
                        onChange={handleInputChange}
                        aria-label="Type your message"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className={`bg-dark text-white rounded-full p-2 font-medium shadow-md flex items-center justify-center ${!message.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-dark/90 active:bg-dark/80'}`}
                        style={{ width: '40px', height: '40px' }}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

Chat.propTypes = {
    selectedChat: PropTypes.string.isRequired,
};