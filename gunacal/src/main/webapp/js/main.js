// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  const currentYearElements = document.querySelectorAll('#current-year, #footer-year');
  currentYearElements.forEach(el => {
    if (el) el.textContent = new Date().getFullYear();
  });

  // User dropdown menu toggle
  const userMenuButton = document.getElementById('user-menu-button');
  const userDropdown = document.getElementById('user-dropdown');
  
  if (userMenuButton && userDropdown) {
    userMenuButton.addEventListener('click', function() {
      userDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
      if (!userMenuButton.contains(event.target) && !userDropdown.contains(event.target)) {
        userDropdown.classList.remove('show');
      }
    });
  }

  // Modal functionality
  const addEventBtn = document.getElementById('add-event-btn');
  const addEventModal = document.getElementById('add-event-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const cancelEventBtn = document.getElementById('cancel-event-btn');
  const addEventForm = document.getElementById('add-event-form');
  
  if (addEventBtn && addEventModal) {
    addEventBtn.addEventListener('click', function() {
      addEventModal.classList.add('show');
    });
    
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', function() {
        addEventModal.classList.remove('show');
      });
    }
    
    if (cancelEventBtn) {
      cancelEventBtn.addEventListener('click', function() {
        addEventModal.classList.remove('show');
      });
    }
    
    // Close modal when clicking outside
    addEventModal.addEventListener('click', function(event) {
      if (event.target === addEventModal) {
        addEventModal.classList.remove('show');
      }
    });
    
    if (addEventForm) {
      addEventForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        const title = document.getElementById('event-title').value;
        const date = document.getElementById('event-date').value;
        const time = document.getElementById('event-time').value;
        const category = document.getElementById('event-category').value;
        
        // Here you would typically send this data to a server
        console.log('New event:', { title, date, time, category });
        
        // Close modal
        addEventModal.classList.remove('show');
        
        // Reset form
        addEventForm.reset();
        
        // For demo purposes, add the event to the list
        addEventToList({ title, date, time, category });
      });
    }
  }

  // Calendar functionality
  const currentMonthYearElement = document.getElementById('current-month-year');
  const calendarDaysElement = document.getElementById('calendar-days');
  
  if (currentMonthYearElement && calendarDaysElement) {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Display current month and year
    updateCalendarHeader(currentMonth, currentYear);
    
    // Generate calendar days
    generateCalendarDays(currentMonth, currentYear);
    
    // Previous and next month buttons
    const prevMonthBtn = document.querySelector('.calendar-nav button:first-child');
    const nextMonthBtn = document.querySelector('.calendar-nav button:last-child');
    
    if (prevMonthBtn && nextMonthBtn) {
      prevMonthBtn.addEventListener('click', function() {
        const [month, year] = currentMonthYearElement.dataset.date.split('-').map(Number);
        const newDate = new Date(year, month - 1, 1);
        updateCalendarHeader(newDate.getMonth(), newDate.getFullYear());
        generateCalendarDays(newDate.getMonth(), newDate.getFullYear());
      });
      
      nextMonthBtn.addEventListener('click', function() {
        const [month, year] = currentMonthYearElement.dataset.date.split('-').map(Number);
        const newDate = new Date(year, month + 1, 1);
        updateCalendarHeader(newDate.getMonth(), newDate.getFullYear());
        generateCalendarDays(newDate.getMonth(), newDate.getFullYear());
      });
    }
  }

  // Generate sample events for the dashboard
  const eventsList = document.getElementById('events-list');
  if (eventsList) {
    const sampleEvents = [
      { id: 1, title: "팀 미팅", date: "2025-03-23", time: "10:00", category: "업무" },
      { id: 2, title: "점심 약속", date: "2025-03-23", time: "12:30", category: "개인" },
      { id: 3, title: "프로젝트 마감일", date: "2025-03-25", time: "18:00", category: "업무" },
      { id: 4, title: "생일 파티", date: "2025-03-27", time: "19:00", category: "개인" },
    ];
    
    sampleEvents.forEach(event => {
      addEventToList(event);
    });
  }
});

// Helper Functions
function updateCalendarHeader(month, year) {
  const currentMonthYearElement = document.getElementById('current-month-year');
  if (!currentMonthYearElement) return;
  
  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];
  
  currentMonthYearElement.textContent = `${year}년 ${monthNames[month]}`;
  currentMonthYearElement.dataset.date = `${month}-${year}`;
}

function generateCalendarDays(month, year) {
  const calendarDaysElement = document.getElementById('calendar-days');
  if (!calendarDaysElement) return;
  
  // Clear previous days
  calendarDaysElement.innerHTML = '';
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Create empty cells for days before first day of month
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-day';
    calendarDaysElement.appendChild(emptyCell);
  }
  
  // Create cells for each day in month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement('div');
    dayCell.className = 'calendar-day';
    
    const dayNumber = document.createElement('div');
    dayNumber.className = 'calendar-day-number';
    dayNumber.textContent = day;
    
    dayCell.appendChild(dayNumber);
    calendarDaysElement.appendChild(dayCell);
    
    // Add click event to day cells
    dayCell.addEventListener('click', function() {
      // Set the date in the event form when a day is clicked
      const eventDateInput = document.getElementById('event-date');
      if (eventDateInput) {
        const selectedDate = new Date(year, month, day);
        const formattedDate = selectedDate.toISOString().split('T')[0];
        eventDateInput.value = formattedDate;
        
        // Open the add event modal
        const addEventModal = document.getElementById('add-event-modal');
        if (addEventModal) {
          addEventModal.classList.add('show');
        }
      }
    });
  }
}

function addEventToList(event) {
  const eventsList = document.getElementById('events-list');
  if (!eventsList) return;
  
  const eventCard = document.createElement('div');
  eventCard.className = 'event-card';
  eventCard.innerHTML = `
    <h3 class="event-title">${event.title}</h3>
    <p class="event-time">${event.date} ${event.time}</p>
    <div class="event-category">${event.category}</div>
  `;
  
  eventsList.appendChild(eventCard);
}