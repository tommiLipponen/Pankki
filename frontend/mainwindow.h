/**
 * MainWindow - ATM Banking Application Main Window
 * 
 * Currently includes API connection testing interface.
 * 
 * Future ATM interface features:
 * - PIN entry screen
 * - Balance inquiry
 * - Cash withdrawal options
 * - Transaction history
 * - Receipt generation
 * 
 * Completed:
 * ? QtNetwork for REST API communication
 * ? Customer data model
 * ? HTTP client connected to Azure backend API
 */

#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QTimer>
#include <QList>
#include "apiclient.h"
#include "transactionsdata.h"

// Forward declarations
class QLabel;
class QFrame;

QT_BEGIN_NAMESPACE
namespace Ui {
class MainWindow;
}
QT_END_NAMESPACE

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private slots:
    void onTestConnectionClicked();
    void onHealthCheckClicked();
    void onCustomersReceived(const QList<Customer> &customers);
    void onHealthCheckSuccess(const QString &status);

    void onInsertCardClicked();
    void onInsertCardSuccess(QStringList modes);
    void onVerifyPinClicked();
    void onVerifyPinSuccess(
        QString token, 
        QString username,
        QString customerId,
        QString accountId,
        QString accountNumber,
        QString balance,
        QString creditLimit);

    // Transaction
    void onTransactionClicked();
    void onTransactionSuccess(QJsonArray transactions);
	void onTransactionError(QString errorMessage);
	void setTenTransactionsToTable(int pageNumber);
	void onPrevTransactionsClicked();
	void onNextTransactionsClicked();

    void onApiError(QString message);

    void onLogoutClicked();
    void onTransactionToDasboardClicked();
    void onBalanceToDashBoardClicked();

    void onBalanceClicked();
    void onWithdrawClicked();
    void onWithdrawSubmitClicked();
    void onWithdrawSuccess(QJsonObject transaction);
    void onWithdrawError(QString errorMessage);
    void onWithdrawToDashboardClicked();
    
    // Quick withdraw buttons
    void onQuickWithdraw20();
    void onQuickWithdraw50();
    void onQuickWithdraw90();
    void onQuickWithdraw140();
    void onQuickWithdraw200();
    
    // DateTime update
    void updateDateTime();
    void checkConnectionStatus();

	// Session management
	void onSessionTimeout();
    void startSessionTimer(int seconds);
    void stopSessionTimer();
    void resetSessionTimer();
    void updateSessionCountdown();
    void onUserActivity();

private:
Ui::MainWindow *ui;
ApiClient *apiClient;
// Timers
QTimer *sessionTimer;
QTimer *sessionCountdownTimer;
QTimer *dateTimeTimer;  // Timer for updating datetime label
QTimer *healthCheckTimer;  // Timer for polling backend health status

int sessionTimeoutSeconds = 0;
int sessionRemainingSeconds = 0;

// Card view
    QString currentCardNumber;
    QStringList availableCardModes;

    // Pin view
    QString jwtToken;
    QString cardMode;

    // Overview
    QString username;
    QString customerId;
    QString accountId;
    QString accountNumber;
    QString balance;
    QString creditLimit;

    // TransactionData object
    TransactionsData objTransactions;

    // Single shared header bar
    QFrame* headerBar;
    QLabel* connectionIndicator;
    QLabel* dateTimeLabel;
    QLabel* atmSerialLabel;
    QLabel* sessionTimerLabel;

    void setupUI();
    void setupConnections();

    void showDashboard();
    void resetSession();

    // Header creation helper
    void createHeaderBar();
};
#endif // MAINWINDOW_H
