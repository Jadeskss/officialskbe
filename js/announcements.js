document.addEventListener('DOMContentLoaded', function() {
    fetchAnnouncements();
});

function fetchAnnouncements() {
    // Update path to match your project structure
    fetch('../assets/announcements/announcements.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(announcements => {
            displayAnnouncements(announcements.filter(ann => ann.active));
        })
        .catch(error => {
            console.error('Error fetching announcements:', error);
            document.getElementById('announcement-container').innerHTML = 
                '<p>Unable to load announcements at this time.</p>';
        });
}

function displayAnnouncements(announcements) {
    const container = document.getElementById('announcement-container');
    
    if (announcements.length === 0) {
        container.innerHTML = '<p>No announcements at this time.</p>';
        return;
    }
    
    let html = '';
    announcements.forEach(announcement => {
        const date = new Date(announcement.date).toLocaleDateString();
        html += `
            <div class="announcement-item">
                <h3>${announcement.title}</h3>
                <p class="announcement-info">
                    <span class="announcement-date">Posted on: ${date}</span>
                    <span class="announcement-author">Author: ${announcement.author || 'SK Staff'}</span>
                </p>
                <div class="announcement-content">${announcement.content}</div>
                ${announcement.showLink && announcement.link ? 
                  `<a href="${announcement.link}" class="btn btn-primary announcement-link mt-3">${announcement.linkText || 'Learn More'}</a>` 
                  : ''}
            </div>
        `;
    });
    
    container.innerHTML = html;
}