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

// Item availability quantities
const itemAvailability = {
    "Lampu Tenda": 6,
    "Tracking Pole": 5,
    "Matras Spon": 6,
    "Kursi Lipat": 10,
    "Meja Lipat": 5,
    "Headlamp Baterai": 3,
    "Headlamp Charge": 4,
    "Cooking Set / Nesting 4 in 1": 3,
    "Cooking Set / Nesting 3 in 1": 3,
    "Kompor Kecil": 4,
    "Kompor Besar": 2,
    "Tripod Kecil": 2,
    "Tripod Besar": 2,
    "Kursi 2 in 1": 2, // Not in current list
    "Sleeping Bag Polar Biasa": 2,
    "Sleeping Bag Polar Bulu": 4,
    "Flysheet 3x4": 1,
    "Tiang Flysheet": 2,
    "Hydropack": 2,
    "Capit": 3,
    "Kuas": 3,
    "Carrier 60L (Arei Toba 60L)": 2,
    "Carrier 35L": 1, // Not in current list
    "Tenda Kapasitas 4–5 (Tendaki Borneo 4)": 3,
    "Tenda Kapasitas 4–5 (Wildshell Jayadipa)": 3,
    "Tenda Kapasitas 6–8 (Great Outdoors Drifter 4)": 1,
    "Grill Pan": 2,
    "Bantal Tiup": 6
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

// Set availability quantities on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set availability quantities for satuan items
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart[data-item-name]');
    addToCartButtons.forEach(button => {
        const itemName = button.getAttribute('data-item-name');
        const availabilityElement = button.closest('.price-item').querySelector('.available-quantity');
        if (availabilityElement && itemAvailability[itemName] !== undefined) {
            availabilityElement.textContent = itemAvailability[itemName];
            
            // Set max attribute for quantity input (now within .quantity-control)
            const quantityInput = button.closest('.add-to-cart-controls').querySelector('.quantity-control .quantity-input');
            if (quantityInput) {
                quantityInput.setAttribute('max', itemAvailability[itemName]);
            }
        }
    });
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('tanggal-satuan').setAttribute('min', today);
    document.getElementById('tanggal-paket').setAttribute('min', today);
    
    // Initialize mobile menu toggle
    initMobileMenu();
    
    // Initialize fade-in animations
    initFadeInAnimations();
    
    // Initialize number-only input for phone fields
    initPhoneNumberValidation();
    
    // Initialize shopping cart functionality
    initShoppingCart();
    
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
    document.getElementById('itemSelectionPaket').addEventListener('change', calculateTotalPaket);
    document.getElementById('itemSelectionPaket').addEventListener('input', calculateTotalPaket);
    document.getElementById('lama-paket').addEventListener('input', calculateTotalPaket);
    document.getElementById('tanggal-paket').addEventListener('change', calculateTotalPaket);
    
    // Handle satuan form submission
    const bookingFormSatuan = document.getElementById('bookingFormSatuan');
    bookingFormSatuan.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const nama = document.getElementById('nama-satuan').value;
        const whatsapp = document.getElementById('whatsapp-satuan').value;
        const alamat = document.getElementById('alamat-satuan').value;
        const destinasi = document.getElementById('destinasi-satuan').value;
        const jamAmbil = document.getElementById('jam-ambil-satuan').value;
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
        
        // Validate time format (24-hour format, flexible input)
        if (!validateFlexibleTime(jamAmbil)) {
            alert('Format jam tidak valid! Harap gunakan format 24-jam (contoh: 14:30, 1430, 830, 14)');
            return;
        }
        
        // Validate and collect items
        let isValid = true;
        itemRows.forEach((row, index) => {
            const itemNameSpan = row.querySelector('.item-name');
            const jumlahInput = row.querySelector('.jumlah-input');
            
            const barang = itemNameSpan.textContent;
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
Alamat: ${alamat}
Destinasi: ${destinasi}
Estimasi Jam Pengambilan: ${jamAmbil}`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/6282139024372?text=${encodedMessage}`;
        
        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');
        
        // Send data to Google Apps Script
        sendDataToGoogleAppsScript(nama, whatsapp, alamat, destinasi, jamAmbil, items, lama, tanggal, total, 'Sewa Satuan');
        
        // Reset form
        bookingFormSatuan.reset();
        // Keep one item row
        const itemSelection = document.getElementById('itemSelectionSatuan');
        itemSelection.innerHTML = `<div class="item-placeholder">Belum ada barang yang ditambahkan</div>`;
        calculateTotalSatuan(); // Reset total display
    });
    
    // Handle paket form submission
    const bookingFormPaket = document.getElementById('bookingFormPaket');
    bookingFormPaket.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const nama = document.getElementById('nama-paket').value;
        const whatsapp = document.getElementById('whatsapp-paket').value;
        const alamat = document.getElementById('alamat-paket').value;
        const destinasi = document.getElementById('destinasi-paket').value;
        const jamAmbil = document.getElementById('jam-ambil-paket').value;
        const lama = document.getElementById('lama-paket').value;
        const tanggal = document.getElementById('tanggal-paket').value;
        
        // Get all item rows
        const itemRows = document.querySelectorAll('#itemSelectionPaket .item-row');
        const items = [];
        
        // Validate form
        if (!nama || !whatsapp || !lama || !tanggal) {
            alert('Harap lengkapi semua field!');
            return;
        }
        
        // Validate time format (24-hour format, flexible input)
        if (!validateFlexibleTime(jamAmbil)) {
            alert('Format jam tidak valid! Harap gunakan format 24-jam (contoh: 14:30, 1430, 830, 14)');
            return;
        }
        
        // Validate and collect items
        let isValid = true;
        itemRows.forEach((row, index) => {
            const itemNameSpan = row.querySelector('.item-name');
            const jumlahInput = row.querySelector('.jumlah-input');
            
            const barang = itemNameSpan.textContent;
            const jumlah = jumlahInput.value;
            
            if (!barang || !jumlah) {
                isValid = false;
                return;
            }
            
            items.push({ barang, jumlah });
        });
        
        if (!isValid || items.length === 0) {
            alert('Harap lengkapi semua paket yang ingin disewa!');
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
        
        const message = `Halo, saya *${nama}* ingin menyewa beberapa paket (Paket Hemat):
${itemDetails}

*Total: Rp ${total.toLocaleString('id-ID')}*

Tanggal sewa: ${tanggal}
Lama sewa: ${lama} hari
Alamat: ${alamat}
Destinasi: ${destinasi}
Estimasi Jam Pengambilan: ${jamAmbil}`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/6282139024372?text=${encodedMessage}`;
        
        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');
        
        // Send data to Google Apps Script
        sendDataToGoogleAppsScript(nama, whatsapp, alamat, destinasi, jamAmbil, items, lama, tanggal, total, 'Paket Hemat');
        
        // Reset form
        bookingFormPaket.reset();
        // Keep one item row
        const itemSelection = document.getElementById('itemSelectionPaket');
        itemSelection.innerHTML = `<div class="item-placeholder">Belum ada paket yang ditambahkan</div>`;
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
    
    // Add item button functionality for paket form
    document.getElementById('addItemPaket').addEventListener('click', function() {
        const itemSelection = document.getElementById('itemSelectionPaket');
        const newItemRow = document.createElement('div');
        newItemRow.className = 'item-row';
        newItemRow.innerHTML = `
            <select name="paket[]" class="paket-select" required>
                <option value="">Pilih Paket</option>
                <option value="Paket Hemat 1">Paket Hemat 1 - Rp 25.000/hari</option>
                <option value="Paket Hemat 2">Paket Hemat 2 - Rp 30.000/hari</option>
                <option value="Paket Hemat 3">Paket Hemat 3 - Rp 35.000/hari</option>
                <option value="Paket Hemat 4">Paket Hemat 4 - Rp 40.000/hari</option>
                <option value="Paket Hemat 5">Paket Hemat 5 - Rp 45.000/hari</option>
                <option value="Paket Hemat 6">Paket Hemat 6 - Rp 65.000/hari</option>
            </select>
            <input type="number" name="jumlah[]" class="jumlah-input" placeholder="Jumlah" min="1" value="1">
            <button type="button" class="remove-item btn-secondary">Hapus</button>
        `;
        itemSelection.appendChild(newItemRow);
        attachRemoveItemListenersPaket();
        calculateTotalPaket(); // Recalculate total when new item added
    });
    
    // Attach event listeners to remove buttons for paket form
    function attachRemoveItemListenersPaket() {
        document.querySelectorAll('#itemSelectionPaket .remove-item').forEach(button => {
            button.addEventListener('click', function() {
                // Only remove if there's more than one item row
                if (document.querySelectorAll('#itemSelectionPaket .item-row').length > 1) {
                    this.closest('.item-row').remove();
                    calculateTotalPaket(); // Recalculate total when item removed
                } else {
                    alert('Minimal harus ada satu paket yang disewa!');
                }
            });
        });
    }
    
    // Initial attachment of remove item listeners for paket form
    attachRemoveItemListenersPaket();
    
    // Function to calculate total price for satuan form
    function calculateTotalSatuan() {
        const itemRows = document.querySelectorAll('#itemSelectionSatuan .item-row');
        const lama = parseInt(document.getElementById('lama-satuan').value) || 0;
        let total = 0;
        
        itemRows.forEach(row => {
            const itemNameSpan = row.querySelector('.item-name');
            const jumlahInput = row.querySelector('.jumlah-input');
            
            const itemName = itemNameSpan.textContent;
            const jumlah = parseInt(jumlahInput.value) || 0;
            
            if (itemName && jumlah > 0) {
                const pricePerDay = itemPrices[itemName] || 0;
                total += pricePerDay * jumlah * lama;
            }
        });
        
        // Update total display
        document.getElementById('totalAmountSatuan').textContent = 'Rp ' + total.toLocaleString('id-ID');
    }
    
    // Function to calculate total price for paket form
    function calculateTotalPaket() {
        const itemRows = document.querySelectorAll('#itemSelectionPaket .item-row');
        const lama = parseInt(document.getElementById('lama-paket').value) || 0;
        let total = 0;
        
        itemRows.forEach(row => {
            const itemNameSpan = row.querySelector('.item-name');
            const jumlahInput = row.querySelector('.jumlah-input');
            
            const itemName = itemNameSpan.textContent;
            const jumlah = parseInt(jumlahInput.value) || 0;
            
            if (itemName && jumlah > 0) {
                const pricePerDay = itemPrices[itemName] || 0;
                total += pricePerDay * jumlah * lama;
            }
        });
        
        // Update total display
        document.getElementById('totalAmountPaket').textContent = 'Rp ' + total.toLocaleString('id-ID');
    }
    
    // Function to send data to Google Apps Script
    function sendDataToGoogleAppsScript(nama, whatsapp, alamat, destinasi, jamAmbil, items, lama, tanggal, total, type) {
        // Use the same Google Apps Script Web App URL as in referensi-database.html
        const scriptURL = 'https://script.google.com/macros/s/AKfycbwd7Mecm2SFDGDX6u72J5k_kT8M8GM3OCNjxvvPCIQppH-w6P8ygkzCSjpnYhqtbP-3/exec';
        
        // Create FormData object
        const formData = new FormData();
        
        // Add form data
        formData.append('name', nama);
        formData.append('contact_number', whatsapp);
        formData.append('alamat', alamat);
        formData.append('destinasi', destinasi);
        formData.append('jam_ambil', jamAmbil);
        formData.append('lama_sewa', lama);
        formData.append('rental_date', tanggal);
        formData.append('price', total);
        formData.append('type', type);
        
        // Format items as a string
        let itemsString = '';
        items.forEach((item, index) => {
            itemsString += `${item.barang} (${item.jumlah} unit)`;
            if (index < items.length - 1) {
                itemsString += ', ';
            }
        });
        
        formData.append('items', itemsString);
        
        // Add timestamp
        const now = new Date();
        const timestamp = now.toISOString().slice(0, 19).replace('T', ' ');
        formData.append('timestamp', timestamp);
        
        // Send data using fetch with FormData
        fetch(scriptURL, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                console.log('Data successfully sent to Google Apps Script');
                alert('Pesanan berhasil dikirim! Kami akan segera menghubungi Anda melalui WhatsApp.');
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

// Function to initialize shopping cart functionality
function initShoppingCart() {
    // Add event listeners to all "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemName = this.getAttribute('data-item-name');
            const itemPrice = parseInt(this.getAttribute('data-item-price'));
            const itemType = this.getAttribute('data-item-type') || 'satuan';
            
            // For paket items, quantity is always 1
            // For satuan items, get quantity from the input field
            let quantity = 1;
            if (itemType !== 'paket') {
                const quantityInput = this.closest('.add-to-cart-controls').querySelector('.quantity-control .quantity-input');
                quantity = parseInt(quantityInput.value) || 1;
            }
            
            // For paket items, allow multiple identical packages to be added
            if (itemType === 'paket') {
                // Check if the same paket already exists in the form
                const itemSelection = document.getElementById('itemSelectionPaket');
                if (itemSelection) {
                    const existingRows = itemSelection.querySelectorAll('.item-row');
                    let itemExists = false;
                    
                    for (let row of existingRows) {
                        const itemNameSpan = row.querySelector('.item-name');
                        if (itemNameSpan && itemNameSpan.textContent === itemName) {
                            // Item already exists, increment quantity
                            const jumlahInput = row.querySelector('.jumlah-input');
                            if (jumlahInput) {
                                const currentQuantity = parseInt(jumlahInput.textContent) || 0;
                                jumlahInput.textContent = currentQuantity + quantity;
                                itemExists = true;
                                break;
                            }
                        }
                    }
                    
                    // If item already exists, we don't need to add a new row
                    if (itemExists) {
                        // Update total calculation
                        if (itemSelection) {
                            itemSelection.dispatchEvent(new Event('change'));
                        }
                        return; // Exit early, item was already added
                    }
                }
            }
            
            // Add item directly to booking form
            addToBookingForm(itemName, itemPrice, itemType, quantity);
            
            // Show soft popup notification with "Langsung Booking" button
            showNotification(`${itemName} ${itemType === 'paket' ? '' : `(${quantity} unit)`} telah ditambahkan. Silahkan cek di form booking.`, itemName, itemPrice, itemType);
        });
    });
    
    // Add event listeners to quantity inputs to enforce max limits (only for satuan items)
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const max = parseInt(this.getAttribute('max')) || 10;
            const value = parseInt(this.value) || 1;
            
            if (value < 1) {
                this.value = 1;
            } else if (value > max) {
                this.value = max;
            }
        });
    });
}

// Function to add item directly to booking form
function addToBookingForm(itemName, itemPrice, itemType, quantity = 1) {
    if (itemType === 'paket') {
        // Switch to paket form
        document.getElementById('booking-paket').checked = true;
        document.getElementById('bookingFormSatuan').style.display = 'none';
        document.getElementById('bookingFormPaket').style.display = 'block';
        
        // Add paket to paket form
        const itemSelection = document.getElementById('itemSelectionPaket');
        if (itemSelection) {
            // Remove placeholder if it exists
            const placeholder = itemSelection.querySelector('.item-placeholder');
            if (placeholder) {
                placeholder.remove();
            }
            
            // Check if item already exists in form
            let itemExists = false;
            const existingRows = itemSelection.querySelectorAll('.item-row');
            
            for (let row of existingRows) {
                const itemNameSpan = row.querySelector('.item-name');
                if (itemNameSpan && itemNameSpan.textContent === itemName) {
                    // Item already exists, increment quantity
                    const jumlahInput = row.querySelector('.jumlah-input');
                    if (jumlahInput) {
                        const currentQuantity = parseInt(jumlahInput.textContent) || 0;
                        jumlahInput.textContent = currentQuantity + quantity;
                    }
                    itemExists = true;
                    break;
                }
            }
            
            // If item doesn't exist, add new row
            if (!itemExists) {
                const itemRow = document.createElement('div');
                itemRow.className = 'item-row';
                itemRow.innerHTML = `
                    <div class="item-details">
                        <div class="item-name">${itemName}</div>
                        <div class="item-price">Rp ${itemPrice.toLocaleString('id-ID')}/hari</div>
                        <div class="item-controls">
                            <span>Jumlah: <input type="number" class="jumlah-input" value="${quantity}" min="1"></span>
                            <button type="button" class="remove-item btn-secondary">Hapus</button>
                        </div>
                    </div>
                `;
                
                itemSelection.appendChild(itemRow);
                
                // Add event listener to remove button
                const removeButton = itemRow.querySelector('.remove-item');
                if (removeButton) {
                    removeButton.addEventListener('click', function() {
                        this.closest('.item-row').remove();
                        // Add placeholder if no items left
                        if (itemSelection.querySelectorAll('.item-row').length === 0) {
                            const placeholder = document.createElement('div');
                            placeholder.className = 'item-placeholder';
                            placeholder.textContent = 'Belum ada paket yang ditambahkan';
                            itemSelection.appendChild(placeholder);
                        }
                        calculateTotalPaket(); // Recalculate total when item removed
                    });
                }
                
                // Add event listener to quantity input
                const jumlahInput = itemRow.querySelector('.jumlah-input');
                if (jumlahInput) {
                    jumlahInput.addEventListener('change', function() {
                        const value = parseInt(this.value) || 1;
                        if (value < 1) this.value = 1;
                        calculateTotalPaket(); // Recalculate total when quantity changes
                    });
                }
            }
            
            // Trigger change event to update total
            itemSelection.dispatchEvent(new Event('change'));
        }
    } else {
        // Switch to satuan form
        document.getElementById('booking-satuan').checked = true;
        document.getElementById('bookingFormSatuan').style.display = 'block';
        document.getElementById('bookingFormPaket').style.display = 'none';
        
        // Add item to satuan form
        const itemSelection = document.getElementById('itemSelectionSatuan');
        if (itemSelection) {
            // Remove placeholder if it exists
            const placeholder = itemSelection.querySelector('.item-placeholder');
            if (placeholder) {
                placeholder.remove();
            }
            
            // Check if item already exists in form
            let itemExists = false;
            const existingRows = itemSelection.querySelectorAll('.item-row');
            
            for (let row of existingRows) {
                const itemNameSpan = row.querySelector('.item-name');
                if (itemNameSpan && itemNameSpan.textContent === itemName) {
                    // Item already exists, increment quantity
                    const jumlahInput = row.querySelector('.jumlah-input');
                    if (jumlahInput) {
                        const currentQuantity = parseInt(jumlahInput.textContent) || 0;
                        jumlahInput.textContent = currentQuantity + quantity;
                    }
                    itemExists = true;
                    break;
                }
            }
            
            // If item doesn't exist, add new row
            if (!itemExists) {
                const itemRow = document.createElement('div');
                itemRow.className = 'item-row';
                itemRow.innerHTML = `
                    <div class="item-details">
                        <div class="item-name">${itemName}</div>
                        <div class="item-price">Rp ${itemPrice.toLocaleString('id-ID')}/hari</div>
                        <div class="item-controls">
                            <span>Jumlah: <input type="number" class="jumlah-input" value="${quantity}" min="1"></span>
                            <button type="button" class="remove-item btn-secondary">Hapus</button>
                        </div>
                    </div>
                `;
                
                itemSelection.appendChild(itemRow);
                
                // Add event listener to remove button
                const removeButton = itemRow.querySelector('.remove-item');
                if (removeButton) {
                    removeButton.addEventListener('click', function() {
                        this.closest('.item-row').remove();
                        // Add placeholder if no items left
                        if (itemSelection.querySelectorAll('.item-row').length === 0) {
                            const placeholder = document.createElement('div');
                            placeholder.className = 'item-placeholder';
                            placeholder.textContent = 'Belum ada barang yang ditambahkan';
                            itemSelection.appendChild(placeholder);
                        }
                        calculateTotalSatuan(); // Recalculate total when item removed
                    });
                }
                
                // Add event listener to quantity input
                const jumlahInput = itemRow.querySelector('.jumlah-input');
                if (jumlahInput) {
                    jumlahInput.addEventListener('change', function() {
                        const value = parseInt(this.value) || 1;
                        if (value < 1) this.value = 1;
                        calculateTotalSatuan(); // Recalculate total when quantity changes
                    });
                }
            }
            
            // Trigger change event to update total
            itemSelection.dispatchEvent(new Event('change'));
        }
    }
    
    // Note: Removed automatic scrolling to booking form
    // Users can now click "Langsung Booking" in the popup notification to scroll to the form
}

// Function to parse time in flexible format (with or without colon)
function parseFlexibleTime(timeInput) {
    // Remove any non-digit characters
    const cleanTime = timeInput.replace(/[^0-9]/g, '');
    
    // Check if we have a valid length (4 digits for HHMM or 3 digits for HM)
    if (cleanTime.length === 3) {
        // Format like 830 -> 08:30 or 930 -> 09:30
        const hours = cleanTime.substring(0, 1);
        const minutes = cleanTime.substring(1, 3);
        return { hours: parseInt(hours), minutes: parseInt(minutes), isValid: true };
    } else if (cleanTime.length === 4) {
        // Format like 0830 or 1430 -> 08:30 or 14:30
        const hours = cleanTime.substring(0, 2);
        const minutes = cleanTime.substring(2, 4);
        return { hours: parseInt(hours), minutes: parseInt(minutes), isValid: true };
    } else if (cleanTime.length === 1 || cleanTime.length === 2) {
        // Just hour input like 8 or 14 -> 08:00 or 14:00
        const hours = cleanTime.substring(0, 2);
        return { hours: parseInt(hours), minutes: 0, isValid: true };
    }
    
    return { hours: 0, minutes: 0, isValid: false };
}

// Function to validate time in flexible format
function validateFlexibleTime(timeInput) {
    const parsed = parseFlexibleTime(timeInput);
    
    if (!parsed.isValid) {
        return false;
    }
    
    // Validate 24-hour format (0-23 for hours, 0-59 for minutes)
    if (parsed.hours < 0 || parsed.hours > 23 || parsed.minutes < 0 || parsed.minutes > 59) {
        return false;
    }
    
    return true;
}

// Function to show soft popup notification
function showNotification(message, itemName, itemPrice, itemType) {
    // Remove any existing notifications
    const existingNotification = document.getElementById('cart-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.id = 'cart-notification';
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <p>${message}</p>
            <button id="langsung-booking" class="btn-primary">Langsung Booking</button>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Fade in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Add event listener to the "Langsung Booking" button
    const langsungBookingBtn = notification.querySelector('#langsung-booking');
    if (langsungBookingBtn) {
        langsungBookingBtn.addEventListener('click', function() {
            // Scroll to booking form
            const bookingSection = document.getElementById('booking');
            if (bookingSection) {
                bookingSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Remove notification
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }
    
    // Auto remove after 3 seconds if not clicked (as per memory requirement)
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}