import * as React from 'react';
import PropTypes from 'prop-types';
import { BarChart } from '@mui/x-charts/BarChart';

const CustomBarChart = ({
    xLabels,
    yLabel,
    yRange,
    barData,
    barColor,
    tickPlacement = 'middle',
    tickLabelPlacement = 'middle',
    width = 1000,
    height = 400,
    slotProps
}) => {
    return (
        <div className=' '>
            <BarChart
                slotProps={slotProps}
                xAxis={[
                    {
                        id: 'x-axis',
                        label: xLabels.label,
                        data: xLabels.data,
                        scaleType: 'band',
                        tickPlacement,
                        tickLabelPlacement,
                    },
                ]}
                yAxis={[
                    {
                        id: 'y-axis',
                        label: yLabel,
                        min: yRange[0],
                        max: yRange[1],
                    },
                ]}
                series={[
                    {
                        data: barData,
                        color: barColor,
                    },
                ]}
                width={width}
                height={height}
            />
        </div>
    );
};

CustomBarChart.propTypes = {
    xLabels: PropTypes.shape({
        label: PropTypes.string.isRequired,
        data: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    yLabel: PropTypes.string,
    yRange: PropTypes.arrayOf(PropTypes.number),
    barData: PropTypes.arrayOf(PropTypes.number),
    barColor: PropTypes.string,
    tickPlacement: PropTypes.oneOf(['start', 'middle', 'end', 'extremities']),
    tickLabelPlacement: PropTypes.oneOf(['tick', 'middle']),
    width: PropTypes.number,
    height: PropTypes.number,
};

export default CustomBarChart;
