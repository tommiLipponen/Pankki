cmake_minimum_required(VERSION 3.19)
project(frontend LANGUAGES CXX)

# Set Qt path if not already set (for Visual Studio)
if(NOT DEFINED CMAKE_PREFIX_PATH OR CMAKE_PREFIX_PATH STREQUAL "")
    if(EXISTS "C:/Qt/6.8.5/msvc2022_64")
        set(CMAKE_PREFIX_PATH "C:/Qt/6.8.5/msvc2022_64")
    endif()
endif()

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
