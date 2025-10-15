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
    "Capit": 3000
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

// Set minimum date for rental to today
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('tanggal-satuan').setAttribute('min', today);
    document.getElementById('tanggal-paket').setAttribute('min', today);
    
    // Initialize mobile menu toggle
    initMobileMenu();
    
    // Initialize fade-in animations
    initFadeInAnimations();
    
    // Initialize number-only input for phone fields
    initPhoneNumberValidation();
    
    // Toggle between price list views
    const priceToggleInputs = document.querySelectorAll('input[name="price-toggle"]');
    priceToggleInputs.forEach(input => {
        input.addEventListener('change', function() {
            const satuanItems = document.getElementById('satuan-items');
            const paketItems = document.getElementById('paket-items');
            
            if (this.value === 'satuan') {
                satuanItems.style.display = 'block';
                paketItems.style.display = 'none';
            } else {
                satuanItems.style.display = 'none';
                paketItems.style.display = 'block';
            }
        });
    });
    
    // Toggle between booking forms
    const bookingToggleInputs = document.querySelectorAll('input[name="booking-toggle"]');
    bookingToggleInputs.forEach(input => {
        input.addEventListener('change', function() {
            const satuanForm = document.getElementById('bookingFormSatuan');
            const paketForm = document.getElementById('bookingFormPaket');
            
            if (this.value === 'satuan') {
                satuanForm.style.display = 'block';
                paketForm.style.display = 'none';
            } else {
                satuanForm.style.display = 'none';
                paketForm.style.display = 'block';
            }
        });
    });
    
    // Add event listeners for price calculation in satuan form
    document.getElementById('itemSelectionSatuan').addEventListener('change', calculateTotalSatuan);
    document.getElementById('itemSelectionSatuan').addEventListener('input', calculateTotalSatuan);
    document.getElementById('lama-satuan').addEventListener('input', calculateTotalSatuan);
    
    // Add event listeners for price calculation in paket form
    document.getElementById('paket').addEventListener('change', calculateTotalPaket);
    document.getElementById('jumlah-paket').addEventListener('input', calculateTotalPaket);
    document.getElementById('lama-paket').addEventListener('input', calculateTotalPaket);
    
    // Handle satuan form submission
    const bookingFormSatuan = document.getElementById('bookingFormSatuan');
    bookingFormSatuan.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const nama = document.getElementById('nama-satuan').value;
        const whatsapp = document.getElementById('whatsapp-satuan').value;
        const lama = document.getElementById('lama-satuan').value;
        const tanggal = document.getElementById('tanggal-satuan').value;
        
        // Get all item rows
        const itemRows = document.querySelectorAll('#itemSelectionSatuan .item-row');
        const items = [];
        
        // Validate form
        if (!nama || !whatsapp || !lama || !tanggal) {
            alert('Harap lengkapi semua field!');
            return;
        }
        
        // Validate and collect items
        let isValid = true;
        itemRows.forEach((row, index) => {
            const barangSelect = row.querySelector('.barang-select');
            const jumlahInput = row.querySelector('.jumlah-input');
            
            const barang = barangSelect.value;
            const jumlah = jumlahInput.value;
            
            if (!barang || !jumlah) {
                isValid = false;
                return;
            }
            
            items.push({ barang, jumlah });
        });
        
        if (!isValid || items.length === 0) {
            alert('Harap lengkapi semua barang yang ingin disewa!');
            return;
        }
        
        // Create WhatsApp message
        let itemDetails = '';
        let total = 0;
        
        items.forEach(item => {
            const pricePerDay = itemPrices[item.barang] || 0;
            const itemTotal = pricePerDay * parseInt(item.jumlah) * parseInt(lama);
            total += itemTotal;
            itemDetails += `\n- ${item.barang} (${item.jumlah} unit) x ${lama} hari = Rp ${itemTotal.toLocaleString('id-ID')}`;
        });
        
        const message = `Halo, saya *${nama}* ingin menyewa beberapa barang (Sewa Satuan):
${itemDetails}

*Total: Rp ${total.toLocaleString('id-ID')}*

Tanggal sewa: ${tanggal}
Lama sewa: ${lama} hari

Catatan: Jika telat mengembalikan barang atau ada barang yang rusak, maka akan dikenakan denda.`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/6282139024372?text=${encodedMessage}`;
        
        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');
        
        // Send data to Google Apps Script
        sendDataToGoogleAppsScript(nama, whatsapp, items, lama, tanggal, total, 'Sewa Satuan');
        
        // Reset form
        bookingFormSatuan.reset();
        // Keep one item row
        const itemSelection = document.getElementById('itemSelectionSatuan');
        itemSelection.innerHTML = `
            <div class="item-row">
                <select name="barang[]" class="barang-select" required>
                    <option value="">Pilih Barang</option>
                    <option value="Hydropack">Hydropack</option>
                    <option value="Tracking Pole">Tracking Pole</option>
                    <option value="Tenda Kapasitas 6–8 (Great Outdoors Drifter 4)">Tenda Kapasitas 6–8 (Great Outdoors Drifter 4)</option>
                    <option value="Tenda Kapasitas 4–5 (Tendaki Borneo 4)">Tenda Kapasitas 4–5 (Tendaki Borneo 4)</option>
                    <option value="Tenda Kapasitas 4–5 (Wildshell Jayadipa)">Tenda Kapasitas 4–5 (Wildshell Jayadipa)</option>
                    <option value="Carrier 60L (Arei Toba 60L)">Carrier 60L (Arei Toba 60L)</option>
                    <option value="Kursi Lipat">Kursi Lipat</option>
                    <option value="Meja Lipat">Meja Lipat</option>
                    <option value="Tripod Kecil">Tripod Kecil</option>
                    <option value="Grill Pan">Grill Pan</option>
                    <option value="Kompor Kecil">Kompor Kecil</option>
                    <option value="Kompor Besar">Kompor Besar</option>
                    <option value="Cooking Set / Nesting 4 in 1">Cooking Set / Nesting 4 in 1</option>
                    <option value="Cooking Set / Nesting 3 in 1">Cooking Set / Nesting 3 in 1</option>
                    <option value="Tripod Besar">Tripod Besar</option>
                    <option value="Sleeping Bag Polar Biasa">Sleeping Bag Polar Biasa</option>
                    <option value="Sleeping Bag Polar Bulu">Sleeping Bag Polar Bulu</option>
                    <option value="Flysheet 3x4">Flysheet 3x4</option>
                    <option value="Kuas">Kuas</option>
                    <option value="Bantal Tiup">Bantal Tiup</option>
                    <option value="Matras Spon">Matras Spon</option>
                    <option value="Lampu Tenda">Lampu Tenda</option>
                    <option value="Headlamp Baterai">Headlamp Baterai</option>
                    <option value="Headlamp Charge">Headlamp Charge</option>
                    <option value="Tiang Flysheet">Tiang Flysheet</option>
                    <option value="Capit">Capit</option>
                </select>
                <input type="number" name="jumlah[]" class="jumlah-input" placeholder="Jumlah" min="1" value="1">
                <button type="button" class="remove-item btn-secondary">Hapus</button>
            </div>
        `;
        attachRemoveItemListenersSatuan();
        calculateTotalSatuan(); // Reset total display
    });
    
    // Handle paket form submission
    const bookingFormPaket = document.getElementById('bookingFormPaket');
    bookingFormPaket.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const nama = document.getElementById('nama-paket').value;
        const whatsapp = document.getElementById('whatsapp-paket').value;
        const paket = document.getElementById('paket').value;
        const jumlah = document.getElementById('jumlah-paket').value;
        const lama = document.getElementById('lama-paket').value;
        const tanggal = document.getElementById('tanggal-paket').value;
        
        // Validate form
        if (!nama || !whatsapp || !paket || !jumlah || !lama || !tanggal) {
            alert('Harap lengkapi semua field!');
            return;
        }
        
        // Calculate total
        const pricePerDay = packagePrices[paket] || 0;
        const total = pricePerDay * parseInt(jumlah) * parseInt(lama);
        
        // Create WhatsApp message
        const message = `Halo, saya *${nama}* ingin menyewa paket hemat:
- ${paket.split(' - ')[0]} (${jumlah} unit) x ${lama} hari = Rp ${total.toLocaleString('id-ID')}

*Total: Rp ${total.toLocaleString('id-ID')}*

Tanggal sewa: ${tanggal}
Lama sewa: ${lama} hari

Catatan: Jika telat mengembalikan barang atau ada barang yang rusak, maka akan dikenakan denda.`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/6282139024372?text=${encodedMessage}`;
        
        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');
        
        // Send data to Google Apps Script
        sendDataToGoogleAppsScript(nama, whatsapp, [{barang: paket.split(' - ')[0], jumlah: jumlah}], lama, tanggal, total, 'Paket Hemat');
        
        // Reset form
        bookingFormPaket.reset();
        calculateTotalPaket(); // Reset total display
    });
    
    // Add item button functionality for satuan form
    document.getElementById('addItemSatuan').addEventListener('click', function() {
        const itemSelection = document.getElementById('itemSelectionSatuan');
        const newItemRow = document.createElement('div');
        newItemRow.className = 'item-row';
        newItemRow.innerHTML = `
            <select name="barang[]" class="barang-select" required>
                <option value="">Pilih Barang</option>
                <option value="Hydropack">Hydropack</option>
                <option value="Tracking Pole">Tracking Pole</option>
                <option value="Tenda Kapasitas 6–8 (Great Outdoors Drifter 4)">Tenda Kapasitas 6–8 (Great Outdoors Drifter 4)</option>
                <option value="Tenda Kapasitas 4–5 (Tendaki Borneo 4)">Tenda Kapasitas 4–5 (Tendaki Borneo 4)</option>
                <option value="Tenda Kapasitas 4–5 (Wildshell Jayadipa)">Tenda Kapasitas 4–5 (Wildshell Jayadipa)</option>
                <option value="Carrier 60L (Arei Toba 60L)">Carrier 60L (Arei Toba 60L)</option>
                <option value="Kursi Lipat">Kursi Lipat</option>
                <option value="Meja Lipat">Meja Lipat</option>
                <option value="Tripod Kecil">Tripod Kecil</option>
                <option value="Grill Pan">Grill Pan</option>
                <option value="Kompor Kecil">Kompor Kecil</option>
                <option value="Kompor Besar">Kompor Besar</option>
                <option value="Cooking Set / Nesting 4 in 1">Cooking Set / Nesting 4 in 1</option>
                <option value="Cooking Set / Nesting 3 in 1">Cooking Set / Nesting 3 in 1</option>
                <option value="Tripod Besar">Tripod Besar</option>
                <option value="Sleeping Bag Polar Biasa">Sleeping Bag Polar Biasa</option>
                <option value="Sleeping Bag Polar Bulu">Sleeping Bag Polar Bulu</option>
                <option value="Flysheet 3x4">Flysheet 3x4</option>
                <option value="Kuas">Kuas</option>
                <option value="Bantal Tiup">Bantal Tiup</option>
                <option value="Matras Spon">Matras Spon</option>
                <option value="Lampu Tenda">Lampu Tenda</option>
                <option value="Headlamp Baterai">Headlamp Baterai</option>
                <option value="Headlamp Charge">Headlamp Charge</option>
                <option value="Tiang Flysheet">Tiang Flysheet</option>
                <option value="Capit">Capit</option>
            </select>
            <input type="number" name="jumlah[]" class="jumlah-input" placeholder="Jumlah" min="1" value="1">
            <button type="button" class="remove-item btn-secondary">Hapus</button>
        `;
        itemSelection.appendChild(newItemRow);
        attachRemoveItemListenersSatuan();
        calculateTotalSatuan(); // Recalculate total when new item added
    });
    
    // Attach event listeners to remove buttons for satuan form
    function attachRemoveItemListenersSatuan() {
        document.querySelectorAll('#itemSelectionSatuan .remove-item').forEach(button => {
            button.addEventListener('click', function() {
                // Only remove if there's more than one item row
                if (document.querySelectorAll('#itemSelectionSatuan .item-row').length > 1) {
                    this.closest('.item-row').remove();
                    calculateTotalSatuan(); // Recalculate total when item removed
                } else {
                    alert('Minimal harus ada satu barang yang disewa!');
                }
            });
        });
    }
    
    // Initial attachment of remove item listeners for satuan form
    attachRemoveItemListenersSatuan();
    
    // Function to calculate total price for satuan form
    function calculateTotalSatuan() {
        const itemRows = document.querySelectorAll('#itemSelectionSatuan .item-row');
        const lama = parseInt(document.getElementById('lama-satuan').value) || 0;
        let total = 0;
        
        itemRows.forEach(row => {
            const barangSelect = row.querySelector('.barang-select');
            const jumlahInput = row.querySelector('.jumlah-input');
            
            const barang = barangSelect.value;
            const jumlah = parseInt(jumlahInput.value) || 0;
            
            if (barang && jumlah > 0) {
                const pricePerDay = itemPrices[barang] || 0;
                total += pricePerDay * jumlah * lama;
            }
        });
        
        // Update total display
        document.getElementById('totalAmountSatuan').textContent = 'Rp ' + total.toLocaleString('id-ID');
    }
    
    // Function to calculate total price for paket form
    function calculateTotalPaket() {
        const paket = document.getElementById('paket').value;
        const jumlah = parseInt(document.getElementById('jumlah-paket').value) || 0;
        const lama = parseInt(document.getElementById('lama-paket').value) || 0;
        
        const pricePerDay = packagePrices[paket] || 0;
        const total = pricePerDay * jumlah * lama;
        
        // Update total display
        document.getElementById('totalAmountPaket').textContent = 'Rp ' + total.toLocaleString('id-ID');
    }
    
    // Function to send data to Google Apps Script
    function sendDataToGoogleAppsScript(nama, whatsapp, items, lama, tanggal, total, type) {
        // TO CONNECT TO GOOGLE APPS SCRIPT:
        // 1. Create a Google Apps Script project (script.google.com)
        // 2. Replace the default code with the provided code from README.md
        // 3. Deploy as Web App with access to "Anyone"
        // 4. Copy the Web App URL
        // 5. Uncomment the lines below and replace 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL' 
        //    with your actual Web App URL
    
        
        const scriptURL = 'https://script.google.com/macros/s/AKfycbxFKFuQK_1fI4J-boFN1DvJ5s4-VK8n_S-1bg4kd6V4Jv7uort5eepFoPigB4_HwXEu/exec';
        
        const data = { nama, whatsapp, items, lama, tanggal, total, type };
        
        fetch(scriptURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                alert('Pesanan Anda telah dikirim! Silakan cek WhatsApp Anda untuk melanjutkan proses booking.');
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            console.error('Error sending data to Google Apps Script:', error);
            alert('Terjadi kesalahan saat mengirim data. Silakan coba lagi.');
        });
    
    }
    
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