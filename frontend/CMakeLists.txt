cmake_minimum_required(VERSION 3.19)
project(frontend LANGUAGES CXX)

# Force UTF-8 encoding for MSVC to handle Scandinavian characters in file paths
if(MSVC)
    add_compile_options(/utf-8)
endif()

# Set Qt path if not already set (for Visual Studio)
if(NOT DEFINED CMAKE_PREFIX_PATH OR CMAKE_PREFIX_PATH STREQUAL "")
    # Try multiple Qt versions and compiler variants
    if(EXISTS "C:/Qt/6.9.3/msvc2022_64")
        set(CMAKE_PREFIX_PATH "C:/Qt/6.9.3/msvc2022_64")
    elseif(EXISTS "C:/Qt/6.9.3/msvc2019_64")
        set(CMAKE_PREFIX_PATH "C:/Qt/6.9.3/msvc2019_64")
    elseif(EXISTS "C:/Qt/6.8.5/msvc2022_64")
        set(CMAKE_PREFIX_PATH "C:/Qt/6.8.5/msvc2022_64")
    elseif(EXISTS "C:/Qt/6.8.3/msvc2022_64")
        set(CMAKE_PREFIX_PATH "C:/Qt/6.8.3/msvc2022_64")
    else()
        message(FATAL_ERROR 
            "Qt 6 not found! Please install Qt 6.2+ or set CMAKE_PREFIX_PATH manually.\n"
            "Expected locations checked:\n"
            "  - C:/Qt/6.9.3/msvc2022_64\n"
            "  - C:/Qt/6.9.3/msvc2019_64\n"
            "  - C:/Qt/6.8.5/msvc2022_64\n"
            "  - C:/Qt/6.8.3/msvc2022_64\n"
            "\nTo fix:\n"
            "  1. Install Qt from https://www.qt.io/download-qt-installer\n"
            "  2. Or set CMAKE_PREFIX_PATH to your Qt installation path\n"
            "     Example: cmake -DCMAKE_PREFIX_PATH=C:/Qt/6.9.3/msvc2022_64 ..")
    endif()
endif()

message(STATUS "Using Qt from: ${CMAKE_PREFIX_PATH}")

find_package(Qt6 6.2 REQUIRED COMPONENTS Core Widgets Network)

qt_standard_project_setup()

qt_add_executable(frontend
    WIN32 MACOSX_BUNDLE
    main.cpp
    mainwindow.cpp
    mainwindow.h
    mainwindow.ui
    apiclient.cpp
    apiclient.h
    customer.cpp
    customer.h
)

# Add API documentation files (not compiled, for reference only)
# These files are visible in both Visual Studio and Qt Creator for easy access
set(API_DOCS_FILE "${CMAKE_CURRENT_SOURCE_DIR}/api-docs.json")
set(API_REFERENCE_FILE "${CMAKE_CURRENT_SOURCE_DIR}/API_REFERENCE.md")

# Check and add OpenAPI specification
if(EXISTS "${API_DOCS_FILE}")
    message(STATUS "OpenAPI specification found: ${API_DOCS_FILE}")
else()
    message(WARNING "OpenAPI specification not found. Download from: https://pankki-api-dcb8eubhg5c5eya6.swedencentral-01.azurewebsites.net/api-docs.json")
endif()

# Check and add API reference guide
if(EXISTS "${API_REFERENCE_FILE}")
    message(STATUS "API reference guide found: ${API_REFERENCE_FILE}")
else()
    message(WARNING "API_REFERENCE.md not found in ${CMAKE_CURRENT_SOURCE_DIR}")
endif()

# Add documentation files to project (visible in IDE but not compiled)
if(EXISTS "${API_DOCS_FILE}" OR EXISTS "${API_REFERENCE_FILE}")
    set(DOC_FILES "")
    if(EXISTS "${API_DOCS_FILE}")
        list(APPEND DOC_FILES ${API_DOCS_FILE})
    endif()
    if(EXISTS "${API_REFERENCE_FILE}")
        list(APPEND DOC_FILES ${API_REFERENCE_FILE})
    endif()
    
    # Mark as header-only (not compiled)
    set_source_files_properties(${DOC_FILES} PROPERTIES HEADER_FILE_ONLY TRUE)
    
    # Add to target sources (visible in IDE project tree)
    target_sources(frontend PRIVATE ${DOC_FILES})
    
    message(STATUS "Added ${CMAKE_CURRENT_LIST_LINE} documentation file(s) to project")
endif()

target_link_libraries(frontend
    PRIVATE
        Qt::Core
        Qt::Widgets
        Qt::Network
)

# Automatically deploy Qt dependencies after build (for Visual Studio)
if(WIN32)
    add_custom_command(TARGET frontend POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E echo "Deploying Qt dependencies..."
        COMMAND ${CMAKE_COMMAND} -E make_directory $<TARGET_FILE_DIR:frontend>/platforms
        COMMAND ${CMAKE_COMMAND} -E make_directory $<TARGET_FILE_DIR:frontend>/tls
        COMMAND ${CMAKE_COMMAND} -E copy_if_different
            $<TARGET_FILE:Qt6::Core>
            $<TARGET_FILE_DIR:frontend>
        COMMAND ${CMAKE_COMMAND} -E copy_if_different
            $<TARGET_FILE:Qt6::Widgets>
            $<TARGET_FILE_DIR:frontend>
        COMMAND ${CMAKE_COMMAND} -E copy_if_different
            $<TARGET_FILE:Qt6::Gui>
            $<TARGET_FILE_DIR:frontend>
        COMMAND ${CMAKE_COMMAND} -E copy_if_different
            $<TARGET_FILE:Qt6::Network>
            $<TARGET_FILE_DIR:frontend>
        COMMAND ${CMAKE_COMMAND} -E copy_if_different
            ${Qt6_DIR}/../../../plugins/platforms/qwindows$<$<CONFIG:Debug>:d>.dll
            $<TARGET_FILE_DIR:frontend>/platforms/
        COMMAND ${CMAKE_COMMAND} -E copy_if_different
            ${Qt6_DIR}/../../../plugins/tls/qopensslbackend$<$<CONFIG:Debug>:d>.dll
            $<TARGET_FILE_DIR:frontend>/tls/
        COMMENT "Copying Qt runtime libraries and TLS plugin"
    )
    
    # Copy OpenSSL DLLs if they exist (required for HTTPS)
    set(OPENSSL_ROOT "C:/Program Files/OpenSSL-Win64/bin")
    if(EXISTS "${OPENSSL_ROOT}")
        add_custom_command(TARGET frontend POST_BUILD
            COMMAND ${CMAKE_COMMAND} -E echo "Deploying OpenSSL for HTTPS support..."
            COMMAND ${CMAKE_COMMAND} -E copy_if_different
                "${OPENSSL_ROOT}/libcrypto-3-x64.dll"
                $<TARGET_FILE_DIR:frontend>
            COMMAND ${CMAKE_COMMAND} -E copy_if_different
                "${OPENSSL_ROOT}/libssl-3-x64.dll"
                $<TARGET_FILE_DIR:frontend>
            COMMENT "Copying OpenSSL DLLs for TLS/SSL support"
        )
    else()
        message(WARNING "OpenSSL not found at ${OPENSSL_ROOT}. HTTPS will not work. Download from: https://slproweb.com/products/Win32OpenSSL.html")
    endif()
endif()

include(GNUInstallDirs)

install(TARGETS frontend
    BUNDLE  DESTINATION .
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
    LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
)

qt_generate_deploy_app_script(
    TARGET frontend
    OUTPUT_SCRIPT deploy_script
    NO_UNSUPPORTED_PLATFORM_ERROR
)
install(SCRIPT ${deploy_script})
