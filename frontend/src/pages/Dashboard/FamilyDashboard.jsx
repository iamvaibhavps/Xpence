
import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux';

import CustomBarChart from '../../components/Charts/BarChartComp'
import CustomDoughnutChart from '../../components/Charts/PieChartComp'
import LineChartComp from '../../components/Charts/LineChartComp'

import TaskCard from "../../components/Card Component/TaskCard"

import { LineChart } from "@mui/x-charts";
import { ChevronDown } from "lucide-react";
import { useEffect } from 'react';
import { getDashboardInfo } from '../../apis/apiCalls';

import { filterOptions } from "../../static/FormConstants"
import { expense, income, investment, savings } from '../../allImages'


const FamilyDashboard = () => {

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

    const [groupSplitChartData, setGroupSplitChartData] = useState([
        { id: 0, value: 0, label: "Travel", color: "#ff7f50" },
        { id: 1, value: 0, label: "Food", color: "#87ceeb" },
        { id: 2, value: 0, label: "Entertainment", color: "#32cd32" },
        { id: 3, value: 0, label: "Miscellaneous", color: "#ff69b4" },
        { id: 4, value: 0, label: "Others", color: "#ffa500" },
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
                totalIncome: 159789,
                totalExpenses: 93452,
                totalSavings: 42861,
                totalInvestments: 23476,
                spendingEfficiencyScore: 85.4,
                investmentGrowth: 12.3,
                groupContributions: 5243,
                expenseCategories: {
                    Food: 22847,
                    Rent: 28975,
                    Entertainment: 12368,
                    Transport: 14672,
                    Miscellaneous: 14590,
                },
                investmentCategories: {
                    MutualFunds: 7289,
                    Stocks: 6453,
                    Gold: 4875,
                    FDs: 4859,
                },
                groupSplits: {
                    Travel: 1500,
                    Food: 1200,
                    Entertainment: 800,
                    Miscellaneous: 600,
                }
            },
            filterData: {
                totalIncome: 143567,
                totalExpenses: 87921,
                totalSavings: 37915,
                totalInvestments: 17731,
                spendingEfficiencyScore: 82.7,
                investmentGrowth: 10.4,
                groupContributions: 4529,
                expenseCategories: {
                    Food: 20376,
                    Rent: 26589,
                    Entertainment: 11248,
                    Transport: 13578,
                    Miscellaneous: 16130,
                },
                investmentCategories: {
                    MutualFunds: 6598,
                    Stocks: 5483,
                    Gold: 3892,
                    FDs: 1758,
                },
                groupSplits: {
                    Travel: 1200,
                    Food: 800,
                    Entertainment: 600,
                    Miscellaneous: 400,
                }
            },
        },
        thisweek: {
            label: "This Week",
            performanceData: {
                totalIncome: 8563,
                totalExpenses: 5238,
                totalSavings: 2312,
                totalInvestments: 1013,
                spendingEfficiencyScore: 76.3,
                investmentGrowth: 3.24,
                groupContributions: 657,
                expenseCategories: {
                    Food: 1526,
                    Rent: 2187,
                    Entertainment: 683,
                    Transport: 534,
                    Miscellaneous: 308,
                },
                investmentCategories: {
                    MutualFunds: 512,
                    Stocks: 287,
                    Gold: 162,
                    FDs: 52,
                },
                groupSplits: {
                    Travel: 300,
                    Food: 200,
                    Entertainment: 150,
                    Miscellaneous: 100,
                },
            },
            filterData: {
                totalIncome: 7843,
                totalExpenses: 5072,
                totalSavings: 2093,
                totalInvestments: 878,
                spendingEfficiencyScore: 73.4,
                investmentGrowth: 2.76,
                groupContributions: 612,
                expenseCategories: {
                    Food: 1324,
                    Rent: 2076,
                    Entertainment: 623,
                    Transport: 587,
                    Miscellaneous: 462,
                },
                investmentCategories: {
                    MutualFunds: 458,
                    Stocks: 276,
                    Gold: 124,
                    FDs: 47,
                },
                groupSplits: {
                    Travel: 250,
                    Food: 150,
                    Entertainment: 100,
                    Miscellaneous: 50,
                }
            },
        },
        prev7days: {
            label: "Compared to Previous Week",
            performanceData: {
                totalIncome: 8927,
                totalExpenses: 5487,
                totalSavings: 2532,
                totalInvestments: 1208,
                spendingEfficiencyScore: 78.2,
                investmentGrowth: 3.54,
                groupContributions: 723,
                expenseCategories: {
                    Food: 1713,
                    Rent: 2276,
                    Entertainment: 798,
                    Transport: 614,
                    Miscellaneous: 386,
                },
                investmentCategories: {
                    MutualFunds: 621,
                    Stocks: 348,
                    Gold: 145,
                    FDs: 94,
                },
                groupSplits: {
                    Travel: 350,
                    Food: 250,
                    Entertainment: 200,
                    Miscellaneous: 150,
                }
            },
            filterData: {
                totalIncome: 8642,
                totalExpenses: 5328,
                totalSavings: 2286,
                totalInvestments: 1128,
                spendingEfficiencyScore: 75.6,
                investmentGrowth: 3.08,
                groupContributions: 658,
                expenseCategories: {
                    Food: 1532,
                    Rent: 2196,
                    Entertainment: 724,
                    Transport: 487,
                    Miscellaneous: 389,
                },
                investmentCategories: {
                    MutualFunds: 542,
                    Stocks: 327,
                    Gold: 134,
                    FDs: 125,
                },
                groupSplits: {
                    Travel: 300,
                    Food: 200,
                    Entertainment: 150,
                    Miscellaneous: 100,
                }
            },
        },
        thismonth: {
            label: "This Month",
            performanceData: {
                totalIncome: 32457,
                totalExpenses: 20134,
                totalSavings: 8367,
                totalInvestments: 3956,
                spendingEfficiencyScore: 80.3,
                investmentGrowth: 6.24,
                groupContributions: 1457,
                expenseCategories: {
                    Food: 5123,
                    Rent: 7236,
                    Entertainment: 2978,
                    Transport: 3847,
                    Miscellaneous: 2950,
                },
                investmentCategories: {
                    MutualFunds: 1847,
                    Stocks: 1231,
                    Gold: 671,
                    FDs: 507,
                },
                groupSplits: {
                    Travel: 400,
                    Food: 300,
                    Entertainment: 250,
                    Miscellaneous: 200,
                },
            },
            filterData: {
                totalIncome: 31268,
                totalExpenses: 19134,
                totalSavings: 7506,
                totalInvestments: 3528,
                spendingEfficiencyScore: 77.8,
                investmentGrowth: 5.46,
                groupContributions: 1432,
                expenseCategories: {
                    Food: 4764,
                    Rent: 6795,
                    Entertainment: 2873,
                    Transport: 3782,
                    Miscellaneous: 2920,
                },
                investmentCategories: {
                    MutualFunds: 1576,
                    Stocks: 1128,
                    Gold: 634,
                    FDs: 390,
                },
                groupSplits: {
                    Travel: 350,
                    Food: 250,
                    Entertainment: 200,
                    Miscellaneous: 150,
                }
            },
        },
        lastmonth: {
            label: "Last Month",
            performanceData: {
                totalIncome: 30278,
                totalExpenses: 18436,
                totalSavings: 8976,
                totalInvestments: 4812,
                spendingEfficiencyScore: 82.5,
                investmentGrowth: 7.08,
                groupContributions: 1321,
                expenseCategories: {
                    Food: 5934,
                    Rent: 6987,
                    Entertainment: 2045,
                    Transport: 2176,
                    Miscellaneous: 1294,
                },
                investmentCategories: {
                    MutualFunds: 1978,
                    Stocks: 1476,
                    Gold: 987,
                    FDs: 471,
                },
                groupSplits: {
                    Travel: 450,
                    Food: 350,
                    Entertainment: 250,
                    Miscellaneous: 200,
                }
            },
            filterData: {
                totalIncome: 29354,
                totalExpenses: 17281,
                totalSavings: 8528,
                totalInvestments: 4545,
                spendingEfficiencyScore: 79.2,
                investmentGrowth: 6.47,
                groupContributions: 1218,
                expenseCategories: {
                    Food: 5762,
                    Rent: 6754,
                    Entertainment: 1832,
                    Transport: 1793,
                    Miscellaneous: 1140,
                },
                investmentCategories: {
                    MutualFunds: 1753,
                    Stocks: 1423,
                    Gold: 923,
                    FDs: 446,
                },
                groupSplits: {
                    Travel: 400,
                    Food: 300,
                    Entertainment: 200,
                    Miscellaneous: 150,
                }
            },
        },
        thisfinancialyear: {
            label: "Current Financial Year",
            performanceData: {
                totalIncome: 178923,
                totalExpenses: 109875,
                totalSavings: 45678,
                totalInvestments: 25370,
                spendingEfficiencyScore: 88.2,
                investmentGrowth: 14.3,
                groupContributions: 7234,
                expenseCategories: {
                    Food: 24876,
                    Rent: 32178,
                    Entertainment: 14287,
                    Transport: 17954,
                    Miscellaneous: 20580,
                },
                investmentCategories: {
                    MutualFunds: 9278,
                    Stocks: 8092,
                    Gold: 5215,
                    FDs: 2785,
                },
                groupSplits: {
                    Travel: 500,
                    Food: 400,
                    Entertainment: 300,
                    Miscellaneous: 250,
                }
            },
            filterData: {
                totalIncome: 171538,
                totalExpenses: 105234,
                totalSavings: 42156,
                totalInvestments: 22148,
                spendingEfficiencyScore: 85.4,
                investmentGrowth: 13.2,
                groupContributions: 6487,
                expenseCategories: {
                    Food: 22945,
                    Rent: 30125,
                    Entertainment: 12874,
                    Transport: 15982,
                    Miscellaneous: 23308,
                },
                investmentCategories: {
                    MutualFunds: 8457,
                    Stocks: 7486,
                    Gold: 4328,
                    FDs: 2677,
                },
                groupSplits: {
                    Travel: 450,
                    Food: 350,
                    Entertainment: 250,
                    Miscellaneous: 200,
                }
            },
        },
        lastfinancialyear: {
            label: "Last Financial Year",
            performanceData: {
                totalIncome: 162587,
                totalExpenses: 102345,
                totalSavings: 39876,
                totalInvestments: 21366,
                spendingEfficiencyScore: 86.5,
                investmentGrowth: 12.47,
                groupContributions: 5976,
                expenseCategories: {
                    Food: 23854,
                    Rent: 30124,
                    Entertainment: 13256,
                    Transport: 16987,
                    Miscellaneous: 18124,
                },
                investmentCategories: {
                    MutualFunds: 7985,
                    Stocks: 6243,
                    Gold: 4128,
                    FDs: 3010,
                },
                groupSplits: {
                    Travel: 600,
                    Food: 500,
                    Entertainment: 400,
                    Miscellaneous: 300,
                }
            },
            filterData: {
                totalIncome: 154987,
                totalExpenses: 94532,
                totalSavings: 39875,
                totalInvestments: 20580,
                spendingEfficiencyScore: 83.6,
                investmentGrowth: 11.47,
                groupContributions: 5832,
                expenseCategories: {
                    Food: 22156,
                    Rent: 28932,
                    Entertainment: 11987,
                    Transport: 15643,
                    Miscellaneous: 15814,
                },
                investmentCategories: {
                    MutualFunds: 7632,
                    Stocks: 6354,
                    Gold: 4267,
                    FDs: 2327,
                },
                groupSplits: {
                    Travel: 550,
                    Food: 450,
                    Entertainment: 350,
                    Miscellaneous: 250,
                }
            },
        },
    };

    const dataForLineChart = {
        '2022-2023': {
            data: [7500, 8000, 8500, 9000, 3255, 7453, 10500, 11000, 11500, 3456, 12500, 13000],
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
            const groupSplits = performanceData.groupSplits || {};
            // console.log("groupSplits", groupSplits);
            const splitValues = Object.values(groupSplits);
            const totalSplit = splitValues.reduce((acc, value) => acc + value, 0);

            // console.log("totalSplit", totalSplit);

            if (totalSplit > 0) {
                const splitChartData = Object.keys(groupSplits).map((category, index) => ({
                    id: index,
                    value: Math.ceil((groupSplits[category] / totalSplit) * 100) || 0,
                    label: category.charAt(0).toUpperCase() + category.slice(1),
                    color: ["#ff7f50", "#87ceeb", "#32cd32", "#ff69b4", "#ffa500"][index % 5],
                }));
                setGroupSplitChartData(splitChartData);
            } else {

                setGroupSplitChartData([
                    {
                        id: 0,
                        value: 1,
                        label: "No Data",
                        color: "#d1d1d1",

                    },
                ]);
            }


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

            // console.log("Data = ", data)

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
        <div className="p-4 overflow-x-hidden">
            {/* <div className="bg-white rounded-lg shadow px-6 ">
                <p className="mb-4">Welcome, {currentUser?.name}!</p>
            </div> */}
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
                                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-lightBlue ${option.value === selectedTimeRangeLabel.value ? "bg-gray-200 font-medium" : ""
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
                <div className="flex flex-col lg:flex-row gap-4 mt-6 mb-6">
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
                                                className={`px-4 py-2 text-xs md:text-sm cursor-pointer hover:bg-gray-100 ${option.value === selectedPerformanceYear ? "bg-gray-200 font-medium" : ""
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
                            pieChartClassName="flex items-center justify-center lg:scale-110 mt-2 ml-28"
                        />
                    </div>

                </div>
                {/* Pie Chart */}
                <div className='flex flex-col lg:flex-row gap-4 mt-6 mb-6'>
                    <div className="flex-1 flex flex-col bg-white rounded-2xl items-center justify-center lg:w-1/3 p-4 border-2 ">
                        <p className="text-lg font-medium">Investment Portfolio</p>
                        <CustomDoughnutChart
                            data={investmentPieChartData}
                            slotProps={{ legend: { hidden: true } }}
                            className="flex flex-col items-center justify-center"
                            pieChartClassName="flex items-center justify-center lg:scale-110 mt-2 ml-28"
                        />
                    </div>

                    <div className="flex-1 flex flex-col bg-white rounded-2xl items-center justify-center lg:w-1/3 p-4 border-2 ">
                        <p className="text-lg font-medium">Group Splits</p>
                        <CustomDoughnutChart
                            data={groupSplitChartData}
                            slotProps={{ legend: { hidden: true } }}
                            className="flex flex-col items-center justify-center"
                            pieChartClassName="flex items-center justify-center lg:scale-110 mt-2 ml-28"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FamilyDashboard;

