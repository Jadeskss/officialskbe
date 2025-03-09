document.addEventListener('DOMContentLoaded', function() {
    fetchRecentAnnouncements();
});

function fetchRecentAnnouncements() {
    fetch('assets/announcements/announcements.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(announcements => {
            // Filter active announcements and sort by date (newest first)
            const activeAnnouncements = announcements
                .filter(ann => ann.active)
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                // Take only the 3 most recent
                .slice(0, 3);
                
            displayRecentAnnouncements(activeAnnouncements);
        })
        .catch(error => {
            console.error('Error fetching announcements:', error);
            document.getElementById('home-announcements-container').innerHTML = 
                '<div class="col-12 text-center"><p>Unable to load announcements at this time.</p></div>';
        });
}

function displayRecentAnnouncements(announcements) {
    const container = document.getElementById('home-announcements-container');
    if (!container || announcements.length === 0) {
        if (container) {
            container.innerHTML = '<div class="col-12 text-center"><p>No announcements at this time.</p></div>';
        }
        return;
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    // Add each announcement
    announcements.forEach(announcement => {
        const date = new Date(announcement.date).toLocaleDateString();
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        
        // Create button HTML based on whether link should be shown
        let buttonHtml = '';
        if (announcement.showLink && announcement.link) {
            // Use the link and text from the JSON
            buttonHtml = `<a href="${announcement.link}" class="btn btn-primary announcement-link">${announcement.linkText || 'Learn More'}</a>`;
        } else {
            // Default button to view the full announcement
            buttonHtml = `<a href="pages/announcements.html" class="btn btn-outline announcement-link">Read More</a>`;
        }
        
        card.innerHTML = `
            <div class="card announcement h-100">
                <div class="card-body">
                    <div class="announcement-date mb-2">${date}</div>
                    <h3 class="card-title">${announcement.title}</h3>
                    <div class="author text-muted mb-2">By: ${announcement.author || 'SK Staff'}</div>
                    <p>${announcement.content.substring(0, 120)}${announcement.content.length > 120 ? '...' : ''}</p>
                </div>
                <div class="card-footer bg-transparent border-0">
                    ${buttonHtml}
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}