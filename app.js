// Main application script for the 2025 Weekly Calendar

// Store the original calendar data for reset functionality
const originalCalendarData = JSON.parse(JSON.stringify(calendarData));

// Check for saved data in localStorage
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Load saved data if available
    loadSavedData();
    
    // Initialize event listeners
    initEventListeners();
    
    // Render the calendar
    renderCalendarView();
    renderListView();
    
    // Create quick navigation
    createQuickNav();
    
    // Show calendar view by default
    toggleView('calendar');
});

// Load saved data from localStorage
function loadSavedData() {
    const savedData = localStorage.getItem('calendarData2025');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            // Update the calendar data with saved data
            calendarData.weeks = parsedData.weeks;
            console.log('Loaded saved calendar data');
        } catch (e) {
            console.error('Error loading saved data:', e);
        }
    }
}

// Save data to localStorage
function saveCalendarData() {
    try {
        localStorage.setItem('calendarData2025', JSON.stringify({
            weeks: calendarData.weeks
        }));
        console.log('Calendar data saved');
    } catch (e) {
        console.error('Error saving data:', e);
    }
}

// Initialize event listeners
function initEventListeners() {
    // View toggle buttons
    document.getElementById('calendar-view').addEventListener('click', function() {
        toggleView('calendar');
    });
    
    document.getElementById('list-view').addEventListener('click', function() {
        toggleView('list');
    });
    
    // Edit mode toggle button
    document.getElementById('edit-mode-toggle').addEventListener('click', function() {
        toggleEditMode();
    });
    
    // Save changes button
    document.getElementById('save-changes').addEventListener('click', function() {
        saveChanges();
    });
    
    // Cancel changes button
    document.getElementById('cancel-changes').addEventListener('click', function() {
        cancelChanges();
    });
    
    // Close buttons for modals
    document.querySelectorAll('.close').forEach(function(closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeAllModals();
        });
    });
    
    // Search button
    document.getElementById('search-btn').addEventListener('click', performSearch);
    
    // Filter dropdowns
    document.getElementById('month-filter').addEventListener('change', applyFilters);
    document.getElementById('region-filter').addEventListener('change', applyFilters);
    document.getElementById('person-filter').addEventListener('change', applyFilters);
    
    // Day edit form buttons - check if elements exist first
    const dayEditCancel = document.getElementById('day-edit-cancel');
    if (dayEditCancel) {
        dayEditCancel.addEventListener('click', function() {
            const dayEditForm = document.getElementById('day-edit-form');
            if (dayEditForm) {
                dayEditForm.style.display = 'none';
            }
        });
    }
    
    const dayEditSave = document.getElementById('day-edit-save');
    if (dayEditSave) {
        dayEditSave.addEventListener('click', saveDayEdit);
    }
    
    // Edit assignment modal buttons - check if elements exist first
    const editCancel = document.getElementById('edit-cancel');
    if (editCancel) {
        editCancel.addEventListener('click', function() {
            const editAssignmentModal = document.getElementById('edit-assignment-modal');
            if (editAssignmentModal) {
                editAssignmentModal.style.display = 'none';
            }
        });
    }
    
    const editSave = document.getElementById('edit-save');
    if (editSave) {
        editSave.addEventListener('click', saveAssignmentEdit);
    }
    
    // Populate edit person dropdown
    const editPersonSelect = document.getElementById('edit-person');
    if (editPersonSelect) {
        calendarData.people.forEach(person => {
            const option = document.createElement('option');
            option.value = person;
            option.textContent = person;
            editPersonSelect.appendChild(option);
        });
    }
    
    // Populate edit region dropdown
    const editRegionSelect = document.getElementById('edit-region');
    if (editRegionSelect) {
        calendarData.regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            editRegionSelect.appendChild(option);
        });
    }
}

// Toggle between calendar and list views
function toggleView(viewType) {
    if (viewType === 'calendar') {
        document.getElementById('calendar-container').classList.add('active-view');
        document.getElementById('list-container').classList.remove('active-view');
        document.getElementById('calendar-view').classList.add('active');
        document.getElementById('list-view').classList.remove('active');
    } else {
        document.getElementById('calendar-container').classList.remove('active-view');
        document.getElementById('list-container').classList.add('active-view');
        document.getElementById('calendar-view').classList.remove('active');
        document.getElementById('list-view').classList.add('active');
    }
}

// Toggle edit mode
function toggleEditMode() {
    const editModeToggle = document.getElementById('edit-mode-toggle');
    const editControls = document.getElementById('edit-controls');
    
    if (editModeToggle.classList.contains('active')) {
        // Turn off edit mode
        editModeToggle.classList.remove('active');
        editControls.style.display = 'none';
        document.querySelectorAll('.day-edit-controls').forEach(control => {
            control.style.display = 'none';
        });
    } else {
        // Turn on edit mode
        editModeToggle.classList.add('active');
        editControls.style.display = 'flex';
        document.querySelectorAll('.day-edit-controls').forEach(control => {
            control.style.display = 'block';
        });
    }
}

// Save changes made in edit mode
function saveChanges() {
    saveCalendarData();
    alert('Changes saved successfully!');
    toggleEditMode();
}

// Cancel changes made in edit mode
function cancelChanges() {
    if (confirm('Are you sure you want to cancel all changes?')) {
        // Reset to original data
        calendarData.weeks = JSON.parse(JSON.stringify(originalCalendarData.weeks));
        
        // Re-render the calendar
        renderCalendarView();
        renderListView();
        
        toggleEditMode();
    }
}

// Render the calendar view
function renderCalendarView() {
    const calendarContainer = document.getElementById('calendar-container');
    calendarContainer.innerHTML = '';
    
    // Group weeks by month
    const monthsData = {};
    calendarData.weeks.forEach(week => {
        if (!monthsData[week.month]) {
            monthsData[week.month] = [];
        }
        monthsData[week.month].push(week);
    });
    
    // Render each month section
    for (const [month, weeks] of Object.entries(monthsData)) {
        const monthSection = document.createElement('div');
        monthSection.className = 'month-section';
        monthSection.setAttribute('data-month', month);
        monthSection.id = `month-${month}`;
        
        // Create month header
        const monthHeader = document.createElement('div');
        monthHeader.className = 'month-header';
        
        const monthName = getMonthName(month);
        
        // Add month header controls
        const monthHeaderControls = document.createElement('div');
        monthHeaderControls.className = 'month-header-controls';
        
        const monthTitle = document.createElement('h2');
        monthTitle.textContent = monthName;
        
        monthHeaderControls.appendChild(monthTitle);
        monthHeader.appendChild(monthHeaderControls);
        
        monthSection.appendChild(monthHeader);
        
        // Create weeks
        weeks.forEach(week => {
            const weekRow = createWeekRow(week);
            monthSection.appendChild(weekRow);
        });
        
        calendarContainer.appendChild(monthSection);
    }
}

// Create a week row for the calendar view
function createWeekRow(week) {
    const weekRow = document.createElement('div');
    weekRow.className = 'week-row';
    weekRow.setAttribute('data-week', week.weekNumber);
    
    // Create week number column
    const weekNumber = document.createElement('div');
    weekNumber.className = 'week-number';
    weekNumber.innerHTML = `Week ${week.weekNumber}<br><small>${formatDate(week.startDate)}</small>`;
    
    weekRow.appendChild(weekNumber);
    
    // Create days container
    const daysContainer = document.createElement('div');
    daysContainer.className = 'days-container';
    
    // Create days for the week
    const startDate = new Date(week.startDate);
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        const dateString = formatDateToYYYYMMDD(currentDate);
        const people = getPeopleForDate(week, i);
        
        const day = createDayCell(dateString, people);
        daysContainer.appendChild(day);
    }
    
    weekRow.appendChild(daysContainer);
    return weekRow;
}

// Get people assigned to a specific day of the week
function getPeopleForDate(week, dayIndex) {
    // Calculate the date string for this day
    const currentDate = new Date(week.startDate);
    currentDate.setDate(currentDate.getDate() + dayIndex);
    const dateString = formatDateToYYYYMMDD(currentDate);
    
    // First check if there are specific daily assignments for this date
    if (week.assignments.dailyAssignments && week.assignments.dailyAssignments[dateString]) {
        // Use the daily assignments
        return week.assignments.dailyAssignments[dateString];
    }
    
    // If no daily assignments, fall back to general assignments
    const people = [];
    
    // For weekdays (Monday-Thursday)
    if (dayIndex < 4) {
        if (week.assignments.EMEA) {
            const emeaAssignees = week.assignments.EMEA.split('/');
            emeaAssignees.forEach(person => people.push(person.trim()));
        }
    } 
    // For Friday-Sunday
    else {
        if (week.assignments.weekendEMEA) {
            const weekendAssignees = week.assignments.weekendEMEA.split('/');
            weekendAssignees.forEach(person => people.push(person.trim()));
        } else if (week.assignments.EMEA) {
            const emeaAssignees = week.assignments.EMEA.split('/');
            emeaAssignees.forEach(person => people.push(person.trim()));
        }
    }
    
    return people;
}

// Create a day cell for the calendar view
function createDayCell(date, people) {
    const day = document.createElement('div');
    day.className = 'day';
    day.setAttribute('data-date', date);
    
    const dateObj = new Date(date);
    const dayName = getDayName(dateObj.getDay());
    const formattedDate = formatDate(date);
    
    // Create day header
    const dayHeader = document.createElement('div');
    dayHeader.className = 'day-header';
    dayHeader.innerHTML = `
        <span class="day-name">${dayName}</span>
        <span class="day-date">${formattedDate}</span>
    `;
    
    // Add edit controls
    const editControls = document.createElement('div');
    editControls.className = 'day-edit-controls';
    
    const editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.addEventListener('click', function(e) {
        e.stopPropagation();
        showDayEditForm(date, people);
    });
    
    editControls.appendChild(editButton);
    day.appendChild(editControls);
    
    // Create day content
    const dayContent = document.createElement('div');
    dayContent.className = 'day-content';
    
    // Add people to the day
    if (people && people.length > 0) {
        people.forEach(person => {
            if (person) {
                const personSpan = document.createElement('span');
                personSpan.className = 'person';
                personSpan.setAttribute('data-name', person);
                personSpan.textContent = person;
                
                // Add edit controls to person
                const personEditControls = document.createElement('span');
                personEditControls.className = 'person-edit-controls';
                
                const editIcon = document.createElement('i');
                editIcon.className = 'fas fa-edit edit-icon';
                editIcon.addEventListener('click', function(e) {
                    e.stopPropagation();
                    showEditAssignmentModal(person, 'EMEA', date);
                });
                
                const removeIcon = document.createElement('i');
                removeIcon.className = 'fas fa-times remove-icon';
                removeIcon.addEventListener('click', function(e) {
                    e.stopPropagation();
                    removePersonFromDay(person, date);
                });
                
                personEditControls.appendChild(editIcon);
                personEditControls.appendChild(removeIcon);
                personSpan.appendChild(personEditControls);
                
                // Add click event to show person details
                personSpan.addEventListener('click', function(e) {
                    e.stopPropagation();
                    showPersonDetails(person);
                });
                
                dayContent.appendChild(personSpan);
            }
        });
    }
    
    // Add "+" button to add a person
    const addButton = document.createElement('span');
    addButton.className = 'add-person-button';
    addButton.innerHTML = '<i class="fas fa-plus"></i>';
    addButton.addEventListener('click', function(e) {
        e.stopPropagation();
        showAddPersonModal(date);
    });
    
    dayContent.appendChild(addButton);
    
    // Add click event to show day details
    day.addEventListener('click', function() {
        showDayDetails(date, people);
    });
    
    day.appendChild(dayHeader);
    day.appendChild(dayContent);
    
    return day;
}

// Render the list view
function renderListView() {
    const listContainer = document.getElementById('list-container');
    listContainer.innerHTML = '';
    
    // Create a list item for each week
    calendarData.weeks.forEach(week => {
        // Create a simplified week view
        const startDate = new Date(week.startDate);
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const dateString = formatDateToYYYYMMDD(currentDate);
            const people = getPeopleForDate(week, i);
            
            const listItem = createListItem(dateString, week.weekNumber, people);
            listContainer.appendChild(listItem);
        }
    });
}

// Create a list item for the list view
function createListItem(date, weekNumber, people) {
    const listItem = document.createElement('div');
    listItem.className = 'list-item';
    listItem.setAttribute('data-date', date);
    
    const dateObj = new Date(date);
    const dayName = getDayName(dateObj.getDay());
    const formattedDate = formatDate(date);
    
    // Create date column
    const dateColumn = document.createElement('div');
    dateColumn.className = 'list-date';
    dateColumn.textContent = `${dayName}, ${formattedDate}`;
    
    // Create week column
    const weekColumn = document.createElement('div');
    weekColumn.className = 'list-week';
    weekColumn.textContent = `Week ${weekNumber}`;
    
    // Create people column
    const peopleColumn = document.createElement('div');
    peopleColumn.className = 'list-people';
    
    // Add people to the list item
    if (people && people.length > 0) {
        people.forEach(person => {
            if (person) {
                const personSpan = document.createElement('span');
                personSpan.className = 'person';
                personSpan.setAttribute('data-name', person);
                personSpan.textContent = person;
                
                peopleColumn.appendChild(personSpan);
            }
        });
    }
    
    // Create region column
    const regionColumn = document.createElement('div');
    regionColumn.className = 'list-region';
    regionColumn.textContent = 'EMEA';
    
    listItem.appendChild(dateColumn);
    listItem.appendChild(weekColumn);
    listItem.appendChild(peopleColumn);
    listItem.appendChild(regionColumn);
    
    return listItem;
}

// Show person details in a modal
function showPersonDetails(person) {
    const modal = document.getElementById('person-details-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    modalTitle.textContent = person;
    modalContent.innerHTML = '<p>Loading person details...</p>';
    
    // Show the modal
    modal.style.display = 'block';
}

// Show day details in a modal
function showDayDetails(date, people) {
    const modal = document.getElementById('day-details-modal');
    const modalTitle = document.getElementById('day-modal-title');
    const modalContent = document.getElementById('day-modal-content');
    
    const dateObj = new Date(date);
    const dayName = getDayName(dateObj.getDay());
    const formattedDate = formatDate(date);
    
    modalTitle.textContent = `${dayName}, ${formattedDate}`;
    modalContent.innerHTML = '';
    
    // Create assignments section
    const assignmentsSection = document.createElement('div');
    assignmentsSection.className = 'day-assignments';
    
    // Add a header and edit button
    const headerContainer = document.createElement('div');
    headerContainer.style.display = 'flex';
    headerContainer.style.justifyContent = 'space-between';
    headerContainer.style.alignItems = 'center';
    headerContainer.style.marginBottom = '10px';
    
    const assignmentsHeader = document.createElement('h3');
    assignmentsHeader.textContent = 'Assignments';
    
    const editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
    editButton.addEventListener('click', function() {
        showDayEditForm(date, people);
    });
    
    headerContainer.appendChild(assignmentsHeader);
    headerContainer.appendChild(editButton);
    assignmentsSection.appendChild(headerContainer);
    
    // Add people assigned to this day
    if (people && people.length > 0) {
        const peopleList = document.createElement('div');
        peopleList.className = 'people-list';
        
        people.forEach(person => {
            if (person) {
                const personItem = document.createElement('div');
                personItem.className = 'person-item';
                personItem.textContent = person;
                peopleList.appendChild(personItem);
            }
        });
        
        assignmentsSection.appendChild(peopleList);
    } else {
        assignmentsSection.innerHTML += '<p>No assignments for this day.</p>';
    }
    
    modalContent.appendChild(assignmentsSection);
    
    // Show the modal
    modal.style.display = 'block';
}

// Show day edit form
function showDayEditForm(date, people) {
    const modal = document.getElementById('day-details-modal');
    const modalContent = document.getElementById('day-modal-content');
    
    // Clear previous content
    modalContent.innerHTML = '';
    
    // Create edit form
    const editForm = document.createElement('div');
    editForm.className = 'edit-form';
    editForm.id = 'day-edit-form';
    editForm.setAttribute('data-date', date);
    
    // Create form header
    const formHeader = document.createElement('h3');
    formHeader.textContent = 'Edit Assignments';
    editForm.appendChild(formHeader);
    
    // Create people container
    const peopleContainer = document.createElement('div');
    peopleContainer.id = 'day-edit-people-container';
    
    // Create checkboxes for all people
    calendarData.people.forEach(person => {
        const isAssigned = people && people.includes(person);
        
        const personDiv = document.createElement('div');
        personDiv.className = 'edit-person-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `edit-person-${person}`;
        checkbox.value = person;
        checkbox.checked = isAssigned;
        
        const label = document.createElement('label');
        label.htmlFor = `edit-person-${person}`;
        label.textContent = person;
        
        personDiv.appendChild(checkbox);
        personDiv.appendChild(label);
        peopleContainer.appendChild(personDiv);
    });
    
    editForm.appendChild(peopleContainer);
    
    // Create form buttons
    const formButtons = document.createElement('div');
    formButtons.className = 'edit-form-buttons';
    
    const cancelButton = document.createElement('button');
    cancelButton.className = 'cancel-button';
    cancelButton.id = 'day-edit-cancel';
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    const saveButton = document.createElement('button');
    saveButton.className = 'save-button';
    saveButton.id = 'day-edit-save';
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', function() {
        saveDayEdit();
    });
    
    formButtons.appendChild(cancelButton);
    formButtons.appendChild(saveButton);
    editForm.appendChild(formButtons);
    
    // Add the form to the modal
    modalContent.appendChild(editForm);
    
    // Show the modal
    modal.style.display = 'block';
}

// Save day edit
function saveDayEdit() {
    const editForm = document.getElementById('day-edit-form');
    const date = editForm.getAttribute('data-date');
    
    // Get selected people
    const selectedPeople = [];
    document.querySelectorAll('#day-edit-people-container input:checked').forEach(checkbox => {
        selectedPeople.push(checkbox.value);
    });
    
    // Find the week that contains this date
    const dateObj = new Date(date);
    
    // Update the calendar data
    for (const week of calendarData.weeks) {
        const weekStart = new Date(week.startDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        if (dateObj >= weekStart && dateObj <= weekEnd) {
            // This date is in this week
            // Only update the daily assignments for this specific day
            if (!week.assignments.dailyAssignments) {
                week.assignments.dailyAssignments = {};
            }
            
            week.assignments.dailyAssignments[date] = selectedPeople;
            
            break;
        }
    }
    
    // Save the updated data
    saveCalendarData();
    
    // Re-render the calendar
    renderCalendarView();
    renderListView();
    
    // Close the modal
    closeAllModals();
}

// Show edit assignment modal
function showEditAssignmentModal(person, region, date) {
    const modal = document.getElementById('edit-assignment-modal');
    if (!modal) {
        console.error('Edit assignment modal not found');
        return;
    }
    
    const modalTitle = document.getElementById('edit-modal-title');
    if (modalTitle) {
        modalTitle.textContent = `Edit Assignment: ${person}`;
    }
    
    // Set the form values
    const editPerson = document.getElementById('edit-person');
    if (editPerson) {
        editPerson.value = person;
    }
    
    const editRegion = document.getElementById('edit-region');
    if (editRegion) {
        editRegion.value = region;
    }
    
    const editDate = document.getElementById('edit-date');
    if (editDate) {
        editDate.value = date;
    }
    
    // Show the modal
    modal.style.display = 'block';
}

// Show add person modal
function showAddPersonModal(date) {
    const modal = document.getElementById('edit-assignment-modal');
    if (!modal) {
        console.error('Edit assignment modal not found');
        return;
    }
    
    const modalTitle = document.getElementById('edit-modal-title');
    if (modalTitle) {
        modalTitle.textContent = 'Add Person Assignment';
    }
    
    // Set the form values
    const editPerson = document.getElementById('edit-person');
    if (editPerson) {
        editPerson.selectedIndex = 0;
    }
    
    const editRegion = document.getElementById('edit-region');
    if (editRegion) {
        editRegion.selectedIndex = 0;
    }
    
    const editDate = document.getElementById('edit-date');
    if (editDate) {
        editDate.value = date;
    }
    
    // Show the modal
    modal.style.display = 'block';
}

// Save assignment edit
function saveAssignmentEdit() {
    const editPerson = document.getElementById('edit-person');
    const editRegion = document.getElementById('edit-region');
    const editDate = document.getElementById('edit-date');
    
    if (!editPerson || !editRegion || !editDate) {
        console.error('Edit form elements not found');
        return;
    }
    
    const person = editPerson.value;
    const region = editRegion.value;
    const date = editDate.value;
    
    // Find the week that contains this date
    const dateObj = new Date(date);
    
    // Update the calendar data
    for (const week of calendarData.weeks) {
        const weekStart = new Date(week.startDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        if (dateObj >= weekStart && dateObj <= weekEnd) {
            // This date is in this week
            // Only update the daily assignments for this specific day
            if (!week.assignments.dailyAssignments) {
                week.assignments.dailyAssignments = {};
            }
            
            if (week.assignments.dailyAssignments[date]) {
                if (!week.assignments.dailyAssignments[date].includes(person)) {
                    week.assignments.dailyAssignments[date].unshift(person);
                    console.log(`Added ${person} to ${date}. Current order:`, week.assignments.dailyAssignments[date]);
                }
            } else {
                week.assignments.dailyAssignments[date] = [person];
                console.log(`Added ${person} to ${date}. Current order:`, week.assignments.dailyAssignments[date]);
            }
            
            break;
        }
    }
    
    // Save the updated data
    saveCalendarData();
    
    // Re-render the calendar
    renderCalendarView();
    renderListView();
    
    // Close the modal
    closeAllModals();
}

// Remove person from day
function removePersonFromDay(person, date) {
    if (confirm(`Remove ${person} from ${formatDate(date)}?`)) {
        // Find the week that contains this date
        const dateObj = new Date(date);
        
        // Update the calendar data
        for (const week of calendarData.weeks) {
            const weekStart = new Date(week.startDate);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            
            if (dateObj >= weekStart && dateObj <= weekEnd) {
                // This date is in this week
                // Only update the daily assignments for this specific day
                if (week.assignments.dailyAssignments && week.assignments.dailyAssignments[date]) {
                    const index = week.assignments.dailyAssignments[date].indexOf(person);
                    if (index !== -1) {
                        week.assignments.dailyAssignments[date].splice(index, 1);
                    }
                }
                
                break;
            }
        }
        
        // Save the updated data
        saveCalendarData();
        
        // Re-render the calendar
        renderCalendarView();
        renderListView();
    }
}

// Create quick navigation
function createQuickNav() {
    const quickNav = document.getElementById('quick-nav');
    if (!quickNav) return; // Exit if element doesn't exist
    
    quickNav.innerHTML = '';
    
    // Get all month sections
    const monthSections = document.querySelectorAll('.month-section');
    
    // Create a button for each month
    monthSections.forEach(section => {
        const month = section.getAttribute('data-month');
        const monthName = getMonthName(month).split(' ')[0]; // Just get the month name, not the year
        
        const button = document.createElement('button');
        button.className = 'quick-nav-button';
        button.setAttribute('data-target', `month-${month}`);
        
        const monthText = document.createElement('span');
        monthText.className = 'quick-nav-month';
        monthText.textContent = monthName.substring(0, 3); // First 3 letters of month
        
        button.appendChild(monthText);
        
        button.addEventListener('click', function() {
            const targetSection = document.getElementById(`month-${month}`);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        quickNav.appendChild(button);
    });
}

// Close all modals
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Apply filters
function applyFilters() {
    const monthFilter = document.getElementById('month-filter').value;
    const regionFilter = document.getElementById('region-filter').value;
    const personFilter = document.getElementById('person-filter').value;
    
    // Filter month sections
    document.querySelectorAll('.month-section').forEach(section => {
        const month = section.getAttribute('data-month');
        if (monthFilter === 'all' || month === monthFilter) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
    
    // Filter people
    document.querySelectorAll('.person').forEach(personElement => {
        const person = personElement.getAttribute('data-name');
        if (personFilter === 'all' || person === personFilter) {
            personElement.style.display = 'inline-block';
        } else {
            personElement.style.display = 'none';
        }
    });
}

// Helper function to get month name
function getMonthName(monthKey) {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('default', { month: 'short', day: 'numeric' });
}

// Helper function to get day name
function getDayName(dayIndex) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
}

// Helper function to format date to YYYY-MM-DD
function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Perform search
function performSearch() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    
    if (!searchTerm) {
        // Reset filters if search is empty
        document.getElementById('month-filter').value = 'all';
        document.getElementById('region-filter').value = 'all';
        document.getElementById('person-filter').value = 'all';
        applyFilters();
        return;
    }
    
    // Hide all people that don't match the search
    document.querySelectorAll('.person').forEach(personElement => {
        const person = personElement.getAttribute('data-name').toLowerCase();
        if (person.includes(searchTerm)) {
            personElement.style.display = 'inline-block';
        } else {
            personElement.style.display = 'none';
        }
    });
}
