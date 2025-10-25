// Item prices (in IDR per day)
const itemPrices = {
    "Hydropack": 10000,
    "Tracking Pole": 10000,
    "Tenda Kapasitas 6–8 (Great Outdoors Drifter 4)": 35000,
    "Tenda Kapasitas 4–5 (Tendaki Borneo 4)": 29000,
    "Tenda Kapasitas 4–5 (Wildshell Jayadipa)": 29000,
    "Carrier 60L (Arei Toba 60L)": 15000,
    "Kursi Lipat": 9000,
    "Meja Lipat": 9000,
    "Tripod Kecil": 8000,
    "Grill Pan": 10000,
    "Kompor Kecil": 9000,
    "Kompor Besar": 12000,
    "Cooking Set / Nesting 4 in 1": 13000,
    "Cooking Set / Nesting 3 in 1": 13000,
    "Tripod Besar": 15000,
    "Sleeping Bag Polar Biasa": 8000,
    "Sleeping Bag Polar Bulu": 10000,
    "Flysheet 3x4": 10000,
    "Kuas": 3000,
    "Bantal Tiup": 3000,
    "Matras Spon": 4000,
    "Lampu Tenda": 5000,
    "Headlamp Baterai": 5000,
    "Headlamp Charge": 5000,
    "Tiang Flysheet": 5000,
    "Capit": 3000,
    "Paket Hemat 1": 25000,
    "Paket Hemat 2": 30000,
    "Paket Hemat 3": 35000,
    "Paket Hemat 4": 40000,
    "Paket Hemat 5": 45000,
    "Paket Hemat 6": 65000
};

// Package prices (in IDR per day)
const packagePrices = {
    "Paket Hemat 1 - Rp 25.000/hari": 25000,
    "Paket Hemat 2 - Rp 30.000/hari": 30000,
    "Paket Hemat 3 - Rp 35.000/hari": 35000,
    "Paket Hemat 4 - Rp 40.000/hari": 40000,
    "Paket Hemat 5 - Rp 45.000/hari": 45000,
    "Paket Hemat 6 - Rp 65.000/hari": 65000
};

// Shopping cart array
let shoppingCart = [];

// Set minimum date for rental to today
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu toggle
    initMobileMenu();
    
    // Initialize fade-in animations
    initFadeInAnimations();
    
    // Initialize number-only input for phone fields
    initPhoneNumberValidation();
    
    // Initialize hero image slider
    initHeroSlider();
    
    // Initialize shopping cart functionality
    initShoppingCart();
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Function to initialize phone number validation
function initPhoneNumberValidation() {
    // Get all phone number input fields
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        // Prevent non-numeric characters
        input.addEventListener('keypress', function(e) {
            // Allow: backspace, delete, tab, escape, enter
            if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
                // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && e.ctrlKey === true) ||
                (e.keyCode === 67 && e.ctrlKey === true) ||
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                return; // Let it happen, don't do anything
            }
            
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
        
        // Handle paste events
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            
            // Get pasted data via clipboard API
            let pastedData = (e.clipboardData || window.clipboardData).getData('text');
            
            // Remove non-numeric characters
            pastedData = pastedData.replace(/\D/g, '');
            
            // Insert the cleaned data
            document.execCommand('insertText', false, pastedData);
        });
    });
}

// Function to initialize mobile menu toggle
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    menuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        
        // Hamburger animation
        const hamburgers = document.querySelectorAll('.hamburger');
        hamburgers.forEach(hamburger => {
            hamburger.classList.toggle('active');
        });
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mainNav.classList.remove('active');
            const hamburgers = document.querySelectorAll('.hamburger');
            hamburgers.forEach(hamburger => {
                hamburger.classList.remove('active');
            });
        });
    });
}

// Function to initialize hero image slider with Ken Burns effect
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    
    function showSlide(index) {
        // Remove active class from all slides
        slides.forEach(slide => slide.classList.remove('active'));
        
        // Add active class to current slide
        slides[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Change slide every 5 seconds
    setInterval(nextSlide, 5000);
}

// Function to initialize fade-in animations
function initFadeInAnimations() {
    // Get all elements with the fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Set up the Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the 'appear' class to trigger the animation
                entry.target.classList.add('appear');
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Adjust the margin to trigger slightly before entering the viewport
    });
    
    // Observe each element
    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // Fallback / robustness: some mobile browsers or situations may not reliably
    // fire IntersectionObserver callbacks (or timing may miss elements). Add a
    // scroll/resize check and an initial forced check to ensure animations run.
    function checkFadeElements() {
        fadeElements.forEach(el => {
            if (el.classList.contains('appear')) return; // already visible
            const rect = el.getBoundingClientRect();
            // Consider element visible if any part is within viewport minus a small offset
            if (rect.top < (window.innerHeight || document.documentElement.clientHeight) - 50 && rect.bottom > 50) {
                el.classList.add('appear');
            }
        });
    }

    // Run an initial check after a small timeout (lets layout settle on mobile)
    setTimeout(checkFadeElements, 250);

    // Add passive scroll/resize listeners as a fallback
    window.addEventListener('scroll', checkFadeElements, { passive: true });
    window.addEventListener('resize', checkFadeElements);
}

// Function to initialize shopping cart functionality
function initShoppingCart() {
    // Add event listeners to all "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Redirect to booking page
            window.location.href = 'booking.html';
        });
    });
}