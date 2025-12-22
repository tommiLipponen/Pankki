#include "apiclient.h"
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QNetworkRequest>
#include <QUrl>
#include <QTimer>
#include <QDebug>

ApiClient::ApiClient(QObject *parent)
    : QObject(parent)
    , m_networkManager(new QNetworkAccessManager(this))
    , m_baseUrl("https://pankki-api-dcb8eubhg5c5eya6.swedencentral-01.azurewebsites.net")
{
    // Don't connect to finished signal here - we'll connect per-reply
    qDebug() << "ApiClient initialized with base URL:" << m_baseUrl;
}

ApiClient::~ApiClient()
{
}

void ApiClient::setBaseUrl(const QString &url)
{
    m_baseUrl = url;
    qDebug() << "Base URL changed to:" << m_baseUrl;
}

// Customer endpoints implementation
void ApiClient::getAllCustomers()
{
    qDebug() << "getAllCustomers() called";
    sendGetRequest("/api/customers");
}

void ApiClient::getCustomerById(int id)
{
    qDebug() << "getCustomerById() called with id:" << id;
    sendGetRequest(QString("/api/customers/%1").arg(id));
}

void ApiClient::createCustomer(const Customer &customer)
{
    qDebug() << "createCustomer() called";
    QJsonObject json = customer.toJson();
    json.remove("id");
    json.remove("createdAt");
    json.remove("updatedAt");
    sendPostRequest("/api/customers", json);
}

void ApiClient::updateCustomer(int id, const Customer &customer)
{
    qDebug() << "updateCustomer() called with id:" << id;
    QJsonObject json = customer.toJson();
    json.remove("id");
    json.remove("createdAt");
    json.remove("updatedAt");
    sendPutRequest(QString("/api/customers/%1").arg(id), json);
}

void ApiClient::deleteCustomer(int id)
{
    qDebug() << "deleteCustomer() called with id:" << id;
    sendDeleteRequest(QString("/api/customers/%1").arg(id));
}

void ApiClient::checkHealth()
{
    qDebug() << "checkHealth() called";
    sendGetRequest("/health");
}

// HTTP request methods
void ApiClient::sendGetRequest(const QString &endpoint)
{
    QUrl url(m_baseUrl + endpoint);
    qDebug() << "Sending GET request to:" << url.toString();
    
    QNetworkRequest request(url);
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    request.setAttribute(QNetworkRequest::RedirectPolicyAttribute, QNetworkRequest::NoLessSafeRedirectPolicy);
    request.setTransferTimeout(120000);
    
    QNetworkReply *reply = m_networkManager->get(request);
    reply->setProperty("endpoint", endpoint);
    reply->setProperty("method", "GET");
    reply->setProperty("startTime", QDateTime::currentMSecsSinceEpoch());
    
    // Connect finished signal for THIS specific reply
    connect(reply, &QNetworkReply::finished, this, [this, reply]() {
        onReplyFinished(reply);
    });
    
    // Connect error signal
    connect(reply, &QNetworkReply::errorOccurred, this, [reply](QNetworkReply::NetworkError code) {
        qDebug() << "Network error occurred:" << code << reply->errorString();
    });
    
    qDebug() << "Request sent, waiting for response...";
}

void ApiClient::sendPostRequest(const QString &endpoint, const QJsonObject &data)
{
    QUrl url(m_baseUrl + endpoint);
    qDebug() << "Sending POST request to:" << url.toString();
    
    QNetworkRequest request(url);
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    request.setAttribute(QNetworkRequest::RedirectPolicyAttribute, QNetworkRequest::NoLessSafeRedirectPolicy);
    request.setTransferTimeout(120000);
    
    QJsonDocument doc(data);
    QByteArray jsonData = doc.toJson();
    
    QNetworkReply *reply = m_networkManager->post(request, jsonData);
    reply->setProperty("endpoint", endpoint);
    reply->setProperty("method", "POST");
    reply->setProperty("startTime", QDateTime::currentMSecsSinceEpoch());
    
    connect(reply, &QNetworkReply::finished, this, [this, reply]() {
        onReplyFinished(reply);
    });
    
    connect(reply, &QNetworkReply::errorOccurred, this, [reply](QNetworkReply::NetworkError code) {
        qDebug() << "Network error occurred:" << code << reply->errorString();
    });
}

void ApiClient::sendPutRequest(const QString &endpoint, const QJsonObject &data)
{
    QUrl url(m_baseUrl + endpoint);
    qDebug() << "Sending PUT request to:" << url.toString();
    
    QNetworkRequest request(url);
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    request.setAttribute(QNetworkRequest::RedirectPolicyAttribute, QNetworkRequest::NoLessSafeRedirectPolicy);
    request.setTransferTimeout(120000);
    
    QJsonDocument doc(data);
    QByteArray jsonData = doc.toJson();
    
    QNetworkReply *reply = m_networkManager->put(request, jsonData);
    reply->setProperty("endpoint", endpoint);
    reply->setProperty("method", "PUT");
    reply->setProperty("startTime", QDateTime::currentMSecsSinceEpoch());
    
    connect(reply, &QNetworkReply::finished, this, [this, reply]() {
        onReplyFinished(reply);
    });
    
    connect(reply, &QNetworkReply::errorOccurred, this, [reply](QNetworkReply::NetworkError code) {
        qDebug() << "Network error occurred:" << code << reply->errorString();
    });
}

void ApiClient::sendDeleteRequest(const QString &endpoint)
{
    QUrl url(m_baseUrl + endpoint);
    qDebug() << "Sending DELETE request to:" << url.toString();
    
    QNetworkRequest request(url);
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    request.setAttribute(QNetworkRequest::RedirectPolicyAttribute, QNetworkRequest::NoLessSafeRedirectPolicy);
    request.setTransferTimeout(120000);
    
    QNetworkReply *reply = m_networkManager->deleteResource(request);
    reply->setProperty("endpoint", endpoint);
    reply->setProperty("method", "DELETE");
    reply->setProperty("startTime", QDateTime::currentMSecsSinceEpoch());
    
    connect(reply, &QNetworkReply::finished, this, [this, reply]() {
        onReplyFinished(reply);
    });
    
    connect(reply, &QNetworkReply::errorOccurred, this, [reply](QNetworkReply::NetworkError code) {
        qDebug() << "Network error occurred:" << code << reply->errorString();
    });
}

// Response handlers
void ApiClient::onReplyFinished(QNetworkReply *reply)
{
    if (!reply) {
        qDebug() << "ERROR: Reply is null!";
        return;
    }
    
    QString endpoint = reply->property("endpoint").toString();
    QString method = reply->property("method").toString();
    qint64 startTime = reply->property("startTime").toLongLong();
    qint64 elapsed = QDateTime::currentMSecsSinceEpoch() - startTime;
    
    qDebug() << "Response received for" << method << endpoint;
    qDebug() << "Response time:" << elapsed << "ms";
    qDebug() << "HTTP Status:" << reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
    qDebug() << "Error code:" << reply->error();
    
    if (reply->error() != QNetworkReply::NoError) {
        qDebug() << "ERROR:" << reply->errorString();
        handleError(reply);
        reply->deleteLater();
        return;
    }
    
    // Read response data ONCE
    QByteArray responseData = reply->readAll();
    qDebug() << "Response data length:" << responseData.length() << "bytes";
    qDebug() << "Response preview:" << responseData.left(200);
    
    // Route to appropriate handler based on endpoint - pass the data
    if (endpoint == "/api/customers" && method == "GET") {
        handleCustomersResponse(responseData);
    } else if (endpoint.startsWith("/api/customers/") && method == "GET") {
        handleCustomerResponse(responseData);
    } else if (endpoint == "/api/customers" && method == "POST") {
        handleCreateResponse(responseData);
    } else if (endpoint.startsWith("/api/customers/") && method == "PUT") {
        handleUpdateResponse(responseData);
    } else if (endpoint.startsWith("/api/customers/") && method == "DELETE") {
        handleDeleteResponse(reply, responseData);
    } else if (endpoint == "/health") {
        handleHealthResponse(responseData);
    }
    
    reply->deleteLater();
}

void ApiClient::handleCustomersResponse(const QByteArray &responseData)
{
    qDebug() << "Parsing customers response...";
    
    // Parse as UTF-8
    QJsonDocument doc = QJsonDocument::fromJson(responseData);
    
    if (doc.isNull()) {
        qDebug() << "Failed to parse JSON response";
        emit errorOccurred("Invalid JSON response from server");
        return;
    }
    
    QJsonObject obj = doc.object();
    
    qDebug() << "Success field:" << obj["success"].toBool();
    
    if (obj["success"].toBool()) {
        QList<Customer> customers;
        QJsonArray dataArray = obj["data"].toArray();
        
        qDebug() << "Number of customers:" << dataArray.count();
        
        for (const QJsonValue &value : dataArray) {
            Customer customer(value.toObject());
            customers.append(customer);
        }
        
        emit customersReceived(customers);
    } else {
        QString errorMsg = obj["message"].toString();
        qDebug() << "API returned error:" << errorMsg;
        emit errorOccurred(errorMsg);
    }
}

void ApiClient::handleCustomerResponse(const QByteArray &responseData)
{
    QJsonDocument doc = QJsonDocument::fromJson(responseData);
    
    if (doc.isNull()) {
        emit errorOccurred("Invalid JSON response from server");
        return;
    }
    
    QJsonObject obj = doc.object();
    
    if (obj["success"].toBool()) {
        Customer customer(obj["data"].toObject());
        emit customerReceived(customer);
    } else {
        emit errorOccurred(obj["message"].toString());
    }
}

void ApiClient::handleCreateResponse(const QByteArray &responseData)
{
    QJsonDocument doc = QJsonDocument::fromJson(responseData);
    
    if (doc.isNull()) {
        emit errorOccurred("Invalid JSON response from server");
        return;
    }
    
    QJsonObject obj = doc.object();
    
    if (obj["success"].toBool()) {
        Customer customer(obj["data"].toObject());
        emit customerCreated(customer);
    } else {
        emit errorOccurred(obj["message"].toString());
    }
}

void ApiClient::handleUpdateResponse(const QByteArray &responseData)
{
    QJsonDocument doc = QJsonDocument::fromJson(responseData);
    
    if (doc.isNull()) {
        emit errorOccurred("Invalid JSON response from server");
        return;
    }
    
    QJsonObject obj = doc.object();
    
    if (obj["success"].toBool()) {
        Customer customer(obj["data"].toObject());
        emit customerUpdated(customer);
    } else {
        emit errorOccurred(obj["message"].toString());
    }
}

void ApiClient::handleDeleteResponse(QNetworkReply *reply, const QByteArray &responseData)
{
    QJsonDocument doc = QJsonDocument::fromJson(responseData);
    
    if (doc.isNull()) {
        emit errorOccurred("Invalid JSON response from server");
        return;
    }
    
    QJsonObject obj = doc.object();
    
    if (obj["success"].toBool()) {
        QString endpoint = reply->property("endpoint").toString();
        int id = endpoint.split("/").last().toInt();
        emit customerDeleted(id);
    } else {
        emit errorOccurred(obj["message"].toString());
    }
}

void ApiClient::handleHealthResponse(const QByteArray &responseData)
{
    qDebug() << "Health response:" << QString::fromUtf8(responseData);
    
    QJsonDocument doc = QJsonDocument::fromJson(responseData);
    
    if (doc.isNull()) {
        emit errorOccurred("Invalid JSON response from server");
        return;
    }
    
    QJsonObject obj = doc.object();
    
    QString status = obj["status"].toString();
    qDebug() << "Health status:" << status;
    emit healthCheckSuccess(status);
}

void ApiClient::handleError(QNetworkReply *reply)
{
    QString errorMsg;
    int httpStatus = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
    
    qDebug() << "Handling error. HTTP Status:" << httpStatus;
    qDebug() << "Network error:" << reply->error() << reply->errorString();
    
    QByteArray responseData = reply->readAll();
    qDebug() << "Error response data:" << responseData;
    
    if (!responseData.isEmpty()) {
        QJsonDocument doc = QJsonDocument::fromJson(responseData);
        QJsonObject obj = doc.object();
        errorMsg = obj["message"].toString();
    }
    
    if (errorMsg.isEmpty()) {
        errorMsg = reply->errorString();
    }
    
    if (httpStatus > 0) {
        errorMsg = QString("HTTP %1: %2").arg(httpStatus).arg(errorMsg);
    }
    
    qDebug() << "Emitting error:" << errorMsg;
    emit errorOccurred(QString("API Error: %1").arg(errorMsg));
}
