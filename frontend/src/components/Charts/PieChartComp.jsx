import { PieChart } from "@mui/x-charts";

const CustomDonutChart = ({
  isPercentage = true,
  data,
  width = 380,
  height = 300,
  slotProps,
  legend = true,
  className = "",
  innerRadius = 65,
  outerRadius = 140,
  pieChartClassName = "",
  legendClassName = "",
}) => {
  const isEmptyChart = data.every((item) => item.value === 0);

  return (
    <div className={`${className}`}>
      {/* Donut Chart */}
      <div className={`${pieChartClassName}`}>
        <PieChart
          series={[
            {
              data,
              innerRadius: innerRadius,
              outerRadius: outerRadius,
            },
          ]}
          width={width}
          height={height}
          slotProps={slotProps}
        />
      </div>

      {/* Custom Legend */}
      {legend && (
        <div className={`${legendClassName}`}>
          <div className="grid grid-cols-2 gap-y-2 md:gap-6 gap-10 px-8 py-2 mt-4">
            {data.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-2"
              >
                {/* Color Indicator */}
                <div
                  className="w-4 h-10 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                {/* Label and Percentage */}
                <span className="text-[13px] font-medium">
                  <p className="text-lg font-semibold">
                    {isEmptyChart ? " " : `${item.value}${isPercentage ? "%" : ""}`}
                  </p>
                  <p className="-mt-2 lg:mt-0.5 text-gray-500 text-xs md:text-[14px]">
                    {item.label}
                  </p>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDonutChart;
