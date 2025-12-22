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
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private slots:
    void onTestConnectionClicked();
    void onHealthCheckClicked();
    void onCustomersReceived(const QList<Customer> &customers);
    void onHealthCheckSuccess(const QString &status);
    void onApiError(const QString &errorMessage);

private:
    Ui::MainWindow *ui;
    ApiClient *apiClient;
    
    void setupUI();
    void setupConnections();
};
#endif // MAINWINDOW_H
