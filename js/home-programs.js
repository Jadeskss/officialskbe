document.addEventListener('DOMContentLoaded', function() {
    fetchFeaturedPrograms();
});

function fetchFeaturedPrograms() {
    // Updated path to match your actual file location
    fetch('assets/programs/programs.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(programs => {
            // Filter for active and featured programs
            const featuredPrograms = programs
                .filter(prog => prog.active && prog.featured)
                .slice(0, 4); // Show up to 4 featured programs
                
            displayFeaturedPrograms(featuredPrograms);
        })
        .catch(error => {
            console.error('Error fetching programs:', error);
            document.getElementById('featured-programs-container').innerHTML = 
                '<div class="col-12 text-center"><p>Unable to load programs at this time.</p></div>';
        });
}

function displayFeaturedPrograms(programs) {
    const container = document.getElementById('featured-programs-container');
    
    if (!container || programs.length === 0) {
        if (container) {
            container.innerHTML = '<div class="col-12 text-center"><p>No featured programs at this time.</p></div>';
        }
        return;
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    // Add each program
    programs.forEach(program => {
        const col = document.createElement('div');
        col.className = 'col-md-6 mb-4';
        
        // Create image HTML (handle both image path formats)
        let imageHtml = '';
        if (program.imagePath) {
            // Fix path for homepage context by removing "../" if present
            let fixedPath = program.imagePath;
            if (fixedPath.startsWith('../')) {
                fixedPath = fixedPath.substring(3);
            }
            imageHtml = `<img src="${fixedPath}" class="card-img-top" alt="${program.title}">`;
        }
        
        col.innerHTML = `
            <div class="card h-100">
                ${imageHtml}
                <div class="card-header">
                    <h3 class="card-title">${program.title}</h3>
                </div>
                <div class="card-body">
                    <p>${program.description.substring(0, 120)}${program.description.length > 120 ? '...' : ''}</p>
                </div>
                <div class="card-footer bg-transparent border-0">
                    <a href="pages/programs.html${program.buttonLink}" class="btn btn-primary">${program.buttonText}</a>
                </div>
            </div>
        `;
        
        container.appendChild(col);
    });
}

// Update the image HTML generation in displayFeaturedPrograms()
let imageHtml = '';
if (program.imagePath) {
    // Fix path for homepage context by removing "../" if present
    let fixedPath = program.imagePath;
    if (fixedPath.startsWith('../')) {
        fixedPath = fixedPath.substring(3);
    }
    imageHtml = `
        <div class="card-img-container">
            <img src="${fixedPath}" class="card-img-top" alt="${program.title}">
        </div>
    `;
}

col.innerHTML = `
    <div class="card h-100">
        ${imageHtml}
        <div class="card-header">
            <h3 class="card-title">${program.title}</h3>
        </div>
        <div class="card-body">
            <p>${program.description.substring(0, 120)}${program.description.length > 120 ? '...' : ''}</p>
        </div>
        <div class="card-footer bg-transparent border-0">
            <a href="pages/programs.html${program.buttonLink}" class="btn btn-primary">${program.buttonText}</a>
        </div>
    </div>
`;