import React from 'react';
import { greenArrowIcon, redArrowIcon } from '../../allImages';

const GoalCard = ({
    icon,
    title = "Title",
    count = 0,
    percentage = 0,
    percentageLabel = "This week",
    isPositive = true,
    noPercentageChange = true,
    isPercentage = false,
}) => {
    return (
        <div className="flex flex-col bg-white px-[15px] py-[10px] gap-[8px] rounded-2xl w-full flex-grow shadow-md">
            {/* Icon and Title */}
            <div className="flex flex-col justify-start gap-[8px]">
                <div className=" text-white rounded-full">
                    {icon}
                </div>
                <p className="text-dark text-[15px] ml-1 ">
                    {title}
                </p>
            </div>

            {/* Count */}
            <div className="ml-1 h-8">
                <div className="text-[30px] -mt-2 font-bold text-black">
                    {count} {isPercentage && '%'}
                </div>
            </div>

            {/* Percentage Change */}
            {noPercentageChange && (
                <div
                    className={`mt-1 flex items-center space-x-2 text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}
                >{isPositive ? (
                    <>
                        <img src={greenArrowIcon} alt="Total Tasks" className="w-10 h-10" />
                    </>
                ) : (
                    <>
                        <img src={redArrowIcon} alt="Total Tasks" className="w-10 h-10" />
                    </>
                )}
                    <span>{percentage}%</span>
                    <span className="text-gray-500">{percentageLabel}</span>
                </div>
            )}

            {/* Responsive Adjustments for Smaller Screens */}
            <style jsx>{`
                @media (max-width: 640px) {
                    .GoalCard p {
                        font-size: 0.875rem;
                    }
                    .GoalCard .text-3xl {
                        font-size: 1.5rem;
                    }
                    .GoalCard .text-sm {
                        font-size: 0.75rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default GoalCard;
