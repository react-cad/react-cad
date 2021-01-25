cmake_minimum_required(VERSION 3.5)

project(react-cad-core)

set(CMAKE_CXX_STANDARD 14)
set(APP_VERSION_MAJOR 1)
set(APP_VERSION_MINOR 0)
set(APP_TARGET react-cad-core)
set(APP_TARGET_ES6 react-cad-core.esm.js)

set(CMAKE_CXX_FLAGS_RELEASE "-O3")

INCLUDE_DIRECTORIES(${PROJECT_SOURCE_DIR})
file(GLOB SOURCES
  *.h
  *.cpp
)

# Open CASCADE Technology
find_package(OpenCASCADE REQUIRED NO_DEFAULT_PATH)
if(OpenCASCADE_FOUND)
  message (STATUS "Using OpenCASCADE from \"${OpenCASCADE_DIR}\"" )
  INCLUDE_DIRECTORIES(${OpenCASCADE_INCLUDE_DIR})
  LINK_DIRECTORIES(${OpenCASCADE_LIBRARY_DIR})
else()
  message(WARNING "Could not find OpenCASCADE, please set OpenCASCADE_DIR variable." )
  set(OCCT_LIBRARY_DIR)
  set(OCCT_BIN_DIR)
endif()

set(OpenCASCADE_LIBS TKRWMesh TKBinXCAF TKBin TKBinL TKOpenGl TKXCAF TKVCAF TKCAF TKV3d TKHLR TKMesh TKService TKShHealing TKOffset TKBool TKBO TKPrim TKTopAlgo TKGeomAlgo TKBRep TKGeomBase TKG3d TKG2d TKMath TKLCAF TKCDF TKernel)

add_executable(${APP_TARGET} ${SOURCES})
target_compile_definitions(${APP_TARGET} PRIVATE $<$<CONFIG:Debug>:REACTCAD_DEBUG>)
target_link_libraries(
  ${APP_TARGET}
  ${OpenCASCADE_LIBS}
)
set_target_properties(${APP_TARGET} PROPERTIES LINK_FLAGS "\
  --bind \
  -s EXTRA_EXPORTED_RUNTIME_METHODS=['ccall','cwrap'] \
  -s WASM=1 \
  -s MODULARIZE=1 \
  -s USE_WEBGL2=1 \
  -s USE_FREETYPE=1 \
  -s INITIAL_MEMORY=536870912 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s DISABLE_EXCEPTION_CATCHING=0 \
  -s NO_EXIT_RUNTIME=1 \
")

add_custom_command(
  TARGET ${APP_TARGET}
  POST_BUILD
  WORKING_DIRECTORY ${CMAKE_BINARY_DIR}
  COMMAND echo 'export default Module\;' | cat ${APP_TARGET}.js - > ${APP_TARGET_ES6}
)

install(TARGETS ${APP_TARGET} DESTINATION lib)
install(FILES "${CMAKE_BINARY_DIR}/${APP_TARGET}.wasm" "${CMAKE_BINARY_DIR}/${APP_TARGET_ES6}" DESTINATION lib)
