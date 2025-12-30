// Solution for Week 26 on Tuesday, showing Tony above Houmaidy

// This is the original data for Week 26
const originalWeek26 = {
  month: "2025-06",
  weekNumber: "26",
  startDate: "2025-06-23",
  assignments: {
    EMEA: "Houmaidy",
    weekendEMEA: "Izaak",
    dailyAssignments: {
      "2025-06-23": ["Houmaidy"],
      "2025-06-24": ["Houmaidy"],  // Tuesday - currently only Houmaidy is assigned
      "2025-06-25": ["Houmaidy"],
      "2025-06-26": ["Houmaidy"],
      "2025-06-27": ["Izaak"],
      "2025-06-28": ["Izaak"],
      "2025-06-29": ["Izaak"]
    }
  }
};

// This is the modified data for Week 26 with Tony showing above Houmaidy on Tuesday
const modifiedWeek26 = {
  month: "2025-06",
  weekNumber: "26",
  startDate: "2025-06-23",
  assignments: {
    EMEA: "Houmaidy",
    weekendEMEA: "Izaak",
    dailyAssignments: {
      "2025-06-23": ["Houmaidy"],
      "2025-06-24": ["Tony", "Houmaidy"],  // Tuesday - Tony now shows above Houmaidy
      "2025-06-25": ["Houmaidy"],
      "2025-06-26": ["Houmaidy"],
      "2025-06-27": ["Izaak"],
      "2025-06-28": ["Izaak"],
      "2025-06-29": ["Izaak"]
    }
  }
};

// Instructions for implementing this change in the actual calendar-data.js file:
// 1. Locate the Week 26 object in the calendar-data.js file
// 2. Find the dailyAssignments property for that week
// 3. Modify the array for "2025-06-24" to be ["Tony", "Houmaidy"] instead of ["Houmaidy"]
// 4. Save the file
// 5. The calendar will now show Tony above Houmaidy on Tuesday of Week 26
