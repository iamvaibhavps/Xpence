import React, { useState, useEffect } from 'react';
import { Plus, Users, Info, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Card, Typography, IconButton } from "@material-tailwind/react";
import AnimatedDialog from '../../components/Dialog/AnimtedDialog';
import MultiSelect from '../../components/Dropdown/MutliSelectDropdown';
import { getAllGroups, createGroup, getAllUsersPhoneNumbers, deleteGroup } from '../../apis/apiCalls';
import { showErrorToast, showSuccessToast } from '../../components/ToastNotification';
import Input from './../../components/Form_Components/Input';
import TextArea from './../../components/Form_Components/TextArea';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function MyGroups() {
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user.user);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const groupsPerPage = 6;
    const [users, setUsers] = useState([
        { value: "1", label: "John (123-456-7890)" },
        { value: "2", label: "Jane (234-567-8901)" },
        { value: "3", label: "Bob (345-678-9012)" },

    ]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        members: []
    });


    const indexOfLastGroup = currentPage * groupsPerPage;
    const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
    const currentGroups = groups.slice(indexOfFirstGroup, indexOfLastGroup);
    const totalPages = Math.ceil(groups.length / groupsPerPage);

    const getAllUsers = async () => {
        try {
            const response = await getAllUsersPhoneNumbers();
            if (response.data) {
                const userOptions = response.data.data.map(user => ({
                    value: user._id,
                    label: `${user.name} (${user.phoneNo})`
                }));
                setUsers(userOptions);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const response = await getAllGroups();
            if (response.data) {
                setGroups(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const handleCreateGroup = async () => {
        try {
            if (!formData.name) {
                showErrorToast("Group name is required");
                return;
            }

            if (formData.members.length === 0) {
                showErrorToast("Please select at least one member");
                return;
            }

            setLoading(true);
            const memberIds = formData.members.map(member => member.value);

            memberIds.push(currentUser.id);
            const response = await createGroup({
                name: formData.name,
                description: formData.description,
                members: memberIds,
                userId: currentUser.id
            });

            if (response.data) {
                showSuccessToast("Group created successfully!");
                resetForm();
                fetchGroups();
            } else {
                showErrorToast(response.data.message || "Failed to create group");
            }

        } catch (error) {
            console.error("Error creating group:", error);
            showErrorToast(error.response?.data?.message || "Failed to create group");
        } finally {
            setLoading(false);
            setIsDialogOpen(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            members: []
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMembersChange = (selectedOptions) => {
        setFormData(prev => ({
            ...prev,
            members: selectedOptions
        }));
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
            label: loading ? "Creating..." : "Create Group",
            onClick: handleCreateGroup,
            color: "dark",
            disabled: loading
        }
    ];



    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <Typography variant="h4" className="font-bold text-gray-800">
                    My Groups
                </Typography>
                <Button
                    color="dark"
                    className="flex items-center gap-2"
                    onClick={() => setIsDialogOpen(true)}
                >
                    <Plus size={16} />
                    Create Group
                </Button>
            </div>

            {loading && groups.length === 0 ? (
                <div className="flex justify-center py-10">
                    <Typography>Loading groups...</Typography>
                </div>
            ) : groups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                    <Users size={48} className="text-gray-400 mb-4" />
                    <Typography variant="h6" className="text-gray-600">
                        You don't have any groups yet
                    </Typography>
                    <Typography className="text-gray-500 mt-2 mb-4">
                        Create a group to start splitting expenses with friends
                    </Typography>
                    <Button
                        color="dark"
                        className="flex items-center gap-2"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <Plus size={16} />
                        Create Your First Group
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentGroups.map((group) => (
                        <Card
                            key={group._id}
                            className="p-5 rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:scale-105 bg-white border border-gray-200"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                        <Users size={20} className="text-blue-600" />
                                    </div>
                                    <Typography variant="h6" className="font-semibold text-gray-800">
                                        {group.name}
                                    </Typography>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Typography
                                        variant="small"
                                        className="text-gray-100 bg-blue-500 px-2 py-1 rounded-full text-xs font-medium"
                                    >
                                        {group.members.length} members
                                    </Typography>
                                </div>
                            </div>

                            <Typography variant="small" className="text-gray-600 mb-4 line-clamp-2">
                                {group.description || "No description available"}
                            </Typography>

                            {/* Member preview */}
                            <div className="mb-4">
                                <div className="flex -space-x-2">
                                    {group.members.slice(0, 3).map((member, index) => (
                                        <div
                                            key={index}
                                            className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium"
                                            title={member.name || "Group Member"}
                                        >
                                            {member.name ? member.name.charAt(0).toUpperCase() : "U"}
                                        </div>
                                    ))}
                                    {group.members.length > 3 && (
                                        <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium">
                                            +{group.members.length - 3}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                                <div className="flex items-center text-xs text-gray-500">
                                    <Calendar size={14} className="mr-1" />
                                    Created {new Date(group.createdAt || Date.now()).toLocaleDateString()}
                                </div>
                                <Button
                                    size="sm"
                                    variant="text"
                                    className="text-blue-500 hover:bg-blue-50 p-2"
                                    onClick={() =>
                                        navigate(`/${currentUser.role}/group-splits?groupId=${group._id}&createdBy=${group.createdBy._id}`)
                                    }
                                >
                                    View Details
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-4">
                    <IconButton
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        <ChevronLeft />
                    </IconButton>
                    <Typography variant="body2" className="text-gray-700 flex items-center">
                        Page {currentPage} of {totalPages}
                    </Typography>
                    <IconButton
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        <ChevronRight />
                    </IconButton>
                </div>
            )}

            <AnimatedDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    resetForm();
                    setIsDialogOpen(false);
                }}
                title="Create Group"
                footerButtons={footerButtons}
                className="max-w-sm md:max-w-md mx-auto p-6"
            >
                <div className="space-y-4">
                    <Typography variant="h5" className="font-bold text-center mb-4">
                        Create New Group
                    </Typography>

                    <div>
                        <Typography variant="small" className="font-medium mb-1">
                            Group Name*
                        </Typography>
                        <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter group name"
                            className="w-full"
                            required
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
                            placeholder="Add a description for your group"
                            className="w-full"
                            rows={3}
                        />
                    </div>

                    <div>
                        <Typography variant="small" className="font-medium mb-1">
                            Members*
                        </Typography>
                        <MultiSelect
                            options={users}
                            placeholder="Search and select members by name or phone"
                            isMulti={true}
                            value={formData.members}
                            onChange={handleMembersChange}
                        />
                        <Typography variant="small" className="text-gray-500 mt-1">
                            <Info size={14} className="inline mr-1" />
                            You can search by name or phone number
                        </Typography>
                    </div>
                </div>
            </AnimatedDialog>
        </div>
    );
}
