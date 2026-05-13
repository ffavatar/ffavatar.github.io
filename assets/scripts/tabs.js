// Tab switching functionality
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', function() {
        const targetTab = this.getAttribute('data-tab');
        
        // Find the closest container that holds this tab system
        const container = this.closest('.container');
        
        // Remove active class from buttons and contents ONLY within this container
        container.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        container.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        this.classList.add('active');
        container.querySelector(`[data-tab-content="${targetTab}"]`).classList.add('active');
    });
});

// Handle scroll arrow visibility and functionality for a specific wrapper
function updateScrollArrows(wrapper) {
    const tabNavigation = wrapper.querySelector('.tab-navigation');
    const scrollLeftBtn = wrapper.querySelector('.tab-scroll-btn.scroll-left');
    const scrollRightBtn = wrapper.querySelector('.tab-scroll-btn.scroll-right');
    
    if (!tabNavigation || !scrollLeftBtn || !scrollRightBtn) return;
    
    const isScrollable = tabNavigation.scrollWidth > tabNavigation.clientWidth;
    
    if (!isScrollable) {
        scrollLeftBtn.classList.remove('visible');
        scrollRightBtn.classList.remove('visible');
        return;
    }
    
    const scrollLeft = tabNavigation.scrollLeft;
    const maxScroll = tabNavigation.scrollWidth - tabNavigation.clientWidth;
    
    // Show/hide left arrow
    if (scrollLeft <= 5) {
        scrollLeftBtn.classList.remove('visible');
    } else {
        scrollLeftBtn.classList.add('visible');
    }
    
    // Show/hide right arrow
    if (scrollLeft >= maxScroll - 5) {
        scrollRightBtn.classList.remove('visible');
    } else {
        scrollRightBtn.classList.add('visible');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Find all tab navigation wrappers and initialize each one independently
    document.querySelectorAll('.tab-navigation-wrapper').forEach(wrapper => {
        const tabNavigation = wrapper.querySelector('.tab-navigation');
        const scrollLeftBtn = wrapper.querySelector('.tab-scroll-btn.scroll-left');
        const scrollRightBtn = wrapper.querySelector('.tab-scroll-btn.scroll-right');
        
        if (tabNavigation && scrollLeftBtn && scrollRightBtn) {
            tabNavigation.scrollLeft = 0;
            
            // Set up scroll listener for this specific wrapper
            tabNavigation.addEventListener('scroll', () => updateScrollArrows(wrapper));
            
            // Scroll button click handlers
            scrollLeftBtn.addEventListener('click', function() {
                const scrollAmount = tabNavigation.clientWidth * 0.7;
                tabNavigation.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
            
            scrollRightBtn.addEventListener('click', function() {
                const scrollAmount = tabNavigation.clientWidth * 0.7;
                tabNavigation.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
            
            // Initial update for this wrapper
            setTimeout(() => updateScrollArrows(wrapper), 100);
            
            // Update on window resize for this wrapper
            window.addEventListener('resize', () => updateScrollArrows(wrapper));
        }
    });
});

