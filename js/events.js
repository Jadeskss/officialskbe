document.addEventListener('DOMContentLoaded', function() {
    fetchEvents();
});

function fetchEvents() {
    fetch('../assets/events/events.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(events => {
            // Filter active events and sort by date
            const activeEvents = events.filter(event => event.active);
            
            // Split events into upcoming and past
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set to beginning of day for fair comparison
            
            const upcomingEvents = activeEvents.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= today;
            }).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort upcoming by date (nearest first)
            
            const pastEvents = activeEvents.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate < today;
            }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort past by date (most recent first)
            
            // Display events in their respective sections
            displayEvents(upcomingEvents, 'upcoming-events-container', true);
            displayEvents(pastEvents, 'past-events-container', false);
        })
        .catch(error => {
            console.error('Error fetching events:', error);
            document.getElementById('upcoming-events-container').innerHTML = 
                '<div class="event-notice">Unable to load upcoming events at this time.</div>';
            document.getElementById('past-events-container').innerHTML = 
                '<div class="event-notice">Unable to load past events at this time.</div>';
        });
}

function displayEvents(events, containerId, isUpcoming) {
    const container = document.getElementById(containerId);
    
    if (!container || events.length === 0) {
        if (container) {
            container.innerHTML = isUpcoming ? 
                '<div class="event-notice">No upcoming events at this time. Check back soon!</div>' : 
                '<div class="event-notice">No past events to display.</div>';
        }
        return;
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    // Create row for grid layout
    const row = document.createElement('div');
    row.className = 'row';
    
    // Add each event
    events.forEach(event => {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6';
        
        // Format date for display
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Determine badge type
        const badgeClass = isUpcoming ? 'event-upcoming-badge' : 'event-past-badge';
        
        col.innerHTML = `
            <div class="event-card">
                <div class="event-image-container">
                    <img src="${event.imagePath}" alt="${event.title}" class="event-image">
                    <div class="event-date-badge ${badgeClass}">
                        ${formattedDate}
                    </div>
                </div>
                <div class="event-content">
                    <h3 class="event-title">${event.title}</h3>
                    <div class="event-meta">
                        <div><i class="fas fa-clock"></i> ${event.time}</div>
                        <div><i class="fas fa-map-marker-alt"></i> ${event.location}</div>
                    </div>
                    <div class="event-description">
                        ${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}
                    </div>
                    <div class="event-actions">
                        <a href="${event.detailsLink}" class="btn btn-outline">Details</a>
                        ${isUpcoming && event.registrationLink ? 
                            `<a href="${event.registrationLink}" class="btn btn-primary">Register</a>` : 
                            event.galleryLink ? 
                            `<a href="${event.galleryLink}" class="btn btn-primary">View Gallery</a>` : ''}
                    </div>
                </div>
            </div>
        `;
        
        row.appendChild(col);
    });
    
    container.appendChild(row);
}

// Add this to the end of your events.js file

// Handle image loading for better display
document.addEventListener('DOMContentLoaded', function() {
    // Add listener for images once they've loaded
    function setupImageLoadHandlers() {
        const eventImages = document.querySelectorAll('.event-image');
        
        eventImages.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', function() {
                    this.classList.add('loaded');
                });
                
                // Handle error case
                img.addEventListener('error', function() {
                    this.src = '../assets/images/event-placeholder.jpg'; // Fallback image
                    this.classList.add('loaded');
                });
            }
        });
    }
    
    // Initial setup for images
    setupImageLoadHandlers();
    
    // Setup again after events are loaded - using a MutationObserver
    const eventContainers = document.querySelectorAll('.events-container');
    
    if (eventContainers.length) {
        const observer = new MutationObserver(function(mutations) {
            setupImageLoadHandlers();
        });
        
        eventContainers.forEach(container => {
            observer.observe(container, { childList: true, subtree: true });
        });
    }
});