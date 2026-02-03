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
#include "apiclient.h"

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

    void onApiError(QString message);

    void onLogoutClicked();


private:
    Ui::MainWindow *ui;
    ApiClient *apiClient;

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
    
    void setupUI();
    void setupConnections();

    void showDashboard();
    void resetSession();
};
#endif // MAINWINDOW_H
