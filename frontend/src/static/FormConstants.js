
export const repetitionOptions = [
  { value: 'None', label: 'None' },
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Monthly', label: 'Monthly' },
];

// Options for days of the week
export const daysOfWeekOptions = [
  { value: "Sunday", label: "Sunday" },
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
];

export const endDateType = [
  {value: 'month', label: 'Month'},
  {value: 'quarter', label: 'Quarter'}
];

export const monthOptions = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export const quarterOptions = [
  { value: 1, label: 'Q1' },
  { value: 2, label: 'Q2' },
  { value: 3, label: 'Q3' },
  { value: 4, label: 'Q4' },
];

export const filterOptions = [
  {
    label: "overall-performance",
    options: [
      { value: 'alltime', label: 'All Time' },
      { value: 'thisweek', label: 'This Week' },
      { value: 'prev7days', label: "Last 7 days"},
      { value: 'thismonth', label: 'This Month' },
      { value: "lastmonth", label: "Last Month" },
      { value: "thisfinancialyear", label: "Current Fin. Year" },
      { value: "lastfinancialyear", label: "Previous Fin. Year" }
    ]
  },
  {
    label: "task-performance",
    options: [
      { value: 'alltime', label: 'All Time' },
      { value: 'thisweek', label: 'This Week' },
      { value: 'prev7days', label: "Last 7 days"},
      { value: 'thismonth', label: 'This Month' },
      { value: "lastmonth", label: "Last Month" },
      { value: "last3months", label: "Last 3 Months" },
      { value: "last6months", label: "Last 6 Months" },
      { value: "thisfinancialyear", label: "Current Fin. Year" },
      { value: "lastfinancialyear", label: "Previous Fin. Year" }
    ]
  },
  {
    label: "goal-performance",
    options: [
      { value: 'alltime', label: 'All Time' },
      { value: 'thismonth', label: 'This Month' },
      { value: "lastmonth", label: "Last Month" },
      { value: "thisfinancialyear", label: "Current Fin. Year" },
      { value: "lastfinancialyear", label: "Previous Fin. Year" }
    ]
  }
];


export const getMonthName = (month) => {
  switch (month) {
    case 1:
      return 'January';
    case 2:
      return 'February';
    case 3:
      return 'March';
    case 4:
      return 'April';
    case 5:
      return 'May';
    case 6:
      return 'June';
    case 7:
      return 'July';
    case 8:
      return 'August';
    case 9:
      return 'September';
    case 10:
      return 'October';
    case 11:
      return 'November';
    case 12:
      return 'December';
    default:
      return '';
  }
};

export const getQuarterName = (quarter) => {
  switch (quarter) {
    case 1:
      return 'Q1 (April-June)';
    case 2:
      return 'Q2 (July-September)';
    case 3:
      return 'Q3 (October-December)';
    case 4:
      return 'Q4 (January-March)';
    default:
      return '';
  }
};

// Tasks Status
export const taskStatusOptions = [
  { value: 'Inprogress', label: 'To do' },
  { value: 'Completed', label: 'Done' },
  { value: 'Incomplete', label: 'Not Done' },
  { value: 'Delayed', label: 'Done late' },
];

// Helper function to format financial year in YYYY-YYYY format
export const formatFinancialYear = (year, month) => {
  const startYear = month >= 4 ? year : year - 1;
  const endYear = startYear + 1;
  return `${startYear}-${endYear}`;
};

// Helper function to generate the next 24 months
export const generateMonthOptions = () => {
  const months = [];
  const currentDate = new Date();

  for (let i = 0; i < 24; i++) {
    const futureDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
    const monthName = futureDate.toLocaleString('default', { month: 'long' });
    const year = futureDate.getFullYear();
    const month = futureDate.getMonth() + 1;

    const financialYear = formatFinancialYear(year, month);

    months.push({
      value: {
        month,
        year,
        financialYear,
      },
      label: `${monthName} - ${year}`,
    });
  }

  // console.log('months: ', months);

  return months;
};

// Helper function to generate the next 8 quarters
export const generateQuarterOptions = () => {
  const quarters = [];
  const currentDate = new Date();
  let quarterIndex = Math.floor(currentDate.getMonth() / 3); // 0: Q1, 1: Q2, 2: Q3, 3: Q4

  for (let i = 0; i < 8; i++) {
    const year = currentDate.getFullYear() + Math.floor((quarterIndex + i - 1) / 4);
    const quarter = ((quarterIndex + i - 1) % 4) + 1;
    const month = quarter * 3 + 1; // Adjust to start from April as month 4 (April, July, October, January)
    const financialYear = formatFinancialYear(year, month);

    quarters.push({
      value: {
        quarter: (quarter == 0) ? 4 : quarter,
        year : (quarter === 0) ? year + 1 : year,
        financialYear: (quarter === 0) ? `${year}-${year + 1}` : financialYear,
      },
      label: `Q${(quarter == 0) ? 4 : quarter} (${year}-${year + 1})`,
    });
  }

  // console.log('quarters: ', quarters);

  return quarters;
};


export const filterByDate = (items, filterType) => {
  const now = new Date();

  if (!["month", "week", "previousWeek", "previousMonth"].includes(filterType)) {
    throw new Error("Invalid filter type. Use 'month', 'week', 'previousWeek', or 'previousMonth'.");
  }

  return items.filter((item) => {
    const itemDate = new Date(item.createdAt);

    if (filterType === "month") {
      return (
        itemDate.getFullYear() === now.getFullYear() &&
        itemDate.getMonth() === now.getMonth()
      );
    }

    if (filterType === "week") {
      const currentWeekStart = new Date(now);
      const currentWeekEnd = new Date(now);

      // Set current week start to Sunday
      currentWeekStart.setDate(now.getDate() - now.getDay());
      currentWeekStart.setHours(0, 0, 0, 0);

      // Set current week end to Saturday
      currentWeekEnd.setDate(now.getDate() + (6 - now.getDay()));
      currentWeekEnd.setHours(23, 59, 59, 999);

      return itemDate >= currentWeekStart && itemDate <= currentWeekEnd;
    }

    if (filterType === "previousWeek") {
      const previousWeekEnd = new Date(now);

      // Set previous week end to last Saturday
      previousWeekEnd.setDate(now.getDate() - now.getDay() - 1);
      previousWeekEnd.setHours(23, 59, 59, 999);

      return itemDate <= previousWeekEnd;
    }

    if (filterType === "previousMonth") {
      const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      previousMonthEnd.setHours(23, 59, 59, 999);

      return itemDate <= previousMonthEnd;
    }

    return false;
  });
};

export const calculateDueDateForGoal = (endDate, financialYear) => {

  // endDate is an object with type, month, quarter and year properties
  // i want to calculate the days left for the goal to end

  const {type, month, quarter, year} = endDate;

  const now = new Date();
  let dueDate = new Date();

  if(type === 'month') {

    // month is from 1 to 12
    // year is the year of the month
    // due date is the last day of the month
    dueDate = new Date(year, month, 0);
  }
  else if(type === 'quarter') {
    // quarter is 1 to 4
    // year is the year of the quarter
    // due date is the last day of the quarter
    dueDate = new Date(year, quarter * 3, 0);

  }

//   console.log('dueDate: ', dueDate);
  return Math.floor((dueDate - now) / (1000 * 60 * 60 * 24));
}


