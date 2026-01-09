// Sales Dashboard JavaScript
// Replace this URL with your deployed Google Apps Script Web App URL
const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbxoFsXJ_CGL9pgIPjl9xLNghnfug0XNYKpAqdEOcnp8sq6lFd943MtmuSe5wMZ2w6UHuA/exec';

let salesData = [];
let filteredData = [];

// DOM Elements
const dataTable = document.getElementById('dataTable');
const tableBody = document.getElementById('tableBody');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');
const searchInput = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterSelect');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const recordForm = document.getElementById('recordForm');
const refreshBtn = document.getElementById('refreshBtn');
const addRecordBtn = document.getElementById('addRecordBtn');
const cancelBtn = document.getElementById('cancelBtn');
const closeBtn = document.querySelector('.close');

// Chart instances
let areaChart, monthChart, categoryChart, salesRepChart;

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadData();
});

// Initialize event listeners
function initializeEventListeners() {
    refreshBtn.addEventListener('click', loadData);
    addRecordBtn.addEventListener('click', () => openModal('add'));
    cancelBtn.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    recordForm.addEventListener('submit', handleFormSubmit);
    searchInput.addEventListener('input', handleSearch);
    filterSelect.addEventListener('change', handleFilter);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Load data from API
async function loadData() {
    try {
        showLoading();

        const response = await fetch(API_BASE_URL);
        const result = await response.json();

        if (result.success) {
            salesData = result.data;
            filteredData = [...salesData];
            populateTable(filteredData);
            updateCharts(filteredData);
            hideLoading();
        } else {
            throw new Error(result.error || 'Failed to load data');
        }
    } catch (error) {
        console.error('Error loading data:', error);
        showError(error.message);
        hideLoading();
    }
}

// Show loading indicator
function showLoading() {
    loadingIndicator.style.display = 'flex';
    errorMessage.style.display = 'none';
    tableBody.innerHTML = '';
}

// Hide loading indicator
function hideLoading() {
    loadingIndicator.style.display = 'none';
}

// Show error message
function showError(message) {
    errorMessage.style.display = 'block';
    errorMessage.querySelector('p').textContent = `❌ ${message}`;
}

// Populate data table
function populateTable(data) {
    tableBody.innerHTML = '';

    if (data.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="11" style="text-align: center; padding: 40px; color: var(--text-secondary);">No data found</td>';
        tableBody.appendChild(emptyRow);
        return;
    }

    data.forEach((record, index) => {
        const row = document.createElement('tr');

        // Format numeric values
        const items = parseFloat(record.ITEMS) || 0;
        const value = parseFloat(record.VALUE) || 0;

        row.innerHTML = `
            <td>${escapeHtml(record.AREA || '')}</td>
            <td>${escapeHtml(record.CLASS || '')}</td>
            <td>${escapeHtml(record['SALES REP'] || '')}</td>
            <td>${escapeHtml(record.CLIENT || '')}</td>
            <td>${escapeHtml(record['SKU/SALES'] || '')}</td>
            <td>${items.toLocaleString()}</td>
            <td>${escapeHtml(record['OTC/HW'] || '')}</td>
            <td>${escapeHtml(record.MONTH || '')}</td>
            <td>${escapeHtml(record.CLIENTS || '')}</td>
            <td>$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            <td class="actions-column">
                <button class="btn btn-primary btn-sm action-btn" onclick="editRecord(${index})">✏️ Edit</button>
                <button class="btn btn-danger btn-sm action-btn" onclick="deleteRecord(${index})">🗑️ Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Update charts with data
function updateCharts(data) {
    updateAreaChart(data);
    updateMonthChart(data);
    updateCategoryChart(data);
    updateSalesRepChart(data);
}

// Area Chart
function updateAreaChart(data) {
    const areaData = {};
    data.forEach(record => {
        const area = record.AREA || 'Unknown';
        const value = parseFloat(record.VALUE) || 0;
        areaData[area] = (areaData[area] || 0) + value;
    });

    const ctx = document.getElementById('areaChart').getContext('2d');

    if (areaChart) {
        areaChart.destroy();
    }

    areaChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(areaData),
            datasets: [{
                label: 'Sales Value ($)',
                data: Object.values(areaData),
                backgroundColor: 'rgba(37, 99, 235, 0.8)',
                borderColor: 'rgba(37, 99, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Sales by Area'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Month Chart
function updateMonthChart(data) {
    const monthData = {};
    data.forEach(record => {
        const month = record.MONTH || 'Unknown';
        const value = parseFloat(record.VALUE) || 0;
        monthData[month] = (monthData[month] || 0) + value;
    });

    const ctx = document.getElementById('monthChart').getContext('2d');

    if (monthChart) {
        monthChart.destroy();
    }

    monthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(monthData),
            datasets: [{
                label: 'Sales Value ($)',
                data: Object.values(monthData),
                borderColor: 'rgba(5, 150, 105, 1)',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Sales Trend by Month'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Category Chart (OTC vs HW)
function updateCategoryChart(data) {
    const categoryData = {};
    data.forEach(record => {
        const category = record['OTC/HW'] || 'Unknown';
        const value = parseFloat(record.VALUE) || 0;
        categoryData[category] = (categoryData[category] || 0) + value;
    });

    const ctx = document.getElementById('categoryChart').getContext('2d');

    if (categoryChart) {
        categoryChart.destroy();
    }

    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categoryData),
            datasets: [{
                data: Object.values(categoryData),
                backgroundColor: [
                    'rgba(37, 99, 235, 0.8)',
                    'rgba(217, 119, 6, 0.8)',
                    'rgba(107, 114, 128, 0.8)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'OTC vs HW Sales'
                }
            }
        }
    });
}

// Sales Rep Chart
function updateSalesRepChart(data) {
    const repData = {};
    data.forEach(record => {
        const rep = record['SALES REP'] || 'Unknown';
        const value = parseFloat(record.VALUE) || 0;
        repData[rep] = (repData[rep] || 0) + value;
    });

    // Get top 10 sales reps
    const sortedReps = Object.entries(repData)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);

    const ctx = document.getElementById('salesRepChart').getContext('2d');

    if (salesRepChart) {
        salesRepChart.destroy();
    }

    salesRepChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedReps.map(([rep]) => rep),
            datasets: [{
                label: 'Sales Value ($)',
                data: sortedReps.map(([, value]) => value),
                backgroundColor: 'rgba(220, 38, 38, 0.8)',
                borderColor: 'rgba(220, 38, 38, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Top 10 Sales Representatives'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
}

// Handle search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    applyFilters(searchTerm, filterSelect.value);
}

// Handle filter functionality
function handleFilter() {
    const searchTerm = searchInput.value.toLowerCase();
    applyFilters(searchTerm, filterSelect.value);
}

// Apply search and filter
function applyFilters(searchTerm, categoryFilter) {
    filteredData = salesData.filter(record => {
        // Search filter
        const matchesSearch = !searchTerm ||
            Object.values(record).some(value =>
                String(value).toLowerCase().includes(searchTerm)
            );

        // Category filter
        const matchesCategory = !categoryFilter ||
            record['OTC/HW'] === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    populateTable(filteredData);
    updateCharts(filteredData);
}

// Open modal for add/edit
function openModal(action, recordIndex = null) {
    modalTitle.textContent = action === 'add' ? 'Add New Record' : 'Edit Record';
    recordForm.reset();

    if (action === 'edit' && recordIndex !== null) {
        const record = filteredData[recordIndex];
        populateForm(record);
        recordForm.dataset.action = 'update';
        recordForm.dataset.recordIndex = recordIndex;
    } else {
        recordForm.dataset.action = 'add';
        delete recordForm.dataset.recordIndex;
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    recordForm.reset();
}

// Populate form with record data
function populateForm(record) {
    document.getElementById('area').value = record.AREA || '';
    document.getElementById('class').value = record.CLASS || '';
    document.getElementById('salesRep').value = record['SALES REP'] || '';
    document.getElementById('client').value = record.CLIENT || '';
    document.getElementById('sku').value = record['SKU/SALES'] || '';
    document.getElementById('items').value = record.ITEMS || 0;
    document.getElementById('category').value = record['OTC/HW'] || '';
    document.getElementById('month').value = record.MONTH || '';
    document.getElementById('clients').value = record.CLIENTS || '';
    document.getElementById('value').value = record.VALUE || 0;
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(recordForm);
    const recordData = {
        AREA: formData.get('AREA'),
        CLASS: formData.get('CLASS'),
        'SALES REP': formData.get('SALES REP'),
        CLIENT: formData.get('CLIENT'),
        'SKU/SALES': formData.get('SKU/SALES'),
        ITEMS: parseInt(formData.get('ITEMS')) || 0,
        'OTC/HW': formData.get('OTC/HW'),
        MONTH: formData.get('MONTH'),
        CLIENTS: formData.get('CLIENTS'),
        VALUE: parseFloat(formData.get('VALUE')) || 0
    };

    const action = recordForm.dataset.action;
    const recordIndex = recordForm.dataset.recordIndex;

    try {
        if (action === 'add') {
            await addRecord(recordData);
        } else if (action === 'update') {
            await updateRecord(recordData, recordIndex);
        }

        closeModal();
        await loadData(); // Refresh data

        alert(`Record ${action === 'add' ? 'added' : 'updated'} successfully!`);
    } catch (error) {
        console.error('Error saving record:', error);
        alert(`Error ${action === 'add' ? 'adding' : 'updating'} record: ${error.message}`);
    }
}

// Add new record
async function addRecord(recordData) {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'add',
            data: recordData
        })
    });

    const result = await response.json();
    if (!result.success) {
        throw new Error(result.error || 'Failed to add record');
    }
}

// Update existing record
async function updateRecord(recordData, recordIndex) {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'update',
            data: recordData,
            rowIndex: recordIndex
        })
    });

    const result = await response.json();
    if (!result.success) {
        throw new Error(result.error || 'Failed to update record');
    }
}

// Edit record (called from table buttons)
function editRecord(index) {
    openModal('edit', index);
}

// Delete record (placeholder - would need backend support)
function deleteRecord(index) {
    if (confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
        alert('Delete functionality would need to be implemented in the Google Apps Script backend.');
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}