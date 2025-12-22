# Bank ATM Frontend - Qt C++ Application

Qt Widgets desktop application for the ATM banking system.

## Technology Stack

- **Qt Version:** 6.8.5
- **Compiler:** MSVC 2022 (64-bit)
- **Build System:** CMake
- **Language:** C++17

## Project Structure

```
frontend/
├── CMakeLists.txt      # CMake build configuration
├── main.cpp            # Application entry point
├── mainwindow.h        # Main window header
├── mainwindow.cpp      # Main window implementation
├── mainwindow.ui       # Qt Designer UI file
└── README.md           # This file
```

## Backend API Connection

**Local Development:**
- API Base URL: `http://localhost:3000`
- API Documentation: `http://localhost:3000/api-docs`
- OpenAPI Spec: `http://localhost:3000/api-docs.json`

**Production:**
- API Base URL: `https://pankki-api-dcb8eubhg5c5eya6.swedencentral-01.azurewebsites.net`
- API Documentation: `https://pankki-api-dcb8eubhg5c5eya6.swedencentral-01.azurewebsites.net/api-docs`

## Building the Project

### Using Qt Creator
1. Open Qt Creator
2. File → Open File or Project → Select `CMakeLists.txt`
3. Configure kit: Qt 6.8.5 MSVC2022 64-bit
4. Build (Ctrl+B)
5. Run (Ctrl+R)

### Using Visual Studio 2026
1. Open Visual Studio 2026
2. File → Open → Folder → Select `frontend` folder
3. CMake will auto-configure
4. Build → Build All
5. Debug → Start Debugging (F5)

### Command Line (CMake)
```bash
cd frontend
mkdir build
cd build
cmake ..
cmake --build .
./frontend.exe
```

## Qt Modules Used

- **QtCore** - Core non-GUI functionality
- **QtWidgets** - GUI widgets
- **QtNetwork** - HTTP client for REST API calls (to be added)

## Development Plan

### Phase 1: Basic UI (Current)
- [x] Main window created
- [ ] ATM interface design
- [ ] PIN entry screen
- [ ] Balance display
- [ ] Transaction screens

### Phase 2: API Integration
- [ ] Add QtNetwork module
- [ ] Implement HTTP client for REST API
- [ ] Create data models (Customer, Account, Transaction)
- [ ] Connect UI to backend endpoints

### Phase 3: ATM Features
- [ ] Card insertion simulation
- [ ] PIN validation
- [ ] Balance inquiry
- [ ] Cash withdrawal
- [ ] Transaction history
- [ ] Receipt generation

## Code Generation from OpenAPI

To generate strongly-typed C++ client code from the backend API:

```bash
# Install openapi-generator
npm install -g @openapitools/openapi-generator-cli

# Generate Qt/C++ client
openapi-generator-cli generate \
  -i http://localhost:3000/api-docs.json \
  -g cpp-qt-client \
  -o generated/
```

This creates:
- Model classes (`Customer.h`, `Account.h`, etc.)
- API client classes (`CustomersApi.h`, etc.)
- JSON serialization helpers

## Team Development

**Backend Team:** Provides REST API endpoints
**Frontend Team:** Builds Qt UI and integrates with API

**Communication:**
- Use OpenAPI spec as the contract
- Backend changes → update API docs → frontend regenerates client
- Test with local backend first, then switch to Azure URL

## Testing

- Manual testing via Qt application
- Integration tests with local backend
- Production testing with Azure deployment

## Resources

- [Qt 6 Documentation](https://doc.qt.io/qt-6/)
- [Qt Widgets Examples](https://doc.qt.io/qt-6/qtwidgets-examples.html)
- [Qt Network Module](https://doc.qt.io/qt-6/qtnetwork-index.html)
- [Backend API Documentation](../backend/README.md)

---

**Last Updated:** December 22, 2025
