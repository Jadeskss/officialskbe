document.addEventListener('DOMContentLoaded', function() {
    fetchPrograms();
});

function fetchPrograms() {
    fetch('../assets/programs/programs.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(programs => {
            // Group programs by category
            const categories = groupByCategory(programs.filter(prog => prog.active));
            
            // Display programs by category
            displayProgramsByCategory(categories);
        })
        .catch(error => {
            console.error('Error fetching programs:', error);
            document.querySelectorAll('.programs-container').forEach(container => {
                container.innerHTML = '<p>Unable to load programs at this time.</p>';
            });
        });
}

function groupByCategory(programs) {
    const categories = {};
    
    programs.forEach(program => {
        if (!categories[program.category]) {
            categories[program.category] = [];
        }
        categories[program.category].push(program);
    });
    
    return categories;
}

function displayProgramsByCategory(categories) {
    // For each program category section, find its container and populate
    for (const [category, programs] of Object.entries(categories)) {
        // Find the container for this category
        const containerId = category.toLowerCase().replace(/\s+/g, '-') + '-container';
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.warn(`Container for category "${category}" (ID: ${containerId}) not found`);
            continue;
        }
        
        // Clear the container
        container.innerHTML = '';
        
        // Create the row for this category's programs
        const row = document.createElement('div');
        row.className = 'row';
        
        // Add each program in this category to the row
        programs.forEach(program => {
            const col = document.createElement('div');
            col.className = 'col-md-6 mb-4';
            
            let additionalInfoHtml = '';
            if (program.additionalInfo && program.additionalInfo.length > 0) {
                additionalInfoHtml = `
                    <p>Regular activities include:</p>
                    <ul>
                        ${program.additionalInfo.map(info => `<li>${info}</li>`).join('')}
                    </ul>
                `;
            }
            
            col.innerHTML = `
                <div class="card h-100">
                    ${program.imagePath ? `<img src="${program.imagePath}" class="card-img-top" alt="${program.title}">` : ''}
                    <div class="card-header">
                        <h3 class="card-title">${program.title}</h3>
                    </div>
                    <div class="card-body">
                        <p>${program.description}</p>
                        ${additionalInfoHtml}
                    </div>
                    <div class="card-footer bg-transparent border-0">
                        <a href="${program.buttonLink}" class="btn btn-primary">${program.buttonText}</a>
                    </div>
                </div>
            `;
            
            row.appendChild(col);
        });
        
        // Add the row to the container
        container.appendChild(row);
    }
}

// ...existing code (if any)...

// Function to load program schedules
function loadProgramSchedules() {
    const scheduleContainer = document.getElementById('schedule-container');
    const scheduleBody = document.getElementById('schedule-body');
    const loadingElement = document.getElementById('schedule-loading');
    const errorElement = document.getElementById('schedule-error');
    
    // Fetch program schedules from JSON file
    fetch('../assets/programs/upcomming.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Hide loading indicator
            loadingElement.style.display = 'none';
            
            // Process the schedule data
            if (data && data.schedules && data.schedules.length > 0) {
                // Show the container
                scheduleContainer.style.display = 'block';
                
                // Clear existing content
                scheduleBody.innerHTML = '';
                
                // Add each schedule item
                data.schedules.forEach(schedule => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${schedule.program}</td>
                        <td>${schedule.date}</td>
                        <td>${schedule.location}</td>
                        <td><a href="${schedule.actionLink}" class="btn btn-sm btn-outline">${schedule.action}</a></td>
                    `;
                    scheduleBody.appendChild(row);
                });
            } else {
                // If no schedules are found
                scheduleBody.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-center">No upcoming schedules available.</td>
                    </tr>
                `;
                scheduleContainer.style.display = 'block';
            }
        })
        .catch(error => {
            // Show error message and hide loading indicator
            console.error('Error fetching program schedules:', error);
            loadingElement.style.display = 'none';
            errorElement.style.display = 'block';
        });
}

// Load schedules when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load existing program data (if you have this functionality already)
    
    // Load program schedules
    loadProgramSchedules();
});