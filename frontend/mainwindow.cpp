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
 * - UTF-8 support for international characters
 */

#include "mainwindow.h"
#include "ui_mainwindow.h"
#include "apiclient.h"
#include <QDebug>
#include <QPushButton>
#include <QTextEdit>
#include <QLabel>
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QMessageBox>
#include <QTime>
#include <QNetworkAccessManager>
#include <QNetworkReply>


/**
 * Constructor
 * Initializes main window, API client, and connects signals
 * 
 * @param parent - Parent widget (nullptr for top-level window)
 */
MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow){

    ui->setupUi(this);
    apiClient = (new ApiClient(this));  // API client for Azure backend

    //setupUI();          // Build the test interface
    //setupConnections(); // Connect signals/slots

    // Card view
    connect(ui->insertCardButton, &QPushButton::clicked,this,&MainWindow::onInsertCardClicked);
    connect(apiClient, &ApiClient::insertCardSuccess,this,&MainWindow::onInsertCardSuccess);
    connect(apiClient, &ApiClient::insertCardError,this,&MainWindow::onApiError);

    ui->stackedWidget->setCurrentIndex(0);

    // Pin view
    connect(ui->verifyPinButton, &QPushButton::clicked, this, &MainWindow::onVerifyPinClicked);
    connect(apiClient, &ApiClient::verifyPinSuccess, this, &MainWindow::onVerifyPinSuccess);
    connect(apiClient, &ApiClient::verifyPinError, this, &MainWindow::onApiError);

    //Logout buttoni
    connect(ui->logoutButton, &QPushButton::clicked,this, &MainWindow::onLogoutClicked);

    //Balance button
    connect(ui->CheckBalanceButton, &QPushButton::clicked,this, &MainWindow::onBalanceClicked);
    connect(ui->balanceToDashboardButton, &QPushButton::clicked, this, &MainWindow::onBalanceToDashBoardClicked);

    //Transaction History button
    // HUOM: transactionWidget sijaitsee vahingossa withdrawPage-sivulla (indeksi 4)
    // Mutta se toimii oikein tapahtumien nayttamiseen
    connect(ui->transactionButton, &QPushButton::clicked, this, &MainWindow::onTransactionClicked);
    connect(apiClient, &ApiClient::verifyTransactionSuccess, this, &MainWindow::onTransactionSuccess);
    connect(ui->transactionToDashboardButton, &QPushButton::clicked, this, &MainWindow::onTransactionToDasboardClicked);

    //Withdraw Cash button
    // Nosto-sivu on indeksissä 5 (correctWithdrawPage)
    connect(ui->pushButton_2, &QPushButton::clicked, this, &MainWindow::onWithdrawClicked);
    connect(apiClient, &ApiClient::withdrawSuccess, this, &MainWindow::onWithdrawSuccess);
    connect(apiClient, &ApiClient::withdrawError, this, &MainWindow::onWithdrawError);  // Fixed: Separate handler for withdraw errors
    
    // Withdraw page buttons (UI elements now exist!)
    connect(ui->withdrawSubmitButton, &QPushButton::clicked, this, &MainWindow::onWithdrawSubmitClicked);
    connect(ui->withdrawToDashboardButton, &QPushButton::clicked, this, &MainWindow::onWithdrawToDashboardClicked);
    
    // Quick withdraw buttons
    connect(ui->withdraw_20, &QPushButton::clicked, this, &MainWindow::onQuickWithdraw20);
    connect(ui->withdraw_50, &QPushButton::clicked, this, &MainWindow::onQuickWithdraw50);
    connect(ui->withdraw_90, &QPushButton::clicked, this, &MainWindow::onQuickWithdraw90);
    connect(ui->withdraw_140, &QPushButton::clicked, this, &MainWindow::onQuickWithdraw140);
    connect(ui->withdraw_200, &QPushButton::clicked, this, &MainWindow::onQuickWithdraw200);
    
    // Initialize header labels on withdraw page
    ui->connectionIndicator->setText("● Connecting...");
    ui->connectionIndicator->setStyleSheet("QLabel { color: #FFA500; font: 700 12pt 'Segoe UI'; background: transparent; }");
    
    ui->atmSerialNumber->setText("ATM #4000");
    ui->atmSerialNumber->setStyleSheet("QLabel { color: #B85C8A; font: 600 11pt 'Segoe UI'; background: transparent; }");
    
    ui->dateTime->setStyleSheet("QLabel { color: #B85C8A; font: 600 11pt 'Segoe UI'; background: transparent; }");
    
    // Style quick withdraw buttons
    QString quickButtonStyle = "QPushButton { "
        "background: qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0 #FFB6D9, stop:1 #FF85C0); "
        "border: none; border-radius: 20px; color: white; font: bold 14pt 'Segoe UI'; } "
        "QPushButton:hover { background: qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0 #FF85C0, stop:1 #FF5CAA); } "
        "QPushButton:pressed { background: #FF5CAA; }";
    
    ui->withdraw_20->setStyleSheet(quickButtonStyle);
    ui->withdraw_20->setText("€20");
    ui->withdraw_50->setStyleSheet(quickButtonStyle);
    ui->withdraw_50->setText("€50");
    ui->withdraw_90->setStyleSheet(quickButtonStyle);
    ui->withdraw_90->setText("€90");
    ui->withdraw_140->setStyleSheet(quickButtonStyle);
    ui->withdraw_140->setText("€140");
    ui->withdraw_200->setStyleSheet(quickButtonStyle);
    ui->withdraw_200->setText("€200");
    
    // Style cancel button
    ui->withdrawToDashboardButton->setStyleSheet(
        "QPushButton { "
        "background-color: rgba(255, 255, 255, 180); border: 2px solid #FFB6D9; "
        "border-radius: 25px; color: #B85C8A; font: 600 12pt 'Segoe UI'; padding: 10px; } "
        "QPushButton:hover { background-color: #FFF0F5; border: 2px solid #FF85C0; } "
        "QPushButton:pressed { background-color: #FFE5EC; }");
    ui->withdrawToDashboardButton->setText("← CANCEL");
    
    // Setup datetime timer to update every second
    dateTimeTimer = new QTimer(this);
    connect(dateTimeTimer, &QTimer::timeout, this, &MainWindow::updateDateTime);
    dateTimeTimer->start(1000); // Update every 1 second
    updateDateTime(); // Initial update
    
    // Setup health check timer to poll backend every 30 seconds
    healthCheckTimer = new QTimer(this);
    connect(healthCheckTimer, &QTimer::timeout, this, &MainWindow::checkConnectionStatus);
    healthCheckTimer->start(30000); // Poll every 30 seconds
    checkConnectionStatus(); // Initial check

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

void MainWindow::showDashboard()
{
    ui->stackedWidget->setCurrentIndex(2);
}

void MainWindow::resetSession()
{
    jwtToken.clear();
    currentCardNumber.clear();
    availableCardModes.clear();
    balance.clear();
    creditLimit.clear();
    cardMode.clear();
    accountId.clear();
    accountNumber.clear();
    username.clear();
    customerId.clear();

    ui->CardNumberEdit->clear();
    ui->pinNumberEdit->clear();
    ui->pinComboBox->clear();
    ui->errorLabel_2->clear();
    ui->pinErrorLabel->clear();

    ui->stackedWidget->setCurrentIndex(0); // Insert Card
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
 * Note: Properly handles UTF-8 for Finnish names (e.g., "Meik�l�inen")
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
//void MainWindow::onApiError(const QString &errorMessage)
//{
//    QLabel *statusLabel = findChild<QLabel*>("labelStatus");
//    QTextEdit *outputText = findChild<QTextEdit*>("textOutput");
//
//    if (statusLabel) {
//        statusLabel->setText("Status: ? Error - Connection failed");
//    }
//
//    if (outputText) {
//        outputText->append("=== ERROR ===");
//        outputText->append(errorMessage);
//        outputText->append("");
//        outputText->append("Troubleshooting:");
//        outputText->append("1. Check your internet connection");
//        outputText->append("2. Verify Azure backend is running");
//        outputText->append("3. Wait 60 seconds and try again (Azure cold start)");
//    }
//
//    // Show error popup with troubleshooting hint
//    QMessageBox::warning(this, "API Connection Error",
//                         QString("Failed to connect to Azure API:\n\n%1\n\nThe server may be waking up. Try again in 30-60 seconds.").arg(errorMessage));
//    }

void MainWindow::onInsertCardClicked()
{
    ui->errorLabel_2->clear();
    currentCardNumber = ui ->CardNumberEdit->text();
    apiClient->insertCard(currentCardNumber);
}

void MainWindow::onInsertCardSuccess(QStringList modes)
{
    availableCardModes = modes;

    ui->pinComboBox->clear();//vaiha ku pin ikkuna ok
    ui->pinComboBox->addItems(modes); // vaiha ku pin ikkuna ok

    ui->stackedWidget->setCurrentIndex(1);//change to pin window
}

void MainWindow::onVerifyPinClicked()
{
    ui->errorLabel_2->clear();

    QString pin = ui->pinNumberEdit->text();
    cardMode = ui->pinComboBox->currentText();

    // Tarkista PIN-koodin pituus (taytyy olla 4 numeroa)
    if (pin.length() != 4 )
    {
        ui->pinErrorLabel->setText("Pin must be 4 numbers");
        return;  // Lopeta jos validointi epaonnistuu
    }

    // Tarkista etta korttimoodi on valittu
    if (cardMode.isEmpty()) {
        ui->pinErrorLabel->setText("Select a card mode");
        return;  // Lopeta jos korttimoodi puuttuu
    }

    // Laheta PIN-vahvistuspyynto API:lle
    apiClient->verifyPin(currentCardNumber, pin, cardMode);
}

void MainWindow::onVerifyPinSuccess(
    QString token, 
    QString userName,
    QString customerIdX,
    QString accountIdX,
    QString accountNumberX,
    QString balanceAmount,
    QString creditLimitAmount)
{
    jwtToken = token;
    username = userName;
    customerId = customerIdX;
    balance = balanceAmount;
    accountId = accountIdX;
    accountNumber = accountNumberX;
    creditLimit = creditLimitAmount;


    ui->pinErrorLabel->clear();
    ui->usernameLabel->setText(username);

    // Calculate and display available balance based on card mode
    QString displayBalance;
    if (cardMode == "CREDIT") {
        // CREDIT mode: show total available (balance + credit limit)
        double balanceValue = balance.toDouble();
        double creditValue = creditLimit.toDouble();
        double availableCredit = balanceValue + creditValue;
        displayBalance = QString::number(availableCredit, 'f', 2) + "€ (incl. credit)";
    } else {
        // DEBIT mode: show only account balance
        displayBalance = balance + "€";
    }

    ui->balanceLabel->setText(displayBalance);
    ui->accountNumberLabel->setText(accountNumber);
    ui->cardModeLabel->setText(cardMode);

    qDebug() << "User:" << username;
    qDebug() << "Account balance:" << balance;
    qDebug() << "Credit limit:" << creditLimit;
    qDebug() << "Card mode:" << cardMode;
    qDebug() << "Displayed balance:" << displayBalance;


    showDashboard();
}

void MainWindow::onApiError(QString message)
{
    ui->errorLabel_2->setText(message);
}

void MainWindow::onLogoutClicked()
{
    resetSession();
}

void MainWindow::onTransactionToDasboardClicked()
{
    // Palaa dashboardiin tapahtumahistoriasta
    ui->stackedWidget->setCurrentIndex(2);
}

void MainWindow::onBalanceToDashBoardClicked()
{
    ui->stackedWidget->setCurrentIndex(2);
}

void MainWindow::onWithdrawToDashboardClicked()
{
    // Palaa takaisin dashboardiin nosto-sivulta
    ui->stackedWidget->setCurrentIndex(2);
}

void MainWindow::onBalanceClicked()
{
    ui->stackedWidget->setCurrentIndex(3);

    // Calculate and display available balance based on card mode
    QString displayBalance;
    if (cardMode == "CREDIT") {
        // CREDIT mode: show total available (balance + credit limit)
        double balanceValue = balance.toDouble();
        double creditValue = creditLimit.toDouble();
        double availableCredit = balanceValue + creditValue;
        displayBalance = QString::number(availableCredit, 'f', 2) + "€ (incl. credit)";
    } else {
        // DEBIT mode: show only account balance
        displayBalance = balance + "€";
    }

    ui->balancePageLabel->setText(displayBalance);
}

void MainWindow::onTransactionClicked() 
{
    // Nayta tapahtumahistoria (indeksi 4, vaikka sivu on nimetty vahingossa withdrawPage)
    ui->stackedWidget->setCurrentIndex(4);
    apiClient->getTransactionsByAccountId(accountId, jwtToken);
}

void MainWindow::onTransactionSuccess(QJsonArray transactions)
{
    // Tayta tapahtumataulukko datalla
    qDebug() << "Loading" << transactions.size() << "transactions to table";
    QTableWidget* table = ui->transactionWidget;
    int rowAmount = transactions.size();
    table->setRowCount(rowAmount);

    for (int row = 0; row < rowAmount; row++) {
        QJsonObject transactionRow = transactions[row].toObject();
        QString type = transactionRow["transactionType"].toString();
        QString amount = transactionRow["amount"].toString();
        QString balanceAfter = transactionRow["balanceAfter"].toString();
        QString date = transactionRow["createdAt"].toString();

        qDebug() << "Transaction row" << row << ":" << type << amount << balanceAfter << date;

        table->setItem(row, 0, new QTableWidgetItem(type));
        table->setItem(row, 1, new QTableWidgetItem(amount));
        table->setItem(row, 2, new QTableWidgetItem(balanceAfter));
        table->setItem(row, 3, new QTableWidgetItem(date));
    }

}

void MainWindow::onWithdrawClicked()
{
    // Siirry nosto-sivulle (indeksi 5 - correctWithdrawPage)
    qDebug() << "Navigating to withdraw page (index 5 - correctWithdrawPage)";
    ui->stackedWidget->setCurrentIndex(5);
    
    // Clear focus so placeholder text is visible
    ui->withdrawAmountEdit->clearFocus();
    
    qDebug() << "Current page index:" << ui->stackedWidget->currentIndex();
}

void MainWindow::onWithdrawSubmitClicked()
{
    // Hae nostomaara kayttajalta
    QString amountText = ui->withdrawAmountEdit->text();
    
    // Tyhjenna aiemmat virheet
    ui->withdrawErrorLabel->clear();
    
    // Tarkista etta summa on syotetty
    if (amountText.isEmpty()) {
        ui->withdrawErrorLabel->setText("Please enter amount");
        return;
    }
    
    // Muunna summaksi
    bool ok;
    double amount = amountText.toDouble(&ok);
    
    // Tarkista etta summa on kelvollinen
    if (!ok || amount <= 0) {
        ui->withdrawErrorLabel->setText("Invalid amount");
        return;
    }
    
    // Laheta nosto-pyynto
    qDebug() << "Withdrawing amount:" << amount;
    apiClient->withdrawMoney(amount, jwtToken);
}

void MainWindow::onWithdrawSuccess(QJsonObject transaction)
{
    // DEBUG: Log raw response
    qDebug() << "=== WITHDRAW SUCCESS HANDLER ===";
    qDebug() << "Full transaction object:" << transaction;
    qDebug() << "balanceAfter field:" << transaction["balanceAfter"];
    qDebug() << "amount field:" << transaction["amount"];

    // Tarkista etta vastaus sisaltaa tarvittavat kentat
    if (!transaction.contains("balanceAfter") || !transaction.contains("amount")) {
        qDebug() << "ERROR: Missing required fields!";
        QMessageBox::warning(this, "Error", "Invalid response from server");
        return;
    }

    // FIXED: Backend sends strings, not numbers! Convert toString() first, then toDouble()
    QString newBalance = QString::number(transaction["balanceAfter"].toString().toDouble(), 'f', 2);
    QString amount = QString::number(transaction["amount"].toString().toDouble(), 'f', 2);

    qDebug() << "Parsed newBalance string:" << newBalance;
    qDebug() << "Parsed amount string:" << amount;

    // Update internal balance (actual account balance)
    balance = newBalance;

    qDebug() << "Updated balance variable:" << balance;

    // Calculate and display available balance based on card mode
    double balanceValue = balance.toDouble();
    double creditValue = creditLimit.toDouble();
    QString displayBalance;
    if (cardMode == "CREDIT") {
        // CREDIT mode: show total available (balance + credit limit)
        double availableCredit = balanceValue + creditValue;
        displayBalance = QString::number(availableCredit, 'f', 2) + "€ (incl. credit)";
    } else {
        // DEBIT mode: show only account balance
        displayBalance = balance + "€";
    }

    // Update dashboard display with calculated available balance
    ui->balanceLabel->setText(displayBalance);

    // Tyhjenna syotekentta ja virheet
    ui->withdrawAmountEdit->clear();
    ui->withdrawErrorLabel->clear();

    // Nayta vahvistus (show actual account balance in confirmation)
    QString successMessage = "Withdrawal successful!\n\nAmount: €" + amount + 
        "\nNew account balance: €" + newBalance;
    if (cardMode == "CREDIT") {
        successMessage += "\nAvailable credit: €" + QString::number(balanceValue + creditValue, 'f', 2);
    }
    QMessageBox::information(this, "Success", successMessage);

    // Palaa dashboardiin
    ui->stackedWidget->setCurrentIndex(2);
}

void MainWindow::onWithdrawError(QString errorMessage)
{
    // Nayta virheilmoitus nosto-sivun virhelabelissa
    qDebug() << "Withdraw error:" << errorMessage;
    ui->withdrawErrorLabel->setText(errorMessage);
    
    // Tyhjenna syotekentta
    ui->withdrawAmountEdit->clear();
}

void MainWindow::updateDateTime()
{
    // Paivita kellonaika suomalaisessa muodossa (24h)
    ui->dateTime->setText(QDateTime::currentDateTime().toString("dd.MM.yyyy HH:mm"));
}

void MainWindow::checkConnectionStatus()
{
    // Laheta health check -pyynto taustalla (ei blokkaa UI:ta)
    // Kasitellaan vastaus onConnectionStatusReceived() -slotissa
    qDebug() << "Checking backend connection status...";
    
    // Vaihda indikaattori odotustilaan
    ui->connectionIndicator->setText("● Checking...");
    ui->connectionIndicator->setStyleSheet("QLabel { color: #FFA500; font: 700 12pt 'Segoe UI'; background: transparent; }");
    
    // Kutsu ApiClient health check -metodia
    // Huom: Tama ei tallenna tulosta, vaan paivittaa vain indikaattorin
    QNetworkAccessManager *tempManager = new QNetworkAccessManager(this);
    QUrl url(apiClient->getBaseUrl() + "/health");
    QNetworkRequest request(url);
    
    QNetworkReply* reply = tempManager->get(request);
    
    // Kasittele vastaus
    connect(reply, &QNetworkReply::finished, this, [=]() {
        if (reply->error() == QNetworkReply::NoError) {
            // Yhteys toimii
            ui->connectionIndicator->setText("● Online");
            ui->connectionIndicator->setStyleSheet("QLabel { color: #4CAF50; font: 700 12pt 'Segoe UI'; background: transparent; }");
            qDebug() << "Backend connection: ONLINE";
        } else {
            // Yhteys ei toimi
            ui->connectionIndicator->setText("● Offline");
            ui->connectionIndicator->setStyleSheet("QLabel { color: #F44336; font: 700 12pt 'Segoe UI'; background: transparent; }");
            qDebug() << "Backend connection: OFFLINE -" << reply->errorString();
        }
        reply->deleteLater();
        tempManager->deleteLater();
    });
}

void MainWindow::onQuickWithdraw20()
{
    qDebug() << "Quick withdraw: €20";
    apiClient->withdrawMoney(20.0, jwtToken);
}

void MainWindow::onQuickWithdraw50()
{
    qDebug() << "Quick withdraw: €50";
    apiClient->withdrawMoney(50.0, jwtToken);
}

void MainWindow::onQuickWithdraw90()
{
    qDebug() << "Quick withdraw: €90";
    apiClient->withdrawMoney(90.0, jwtToken);
}

void MainWindow::onQuickWithdraw140()
{
    qDebug() << "Quick withdraw: €140";
    apiClient->withdrawMoney(140.0, jwtToken);
}

void MainWindow::onQuickWithdraw200()
{
    qDebug() << "Quick withdraw: €200";
    apiClient->withdrawMoney(200.0, jwtToken);
}