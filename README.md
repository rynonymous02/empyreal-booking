# Empyreal Outdoor - Rental Equipment Website

A complete website for outdoor equipment rental business built with HTML, CSS, and JavaScript.

## Features

- Responsive design that works on all devices
- Rental information section
- Google Maps integration for location
- Price list for equipment
- Booking form with validation
- Multi-item selection for rentals
- WhatsApp integration for order processing
- Google Apps Script integration for saving data to Google Spreadsheet
- Custom logo support

## Setup Instructions

### 1. Basic Website Setup

1. Simply open `index.html` in your web browser to view the website.
2. All files are interlinked and will work without any additional setup.

### 2. Adding Your Logo

1. Create your logo image in WebP format
2. Name it `logo.webp`
3. Place it in the `images` folder

### 3. WhatsApp Integration

The WhatsApp integration is already configured with the number: +62821-3902-4372
When a user submits the booking form, they will be redirected to WhatsApp with a pre-filled message.

### 4. Google Apps Script Integration (Optional)

To enable automatic saving of booking data to Google Spreadsheet:

#### Step 1: Create a Google Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Add headers in the first row:
   - Timestamp
   - Nama
   - WhatsApp
   - Barang
   - Jumlah
   - Lama Sewa
   - Tanggal Sewa
   - Total
   - Tipe Booking

#### Step 2: Create a Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project
3. Replace the default code with the following:

```javascript
    const SHEET_NAME = "Sheet1"; // Change if your sheet has a different name

    function doPost(e) {
    const lock = LockService.getScriptLock();
    lock.waitLock(15000);
    
    try {
        const data = JSON.parse(e.postData.contents);
        
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
        
        const timestamp = new Date();
        
        // Process items differently based on booking type
        let itemsDetails = "";
        if (data.type === "Paket Hemat") {
        // For packages, data.items is an array with one item
        itemsDetails = data.items[0].barang + " (" + data.items[0].jumlah + " unit)";
        } else {
        // For individual items, process all items
        data.items.forEach((item, index) => {
            if (index > 0) itemsDetails += ", ";
            itemsDetails += item.barang + " (" + item.jumlah + " unit)";
        });
        }
        
        const rowData = [
        timestamp,
        data.nama,
        data.whatsapp,
        itemsDetails,
        data.lama,
        data.tanggal,
        data.total,
        data.type
        ];
        
        sheet.appendRow(rowData);
        
        return ContentService
        .createTextOutput(JSON.stringify({result: "success"}))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
        return ContentService
        .createTextOutput(JSON.stringify({result: "error", error: error.toString()}))
        .setMimeType(ContentService.MimeType.JSON);
    } finally {
        lock.releaseLock();
    }
    }
```

#### Step 3: Deploy the Script as a Web App
1. Click on "Deploy" > "New deployment"
2. Select "Web app" as the type
3. Set "Execute as" to "Me"
4. Set "Who has access" to "Anyone" (or "Anyone with Google" for more security)
5. Click "Deploy"
6. Copy the Web App URL

#### Step 4: Update the JavaScript Code
1. Open `script.js` in your code editor
2. Find the `sendDataToGoogleAppsScript` function
3. Uncomment the Google Apps Script section
4. Replace `'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL'` with your actual Web App URL
5. Comment out or remove the demo alert message

Example of updated JavaScript code:
```javascript
// Function to send data to Google Apps Script
function sendDataToGoogleAppsScript(nama, whatsapp, items, lama, tanggal, total, type) {
    // Replace with your actual Google Apps Script Web App URL
    const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
    
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
```

## Customization

You can easily customize the website by modifying:

- **index.html**: Content and structure
- **styles.css**: Appearance and layout
- **script.js**: Form functionality and integrations

## Support

For any issues or questions, please contact:
- WhatsApp: +62821-3902-4372
- Instagram: [@empyrealoutdoor](https://www.instagram.com/empyrealoutdoor?igsh=NzA4aG1sdnp6MmI4)