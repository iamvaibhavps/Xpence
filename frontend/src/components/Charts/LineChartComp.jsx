import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const LineChartComp = ({
    xAxisData = [],
    seriesData = [],
    width,
    height,
    className }
) => {
    return (
        <LineChart
            xAxis={[{ data: xAxisData }]}
            series={seriesData}
            width={width}
            height={height}
            className={className}
        />
    );
};

export default LineChartComp;