import * as React from 'react';
import PropTypes from 'prop-types';
import { PieChart } from '@mui/x-charts/PieChart';

const ContributionPieChart = ({
  data,
  width = 390,
  height = 300,
  slotProps,
  legend = true,
  className = '',
  title,
  paddingAngle = 2,
  cornerRadius = 4,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-start p-3">
      {/* Donut Chart */}
      <PieChart
        series={[
          {
            data,
            innerRadius: 65,
            outerRadius: 140,
            paddingAngle: paddingAngle,
            cornerRadius: cornerRadius,
          },
        ]}
        width={width}
        height={height}
        slotProps={slotProps}
        className={className}
        title={title}
      />

      {/* Custom Legend */}
      {legend && (
        <div className="flex flex-col px-6 py-2 sm:pl-6 sm:pt-0">
          {data.map((item) => (
            <div
              key={item.id}
              className="flex items-center mb-4 space-x-2"
            >
              {/* Color Indicator */}
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              {/* Label and Percentage */}
              <span className="text-sm font-medium">
                <p className="text-lg font-semibold">
                  {item.value}%
                </p>
                <p className="-mt-2 text-gray-500">
                  {item.label}
                </p>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ContributionPieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string,
    })
  ).isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  legend: PropTypes.bool,
};

export default ContributionPieChart;
