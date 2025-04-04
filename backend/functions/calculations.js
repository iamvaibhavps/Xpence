// --------------------- Controller Functions ----------------------------- //

const getPreviousDay = (today) =>  {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Get the current day of the week (0-6)
    const todayIndex = daysOfWeek.indexOf(today);

    if (todayIndex === -1) {
        throw new Error('Invalid day of the week');
    }

    // Calculate the previous day index (handle wrapping to the last day)
    const previousDayIndex = (todayIndex - 1 + 7) % 7;

    // Return the previous day name
    return daysOfWeek[previousDayIndex];
};
  
const getPreviousMonth = () => {

    const lastMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toLocaleString('default', { month: 'long' });
    return lastMonth;

}

const getCurrentFinancialYear = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Financial year starts from April
    if (currentMonth >= 3) {
        return `${currentYear}-${currentYear + 1}`;
    } else {
        return `${currentYear - 1}-${currentYear}`;
    }
};

const getPreviousFinancialYear = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Financial year starts from April
    if (currentMonth >= 3) {
        return `${currentYear - 1}-${currentYear}`;
    } else {
        return `${currentYear - 2}-${currentYear - 1}`;
    }
};

const calculatePerformanceData = (goals = [], tasks = []) => {

    let performanceData = {
        totalPerformance: 0,
        overallRank: 0,
        totalTasks: 0,
        smallTasks: 0,
        smallTasksPoints: 0,
        bigTasksPoints: 0,
        bigTasks: 0,
        doneTasks: 0,
        doneLateTasks: 0,
        notDoneTasks: 0,
        toDoTasks: 0,
        taskNum: 0,
        taskDenom: 0,
        taskPerformance: 0,
        taskRank: 0,

        totalGoals: 0,
        monthlyGoals: 0,
        quarterlyGoals: 0,
        achievedGoals: 0,
        inProgressGoals: 0,
        missedGoals: 0,
        goalPerformance: 0,
        goalNum: 0,
        goalDenom: 0,
        monthlyGoalNum: 0,
        monthlyGoalDenom: 0,
        quarterlyGoalNum: 0,
        quarterlyGoalDenom: 0,
        goalRank: 0,
    };

    // loop over the goals
    goals.forEach(goal => {
        
        performanceData.totalGoals++;

        if (goal.endDate.type === 'month') { 
            performanceData.monthlyGoals++; 
            performanceData.monthlyGoalNum += goal.creditsAchieved;
            performanceData.monthlyGoalDenom += goal.totalCredits;
        } 
        else if (goal.endDate.type === 'quarter') { 
            performanceData.quarterlyGoals++; 
            performanceData.quarterlyGoalNum += goal.creditsAchieved;
            performanceData.quarterlyGoalDenom += goal.totalCredits;
        }

        if (goal.status === 'Achieved') { performanceData.achievedGoals++; } 
        else if (goal.status === 'InProgress') { performanceData.inProgressGoals++; } 
        else if (goal.status === 'Missed') { performanceData.missedGoals++; }

        performanceData.goalNum += goal.creditsAchieved;
        performanceData.goalDenom += goal.totalCredits;
    });
    // loop over the tasks
    tasks.forEach(task => {

        performanceData.totalTasks++;

        if (task.taskType === 'Small Task') { performanceData.smallTasks++; } 
        else { performanceData.bigTasks++; }

        performanceData.taskDenom += (task.taskType === 'Small Task' ? 2 : 4);

        if (task.status === 'Completed') { 
            if(task.taskType === 'Small Task') {
                performanceData.smallTasksPoints += 2;
            } else {
                performanceData.bigTasksPoints += 4;
            }
        performanceData.doneTasks++;
        performanceData.taskNum += (task.taskType === 'Small Task' ? 2 : 4); 
        } 
        else if (task.status === 'Delayed') { 
            if(task.taskType === 'Small Task') {
                performanceData.smallTasksPoints += 1;
            } else {
                performanceData.bigTasksPoints += 2;
            }
        performanceData.doneLateTasks++;
        performanceData.taskNum += (task.taskType === 'Small Task' ? 1 : 2); 
        } 
        else if (task.status === 'Incomplete') { performanceData.notDoneTasks++;}
        else if(task.status === "Inprogress") { performanceData.toDoTasks++; }

    });

    performanceData.goalPerformance = performanceData.goalDenom > 0 ? performanceData.goalNum / performanceData.goalDenom * 100 : 0;
    performanceData.taskPerformance = performanceData.taskDenom > 0 ? performanceData.taskNum / performanceData.taskDenom * 100 : 0;
    performanceData.totalPerformance = (performanceData.taskDenom + performanceData.goalDenom) > 0 ? (performanceData.taskNum + performanceData.goalNum) / (performanceData.taskDenom + performanceData.goalDenom) * 100 : 0;

    return performanceData;

};

const addQuarterlyDataInFilter = (filterData, userPerformance, finYear, month) => {

    // const monthsArray = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];

    // const quarter = (monthsArray.indexOf(month) < 3) ? "Q1" : (monthsArray.indexOf(month) < 6) ? "Q2" : (monthsArray.indexOf(month) < 9) ? "Q3" : "Q4";
    
    // const qInPGoals = userPerformance.financialYears.find(year => year.financialYear === finYear).quarters[quarter].quarterlyInProgressGoals;
    // const qAGoals = userPerformance.financialYears.find(year => year.financialYear === finYear).quarters[quarter].quarterlyAchievedGoals;
    // const qMGoals = userPerformance.financialYears.find(year => year.financialYear === finYear).quarters[quarter].quarterlyMissedGoals;
    // const qGN = userPerformance.financialYears.find(year => year.financialYear === finYear).quarters[quarter].quarterlyGoalNum;
    // const qGD = userPerformance.financialYears.find(year => year.financialYear === finYear).quarters[quarter].quarterlyGoalDenom;
    
    // filterData.inProgressGoals += qInPGoals;
    // filterData.achievedGoals += qAGoals;
    // filterData.missedGoals += qMGoals;

    // filterData.quarterlyGoals += qInPGoals + qAGoals + qMGoals;
    // filterData.totalGoals += qInPGoals + qAGoals + qMGoals;

    // filterData.goalNum += qGN;
    // filterData.goalDenom += qGD;

    // // calculate the goal performance
    // filterData.goalPerformance = (filterData.goalDenom > 0) ? (filterData.goalNum / filterData.goalDenom) * 100 : 0;

    // filterData.totalPerformance = (filterData.goalDenom + filterData.taskDenom) > 0 ? (filterData.goalNum + filterData.taskNum) / (filterData.goalDenom + filterData.taskDenom) * 100 : 0;

    return filterData;
};

const calculateYearlyData = (financialData) => {
    let yearlyData = {
        totalIncome: 0,
        totalExpenses: 0,
        totalSavings: 0,
        totalInvestments: 0,

        expenseCategories: {
            food: 0,
            rent: 0,
            shopping: 0,
            travel: 0,
            miscellaneous: 0
        },

        investmentCategories: {
            stocks: 0,
            mutualFunds: 0,
            realEstate: 0,
            gold: 0,
            fixedDeposits: 0,
            crypto: 0
        },

        spendingEfficiencyScore: 0,
        investmentGrowth: 0,

        groupExpenses: {
            family: 0,
            friends: 0,
            work: 0,
            travel: 0
        },
        groupContributions: 0
    };

    let efficiencyScoreCount = 0;
    let investmentGrowthCount = 0;

    // Iterate over months
    Object.values(financialData.months || {}).forEach(month => {
        yearlyData.totalIncome += month.totalIncome || 0;
        yearlyData.totalExpenses += month.totalExpenses || 0;
        yearlyData.totalSavings += month.totalSavings || 0;
        yearlyData.totalInvestments += month.totalInvestments || 0;

        // Aggregate expense categories
        Object.keys(yearlyData.expenseCategories).forEach(category => {
            yearlyData.expenseCategories[category] += month.expenseCategories?.[category] || 0;
        });

        // Aggregate investment categories
        Object.keys(yearlyData.investmentCategories).forEach(category => {
            yearlyData.investmentCategories[category] += month.investmentCategories?.[category] || 0;
        });

        // Aggregate group expenses
        Object.keys(yearlyData.groupExpenses).forEach(group => {
            yearlyData.groupExpenses[group] += month.groupExpenses?.[group] || 0;
        });

        yearlyData.groupContributions += month.groupContributions || 0;

        // Compute average AI insights
        if (month.spendingEfficiencyScore) {
            efficiencyScoreCount++;
            yearlyData.spendingEfficiencyScore += month.spendingEfficiencyScore;
        }
        if (month.investmentGrowth) {
            investmentGrowthCount++;
            yearlyData.investmentGrowth += month.investmentGrowth;
        }
    });

    // Compute average scores
    yearlyData.spendingEfficiencyScore = efficiencyScoreCount > 0 ? yearlyData.spendingEfficiencyScore / efficiencyScoreCount : 0;
    yearlyData.investmentGrowth = investmentGrowthCount > 0 ? yearlyData.investmentGrowth / investmentGrowthCount : 0;

    return yearlyData;
};

module.exports = {
    getPreviousDay,
    getPreviousMonth,
    getCurrentFinancialYear,
    getPreviousFinancialYear,
    calculatePerformanceData,
    addQuarterlyDataInFilter,
    calculateYearlyData
};