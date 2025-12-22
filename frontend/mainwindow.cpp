/**
 * mainwindow.cpp - Main window implementation for ATM API test interface
 * 
 * Current Purpose: API connection testing and validation
 * Future Purpose: Full ATM user interface
 * 
 * Features:
 * - Health check to verify Azure backend is responsive
 * - Customer data fetch from Azure MySQL database
 * - Real-time status updates and error handling
 * - UTF-8 support for Scandinavian characters (å, ä, ö)
 */

#include "mainwindow.h"
#include "ui_mainwindow.h"
#include "apiclient.h"
#include <QPushButton>
#include <QTextEdit>
#include <QLabel>
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QMessageBox>

/**
 * Constructor
 * Initializes main window, API client, and connects signals
 * 
 * @param parent - Parent widget (nullptr for top-level window)
 */
MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
    , apiClient(new ApiClient(this))  // API client for Azure backend
{
    ui->setupUi(this);
    setupUI();          // Build the test interface
    setupConnections(); // Connect signals/slots
}

/**
 * Destructor
 * Cleans up UI resources (apiClient auto-deleted via parent)
 */
MainWindow::~MainWindow()
{
    delete ui;
}

/**
 * Setup the test UI programmatically
 * Creates a simple interface for testing Azure API connectivity
 * 
 * Layout:
 * - Title + API URL display
 * - Two test buttons (Health Check, Get Customers)
 * - Output text area for results
 * - Status label at bottom
 * 
 * Note: Uses programmatic UI instead of .ui file for flexibility
 *       Will be replaced with proper ATM interface later
 */
void MainWindow::setupUI()
{
    setWindowTitle("Bank ATM System - API Test");
    resize(800, 600);
    
    // Create central widget with vertical layout
    QWidget *centralWidget = new QWidget(this);
    QVBoxLayout *layout = new QVBoxLayout(centralWidget);
    
    // === TITLE SECTION ===
    QLabel *titleLabel = new QLabel("Bank ATM System - API Connection Test", this);
    QFont titleFont = titleLabel->font();
    titleFont.setPointSize(14);
    titleFont.setBold(true);
    titleLabel->setFont(titleFont);
    titleLabel->setAlignment(Qt::AlignCenter);
    layout->addWidget(titleLabel);
    
    // Display current API endpoint
    QLabel *apiUrlLabel = new QLabel("API: " + apiClient->getBaseUrl(), this);
    apiUrlLabel->setAlignment(Qt::AlignCenter);
    apiUrlLabel->setStyleSheet("color: #666; font-size: 10pt;");
    layout->addWidget(apiUrlLabel);
    
    // === BUTTON SECTION ===
    QHBoxLayout *buttonLayout = new QHBoxLayout();
    
    // Health check button - Quick test to wake up Azure
    QPushButton *healthButton = new QPushButton("1. Health Check (Quick Test)", this);
    healthButton->setMinimumHeight(40);
    healthButton->setObjectName("btnHealthCheck");
    healthButton->setStyleSheet("background-color: #4CAF50; color: white; font-weight: bold;");
    buttonLayout->addWidget(healthButton);
    
    // Customer fetch button - Full database query test
    QPushButton *testButton = new QPushButton("2. Get All Customers (Full Test)", this);
    testButton->setMinimumHeight(40);
    testButton->setObjectName("btnTestConnection");
    testButton->setStyleSheet("background-color: #2196F3; color: white; font-weight: bold;");
    buttonLayout->addWidget(testButton);
    
    layout->addLayout(buttonLayout);
    
    // === INFO LABEL ===
    // Warn about Azure App Service cold start delay
    QLabel *infoLabel = new QLabel("Note: First request may take 30-60 seconds (Azure waking up)", this);
    infoLabel->setAlignment(Qt::AlignCenter);
    infoLabel->setStyleSheet("color: #FF9800; font-style: italic;");
    layout->addWidget(infoLabel);
    
    // === OUTPUT TEXT AREA ===
    // Display API responses and customer data
    QTextEdit *outputText = new QTextEdit(this);
    outputText->setReadOnly(true);
    outputText->setPlaceholderText("API response will appear here...\n\nTip: Try Health Check first to wake up the Azure server!");
    outputText->setObjectName("textOutput");
    layout->addWidget(outputText);
    
    // === STATUS LABEL ===
    // Real-time status updates at bottom
    QLabel *statusLabel = new QLabel("Status: Ready - Click Health Check to test connection", this);
    statusLabel->setObjectName("labelStatus");
    statusLabel->setStyleSheet("padding: 5px; background-color: #f0f0f0;");
    layout->addWidget(statusLabel);
    
    setCentralWidget(centralWidget);
}

/**
 * Setup signal/slot connections
 * Connects UI buttons to handlers and API client signals to response handlers
 * 
 * Connections:
 * - Button clicks ? API request handlers
 * - API success signals ? Data display handlers
 * - API error signal ? Error display handler
 */
void MainWindow::setupConnections()
{
    // === BUTTON CONNECTIONS ===
    QPushButton *healthButton = findChild<QPushButton*>("btnHealthCheck");
    if (healthButton) {
        connect(healthButton, &QPushButton::clicked, this, &MainWindow::onHealthCheckClicked);
    }
    
    QPushButton *testButton = findChild<QPushButton*>("btnTestConnection");
    if (testButton) {
        connect(testButton, &QPushButton::clicked, this, &MainWindow::onTestConnectionClicked);
    }
    
    // === API CLIENT CONNECTIONS ===
    // Connect async API response signals to UI update slots
    connect(apiClient, &ApiClient::customersReceived, this, &MainWindow::onCustomersReceived);
    connect(apiClient, &ApiClient::healthCheckSuccess, this, &MainWindow::onHealthCheckSuccess);
    connect(apiClient, &ApiClient::errorOccurred, this, &MainWindow::onApiError);
}

/**
 * Health check button click handler
 * Sends GET request to /health endpoint to verify Azure backend is online
 * 
 * Purpose:
 * - Wake up Azure App Service from sleep mode
 * - Verify network connectivity
 * - Test HTTPS/TLS connection
 * 
 * Note: Azure Basic tier goes to sleep after 20 mins inactivity
 *       First request can take 30-60 seconds to wake up
 */
void MainWindow::onHealthCheckClicked()
{
    QLabel *statusLabel = findChild<QLabel*>("labelStatus");
    QTextEdit *outputText = findChild<QTextEdit*>("textOutput");
    
    // Update UI to show request in progress
    if (statusLabel) {
        statusLabel->setText("Status: Pinging Azure server... (may take up to 60 seconds on first request)");
    }
    
    if (outputText) {
        outputText->clear();
        outputText->append("=== HEALTH CHECK ===");
        outputText->append("Sending request to: " + apiClient->getBaseUrl() + "/health");
        outputText->append("");
        outputText->append("Please wait... Azure App Service may be waking up from sleep mode.");
        outputText->append("This can take 30-60 seconds on the first request.");
        outputText->append("");
    }
    
    // Make async API call (response handled by onHealthCheckSuccess)
    apiClient->checkHealth();
}

/**
 * Get customers button click handler
 * Sends GET request to /api/customers to fetch all customers from Azure MySQL
 * 
 * Purpose:
 * - Test database connectivity
 * - Verify JSON parsing with UTF-8 (Finnish characters)
 * - Display customer data from production database
 */
void MainWindow::onTestConnectionClicked()
{
    QLabel *statusLabel = findChild<QLabel*>("labelStatus");
    QTextEdit *outputText = findChild<QTextEdit*>("textOutput");
    
    // Update UI to show request in progress
    if (statusLabel) {
        statusLabel->setText("Status: Fetching customers from Azure MySQL...");
    }
    
    if (outputText) {
        outputText->clear();
        outputText->append("=== FETCHING CUSTOMERS ===");
        outputText->append("API Endpoint: " + apiClient->getBaseUrl() + "/api/customers");
        outputText->append("");
        outputText->append("Connecting to Azure MySQL database...");
        outputText->append("Please wait...");
        outputText->append("");
    }
    
    // Make async API call (response handled by onCustomersReceived)
    apiClient->getAllCustomers();
}

/**
 * Health check success response handler
 * Called when /health endpoint responds with status
 * 
 * @param status - Server status string (usually "OK")
 * 
 * Updates UI to show:
 * - Server is online and responding
 * - Backend is ready for database queries
 */
void MainWindow::onHealthCheckSuccess(const QString &status)
{
    QLabel *statusLabel = findChild<QLabel*>("labelStatus");
    QTextEdit *outputText = findChild<QTextEdit*>("textOutput");
    
    if (statusLabel) {
        statusLabel->setText("Status: ? Connected! Server is healthy");
    }
    
    if (outputText) {
        outputText->append("=== SUCCESS ===");
        outputText->append("Server Status: " + status);
        outputText->append("");
        outputText->append("Azure backend is now awake and responding!");
        outputText->append("You can now click 'Get All Customers' to fetch data.");
    }
    
    // Show success popup
    QMessageBox::information(this, "Health Check Success", 
                            "? Successfully connected to Azure!\n\nServer Status: " + status + 
                            "\n\nThe backend is now ready. You can fetch customers.");
}

/**
 * Customers received response handler
 * Called when /api/customers responds with customer list
 * 
 * @param customers - List of Customer objects from Azure MySQL
 * 
 * Displays:
 * - Customer count
 * - Each customer's ID, name (UTF-8), address, timestamp
 * - Empty state message if no customers
 * 
 * Note: Properly handles UTF-8 for Finnish names (e.g., "Meikäläinen")
 */
void MainWindow::onCustomersReceived(const QList<Customer> &customers)
{
    QLabel *statusLabel = findChild<QLabel*>("labelStatus");
    QTextEdit *outputText = findChild<QTextEdit*>("textOutput");
    
    if (statusLabel) {
        statusLabel->setText(QString("Status: ? Success! Received %1 customer(s)").arg(customers.count()));
    }
    
    if (outputText) {
        // Ensure proper UTF-8 display (no rich text formatting issues)
        outputText->setAcceptRichText(false);
        
        outputText->append("=== SUCCESS ===");
        outputText->append(QString("Found %1 customer(s) in Azure MySQL database:").arg(customers.count()));
        outputText->append("");
        
        // Handle empty database
        if (customers.isEmpty()) {
            outputText->append("No customers found. Database is empty.");
            outputText->append("");
            outputText->append("You can add customers using:");
            outputText->append("POST " + apiClient->getBaseUrl() + "/api/customers");
        } else {
            // Display each customer's details
            for (int i = 0; i < customers.count(); ++i) {
                const Customer &customer = customers[i];
                outputText->append(QString("?????????????????????????????"));
                outputText->append(QString("Customer #%1:").arg(i + 1));
                outputText->append(QString("  ID: %1").arg(customer.getId()));
                outputText->append(QString("  Name: %1").arg(customer.getFullName())); // UTF-8 safe
                outputText->append(QString("  Address: %1").arg(customer.getAddress()));
                if (customer.getCreatedAt().isValid()) {
                    outputText->append(QString("  Created: %1").arg(customer.getCreatedAt().toString("yyyy-MM-dd HH:mm:ss")));
                }
                outputText->append("");
            }
        }
    }
    
    // Show success popup with UTF-8 encoded customer name
    QString message = QString("? Successfully connected to Azure MySQL!\n\nReceived %1 customer(s) from the database.")
                        .arg(customers.count());
    
    if (!customers.isEmpty()) {
        // Show first customer name to verify UTF-8 encoding works
        message += QString("\n\nFirst customer: %1").arg(customers.first().getFullName());
    }
    
    QMessageBox::information(this, "API Test Successful", message);
}

/**
 * API error response handler
 * Called when any API request fails
 * 
 * @param errorMessage - Error description from ApiClient
 * 
 * Common errors:
 * - Network timeout (Azure cold start)
 * - TLS/SSL failure (missing OpenSSL)
 * - HTTP errors (404, 500, etc.)
 * 
 * Provides troubleshooting tips to user
 */
void MainWindow::onApiError(const QString &errorMessage)
{
    QLabel *statusLabel = findChild<QLabel*>("labelStatus");
    QTextEdit *outputText = findChild<QTextEdit*>("textOutput");
    
    if (statusLabel) {
        statusLabel->setText("Status: ? Error - Connection failed");
    }
    
    if (outputText) {
        outputText->append("=== ERROR ===");
        outputText->append(errorMessage);
        outputText->append("");
        outputText->append("Troubleshooting:");
        outputText->append("1. Check your internet connection");
        outputText->append("2. Verify Azure backend is running");
        outputText->append("3. Wait 60 seconds and try again (Azure cold start)");
    }
    
    // Show error popup with troubleshooting hint
    QMessageBox::warning(this, "API Connection Error", 
                         QString("Failed to connect to Azure API:\n\n%1\n\nThe server may be waking up. Try again in 30-60 seconds.").arg(errorMessage));
}
