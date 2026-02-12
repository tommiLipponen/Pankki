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

    void onTransactionClicked();
    void onTransactionSuccess(QJsonArray transactions);

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


private:
Ui::MainWindow *ui;
ApiClient *apiClient;
QTimer *dateTimeTimer;  // Timer for updating datetime label
QTimer *healthCheckTimer;  // Timer for polling backend health status

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

    // Single shared header bar
    QFrame* headerBar;
    QLabel* connectionIndicator;
    QLabel* dateTimeLabel;
    QLabel* atmSerialLabel;

    void setupUI();
    void setupConnections();

    void showDashboard();
    void resetSession();

    // Header creation helper
    void createHeaderBar();
};
#endif // MAINWINDOW_H
