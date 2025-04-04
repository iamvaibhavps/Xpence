import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const Performer = ({ title, performers, onTimeRangeChange, loading, dropdown, setType }) => {
    const [selectedTimeRange, setSelectedTimeRange] = useState("all-time");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const performerFilterOptions = [
        { label: "All Time", value: "all-time" },
        { label: "Weekly", value: "weekly" },
        { label: "Monthly", value: "monthly" },
    ];

    const handleTimeRangeChange = (value) => {
        setSelectedTimeRange(value);
        setIsDropdownOpen(false);
        if (onTimeRangeChange) {
            onTimeRangeChange(value);
        }
        if (title === "Top Performers") {
            setType("top");
        } else {
            setType("bottom");
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const getPlaceholder = (name) => {
        const initials = name.charAt(0).toUpperCase();
        return (
            <div className="w-10 h-10 rounded-full mr-3 border border-gray-400 bg-gray-400 flex items-center justify-center text-lg font-semibold text-dark">
                {initials}
            </div>
        );
    };

    return (
        <div className="border bg-gray-200 hover:bg-gray-300 rounded-2xl border-gray-400 p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{title}</h2>
                <div className="relative">
                    {/* Dropdown Container */}
                    <div
                        className={`relative flex items-center ${dropdown ? "cursor-pointer" : ""}`}
                        onClick={dropdown ? toggleDropdown : null}
                    >
                        <span className="text-sm text-dark">{performerFilterOptions.find(option => option.value === selectedTimeRange)?.label}</span>
                        <ChevronDown className="w-6 h-6 text-gray-500 ml-2" />
                    </div>

                    {/* Dropdown Options */}
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                            {performerFilterOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${option.value === selectedTimeRange ? "bg-gray-200 font-medium" : ""
                                        }`}
                                    onClick={() => handleTimeRangeChange(option.value)}
                                >
                                    {option.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Performers List */}
            {loading ? (
                <>
                    <p className="text-center">Loading ...</p>
                </>
            ) : (
                <>
                    {performers.map((performer, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between py-2"
                        >
                            <div className="flex items-center">

                                {performer?.image && /\.(jpeg|jpg|png|gif|bmp|webp)$/i.test(performer.image) ? (
                                    <img
                                        src={`${import.meta.env.VITE_IMAGE_UPLOAD_URL}/${performer?.image}`}
                                        alt={performer.name}
                                        className="w-10 h-10 rounded-full mr-3 border border-gray-400 object-cover"
                                    />
                                ) : (
                                    getPlaceholder(performer.name)
                                )}
                                <div>
                                    <h3 className="text-sm font-medium">{performer.name}</h3>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-600">
                                    {performer.score.toFixed(0)}/{performer.total}
                                </span>
                                <div className="w-10 h-10 border-2 font-semibold border-dark bg-white rounded-full flex items-center justify-center">
                                    {performer.percentage}
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default Performer;
