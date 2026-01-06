/**
 * Customer - Data model for bank customer
 * 
 * Represents a customer entity from the Bank ATM API
 * Maps to the Customer schema in the OpenAPI specification
 */

#ifndef CUSTOMER_H
#define CUSTOMER_H

#include <QString>
#include <QDateTime>
#include <QJsonObject>

class Customer
{
public:
    Customer();
    Customer(const QJsonObject &json);
    
    // Getters
    int getId() const { return m_id; }
    QString getFirstName() const { return m_firstName; }
    QString getLastName() const { return m_lastName; }
    QString getAddress() const { return m_address; }
    QDateTime getCreatedAt() const { return m_createdAt; }
    QDateTime getUpdatedAt() const { return m_updatedAt; }
    
    // Setters
    void setId(int id) { m_id = id; }
    void setFirstName(const QString &firstName) { m_firstName = firstName; }
    void setLastName(const QString &lastName) { m_lastName = lastName; }
    void setAddress(const QString &address) { m_address = address; }
    void setCreatedAt(const QDateTime &createdAt) { m_createdAt = createdAt; }
    void setUpdatedAt(const QDateTime &updatedAt) { m_updatedAt = updatedAt; }
    
    // Helper methods
    QString getFullName() const { return m_firstName + " " + m_lastName; }
    QJsonObject toJson() const;
    void fromJson(const QJsonObject &json);
    bool isValid() const;

private:
    int m_id;
    QString m_firstName;
    QString m_lastName;
    QString m_address;
    QDateTime m_createdAt;
    QDateTime m_updatedAt;
};

#endif // CUSTOMER_H
