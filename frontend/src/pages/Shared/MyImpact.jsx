import React, { useRef, useState } from 'react'

import CustomBarChart from '../../components/Charts/BarChartComp'
import CustomDoughnutChart from '../../components/Charts/PieChartComp'
import LineChartComp from '../../components/Charts/LineChartComp'

import TaskCard from "../../components/Card Component/TaskCard"


import { useSelector } from "react-redux";
import { LineChart } from "@mui/x-charts";
import { ChevronDown } from "lucide-react";
import { useEffect } from 'react';
import { getDashboardInfo } from '../../apis/apiCalls';

import {filterOptions} from "../../static/FormConstants"
import { expense, income, investment, savings } from '../../allImages'

export default function MyImpact() {

  const currentUser = useSelector((state) => state.user.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to control dropdown visibility
  const timeRangeOptions = filterOptions.find((option) => option.label === "overall-performance")?.options || [];
  const [selectedTimeRangeLabel, setSelectedTimeRangeLabel] = useState({
      label: "All Time",
      value: "alltime",
  });

  let performanceData = {}; //  State to store the performance data
  let filterData = {}; // State to store the filter data
  const [label, setLabel] = useState("This Month");

  // -------------- DASHBOARD DATA -------------- //
  const [dashBoardData, setDashBoardData] = useState({
    myPerformance: 0,
    percentage: 0,
    percentageLabel: "",
    pointsScored: { num: 0, den: 0 },
    totalIncome: 0,
    totalExpense: 0,
    totalSavings: 0,

  });

  const [dashboardFilterData, setDashboardFilterData] = useState({
    myPerformance: 0,
    percentage: 0,
    percentageLabel: "",
    pointsScored: { num: 0, den: 0 },
    totalIncome: 0,
    totalExpense: 0,
    totalSavings: 0,
  });

  const [categoryPieChartData, setCategoryPieChartData] = useState([
    { id: 0, value: 0, label: "Big tasks", color: "#232b85" },
    { id: 1, value: 0, label: "Small tasks", color: "#018ad9" },
    { id: 2, value: 0, label: "Monthly goals", color: "#40adaf" },
    { id: 3, value: 0, label: "Quarterly goals", color: "#7ac4d6" },
    { id: 4, value: 0, label: "Yearly goals", color: "#d1d1d1" },
  ]);

  const [investmentPieChartData, setInvestmentPieChartData] = useState([
    { id: 0, value: 0, label: "Mutual Funds", color: "#ff7f50" },
    { id: 1, value: 0, label: "Stocks", color: "#87ceeb" },
    { id: 2, value: 0, label: "Gold", color: "#32cd32" },
    { id: 3, value: 0, label: "FDs", color: "#ff69b4" },
    { id: 4, value: 0, label: "Bonds", color: "#ffa500" },
  ]);

  // -------------- Goal & Task Chart data -------------- //
  const [lineChartData, setLineChartData] = useState([]);
  const [goalBarData, setGoalBarData] = useState([]);
  const [xLabels, setXLabels] = useState({
    label: "Months",
    data: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  });
  const yLabel = "Goal Performance (%)";
  const yRange = [0, 100];
  const barColor = "gray";

  // financial year filters options for the dropdown at least 5 years back
  const financialYears = Array.from({ length: 3 }, (_, i) => {
    const currentYear = new Date().getFullYear();
    const year = currentYear - i;
    return {
        label: `${year - 1}-${year}`,
        value: `${year - 1}-${year}`,
    };
  });

  // console.log("financial years", financialYears);

  const [selectedFinancialYear, setSelectedFinancialYear] = useState(
      financialYears[0]
  );
  const [filterFinancialYear, setFilterFinancialYear] = useState(
      selectedFinancialYear.value
  );
  const [isDropdownOpenYear, setIsDropdownOpenYear] = useState(false); // State to control

  const toggleDropdown = () => {
      setIsDropdownOpenYear((prev) => !prev);
  };

  const handleFinancialYearChange = (value) => {
    // console.log("selected financial year", value);
    setIsDropdownOpenYear(false);
    setSelectedFinancialYear(
        financialYears.find((year) => year.value === value)
    );
    setFilterFinancialYear(value);
  };

  const dataForCards = {
    alltime: {
      label: "This Month",
      performanceData: {
        totalIncome: 150000,
        totalExpenses: 90000,
        totalSavings: 40000,
        totalInvestments: 20000,
        spendingEfficiencyScore: 85,
        investmentGrowth: 12,
        groupContributions: 5000,
        expenseCategories: {
          Food: 22000,
          Rent: 28000,
          Entertainment: 12000,
          Transport: 14000,
          Miscellaneous: 14000,
        },
        investmentCategories: {
          MutualFunds: 7000,
          Stocks: 6000,
          Gold: 4000,
          FDs: 3000,
        },
      },
      filterData: {
        totalIncome: 140000,
        totalExpenses: 85000,
        totalSavings: 38000,
        totalInvestments: 18000,
        spendingEfficiencyScore: 82,
        investmentGrowth: 10,
        groupContributions: 4500,
        expenseCategories: {
          Food: 20000,
          Rent: 26000,
          Entertainment: 11000,
          Transport: 13000,
          Miscellaneous: 15000,
        },
        investmentCategories: {
          MutualFunds: 6500,
          Stocks: 5500,
          Gold: 4000,
          FDs: 2000,
        },
      },
    },
    thisweek: {
      label: "This Week",
      performanceData: {
        totalIncome: 8500,
        totalExpenses: 5200,
        totalSavings: 2300,
        totalInvestments: 1000,
        spendingEfficiencyScore: 76,
        investmentGrowth: 3.2,
        groupContributions: 650,
        expenseCategories: {
          Food: 1500,
          Rent: 2200,
          Entertainment: 700,
          Transport: 500,
          Miscellaneous: 300,
        },
        investmentCategories: {
          MutualFunds: 500,
          Stocks: 300,
          Gold: 150,
          FDs: 50,
        },
      },
      filterData: {
        totalIncome: 7800,
        totalExpenses: 5000,
        totalSavings: 2100,
        totalInvestments: 900,
        spendingEfficiencyScore: 73,
        investmentGrowth: 2.8,
        groupContributions: 600,
        expenseCategories: {
          Food: 1300,
          Rent: 2100,
          Entertainment: 600,
          Transport: 600,
          Miscellaneous: 400,
        },
        investmentCategories: {
          MutualFunds: 450,
          Stocks: 280,
          Gold: 120,
          FDs: 50,
        },
      },
    },
    prev7days: {
      label: "Compared to Previous Week",
      performanceData: {
        totalIncome: 8900,
        totalExpenses: 5500,
        totalSavings: 2500,
        totalInvestments: 1200,
        spendingEfficiencyScore: 78,
        investmentGrowth: 3.5,
        groupContributions: 700,
        expenseCategories: {
          Food: 1700,
          Rent: 2300,
          Entertainment: 800,
          Transport: 600,
          Miscellaneous: 400,
        },
        investmentCategories: {
          MutualFunds: 600,
          Stocks: 350,
          Gold: 150,
          FDs: 100,
        },
      },
      filterData: {
        totalIncome: 8600,
        totalExpenses: 5300,
        totalSavings: 2300,
        totalInvestments: 1100,
        spendingEfficiencyScore: 75,
        investmentGrowth: 3,
        groupContributions: 650,
        expenseCategories: {
          Food: 1500,
          Rent: 2200,
          Entertainment: 700,
          Transport: 500,
          Miscellaneous: 400,
        },
        investmentCategories: {
          MutualFunds: 550,
          Stocks: 320,
          Gold: 130,
          FDs: 100,
        },
      },
    },
    thismonth: {
      label: "This Month",
      performanceData: {
        totalIncome: 32000,
        totalExpenses: 20000,
        totalSavings: 8000,
        totalInvestments: 4000,
        spendingEfficiencyScore: 80,
        investmentGrowth: 6,
        groupContributions: 1500,
        expenseCategories: {
          Food: 5000,
          Rent: 7000,
          Entertainment: 3000,
          Transport: 4000,
          Miscellaneous: 3000,
        },
        investmentCategories: {
          MutualFunds: 1800,
          Stocks: 1200,
          Gold: 700,
          FDs: 500,
        },
      },
      filterData: {
        totalIncome: 31000,
        totalExpenses: 19000,
        totalSavings: 7500,
        totalInvestments: 3500,
        spendingEfficiencyScore: 77,
        investmentGrowth: 5.5,
        groupContributions: 1400,
        expenseCategories: {
          Food: 4800,
          Rent: 6800,
          Entertainment: 2900,
          Transport: 3800,
          Miscellaneous: 2900,
        },
        investmentCategories: {
          MutualFunds: 1600,
          Stocks: 1100,
          Gold: 600,
          FDs: 400,
        },
      },
    },
    lastmonth: {
      label: "Last Month",
      performanceData: {
        totalIncome: 30000,
        totalExpenses: 18000,
        totalSavings: 9000,
        totalInvestments: 5000,
        spendingEfficiencyScore: 82,
        investmentGrowth: 7,
        groupContributions: 1300,
        expenseCategories: {
          Food: 6000,
          Rent: 7000,
          Entertainment: 2000,
          Transport: 2000,
          Miscellaneous: 800,
        },
        investmentCategories: {
          MutualFunds: 2000,
          Stocks: 1500,
          Gold: 1000,
          FDs: 500,
        },
      },
      filterData: {
        totalIncome: 29000,
        totalExpenses: 17000,
        totalSavings: 8500,
        totalInvestments: 4500,
        spendingEfficiencyScore: 79,
        investmentGrowth: 6.5,
        groupContributions: 1200,
        expenseCategories: {
          Food: 5800,
          Rent: 6800,
          Entertainment: 1800,
          Transport: 1800,
          Miscellaneous: 800,
        },
        investmentCategories: {
          MutualFunds: 1800,
          Stocks: 1400,
          Gold: 900,
          FDs: 400,
        },
      },
    },
    thisfinancialyear: {
      label: "Current Financial Year",
      performanceData: {
        totalIncome: 180000,
        totalExpenses: 110000,
        totalSavings: 45000,
        totalInvestments: 25000,
        spendingEfficiencyScore: 88,
        investmentGrowth: 14,
        groupContributions: 7000,
        expenseCategories: {
          Food: 25000,
          Rent: 32000,
          Entertainment: 14000,
          Transport: 18000,
          Miscellaneous: 21000,
        },
        investmentCategories: {
          MutualFunds: 9000,
          Stocks: 8000,
          Gold: 5000,
          FDs: 3000,
        },
      },
      filterData: {
        totalIncome: 170000,
        totalExpenses: 105000,
        totalSavings: 42000,
        totalInvestments: 23000,
        spendingEfficiencyScore: 85,
        investmentGrowth: 13,
        groupContributions: 6500,
        expenseCategories: {
          Food: 23000,
          Rent: 30000,
          Entertainment: 13000,
          Transport: 16000,
          Miscellaneous: 19000,
        },
        investmentCategories: {
          MutualFunds: 8500,
          Stocks: 7500,
          Gold: 4500,
          FDs: 2500,
        },
      },
    },
    lastfinancialyear: {
      label: "Last Financial Year",
      performanceData: {
        totalIncome: 160000,
        totalExpenses: 100000,
        totalSavings: 50000,
        totalInvestments: 30000,
        spendingEfficiencyScore: 86,
        investmentGrowth: 12.5,
        groupContributions: 6000,
        expenseCategories: {
          Food: 24000,
          Rent: 30000,
          Entertainment: 13000,
          Transport: 17000,
          Miscellaneous: 20000,
        },
        investmentCategories: {
          MutualFunds: 10000,
          Stocks: 9000,
          Gold: 6000,
          FDs: 5000,
        },
      },
      filterData: {
        totalIncome: 155000,
        totalExpenses: 95000,
        totalSavings: 48000,
        totalInvestments: 28000,
        spendingEfficiencyScore: 83,
        investmentGrowth: 11.5,
        groupContributions: 5800,
        expenseCategories: {
          Food: 22000,
          Rent: 29000,
          Entertainment: 12000,
          Transport: 16000,
          Miscellaneous: 18000,
        },
        investmentCategories: {
          MutualFunds: 9500,
          Stocks: 8500,
          Gold: 5500,
          FDs: 4500,
        },
      },
    },
  };

  const dataForLineChart = {
    '2022-2023': {
      data: [7500, 8000, 8500, 9000,3255, 7453, 10500, 11000, 11500, 3456, 12500, 13000],
    },
    '2023-2024': {
      data: [8705, 9000, 9500, 10000, 10500, 11000, 11500, 12000, 12500, 13000, 13500, 14000],
    },
    '2024-2025': {
      data: [9346, 3465, 6004, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000],
    },
  }

  const tasks = [
    {
        icon: <img src={income} alt="rank" className="w-10 h-10" />,
        title: "Total Income",
        count: dashBoardData.totalIncome,
        percentage: Math.round(dashBoardData.totalIncome - dashboardFilterData.totalIncome),
        percentageLabel: label,
        isPositive: ((dashBoardData.totalIncome - dashboardFilterData.totalIncome) >= 0),
        isPercentage: false,
        className: "bg-white p-6 rounded-lg shadow-md border border-gray-200",
    },
    {
      icon: <img src={expense} alt="rank" className="w-10 h-10" />,
      title: "Total Spend",
      count: dashBoardData.totalExpenses,
      percentage: Math.round(dashBoardData.totalExpenses - dashboardFilterData.totalExpenses),
      percentageLabel: label,
      isPositive: ((dashBoardData.totalExpenses - dashboardFilterData.totalExpenses) >= 0),
      isPercentage: false,
      className: "bg-white p-6 rounded-lg shadow-md border border-gray-200",
    },
    {
      icon: <img src={savings} alt="rank" className="w-10 h-10" />,
      title: "Total Savings",
      count: dashBoardData.totalSavings,
      percentage: Math.round(dashBoardData.totalSavings - dashboardFilterData.totalSavings),
      percentageLabel: label,
      isPositive: ((dashBoardData.totalSavings - dashboardFilterData.totalSavings) >= 0),
      isPercentage: false,
      className: "bg-white p-6 rounded-lg shadow-md border border-gray-200",
    },
    {
      icon: <img src={investment} alt="rank" className="w-10 h-10" />,
      title: "Total Investment",
      count: dashBoardData.totalInvestments,
      percentage: Math.round(dashBoardData.totalInvestments - dashboardFilterData.totalInvestments),
      percentageLabel: label,
      isPositive: ((dashBoardData.totalInvestments - dashboardFilterData.totalInvestments) >= 0),
      isPercentage: false,
      className: "bg-white p-6 rounded-lg shadow-md border border-gray-200",
    },
  ];

  const fetchData = async () => {
    try {
        // const response = await getDashboardInfo(currentUser.id, selectedTimeRangeLabel.value);

        // const performanceData = response.data.data.performanceData;
        // const filterData = response.data.data.filterData;
        // const label = response.data.data.label;
        // setLabel(label);

        const response = await dataForCards[selectedTimeRangeLabel.value];
        performanceData = response.performanceData;
        filterData = response.filterData;
        const label = response.label;
        setLabel(label);

        setDashboardFilterData({
            totalIncome: filterData.totalIncome || 0,
            totalExpenses: filterData.totalExpenses || 0,
            totalSavings: filterData.totalSavings || 0,
            totalInvestments: filterData.totalInvestments || 0,
            spendingEfficiencyScore: filterData.spendingEfficiencyScore || 0,
            investmentGrowth: filterData.investmentGrowth || 0,
            groupContributions: filterData.groupContributions || 0,
            percentageLabel: label,
        });

        setDashBoardData({
            totalIncome: performanceData.totalIncome || 0,
            totalExpenses: performanceData.totalExpenses || 0,
            totalSavings: performanceData.totalSavings || 0,
            totalInvestments: performanceData.totalInvestments || 0,
            spendingEfficiencyScore: performanceData.spendingEfficiencyScore || 0,
            investmentGrowth: performanceData.investmentGrowth || 0,
            groupContributions: performanceData.groupContributions || 0,
            percentageLabel: label,
        });

        // Handle pie chart data for expense categories
        const totalExpenses = performanceData.totalExpenses || 0;
        const expenseCategories = performanceData.expenseCategories || {};

        if (totalExpenses === 0) {
            setCategoryPieChartData([
                {
                    id: 0,
                    value: 1,
                    label: "No Data",
                    color: "#d1d1d1",
                },
            ]);
        } else {
            const pieChartData = Object.keys(expenseCategories).map((category, index) => ({
                id: index,
                value: Math.ceil((expenseCategories[category] / totalExpenses) * 100) || 0,
                label: category.charAt(0).toUpperCase() + category.slice(1),
                color: ["#232b85", "#018ad9", "#40adaf", "#7ac4d6", "#d1d1d1"][index % 5],
            }));
            setCategoryPieChartData(pieChartData);
        }

        // Handle investment distribution data
        const totalInvestments = performanceData.totalInvestments || 0;
        const investmentCategories = performanceData.investmentCategories || {};

        if (totalInvestments === 0) {
            setInvestmentPieChartData([
                {
                    id: 0,
                    value: 1,
                    label: "No Data",
                    color: "#d1d1d1",
                },
            ]);
        } else {
            const investmentChartData = Object.keys(investmentCategories).map((category, index) => ({
                id: index,
                value: Math.ceil((investmentCategories[category] / totalInvestments) * 100) || 0,
                label: category.charAt(0).toUpperCase() + category.slice(1),
                color: ["#ff7f50", "#87ceeb", "#32cd32", "#ff69b4", "#ffa500", "#6a5acd"][index % 6],
            }));
            setInvestmentPieChartData(investmentChartData);
        }

    } catch (error) {
        console.error("Error fetching organization user performance data: ", error);
    }
};

  useEffect(() => {
      fetchData();
  }, [selectedTimeRangeLabel]);


  const [selectedPerformanceYear, setSelectedPerformanceYear] = useState(financialYears[0]);
  const [filterPerformanceYear, setFilterPerformanceYear] = useState(selectedPerformanceYear.value);
  const [isDropdownOpenPerformance, setIsDropdownOpenPerformance] = useState(false); // State to control dropdown visibility

  const toggleDropdownPerformance = () => {

      // console.log("toggle dropdown performance");
      setIsDropdownOpenPerformance((prev) => !prev);
  };

  const handlePerformanceYearChange = (value) => {

      setIsDropdownOpenPerformance(false);
      setSelectedPerformanceYear(financialYears.find((year) => year.value === value));
      setFilterPerformanceYear(value);

  };

  // -------------- ORGANIZATION Performance VS. USER Performance Line Chart -------------- //
  const [xAxisData, setXAxisData] = useState(["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]);
  const [orgPerformanceData, setOrgPerformanceData] = useState([]);
  const [userPerformanceData, setUserPerformanceData] = useState([]);

  
  const fetchOrgUserPerformance = async () => {

    setFilterPerformanceYear(selectedPerformanceYear.value);

    try {
        const response = await dataForLineChart[filterPerformanceYear];
        const data = response.data;

        console.log("Data = ", data)

        let userPerformanceArray = data;

        if (data) {
            const updatedUserArray = [
                ...userPerformanceArray.slice(3, 12),
                ...userPerformanceArray.slice(0, 3),
            ];

            setUserPerformanceData(updatedUserArray);
        }
    } catch (error) {
        console.error(
            "Error fetching organization and user performance data: ",
            error
        );
    }
};

useEffect(() => {
    fetchOrgUserPerformance();
}, [selectedPerformanceYear]);



  const containerWidth = window.innerWidth; // Use this to dynamically adjust the width

  const [windowWidth, setWindowWidth] = useState(containerWidth);

  useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isSmallScreen = windowWidth < 600;

  const containerRef = useRef(null);

  return (
    <div className="flex flex-col p-4 max-w-full">
    {/* Time Filter Dropdown */}
    <div className="relative flex w-full md:w-80 lg:w-64 justify-end">
      <div
        className="rounded-full border w-full border-gray-500 px-4 py-2 flex items-center gap-2 cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        <span>{selectedTimeRangeLabel.label || "All Time"}</span>
      </div>
  
      {isDropdownOpen && (
        <div className="absolute top-full left-0 w-full md:w-80 lg:w-64 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          {timeRangeOptions.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-lightBlue ${
                option.value === selectedTimeRangeLabel.value ? "bg-gray-200 font-medium" : ""
              }`}
              onClick={() => {
                setSelectedTimeRangeLabel(option);
                setIsDropdownOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  
    {/* Task Cards - Four Cards in One Row */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      {tasks.map((task, index) => (
        <TaskCard key={index} {...task} />
      ))}
    </div>
  
    {/* Performance & Charts - LineChart and PieChart in the Same Row */}
    <div className="flex flex-col lg:flex-row gap-4 mt-6">
      {/* Performance Graph */}
      <div className="flex-1 p-4 bg-white rounded-2xl border-2">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">My Expenditure</span>
          <div className="relative">
            <div className="flex items-center cursor-pointer" onClick={toggleDropdownPerformance}>
              <span className="text-sm text-dark cursor-pointer">
                {financialYears.find(option => option.value === selectedPerformanceYear.value).label}
              </span>
              <ChevronDown className="w-6 h-6 text-gray-500 ml-2" />
            </div>
  
            {isDropdownOpenPerformance && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                {financialYears.map((option) => (
                  <div
                    key={option.value}
                    className={`px-4 py-2 text-xs md:text-sm cursor-pointer hover:bg-gray-100 ${
                      option.value === selectedPerformanceYear ? "bg-gray-200 font-medium" : ""
                    }`}
                    onClick={() => handlePerformanceYearChange(option.value)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
  
        <div className="flex justify-center">
          <LineChart
            xAxis={[
              {
                data: xAxisData,
                scaleType: "band",
                tickLabelStyle: {
                  angle: window.innerWidth < 600 ? 45 : 0,
                  textAnchor: window.innerWidth < 600 ? "start" : "middle",
                  fontSize: window.innerWidth < 600 ? 10 : 12,
                },
              },
            ]}
            series={[
              { data: userPerformanceData, color: "#33A1FF", label: "My Expenditure" },
            ]}
            width={window.innerWidth < 600 ? window.innerWidth - 90 : window.innerWidth < 1025 ? 1000 : 690}
            height={window.innerWidth < 600 ? 300 : 380}
            margin={{
              left: window.innerWidth < 600 ? 20 : 5,
              right: window.innerWidth < 600 ? 6 : 5,
              top: 60,
              bottom: window.innerWidth < 600 ? 30 : 20,
            }}
            sx={{
              ".MuiChartsLegend-root": {
                transform: window.innerWidth < 600 ? "scale(0.85)" : "none",
              },
            }}
          />
        </div>
      </div>
  
      {/* Pie Chart */}
      <div className="flex flex-col bg-white rounded-2xl items-center justify-center lg:w-1/3 p-4 border-2">
        <p className="text-lg font-medium">Income Spend Categories</p>
        <CustomDoughnutChart
          data={categoryPieChartData}
          slotProps={{ legend: { hidden: true } }}
          className="flex flex-col items-center justify-center"
          pieChartClassName="flex items-center justify-center lg:scale-110 mt-2"
        />
      </div>
      
    </div>
    {/* Pie Chart */}
    <div className="flex flex-col bg-white rounded-2xl items-center justify-center lg:w-1/3 p-4 border-2">
    <p className="text-lg font-medium">Investment Portfolio</p>
    <CustomDoughnutChart
      data={investmentPieChartData}
      slotProps={{ legend: { hidden: true } }}
      className="flex flex-col items-center justify-center"
      pieChartClassName="flex items-center justify-center lg:scale-110 mt-2"
    />
  </div>
  </div>
  
  )
}