# Bank ATM Frontend - Qt C++ Application

**Qt Widgets desktop application for ATM banking system**  
**Part of OAMK Software Development Application Project (Spring 2026)**

---

## ✅ Current Status (Week 2)

### Completed Features
- ✅ Qt 6.8.5 project setup with CMake
- ✅ Visual Studio 2026 & Qt Creator compatibility
- ✅ HTTPS/TLS support with OpenSSL
- ✅ REST API client (`ApiClient` class)
- ✅ Customer data model with JSON serialization
- ✅ Connected to Azure MySQL via backend API
- ✅ API connection test UI
- ✅ UTF-8 support for Scandinavian characters (å, ä, ö)

### Week 3 In Progress
- 🔄 Account data model
- 🔄 Card data model (without authentication)
- 🔄 Transaction data model
- 🔄 ATM user interface design

### Week 4 Planned
- 📋 JWT authentication flow
- 📋 Card insertion screen
- 📋 PIN entry screen
- 📋 Token management
- 📋 Protected API requests

---

## 🛠️ Technology Stack

- **Qt Version:** 6.8.5
- **Compiler:** MSVC 2022 (64-bit)
- **Build System:** CMake 3.19+
- **Language:** C++17
- **IDE:** Visual Studio 2026 Professional / Qt Creator
- **Network:** Qt Network module with OpenSSL 3.x
- **API:** REST client for Azure-hosted backend

---

## 📁 Project Structure

```
frontend/
├── CMakeLists.txt          # CMake build configuration
├── CMakePresets.json       # VS/Qt Creator presets
├── main.cpp                # Application entry point
├── mainwindow.h/cpp        # Main window (test UI)
├── mainwindow.ui           # Qt Designer UI file
├── apiclient.h/cpp         # REST API HTTP client
├── customer.h/cpp          # Customer data model
└── README.md               # This file
```

---

## 🚀 Quick Start

### Prerequisites
1. **Qt 6.8.5** installed at `C:\Qt\6.8.5\msvc2022_64\`
2. **Visual Studio 2026 Professional** with Qt Tools extension
3. **OpenSSL 3.x** installed (for HTTPS): [Download here](https://slproweb.com/products/Win32OpenSSL.html)

### Building & Running

#### Visual Studio 2026
1. Open Visual Studio 2026
2. **File → Open → Folder** → Select `frontend` folder
3. CMake will auto-configure (wait for it to finish)
4. Select configuration: **vs-debug** or **vs-release**
5. **Build → Build All** (Ctrl+Shift+B)
6. **Debug → Start Debugging** (F5)

#### Qt Creator
1. Open Qt Creator
2. **File → Open File or Project** → Select `CMakeLists.txt`
3. Configure kit: **Qt 6.8.5 MSVC2022 64-bit**
4. **Build** (Ctrl+B)
5. **Run** (Ctrl+R)

---

## 🔌 Backend API Connection

### Production (Azure)
- **API Base URL:** `https://pankki-api-dcb8eubhg5c5eya6.swedencentral-01.azurewebsites.net`
- **Health Check:** `/health`
- **Customers API:** `/api/customers`
- **API Docs:** `/api-docs`
- **OpenAPI Spec:** `/api-docs.json`

### Local Development
- **API Base URL:** `http://localhost:3000`
- Switch in code: `apiClient->setBaseUrl("http://localhost:3000");`

---

## 📦 Qt Modules & Dependencies

### Qt Modules
- **QtCore** - Core non-GUI functionality
- **QtWidgets** - GUI widgets
- **QtNetwork** - HTTP client for REST API

### External Dependencies
- **OpenSSL 3.x** - Required for HTTPS/TLS connections to Azure
  - DLLs: `libssl-3-x64.dll`, `libcrypto-3-x64.dll`
  - Qt Plugin: `qopensslbackend.dll`
  - ✅ Automatically deployed by CMake during build

---

## 🏗️ Architecture

### API Client Pattern
```cpp
// Singleton API client
ApiClient *api = new ApiClient(this);

// Connect signals
connect(api, &ApiClient::customersReceived, 
        this, &MainWindow::onCustomersReceived);

// Make async requests
api->getAllCustomers();
api->getCustomerById(1);
api->createCustomer(customer);
```

### Data Models
```cpp
Customer customer;
customer.setFirstName("Matti");
customer.setLastName("Meikäläinen");
customer.setAddress("Torikatu 10, 90100 Oulu");

QJsonObject json = customer.toJson(); // Serialize
Customer loaded(json);                 // Deserialize
```

---

## 🧪 Testing the API Connection

1. **Run the application** (F5)
2. **Click "1. Health Check (Quick Test)"**
   - ✅ Should show: "Status: OK"
   - ⏱️ Takes 30-60s on first request (Azure cold start)
3. **Click "2. Get All Customers (Full Test)"**
   - ✅ Should display customer list from Azure MySQL
   - Shows: ID, Name, Address, Created date

---

## 🔧 Troubleshooting

### TLS/SSL Errors
**Error:** `qt.network.ssl: No functional TLS backend was found`

**Solution:**
1. Install OpenSSL: [Win64 OpenSSL v3.x Light](https://slproweb.com/products/Win32OpenSSL.html)
2. Rebuild project (CMake auto-copies DLLs)
3. Verify files exist in `out/build/vs-debug/`:
   - `libssl-3-x64.dll`
   - `libcrypto-3-x64.dll`
   - `tls/qopensslbackendd.dll`

### CMake Configuration Issues
**Error:** Cannot find Qt6

**Solution:**
- Verify Qt is installed at `C:\Qt\6.8.5\msvc2022_64\`
- Or update path in `CMakeLists.txt` line 6
- Reconfigure: **Project → Delete Cache and Reconfigure**

### Missing DLLs at Runtime
**Error:** Application won't start

**Solution:**
- CMake post-build commands should auto-copy DLLs
- Rebuild project (Ctrl+Shift+B)
- Check `out/build/vs-debug/` for Qt DLLs

---

## 🎯 Development Roadmap

### Phase 1: Core Infrastructure ✅ (Complete)
- [x] Qt project setup
- [x] CMake configuration for VS 2026
- [x] HTTPS/TLS with OpenSSL
- [x] REST API client
- [x] Customer data model
- [x] Azure API integration

### Phase 2: ATM UI (In Progress)
- [ ] PIN entry screen
- [ ] Card insertion simulation
- [ ] Balance inquiry screen
- [ ] Cash withdrawal interface
- [ ] Transaction history view

### Phase 3: Backend Integration
- [ ] Account data model
- [ ] Card data model  
- [ ] Transaction data model
- [ ] PIN validation API calls
- [ ] Balance inquiry API calls
- [ ] Withdrawal API calls

### Phase 4: Advanced Features
- [ ] Receipt generation
- [ ] Transaction browsing
- [ ] Card locking after failed PINs
- [ ] Dual card support
- [ ] Custom withdrawal amounts

---

## 📚 Resources

- [Qt 6.8 Documentation](https://doc.qt.io/qt-6/)
- [Qt Network Module](https://doc.qt.io/qt-6/qtnetwork-index.html)
- [CMake Documentation](https://cmake.org/documentation/)
- [Backend API (Parent README)](../README.md)
- [OpenAPI Specification](https://pankki-api-dcb8eubhg5c5eya6.swedencentral-01.azurewebsites.net/api-docs.json)

---

## 👥 Team

- **Frontend Team:** Qt UI development & API integration
- **Backend Team:** Node.js REST API & Azure MySQL

---

**Last Updated:** December 22, 2025  
**Status:** ✅ API Connection Working | 🔄 UI Development In Progress
