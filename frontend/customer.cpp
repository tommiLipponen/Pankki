/**
 * customer.cpp - Customer data model implementation
 * 
 * Handles JSON serialization/deserialization for Customer entities
 * Compatible with backend API JSON format
 */

#include "customer.h"
#include <QJsonDocument>

/**
 * Default constructor
 * Initializes customer with invalid ID (0)
 */
Customer::Customer()
    : m_id(0)
{
}

/**
 * JSON constructor
 * Creates customer from JSON object received from API
 * 
 * @param json - JSON object from API response
 */
Customer::Customer(const QJsonObject &json)
{
    fromJson(json);
}

/**
 * Serialize customer to JSON
 * Converts customer data to JSON format for API requests
 * 
 * @return QJsonObject - Customer data in JSON format
 * 
 * Note: Only includes ID if > 0 (for updates, not creation)
 *       Only includes timestamps if valid (API manages these)
 */
QJsonObject Customer::toJson() const
{
    QJsonObject json;
    
    // ID only included for existing customers (updates)
    if (m_id > 0) {
        json["id"] = m_id;
    }
    
    // Required fields - always included
    json["firstName"] = m_firstName;
    json["lastName"] = m_lastName;
    json["address"] = m_address;
    
    // Timestamps - only if set (API manages these server-side)
    if (m_createdAt.isValid()) {
        json["createdAt"] = m_createdAt.toString(Qt::ISODate);
    }
    if (m_updatedAt.isValid()) {
        json["updatedAt"] = m_updatedAt.toString(Qt::ISODate);
    }
    
    return json;
}

/**
 * Deserialize customer from JSON
 * Parses JSON object from API response into customer properties
 * 
 * @param json - JSON object from API response
 * 
 * Handles:
 * - Missing fields (uses defaults)
 * - ISO 8601 timestamp parsing
 * - UTF-8 encoded strings (Finnish characters: å, ä, ö)
 */
void Customer::fromJson(const QJsonObject &json)
{
    m_id = json["id"].toInt();
    m_firstName = json["firstName"].toString();
    m_lastName = json["lastName"].toString();
    m_address = json["address"].toString();
    
    // Parse ISO 8601 timestamps from API
    QString createdAtStr = json["createdAt"].toString();
    if (!createdAtStr.isEmpty()) {
        m_createdAt = QDateTime::fromString(createdAtStr, Qt::ISODate);
    }
    
    QString updatedAtStr = json["updatedAt"].toString();
    if (!updatedAtStr.isEmpty()) {
        m_updatedAt = QDateTime::fromString(updatedAtStr, Qt::ISODate);
    }
}

/**
 * Validate customer data
 * Checks if customer has minimum required fields for API operations
 * 
 * @return bool - true if customer has all required fields
 * 
 * Required fields:
 * - firstName (non-empty)
 * - lastName (non-empty)
 * - address (non-empty)
 * 
 * Note: ID and timestamps are optional (managed by API)
 */
bool Customer::isValid() const
{
    return !m_firstName.isEmpty() && 
           !m_lastName.isEmpty() && 
           !m_address.isEmpty();
}
