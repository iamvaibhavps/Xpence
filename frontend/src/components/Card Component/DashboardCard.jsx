import React from 'react';

const DashboardCard = ({
  icon,
  title = "Title",
  count = 0,
  percentage = 0,
  percentageLabel = "This week",
  isPositive = true,
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-xl shadow-sm w-full sm:w-[48%] md:w-[30%] lg:w-[23%] xl:w-[18%] flex-grow">
      {/* Icon and Title */}
      <div className="flex items-center space-x-2">
        <div className="bg-black text-white p-2 rounded-md">
          {icon}
        </div>
        <p className="text-dark font-medium text-md sm:text-lg">
          {title}
        </p>
      </div>

      {/* Count */}
      <div className="mt-3 text-3xl font-bold text-black sm:text-2xl">
        {count}
      </div>

      {/* Percentage Change */}
      <div
        className={`mt-1 flex items-center space-x-2 text-sm sm:text-xs ${isPositive ? "text-green-600" : "text-red-600"}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={isPositive ? "M5 12l5 5L20 7" : "M5 12l5-5L20 17"}
          />
        </svg>
        <span>{percentage}%</span>
        <span className="text-gray-500">{percentageLabel}</span>
      </div>
    </div>
  );
};

export default DashboardCard;
