/**
 * MainWindow - ATM Banking Application Main Window
 * 
 * This will become the main ATM interface with:
 * - PIN entry screen
 * - Balance inquiry
 * - Cash withdrawal options
 * - Transaction history
 * - Receipt generation
 * 
 * TODO: Add QtNetwork for REST API communication
 * TODO: Create data models (Customer, Account, Transaction)
 * TODO: Implement HTTP client to connect to backend API
 */

#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>

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

private:
    Ui::MainWindow *ui;
    
    // TODO: Add private members for:
    // - API client
    // - Current customer/account state
    // - Transaction data
};
#endif // MAINWINDOW_H
