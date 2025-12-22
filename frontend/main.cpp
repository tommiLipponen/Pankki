/**
 * Bank ATM System - Frontend Application
 * 
 * Qt Widgets desktop application for ATM banking operations.
 * Connects to Node.js REST API backend for data operations.
 * 
 * Backend API:
 *   - Local:      http://localhost:3000
 *   - Production: https://pankki-api-dcb8eubhg5c5eya6.swedencentral-01.azurewebsites.net
 * 
 * Project: OAMK Software Development Application Project (Spring 2026)
 */

#include "mainwindow.h"

#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    MainWindow w;
    w.show();
    return a.exec();
}
