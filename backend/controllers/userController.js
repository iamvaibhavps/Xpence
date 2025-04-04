const { default: mongoose } = require("mongoose");
const UserPerformance = require("../models/UserPerformance");
const { getCurrentFinancialYear, getPreviousFinancialYear, getPreviousMonth, getPreviousDay } = require("../functions/calculations");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const getUserPerformance = async (req, res) => {
    const userId = req.params.id;
    const {
      filterType,
      filterTimeRange,
      startq,
      startfiscal,
      endq,
      endfiscal, // for custom range of goals quarterly
      startm,
      endm,
      starty,
      endy, // for custom range of goals monthly
    } = req.query;
  
    if (!userId) return ApiError(400, "Invalid User ID", null, res);
  
    // Helper function to get month names in order
    const allMonths = [
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
      "January",
      "February",
      "March",
    ];

    const currentMonth = new Date().toLocaleString("default", { month: "long" });
    const currentFinancialYear = getCurrentFinancialYear();
  
    const previousMonth = getPreviousMonth();
    const previousFinancialYear = getPreviousFinancialYear();
  
    const currentDay = new Date().toLocaleString("default", { weekday: "long" });
    const previousDay = getPreviousDay(
      new Date().toLocaleString("default", { weekday: "long" })
    );
  
    try {
      let data = {};
      const userPerformance = await UserPerformance.findOne({ userId });
  
      // filters: alltime, thismonth, lastmonth, thisfinancialyear, lastfinancialyear
        if (filterTimeRange === "alltime") {
            
            let performanceData = userPerformance.financialYears.find(
              (year) => year.financialYear === currentFinancialYear
            ).months[currentMonth];
            // performanceData = addQuarterlyDataInFilter(performanceData, userPerformance, currentFinancialYear, currentMonth);
    
            let filterData = {};
    
            if (currentMonth === "April") {
              filterData = userPerformance.financialYears.find(
                (year) => year.financialYear === previousFinancialYear
              ).months["March"];
              // filterData = addQuarterlyDataInFilter(filterData, userPerformance, previousFinancialYear, "March");
            } else {
              // else the previous month will be the previous month of the current financial year
              filterData = userPerformance.financialYears.find(
                (year) => year.financialYear === currentFinancialYear
              ).months[previousMonth];
              // filterData = addQuarterlyDataInFilter(filterData, userPerformance, currentFinancialYear, previousMonth);
            }
    
            data = { performanceData, filterData, label: "This Month" };

        } else if (filterTimeRange === "thisweek") {
          // fetch all compared with start of this week

            let performanceData = userPerformance.financialYears.find(
                (year) => year.financialYear === currentFinancialYear
            ).months[currentMonth];

            // performanceData = addQuarterlyDataInFilter(performanceData, userPerformance, currentFinancialYear, currentMonth);
    
            let filterData = userPerformance.weekly.days["Sunday"];

            data = { performanceData, filterData, label: "This Month" };
            data = { performanceData, filterData, label: "This Week" };

        } 
        else if (filterTimeRange === "prev7days") {
            
            let performanceData = userPerformance.financialYears.find(
                (year) => year.financialYear === currentFinancialYear
            ).months[currentMonth];

            // performanceData = addQuarterlyDataInFilter(performanceData, userPerformance, currentFinancialYear, currentMonth);
    
            let filterData = userPerformance.weekly.days[currentDay];
            data = { performanceData, filterData, label: "This Month" };
    
            data = {
                performanceData,
                filterData,
                label: "Compared to Previous Week",
            };
            } else if (filterTimeRange === "thismonth") {

            let performanceData = userPerformance.financialYears.find(
                (year) => year.financialYear === currentFinancialYear
            ).months[currentMonth];
            // performanceData = addQuarterlyDataInFilter(performanceData, userPerformance, currentFinancialYear, currentMonth);
    
            let filterData = {};
    
            if (currentMonth === "April") {
                filterData = userPerformance.financialYears.find(
                (year) => year.financialYear === previousFinancialYear
                ).months["March"];
                // filterData = addQuarterlyDataInFilter(filterData, userPerformance, previousFinancialYear, "March");
            } else {
                // else the previous month will be the previous month of the current financial year
                filterData = userPerformance.financialYears.find(
                (year) => year.financialYear === currentFinancialYear
                ).months[previousMonth];
                // filterData = addQuarterlyDataInFilter(filterData, userPerformance, currentFinancialYear, previousMonth);
            }
  
            data = { performanceData, filterData, label: "This Month" };

        } else if (filterTimeRange === "lastmonth") {

            let performanceData = {};
            let filterData = {};
  
            if (previousMonth === "March") {
                performanceData = userPerformance.financialYears.find(
                (year) => year.financialYear === previousFinancialYear
                ).months["March"];
                // performanceData = addQuarterlyDataInFilter(performanceData, userPerformance, previousFinancialYear, "March");
            } else {
                performanceData = userPerformance.financialYears.find(
                (year) => year.financialYear === currentFinancialYear
                ).months[previousMonth];
                // performanceData = addQuarterlyDataInFilter(performanceData, userPerformance, currentFinancialYear, previousMonth);
            }
  
            filterData = userPerformance.financialYears.find(
                (year) => year.financialYear === currentFinancialYear
            ).months[currentMonth];

            // filterData = addQuarterlyDataInFilter(filterData, userPerformance, currentFinancialYear, currentMonth);

            data = {
                performanceData,
                filterData,
                label: "Previous Month",
            };
        }
        // thisfinancialyear, lastfinancialyear
        else {
            const currentFinPerformance = userPerformance.financialYears.find(
                (year) => year.financialYear === currentFinancialYear
            );
            const prevFinPerformance = userPerformance.financialYears.find(
                (year) => year.financialYear === previousFinancialYear
            );
    
            // console.log("currentFinPerformance: ", currentFinPerformance);
            // console.log("prevFinPerformance: ", prevFinPerformance);
    
            const currentYearData = calculateYearlyData(currentFinPerformance);
            const prevYearData = calculateYearlyData(prevFinPerformance);
    
            let performanceData = {};
            let filterData = {};
    
            if (filterTimeRange === "thisfinancialyear") {
                performanceData = currentYearData;
                filterData = prevYearData;
            } else if (filterTimeRange === "lastfinancialyear") {
                performanceData = prevYearData;
                filterData = currentYearData;
            }
    
            const label =
                filterTimeRange === "thisfinancialyear"
                ? "Current Financial Year"
                : "Previous Financial Year";
    
            data = { performanceData, filterData, label };
        }

        return ApiResponse(200, "Data Fetched Successfully", data, res);
    }   catch (error) {
        return ApiError(500, "Error fetching data", error, res);
    }
};

module.exports = {
    getUserPerformance
};