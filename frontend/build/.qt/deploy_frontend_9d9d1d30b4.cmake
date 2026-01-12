include("C:/Users/leipp/Documents/Tietotekniikka/ohjelmistokehityksen_sovellusprojekti/group_1/frontend/build/.qt/QtDeploySupport.cmake")
include("${CMAKE_CURRENT_LIST_DIR}/frontend-plugins.cmake" OPTIONAL)
set(__QT_DEPLOY_I18N_CATALOGS "qtbase")

qt6_deploy_runtime_dependencies(
    EXECUTABLE "C:/Users/leipp/Documents/Tietotekniikka/ohjelmistokehityksen_sovellusprojekti/group_1/frontend/build/frontend.exe"
    GENERATE_QT_CONF
)
