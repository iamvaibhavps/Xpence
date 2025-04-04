import React from 'react';
import { greenArrowIcon, redArrowIcon } from '../../allImages';

const TaskCard = ({
  icon,
  title = "Title",
  count = 0,
  percentage = 0,
  percentageLabel = "This week",
  isPositive = true,
  isPercentage = false,
  score,
  noPercentageChange = true,
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
        {score ? (
          <div className="text-[30px]  font-bold text-black">
          ₹ {score}
          </div>
        ) : (
          <div className="text-[30px] -mt-2 font-bold text-black">
          ₹ {count}{isPercentage ? '%' : ''}
          </div>
        )}
      </div>

      {/* Percentage Change */}
      {noPercentageChange && (
        <span className={`-ml-2 -mt-1 h-6 flex items-center ${isPositive ? "text-green-600" : "text-red-600"} `}>
          {isPositive ? (
            <>
              <img src={greenArrowIcon} alt="Total Tasks" className="w-10 h-10" />
            </>
          ) : (
            <>
              <img src={redArrowIcon} alt="Total Tasks" className="w-10 h-10" />
            </>
          )}
          <span className='text-[15px] -ml-2'>₹ {percentage}{isPercentage && '%'}</span>
          <span className="text-[15px] ml-2 text-gray-500">{percentageLabel}</span>
        </span>
      )}
    </div>
  );
};

export default TaskCard;
