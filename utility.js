// Utility functions for the 2026 Weekly Calendar

/**
 * Generates a unique ID for elements
 * @returns {string} A unique ID
 */
function generateUniqueId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The time to wait in milliseconds
 * @returns {Function} The debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

/**
 * Format a date object to a readable string
 * @param {Date} date - The date to format
 * @param {string} format - The format to use (default: 'YYYY-MM-DD')
 * @returns {string} The formatted date string
 */
function formatDateString(date, format = 'YYYY-MM-DD') {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    let result = format;
    result = result.replace('YYYY', year);
    result = result.replace('MM', month);
    result = result.replace('DD', day);
    
    return result;
}

/**
 * Parse a date string to a Date object
 * @param {string} dateString - The date string to parse
 * @returns {Date} The parsed Date object
 */
function parseDate(dateString) {
    // Handle different date formats
    if (dateString.includes('-')) {
        // YYYY-MM-DD format
        const [year, month, day] = dateString.split('-');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else if (dateString.includes('/')) {
        // MM/DD/YYYY format
        const [month, day, year] = dateString.split('/');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    
    // Default to current date if format is not recognized
    return new Date();
}

/**
 * Get the week number for a given date
 * @param {Date} date - The date to get the week number for
 * @returns {number} The week number
 */
function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Get the first day of the week for a given date
 * @param {Date} date - The date to get the first day of the week for
 * @param {number} startDay - The day to start the week on (0 = Sunday, 1 = Monday, etc.)
 * @returns {Date} The first day of the week
 */
function getFirstDayOfWeek(date, startDay = 1) {
    const day = date.getDay();
    const diff = (day < startDay ? 7 : 0) + day - startDay;
    const firstDay = new Date(date);
    firstDay.setDate(date.getDate() - diff);
    return firstDay;
}

/**
 * Get the last day of the week for a given date
 * @param {Date} date - The date to get the last day of the week for
 * @param {number} startDay - The day to start the week on (0 = Sunday, 1 = Monday, etc.)
 * @returns {Date} The last day of the week
 */
function getLastDayOfWeek(date, startDay = 1) {
    const firstDay = getFirstDayOfWeek(date, startDay);
    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6);
    return lastDay;
}

/**
 * Get the month name for a given month number
 * @param {number} month - The month number (0-11)
 * @param {string} locale - The locale to use (default: 'en-US')
 * @returns {string} The month name
 */
function getMonthName(month, locale = 'en-US') {
    const date = new Date(2000, month, 1);
    return date.toLocaleString(locale, { month: 'long' });
}

/**
 * Get the day name for a given day number
 * @param {number} day - The day number (0-6)
 * @param {string} locale - The locale to use (default: 'en-US')
 * @returns {string} The day name
 */
function getDayName(day, locale = 'en-US') {
    const date = new Date(2000, 0, day + 2);
    return date.toLocaleString(locale, { weekday: 'long' });
}

/**
 * Check if two dates are the same day
 * @param {Date} date1 - The first date
 * @param {Date} date2 - The second date
 * @returns {boolean} True if the dates are the same day, false otherwise
 */
function isSameDay(date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

/**
 * Check if a date is today
 * @param {Date} date - The date to check
 * @returns {boolean} True if the date is today, false otherwise
 */
function isToday(date) {
    return isSameDay(date, new Date());
}

/**
 * Check if a date is in the past
 * @param {Date} date - The date to check
 * @returns {boolean} True if the date is in the past, false otherwise
 */
function isPast(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
}

/**
 * Check if a date is in the future
 * @param {Date} date - The date to check
 * @returns {boolean} True if the date is in the future, false otherwise
 */
function isFuture(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
}

/**
 * Get the number of days in a month
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @returns {number} The number of days in the month
 */
function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

/**
 * Add days to a date
 * @param {Date} date - The date to add days to
 * @param {number} days - The number of days to add
 * @returns {Date} The new date
 */
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

/**
 * Subtract days from a date
 * @param {Date} date - The date to subtract days from
 * @param {number} days - The number of days to subtract
 * @returns {Date} The new date
 */
function subtractDays(date, days) {
    return addDays(date, -days);
}

/**
 * Add months to a date
 * @param {Date} date - The date to add months to
 * @param {number} months - The number of months to add
 * @returns {Date} The new date
 */
function addMonths(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
}

/**
 * Subtract months from a date
 * @param {Date} date - The date to subtract months from
 * @param {number} months - The number of months to subtract
 * @returns {Date} The new date
 */
function subtractMonths(date, months) {
    return addMonths(date, -months);
}

/**
 * Get the difference in days between two dates
 * @param {Date} date1 - The first date
 * @param {Date} date2 - The second date
 * @returns {number} The difference in days
 */
function getDaysDifference(date1, date2) {
    const diffTime = Math.abs(date2 - date1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Sort an array of dates
 * @param {Date[]} dates - The array of dates to sort
 * @param {boolean} ascending - Whether to sort in ascending order (default: true)
 * @returns {Date[]} The sorted array of dates
 */
function sortDates(dates, ascending = true) {
    return dates.sort((a, b) => {
        return ascending ? a - b : b - a;
    });
}

/**
 * Filter an array of dates by a range
 * @param {Date[]} dates - The array of dates to filter
 * @param {Date} startDate - The start date of the range
 * @param {Date} endDate - The end date of the range
 * @returns {Date[]} The filtered array of dates
 */
function filterDatesByRange(dates, startDate, endDate) {
    return dates.filter(date => date >= startDate && date <= endDate);
}

/**
 * Group an array of dates by month
 * @param {Date[]} dates - The array of dates to group
 * @returns {Object} An object with month keys and arrays of dates as values
 */
function groupDatesByMonth(dates) {
    return dates.reduce((groups, date) => {
        const month = date.getMonth();
        const year = date.getFullYear();
        const key = `${year}-${month}`;
        
        if (!groups[key]) {
            groups[key] = [];
        }
        
        groups[key].push(date);
        return groups;
    }, {});
}

/**
 * Group an array of dates by week
 * @param {Date[]} dates - The array of dates to group
 * @param {number} startDay - The day to start the week on (0 = Sunday, 1 = Monday, etc.)
 * @returns {Object} An object with week keys and arrays of dates as values
 */
function groupDatesByWeek(dates, startDay = 1) {
    return dates.reduce((groups, date) => {
        const weekStart = getFirstDayOfWeek(date, startDay);
        const key = formatDateString(weekStart);
        
        if (!groups[key]) {
            groups[key] = [];
        }
        
        groups[key].push(date);
        return groups;
    }, {});
}

/**
 * Create a date range array between two dates
 * @param {Date} startDate - The start date of the range
 * @param {Date} endDate - The end date of the range
 * @returns {Date[]} An array of dates in the range
 */
function createDateRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
}

/**
 * Get the quarter for a given date
 * @param {Date} date - The date to get the quarter for
 * @returns {number} The quarter (1-4)
 */
function getQuarter(date) {
    return Math.floor(date.getMonth() / 3) + 1;
}

/**
 * Check if a year is a leap year
 * @param {number} year - The year to check
 * @returns {boolean} True if the year is a leap year, false otherwise
 */
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Get the day of the year for a given date
 * @param {Date} date - The date to get the day of the year for
 * @returns {number} The day of the year (1-366)
 */
function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

/**
 * Get the week of the month for a given date
 * @param {Date} date - The date to get the week of the month for
 * @returns {number} The week of the month
 */
function getWeekOfMonth(date) {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstWeekday = firstDayOfMonth.getDay();
    const offsetDate = date.getDate() + firstWeekday - 1;
    return Math.floor(offsetDate / 7) + 1;
}

/**
 * Format a date as a relative time string (e.g. "2 days ago", "in 3 hours")
 * @param {Date} date - The date to format
 * @returns {string} The relative time string
 */
function formatRelativeTime(date) {
    const now = new Date();
    const diffMs = date - now;
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    
    if (diffSec < 0) {
        // Past
        if (diffSec > -60) return `${-diffSec} seconds ago`;
        if (diffMin > -60) return `${-diffMin} minutes ago`;
        if (diffHour > -24) return `${-diffHour} hours ago`;
        if (diffDay > -30) return `${-diffDay} days ago`;
        
        const diffMonth = Math.round(diffDay / 30);
        if (diffMonth > -12) return `${-diffMonth} months ago`;
        
        const diffYear = Math.round(diffDay / 365);
        return `${-diffYear} years ago`;
    } else {
        // Future
        if (diffSec < 60) return `in ${diffSec} seconds`;
        if (diffMin < 60) return `in ${diffMin} minutes`;
        if (diffHour < 24) return `in ${diffHour} hours`;
        if (diffDay < 30) return `in ${diffDay} days`;
        
        const diffMonth = Math.round(diffDay / 30);
        if (diffMonth < 12) return `in ${diffMonth} months`;
        
        const diffYear = Math.round(diffDay / 365);
        return `in ${diffYear} years`;
    }
}

/**
 * Export all utility functions
 */
const DateUtils = {
    generateUniqueId,
    debounce,
    formatDateString,
    parseDate,
    getWeekNumber,
    getFirstDayOfWeek,
    getLastDayOfWeek,
    getMonthName,
    getDayName,
    isSameDay,
    isToday,
    isPast,
    isFuture,
    getDaysInMonth,
    addDays,
    subtractDays,
    addMonths,
    subtractMonths,
    getDaysDifference,
    sortDates,
    filterDatesByRange,
    groupDatesByMonth,
    groupDatesByWeek,
    createDateRange,
    getQuarter,
    isLeapYear,
    getDayOfYear,
    getWeekOfMonth,
    formatRelativeTime
};
