document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle - consolidated implementation
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const nav = document.querySelector('nav');
    const mainNav = document.getElementById('main-nav');
    const header = document.querySelector('header');
    
    if (mobileToggle && nav) {
        // Toggle function to handle all menu state changes
        function toggleMobileMenu(show) {
            // If show is undefined, toggle current state
            if (show === undefined) {
                show = !nav.classList.contains('open');
            }
            
            if (show) {
                // Open menu
                nav.classList.add('open');
                if (mainNav) mainNav.classList.add('active');
                mobileToggle.classList.add('active');
                mobileToggle.setAttribute('aria-expanded', 'true');
                document.body.classList.add('menu-open');
                header.classList.add('has-open-menu');
                
                // Ensure hamburger icon shows as X
                const hamburgerIcon = mobileToggle.querySelector('.hamburger-icon');
                if (hamburgerIcon) hamburgerIcon.classList.add('open');
            } else {
                // Close menu
                nav.classList.remove('open');
                if (mainNav) mainNav.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
                header.classList.remove('has-open-menu');
                
                // Ensure hamburger icon shows as bars
                const hamburgerIcon = mobileToggle.querySelector('.hamburger-icon');
                if (hamburgerIcon) hamburgerIcon.classList.remove('open');
            }
        }
        
        // Toggle menu when clicking the button
        mobileToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMobileMenu();
        });
        
        // Close menu when clicking on links
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    toggleMobileMenu(false);
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (window.innerWidth <= 768 && 
                nav.classList.contains('open') && 
                !event.target.closest('nav') && 
                !event.target.closest('.mobile-nav-toggle')) {
                toggleMobileMenu(false);
            }
        });
        
        // Close menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && nav.classList.contains('open')) {
                toggleMobileMenu(false);
            }
        });
    }
    
    // Handle header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Trigger scroll once to set initial state
    window.dispatchEvent(new Event('scroll'));
});