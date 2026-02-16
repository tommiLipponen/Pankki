# Bank ATM Frontend - Qt C++ Application

**Production-ready Qt Widgets desktop application for ATM banking system**  
**OAMK Software Development Application Project (Spring 2025) - Group 1**

---

## ✅ Current Status - PRODUCTION READY (January 2025)

### 🎉 Complete ATM System Implementation

#### ✨ Frontend Features
- ✅ **Full ATM UI** - 6-page stacked widget interface with pink gradient theme
- ✅ **Card Authentication** - 16-digit card number validation with Azure MySQL lookup
- ✅ **JWT Authentication** - bcrypt PIN hashing + 1-hour token expiry
- ✅ **Session Management** - 10s PIN timer, 30s dashboard timer with user activity tracking
- ✅ **Withdrawal System** - MySQL stored procedure (`withdraw_money`) with ACID guarantees
- ✅ **Transaction History** - Client-side pagination (10 transactions per page)
- ✅ **Dual-Mode Cards** - DEBIT & CREDIT support with credit limit calculations
- ✅ **Quick Withdrawals** - Preset buttons (€20, €50, €90, €140, €200)
- ✅ **Real-Time Status** - Azure backend connection health monitoring (30s polling)
- ✅ **Pink Theme** - Custom gradient design (#FFE5EC → #FFC9DE)

#### 📚 Technical Documentation
- ✅ Component Architecture Diagram (Mermaid flowcharts)
- ✅ Component Descriptions (7 components with UML class diagrams)
- ✅ UI State Diagram (6 pages with session flow)
- ✅ OpenAPI 3.0 Specification (5 REST API endpoints)

---

## 🛠️ Technology Stack

### Frontend
- **Qt Version:** 6.8.1 (Widgets)
- **Compiler:** MSVC 2022 (64-bit)
- **Build System:** CMake 3.16+ (Ninja generator)
- **Language:** C++17
- **IDE:** Visual Studio 2022 Professional / Qt Creator
- **Network:** Qt Network module with OpenSSL 3.x
- **UI Components:** QStackedWidget, QTableWidget, QNetworkAccessManager

### Backend
- **Runtime:** Node.js 20.x
- **Framework:** Express 4.x
- **ORM:** Prisma + MySQL2 Pool (hybrid approach)
- **Database:** Azure MySQL 8.0 (Sweden Central)
- **Authentication:** JWT (jsonwebtoken) + bcrypt
- **Deployment:** Azure App Service (Basic B1 tier)

---

## 📁 Project Structure

```
frontend/
├── CMakeLists.txt          # CMake build configuration
├── CMakePresets.json       # VS/Qt Creator presets
├── main.cpp                # Application entry point
├── mainwindow.h/cpp        # Main window + 6-page ATM UI
├── mainwindow.ui           # Qt Designer UI file (QStackedWidget)
├── apiclient.h/cpp         # REST API HTTP client (JWT support)
├── customer.h/cpp          # Customer data model
├── transactionmanager.h/cpp # Transaction pagination helper
├── docs/
│   ├── component-diagram.md      # System architecture diagrams
│   ├── component-descriptions.md # Component details with UML
│   ├── ui-description.md         # UI state diagram
│   └── api-specification.md      # OpenAPI 3.0 spec
├── TEST_CREDENTIALS.md     # Test card numbers + PINs
└── README.md               # This file
```

---

## 🚀 Quick Start

### Prerequisites
1. **Qt 6.8.1** installed at `C:\Qt\6.8.1\msvc2022_64\`
2. **Visual Studio 2022** with Qt Tools extension
3. **OpenSSL 3.x** installed (for HTTPS): [Download here](https://slproweb.com/products/Win32OpenSSL.html)

### Building & Running

#### Visual Studio 2022
1. Open Visual Studio 2022
2. **File → Open → Folder** → Select `frontend` folder
3. CMake will auto-configure (wait for it to finish)
4. Select configuration: **vs-debug** or **vs-release**
5. **Build → Build All** (Ctrl+Shift+B)
6. **Debug → Start Debugging** (F5)

#### Qt Creator
1. Open Qt Creator
2. **File → Open File or Project** → Select `CMakeLists.txt`
3. Configure kit: **Qt 6.8.1 MSVC2022 64-bit**
4. **Build** (Ctrl+B)
5. **Run** (Ctrl+R)

---

## 🔌 Backend API Connection

### Production (Azure)
- **API Base URL:** `https://bank-atm-backend-h5bybufaegbnbvaf.swedencentral-01.azurewebsites.net`
- **Health Check:** `GET /health`
- **Card Authentication:** `POST /api/cards/authenticate`
- **PIN Verification:** `POST /api/auth/verify-pin` (returns JWT token)
- **Withdraw Cash:** `POST /api/transactions/withdraw` (JWT required)
- **Transaction History:** `GET /api/transactions/account/:id` (JWT required)
- **API Documentation:** See `docs/api-specification.md`

### Local Development
- **API Base URL:** `http://localhost:3000`
- Switch in code: `apiClient->setBaseUrl("http://localhost:3000");`

---

## 📦 Qt Modules & Dependencies

### Qt Modules
- **QtCore** - Core non-GUI functionality
- **QtWidgets** - GUI widgets (QStackedWidget, QTableWidget, QLabel, etc.)
- **QtNetwork** - HTTP client for REST API (QNetworkAccessManager)

### External Dependencies
- **OpenSSL 3.x** - Required for HTTPS/TLS connections to Azure
  - DLLs: `libssl-3-x64.dll`, `libcrypto-3-x64.dll`
  - Qt Plugin: `qopensslbackend.dll`
  - ✅ Automatically deployed by CMake during build

---

## 🏗️ Architecture

### 6-Page ATM Interface (QStackedWidget)
```
Index 0: Insert Card Page - Card number entry
Index 1: PIN Entry Page - PIN + card mode selection (10s session timer)
Index 2: Dashboard - Main menu (30s session timer)
Index 3: Balance View - Account balance display
Index 4: Transaction History - Paginated transaction table
Index 5: Withdraw Cash - Custom amount + quick buttons
```

### API Client Pattern (Asynchronous)
```cpp
// Create API client
ApiClient *apiClient = new ApiClient(this);

// Connect signals for card authentication
connect(apiClient, &ApiClient::insertCardSuccess, 
        this, &MainWindow::onInsertCardSuccess);

// Connect signals for JWT-authenticated requests
connect(apiClient, &ApiClient::verifyPinSuccess, 
        this, &MainWindow::onVerifyPinSuccess);

// Make async requests
apiClient->insertCard("1234567890123456");
apiClient->verifyPin(cardNumber, "1234", "DEBIT");
apiClient->withdrawMoney(50.0, jwtToken);
```

### Session Management
```cpp
// Start 10-second timer on PIN page
startSessionTimer(10);

// Start 30-second timer on dashboard
startSessionTimer(30);

// User activity resets timer
connect(ui->pinNumberEdit, &QLineEdit::textEdited, 
        this, &MainWindow::onUserActivity);

// Timeout triggers auto-logout
void MainWindow::onSessionTimeout() {
    QMessageBox::information(this, "Session Timeout", 
        "Your session has expired due to inactivity.");
    resetSession(); // Return to Insert Card page
}
```

---

## 🧪 Testing the ATM Application

### Step 1: Insert Card
Run the application and enter a test card number:

**Recommended Test Cards:**
- **Basic DEBIT Card:** `1234567890123456`
  - Balance: €1,500.00
  - PIN: 1234
  - Mode: DEBIT only

- **Dual-Mode Card:** `1234567890123457`
  - Balance: €500.00
  - Credit Limit: €1,000.00
  - PIN: 1234
  - Modes: DEBIT or CREDIT

**📖 Full Test Credentials:** See `TEST_CREDENTIALS.md` for 10+ test cards

### Step 2: Enter PIN & Select Mode
1. **PIN:** Enter `1234` (4 digits required)
2. **Mode:** Select DEBIT or CREDIT (if available)
3. **Session Timer:** Visible in header (10s countdown, resets on activity)
4. **Click:** "VERIFY PIN ✓"

### Step 3: Use ATM Features

#### Dashboard (Main Menu)
✅ **Username:** Matti Meikäläinen  
✅ **Balance Display:**
- DEBIT mode: `€1,500.00`
- CREDIT mode: `Debit €500.00 / Credit Limit €1,000.00 / Available €1,500.00`

✅ **Session Timer:** 30 seconds (visible in header)  
✅ **Action Buttons:**
- 💰 Check Balance
- 📜 Transaction History
- 💵 Withdraw Cash
- 🚪 Logout

#### Check Balance
- View detailed balance breakdown
- CREDIT mode shows three lines (Debit, Credit Limit, Available)

#### Transaction History
- 10 transactions per page
- Columns: Type, Amount, Balance After, Date
- Navigation: ◄ Previous | Next ►

#### Withdraw Cash
- **Quick Buttons:** €20, €50, €90, €140, €200
- **Custom Amount:** Enter any amount
- **Validation:** Client-side (amount > 0) + Server-side (sufficient funds)
- **Success:** Shows new balance, auto-returns to dashboard

### Expected Behavior

✅ **After successful login:**
- Dashboard displays username, balance, account number, card mode
- Session timer starts (30s, resets on any interaction)
- Pink gradient background (#FFE5EC → #FFC9DE)

✅ **After withdrawal:**
- Balance updates in real-time
- Success dialog shows withdrawn amount + new balance
- Returns to dashboard automatically
- Transaction appears in history

✅ **On session timeout:**
- Dialog: "Your session has expired due to inactivity"
- Auto-logout, return to Insert Card page
- All session data cleared


---

## 🎨 Pink Theme Design

### Color Palette
```css
/* Main gradient background */
#FFE5EC → #FFC9DE (diagonal gradient)

/* Pink theme colors */
Primary:   #FFB6D9 (light pink - buttons)
Secondary: #FF85C0 (medium pink - hover states)
Accent:    #FF5CAA (dark pink - pressed states)
Text:      #B85C8A (pink-brown - titles)
SubText:   #9D4E6F (dark pink-purple - data)
Badge:     #FF85C0 (medium pink - card mode)
Error:     #E91E63 (pink-red - error messages)

/* Input fields */
Background: #FFF0F5 (very light pink)
Border:     #FFB6D9
Focus:      #FF85C0 (3px)

/* Buttons */
Primary:    Gradient (#FFB6D9 → #FF85C0)
Secondary:  Outlined #FFB6D9, transparent background
Cancel:     Light background, #FFB6D9 border
```

### Typography
- **Font:** Segoe UI
- **Sizes:** 22pt (title), 18pt (headers), 14pt (buttons), 12pt (body), 11-14pt (errors)
- **Weights:** 700 (bold), 600 (semi-bold), normal

### UI Components
- **Border Radius:** 15-27px (rounded corners)
- **Button Height:** 50px minimum
- **Header Height:** 50px fixed
- **Session Timer:** Top-right corner, pink text

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
- Verify Qt is installed at `C:\Qt\6.8.1\msvc2022_64\`
- Or update path in `CMakeLists.txt` line 6
- Reconfigure: **Project → Delete Cache and Reconfigure**

### Missing DLLs at Runtime
**Error:** Application won't start

**Solution:**
- CMake post-build commands should auto-copy DLLs
- Rebuild project (Ctrl+Shift+B)
- Check `out/build/vs-debug/` for Qt DLLs

### Azure Cold Start (First Request Slow)
**Symptom:** First API request takes 30-60 seconds

**Explanation:** Azure Basic B1 tier goes to sleep after 20 minutes of inactivity. The first request wakes up the server.

**Solution:** 
- Wait for initial request to complete
- Subsequent requests are fast (~50-200ms)
- Health check polling (every 30s) keeps server awake

### Session Timeout Too Fast
**Symptom:** Session expires unexpectedly

**Explanation:** 10s on PIN page, 30s on dashboard. User activity resets timer.

**Solution:**
- Any button click, text input, or navigation resets the timer
- Adjust timeout in `startSessionTimer(seconds)` if needed for testing

---

## 🎯 Development Roadmap

### ✅ Phase 1-3: COMPLETE (January 2025)
- [x] Qt 6.8.1 project setup with CMake
- [x] HTTPS/TLS with OpenSSL 3.x
- [x] REST API client with JWT authentication
- [x] Customer, Account, Card, Transaction data models
- [x] Full ATM UI with pink gradient theme
- [x] 6-page QStackedWidget interface
- [x] Session management (10s PIN, 30s dashboard)
- [x] MySQL stored procedure withdrawals (`withdraw_money`)
- [x] Transaction history with client-side pagination
- [x] Dual-mode card support (DEBIT/CREDIT)
- [x] Quick withdraw buttons (€20-€200)
- [x] Real-time connection status indicator
- [x] Technical specification documentation (4 docs)

### 🚧 Phase 4: Optional Enhancements (Future)
- [ ] Receipt generation (PDF export via QPrinter)
- [ ] Card locking after 3 failed PIN attempts (backend logic exists)
- [ ] Multi-language support (Finnish + English)
- [ ] Accessibility features (screen reader, high contrast mode)
- [ ] Deposit functionality
- [ ] PIN change feature
- [ ] Transaction filtering by date range

---

## 👥 Team

**Development Team (Group 1):**
- **Tommi Lipponen** - Backend architecture, MySQL stored procedures, JWT authentication, Azure deployment
- **Tommy Näsänen** - ApiClient implementation, Express routing, card/PIN validation endpoints
- **Iisa Metsola** - TransactionManager, frontend-backend integration, balance calculations
- **Topi Pietilänaho** - MainWindow UI design, pink theme styling, session management, QStackedWidget

**Course:** Software Development Application Project (Spring 2025)  
**Institution:** Oulu University of Applied Sciences (OAMK)

---

## 📚 Resources

### Project Documentation
- [Test Credentials](TEST_CREDENTIALS.md) - 10+ test cards with PINs
- [Component Diagram](docs/component-diagram.md) - System architecture (Mermaid)
- [Component Descriptions](docs/component-descriptions.md) - 7 components with UML
- [UI State Diagram](docs/ui-description.md) - 6-page navigation flow
- [OpenAPI 3.0 Spec](docs/api-specification.md) - REST API documentation

### External Resources
- [Qt 6.8 Documentation](https://doc.qt.io/qt-6/)
- [Qt Network Module](https://doc.qt.io/qt-6/qtnetwork-index.html)
- [Qt Widgets](https://doc.qt.io/qt-6/qtwidgets-index.html)
- [CMake Documentation](https://cmake.org/documentation/)
- [OpenSSL Downloads](https://slproweb.com/products/Win32OpenSSL.html)

### Backend Stack
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [Azure App Service](https://azure.microsoft.com/en-us/services/app-service/)
- [Azure MySQL](https://azure.microsoft.com/en-us/services/mysql/)

---

## 📄 License

This project is for educational purposes as part of OAMK Software Development Application Project.

---

## 🐛 Known Issues

1. **Transaction Table Row Clipping** - Vertical header styling applied to fix row number visibility
2. **Duplicate atmSerialLabel** - Harmless UI bug (added twice in header layout, but only renders once)
3. **Azure Cold Start** - First request takes 30-60s (Azure Basic B1 limitation, not a bug)

---

## 🔐 Security Notes

### Production Considerations
- ✅ JWT tokens expire after 1 hour
- ✅ bcrypt PIN hashing (cost factor: 10)
- ✅ HTTPS/TLS for all API communication
- ✅ SQL injection prevention (Prisma ORM + Stored Procedures)
- ✅ Session timeout prevents unattended access
- ⚠️ **CORS:** Currently allows all origins (set to specific domain in production)
- ⚠️ **Rate Limiting:** Not implemented (consider adding for production)

### Test Environment
- All test credentials are **public** for educational purposes
- Do **NOT** use real financial data in this system
- Backend is configured for testing, not production financial transactions

---

**Last Updated:** January 21, 2025  
**Status:** ✅ PRODUCTION READY | 🎓 School Project Complete  
**Version:** 1.0.0  
**GitHub:** [25kmo-project/group_1](https://github.com/25kmo-project/group_1)
