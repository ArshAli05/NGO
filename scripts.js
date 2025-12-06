document.addEventListener('DOMContentLoaded', function() {
    // 1. Mobile Menu Toggle
    const navMenu = document.querySelector('[data-nav-menu]');
    const menuToggle = document.querySelector('[data-menu-toggle]');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // 2. Dynamic Impact Counter
    const counters = document.querySelectorAll('.impact-card');
    
    // Function to animate the counter
    const animateCounter = (el, target) => {
        let start = 0;
        const duration = 2000; // 2 seconds
        const step = Math.ceil(target / (duration / 10)); // Calculate step size

        const updateCount = () => {
            start += step;
            if (start > target) {
                start = target;
            }
            // Use Intl.NumberFormat for better readability
            el.querySelector('.counter').textContent = new Intl.NumberFormat().format(start);

            if (start < target) {
                requestAnimationFrame(updateCount);
            }
        };

        requestAnimationFrame(updateCount);
    };

    // Use Intersection Observer to trigger animation when the section is visible
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the element is visible
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counterElement = entry.target;
                const targetValue = parseInt(counterElement.getAttribute('data-count-to'));
                animateCounter(counterElement, targetValue);
                observer.unobserve(counterElement); // Stop observing once animated
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    
    // 3. Hero Carousel Background Functionality
    const heroCarouselTrack = document.getElementById('hero-carousel-track');
    const heroCarouselSlides = document.querySelectorAll('.hero-carousel-slide');
    const heroCarouselIndicators = document.getElementById('hero-carousel-indicators');
    const heroPrevBtn = document.getElementById('hero-carousel-prev');
    const heroNextBtn = document.getElementById('hero-carousel-next');
    
    let heroCurrentSlide = 0;
    const heroTotalSlides = heroCarouselSlides.length;
    let heroAutoSlideInterval;

    // Create indicators for hero carousel
    heroCarouselSlides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'carousel-indicator' + (index === 0 ? ' active' : '');
        indicator.addEventListener('click', () => heroGoToSlide(index));
        heroCarouselIndicators.appendChild(indicator);
    });

    function heroUpdateCarousel() {
        const offset = -heroCurrentSlide * 100;
        if (heroCarouselTrack) {
            heroCarouselTrack.style.transform = `translateX(${offset}%)`;
        }
        
        // Update indicators
        document.querySelectorAll('#hero-carousel-indicators .carousel-indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === heroCurrentSlide);
        });
    }

    function heroGoToSlide(index) {
        heroCurrentSlide = (index + heroTotalSlides) % heroTotalSlides;
        heroUpdateCarousel();
        heroResetAutoSlide();
    }

    function heroNextSlide() {
        heroGoToSlide(heroCurrentSlide + 1);
    }

    function heroPrevSlide() {
        heroGoToSlide(heroCurrentSlide - 1);
    }

    function heroStartAutoSlide() {
        heroAutoSlideInterval = setInterval(heroNextSlide, 4000); // Change slide every 4 seconds
    }

    function heroResetAutoSlide() {
        clearInterval(heroAutoSlideInterval);
        heroStartAutoSlide();
    }

    if (heroPrevBtn) heroPrevBtn.addEventListener('click', heroPrevSlide);
    if (heroNextBtn) heroNextBtn.addEventListener('click', heroNextSlide);

    // Start auto-sliding for hero
    heroStartAutoSlide();

    // Pause on hover for hero
    const heroCarouselWrapper = document.querySelector('.hero-carousel-wrapper');
    if (heroCarouselWrapper) {
        heroCarouselWrapper.addEventListener('mouseenter', () => clearInterval(heroAutoSlideInterval));
        heroCarouselWrapper.addEventListener('mouseleave', heroStartAutoSlide);
    }
    
    // 4. Regular Carousel Functionality (Gallery)
    const carouselTrack = document.getElementById('carousel-track');
    const carouselSlides = document.querySelectorAll('#carousel-track .carousel-slide');
    const carouselIndicators = document.getElementById('carousel-indicators');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    
    let currentSlide = 0;
    const totalSlides = carouselSlides.length;
    let autoSlideInterval;

    // Create indicators
    carouselSlides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'carousel-indicator' + (index === 0 ? ' active' : '');
        indicator.addEventListener('click', () => goToSlide(index));
        carouselIndicators.appendChild(indicator);
    });

    function updateCarousel() {
        const offset = -currentSlide * 100;
        carouselTrack.style.transform = `translateX(${offset}%)`;
        
        // Update indicators
        document.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = (index + totalSlides) % totalSlides;
        updateCarousel();
        resetAutoSlide();
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Start auto-sliding
    startAutoSlide();

    // Pause on hover
    if (carouselTrack) {
        carouselTrack.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        carouselTrack.addEventListener('mouseleave', startAutoSlide);
    }
    
    // 4. Donation Slider Functionality
    const donationSlider = document.getElementById('donation-amount');
    const currentAmountSpan = document.getElementById('current-amount');
    const impactDescriptionSpan = document.getElementById('impact-description');
    const submitAmountSpan = document.getElementById('submit-amount');

    const impactLevels = [
        { min: 1, max: 50, description: "provides a nutritious meal for a child." },
        { min: 51, max: 100, description: "provides two days of school supplies." },
        { min: 101, max: 500, description: "provides a full week of schooling." },
        { min: 501, max: 1000, description: "funds healthcare services for a family." },
        { min: 1001, max: 5000, description: "supports skill training programs." },
        { min: 5001, max: 50000, description: "builds lasting community infrastructure." }
    ];

    function updateDonationDisplay() {
        const amount = parseInt(donationSlider.value);
        currentAmountSpan.textContent = amount;
        submitAmountSpan.textContent = amount;
        
        // Direct INR amount (no conversion)
        document.getElementById('upi-amount').textContent = amount;
        document.getElementById('bank-amount').textContent = amount;

        // Update dynamic impact description
        const level = impactLevels.find(l => amount >= l.min && amount <= l.max);
        if (level) {
            impactDescriptionSpan.textContent = level.description;
        }

        // Generate QR code
        generateUPIQRCode(amount);
        updatePaymentSummary();
    }

    donationSlider.addEventListener('input', updateDonationDisplay);

    // 4. Payment Method Tabs
    const paymentTabs = document.querySelectorAll('.payment-tab');
    const paymentContents = document.querySelectorAll('.payment-method-content');

    paymentTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const method = tab.getAttribute('data-method');
            
            // Update active tab
            paymentTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active content
            paymentContents.forEach(content => content.classList.remove('active'));
            document.getElementById(method + '-method').classList.add('active');
        });
    });

    // 5. Frequency Toggle
    const freqToggleContainer = document.querySelector('[data-frequency-toggle]');
    const freqButtons = freqToggleContainer.querySelectorAll('button');
    let selectedFrequency = 'once';

    freqButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            freqButtons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            selectedFrequency = event.target.getAttribute('data-freq');
            updatePaymentSummary();
        });
    });

    // 6. Generate UPI QR Code
    function generateUPIQRCode(amount) {
        const upiString = `upi://pay?pa=globalreach@upi&pn=GlobalReachNGO&am=${amount}&tr=DONATION&tn=NGO%20Donation`;
        const encodedUPI = encodeURI(upiString);
        
        // Using QR server API (free service)
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(encodedUPI)}`;
        const qrImage = document.getElementById('qr-code-image');
        if (qrImage) {
            qrImage.src = qrCodeUrl;
        }
    }

    // 7. UPI Payment Functionality
    const openUPIBtn = document.getElementById('open-upi-app');
    if (openUPIBtn) {
        openUPIBtn.addEventListener('click', () => {
            const amount = Math.round(parseInt(donationSlider.value) * 85);
            const upiString = `upi://pay?pa=globalreach@upi&pn=GlobalReachNGO&am=${amount}&tr=DONATION&tn=NGO%20Donation`;
            window.location.href = upiString;
        });
    }

    // 8. Copy to Clipboard
    const copyUPIBtn = document.getElementById('copy-upi-btn');
    if (copyUPIBtn) {
        copyUPIBtn.addEventListener('click', () => {
            const upiInput = document.getElementById('upi-id-input');
            upiInput.select();
            document.execCommand('copy');
            
            const originalText = copyUPIBtn.innerHTML;
            copyUPIBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyUPIBtn.innerHTML = originalText;
            }, 2000);
        });
    }

    const copyAccountBtn = document.getElementById('copy-account-btn');
    if (copyAccountBtn) {
        copyAccountBtn.addEventListener('click', () => {
            const accountNumber = '35612480965234';
            navigator.clipboard.writeText(accountNumber).then(() => {
                const originalText = copyAccountBtn.innerHTML;
                copyAccountBtn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyAccountBtn.innerHTML = originalText;
                }, 2000);
            });
        });
    }

    const copyIFSCBtn = document.getElementById('copy-ifsc-btn');
    if (copyIFSCBtn) {
        copyIFSCBtn.addEventListener('click', () => {
            const ifscCode = 'SBIN0001234';
            navigator.clipboard.writeText(ifscCode).then(() => {
                const originalText = copyIFSCBtn.innerHTML;
                copyIFSCBtn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyIFSCBtn.innerHTML = originalText;
                }, 2000);
            });
        });
    }

    // 9. UPI Confirm Button
    const upiConfirmBtn = document.getElementById('upi-confirm-btn');
    if (upiConfirmBtn) {
        upiConfirmBtn.addEventListener('click', () => {
            const upiEmail = document.getElementById('upi-email').value.trim();
            if (!upiEmail || !upiEmail.includes('@')) {
                alert('Please enter a valid email address.');
                return;
            }

            const formData = {
                name: 'UPI Donor',
                email: upiEmail,
                amount: parseInt(donationSlider.value),
                frequency: selectedFrequency,
                method: 'UPI'
            };

            showPaymentSuccess(formData);
        });
    }

    // 10. Bank Confirm Button
    const bankConfirmBtn = document.getElementById('bank-confirm-btn');
    if (bankConfirmBtn) {
        bankConfirmBtn.addEventListener('click', () => {
            const bankEmail = document.getElementById('bank-email').value.trim();
            const bankName = document.getElementById('bank-name').value.trim();
            
            if (!bankEmail || !bankEmail.includes('@')) {
                alert('Please enter a valid email address.');
                return;
            }
            if (!bankName) {
                alert('Please enter your name.');
                return;
            }

            const formData = {
                name: bankName,
                email: bankEmail,
                amount: parseInt(donationSlider.value),
                frequency: selectedFrequency,
                method: 'Bank Transfer'
            };

            showPaymentSuccess(formData);
        });
    }

    // 11. Card Payment Form Handling
    const paymentForm = document.getElementById('donation-form');
    const cardNumberInput = document.getElementById('card-number');
    const expiryInput = document.getElementById('expiry');
    const cvvInput = document.getElementById('cvv');

    // Card number formatting (add spaces)
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }

    // Expiry date formatting (MM/YY)
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }

    // CVV only numbers
    if (cvvInput) {
        cvvInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    // Update payment summary
    function updatePaymentSummary() {
        const amount = parseInt(donationSlider.value);
        document.getElementById('summary-amount').textContent = '₹' + amount;
        document.getElementById('summary-frequency').textContent = selectedFrequency === 'once' ? 'One-Time' : 'Monthly';
        document.getElementById('summary-total').textContent = '₹' + amount;
    }

    // Form submission
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form
            if (!validatePaymentForm()) {
                return;
            }

            // Get form data
            const formData = {
                name: document.getElementById('donor-name').value,
                email: document.getElementById('email').value,
                cardName: document.getElementById('card-name').value,
                cardNumber: document.getElementById('card-number').value.replace(/\s/g, ''),
                expiry: document.getElementById('expiry').value,
                cvv: document.getElementById('cvv').value,
                country: document.getElementById('country').value,
                amount: parseInt(donationSlider.value),
                frequency: selectedFrequency,
                method: 'Card'
            };

            // Show success message
            showPaymentSuccess(formData);
        });
    }

    function validatePaymentForm() {
        const name = document.getElementById('donor-name').value.trim();
        const email = document.getElementById('email').value.trim();
        const cardName = document.getElementById('card-name').value.trim();
        const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
        const expiry = document.getElementById('expiry').value;
        const cvv = document.getElementById('cvv').value;
        const country = document.getElementById('country').value;

        if (!name) {
            alert('Please enter your full name.');
            return false;
        }

        if (!email || !email.includes('@')) {
            alert('Please enter a valid email address.');
            return false;
        }

        if (!cardName) {
            alert('Please enter cardholder name.');
            return false;
        }

        if (cardNumber.length !== 16) {
            alert('Please enter a valid card number (16 digits).');
            return false;
        }

        if (!expiry.match(/^\d{2}\/\d{2}$/)) {
            alert('Please enter expiry date in MM/YY format.');
            return false;
        }

        if (cvv.length < 3) {
            alert('Please enter a valid CVV.');
            return false;
        }

        if (!country) {
            alert('Please select your country.');
            return false;
        }

        return true;
    }

    function showPaymentSuccess(data) {
        const modal = document.createElement('div');
        modal.className = 'payment-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Thank You for Your Donation!</h2>
                <p>Your generous donation of <strong>₹${data.amount}</strong> ${data.frequency === 'once' ? 'has been' : 'will be'} processed successfully via ${data.method}.</p>
                <div class="donation-receipt">
                    <h3>Donation Receipt</h3>
                    <p><strong>Donor:</strong> ${data.name}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Amount:</strong> ₹${data.amount}</p>
                    <p><strong>Frequency:</strong> ${data.frequency === 'once' ? 'One-Time' : 'Monthly'}</p>
                    <p><strong>Payment Method:</strong> ${data.method}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
                <p style="margin-top: 20px; font-size: 0.9em; color: #666;">A confirmation email has been sent to ${data.email}</p>
                <button class="btn btn-close-modal">Close</button>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'flex';

        const closeBtn = modal.querySelector('.btn-close-modal');
        closeBtn.addEventListener('click', () => {
            modal.remove();
            if (paymentForm) {
                paymentForm.reset();
            }
            updatePaymentSummary();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Initialize QR code on page load
    updateDonationDisplay();
});