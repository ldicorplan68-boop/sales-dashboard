# 📊 Sales Dashboard - Google Sheets + Apps Script + GitHub Pages

A complete 100% free web dashboard for your sales data using Google Sheets as the database, Google Apps Script as the backend API, and GitHub Pages for hosting.

## 🎯 Features

- **Interactive Dashboard**: View sales data with beautiful charts and tables
- **Editable Data**: Add, edit, and save changes directly to Google Sheets
- **Real-time Charts**: Bar, line, pie, and doughnut charts for data visualization
- **Search & Filter**: Find specific records and filter by category
- **Mobile Responsive**: Works perfectly on all devices
- **Professional Design**: Clean, modern reporting-style interface

## 📋 Prerequisites

- Google Account (Gmail)
- GitHub Account
- Basic understanding of copying/pasting code

## 🚀 Step-by-Step Setup Guide

### Step 1: Prepare Your Google Sheet

1. **Create a new Google Sheet**:
   - Go to [sheets.google.com](https://sheets.google.com)
   - Click "Blank" to create a new spreadsheet
   - Name it something like "Sales Dashboard Data"

2. **Set up your data structure**:
   - In the first row (header row), enter these exact column names:
     ```
     AREA	CLASS	SALES REP	CLIENT	SKU/SALES	ITEMS	OTC/HW	MONTH	CLIENTS	VALUE
     ```
     - **Note**: ITEMS column should contain product names (text), not quantities
   - Add some sample data below the headers (at least 5-10 rows)
   - **Important**: Keep the sheet name as "Sheet1" (default)

3. **Copy the Sheet ID**:
   - Look at the URL in your browser. It should look like:
     `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`
   - Copy the long string of characters between `/d/` and `/edit` - this is your Sheet ID

### Step 2: Set Up Google Apps Script

1. **Open Apps Script**:
   - In your Google Sheet, go to **Extensions** → **Apps Script**
   - This will open a new tab with the Apps Script editor

2. **Replace the default code**:
   - Delete all the default code in `Code.gs`
   - Copy and paste the entire content from our `GoogleAppsScript.js` file
   - **Important**: The file must be named exactly `Code.gs`

3. **Deploy as Web App**:
   - Click the **Deploy** button (blue button)
   - Select **"New deployment"**
   - Click the gear icon next to "Select type" and choose **"Web app"**
   - Configure the deployment:
     - **Description**: "Sales Dashboard API"
     - **Execute as**: Me (your email)
     - **Who has access**: Anyone
   - Click **Deploy**
   - **Important**: Copy the Web App URL that appears in the dialog box
     - It will look like: `https://script.google.com/macros/s/[SCRIPT_ID]/exec`
     - Save this URL - you'll need it in the next step!

4. **Authorize the script**:
   - The first time you deploy, Google will ask for permissions
   - Click "Authorize access"
   - Choose your Google account
   - Click "Allow" to give the necessary permissions

### Step 3: Set Up the Frontend

1. **Download the files**:
   - Download these files from this repository:
     - `index.html`
     - `styles.css`
     - `script.js`

2. **Update the API URL**:
   - Open `script.js` in a text editor (like Notepad or VS Code)
   - Find this line at the top:
     ```javascript
     const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbxoFsXJ_CGL9pgIPjl9xLNghnfug0XNYKpAqdEOcnp8sq6lFd943MtmuSe5wMZ2w6UHuA/exec';
     ```
   - This should already be set to your URL. If not, replace it with your Web App URL from Step 2
   - Save the file

3. **Test locally** (optional):
   - You can test the dashboard locally by opening `index.html` in a web browser
   - Note: Some features might not work due to browser security restrictions

### Step 4: Deploy to GitHub Pages

1. **Create a GitHub repository**:
   - Go to [github.com](https://github.com) and sign in
   - Click the **+** icon (top right) → **New repository**
   - Repository name: `sales-dashboard`
   - Make it **Public**
   - **Check "Add a README file"**
   - Click **Create repository**

2. **Upload your files**:
   - In your new repository, click **Add file** → **Upload files**
   - Drag and drop these files:
     - `index.html`
     - `styles.css`
     - `script.js`
   - Click **Commit changes**

3. **Enable GitHub Pages**:
   - Go to your repository **Settings** tab
   - Scroll down to **Pages** section
   - Under "Source", select **"Deploy from a branch"**
   - Under "Branch", select **main** and **/(root)**
   - Click **Save**

4. **Get your live URL**:
   - Wait 2-3 minutes for deployment
   - Go back to **Settings** → **Pages**
   - Your live URL will appear: `https://yourusername.github.io/sales-dashboard/`

## ✅ You're Done!

Your sales dashboard is now live! Share the GitHub Pages URL with anyone who needs access to view or edit the sales data.

## 🔍 How to Verify Everything Works

1. Open your Google Sheet - make sure it has data with the correct column headers
2. Visit your GitHub Pages URL
3. Check browser console (F12) if there are any errors

## 🔧 Troubleshooting

### "Error loading data" message
- Check that your Web App URL in `script.js` is correct
- Make sure your Google Sheet has data and the correct column headers
- Verify that your Apps Script is deployed and accessible

### Charts not showing
- Make sure you have Chart.js loaded (it's included via CDN in the HTML)
- Check the browser console for any JavaScript errors

### Cannot save changes
- Ensure your Apps Script has the correct permissions
- Check that your Google Sheet is not read-only
- Verify the Web App is deployed with "Anyone" access

### Mobile issues
- The dashboard is responsive, but test on your specific device
- If charts don't display properly, try refreshing the page

## 📞 Support

If you run into issues:

1. **Check the browser console** for error messages (press F12 → Console tab)
2. **Verify all URLs** are correct and accessible
3. **Test each component** separately:
   - Can you access your Google Sheet?
   - Is your Apps Script Web App URL working? (try pasting it in a browser)
   - Does your GitHub Pages site load?

## 🔒 Security Notes

- Your Google Sheet data is only as secure as your Google account
- Anyone with the dashboard URL can view the data
- Only share the URL with trusted colleagues
- Consider using Google Sheets sharing settings to control access

## 🎨 Customization

Want to customize the dashboard?

- **Colors**: Edit the CSS variables in `styles.css`
- **Charts**: Modify the Chart.js configurations in `script.js`
- **Layout**: Adjust the HTML structure and CSS grid
- **Fields**: Update the form fields and API calls for different data structures

## 📈 Advanced Features

The current setup supports basic CRUD operations. For advanced features like:

- User authentication
- Data validation
- Advanced filtering
- Export functionality
- Batch operations

You would need to extend the Google Apps Script code.

---

**Built with ❤️ using Google Sheets, Apps Script, and GitHub Pages**