/**
 * ApiClient - HTTP client for Bank ATM REST API
 * 
 * Handles all communication with the backend API
 * Based on OpenAPI specification from:
 * https://pankki-api-dcb8eubhg5c5eya6.swedencentral-01.azurewebsites.net/api-docs.json
 * 
 * Production: https://pankki-api-dcb8eubhg5c5eya6.swedencentral-01.azurewebsites.net
 * Development: http://localhost:3000
 */

#ifndef APICLIENT_H
#define APICLIENT_H

#include <QObject>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QList>
#include "customer.h"

class ApiClient : public QObject
{
    Q_OBJECT

public:
    explicit ApiClient(QObject *parent = nullptr);
    ~ApiClient();
    
    // Set API base URL (default: production)
    void setBaseUrl(const QString &url);
    QString getBaseUrl() const { return m_baseUrl; }
    
    // Customer endpoints
    void getAllCustomers();
    void getCustomerById(int id);
    void createCustomer(const Customer &customer);
    void updateCustomer(int id, const Customer &customer);
    void deleteCustomer(int id);
    
    // Health check
    void checkHealth();

signals:
    // Success signals
    void customersReceived(const QList<Customer> &customers);
    void customerReceived(const Customer &customer);
    void customerCreated(const Customer &customer);
    void customerUpdated(const Customer &customer);
    void customerDeleted(int id);
    void healthCheckSuccess(const QString &status);
    
    // Error signal
    void errorOccurred(const QString &errorMessage);

private:
    QNetworkAccessManager *m_networkManager;
    QString m_baseUrl;
    
    // Helper methods
    void sendGetRequest(const QString &endpoint);
    void sendPostRequest(const QString &endpoint, const QJsonObject &data);
    void sendPutRequest(const QString &endpoint, const QJsonObject &data);
    void sendDeleteRequest(const QString &endpoint);
    
    void onReplyFinished(QNetworkReply *reply);
    void handleCustomersResponse(const QByteArray &responseData);
    void handleCustomerResponse(const QByteArray &responseData);
    void handleCreateResponse(const QByteArray &responseData);
    void handleUpdateResponse(const QByteArray &responseData);
    void handleDeleteResponse(QNetworkReply *reply, const QByteArray &responseData);
    void handleHealthResponse(const QByteArray &responseData);
    void handleError(QNetworkReply *reply);
};

#endif // APICLIENT_H
