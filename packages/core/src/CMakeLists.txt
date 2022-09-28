cmake_minimum_required(VERSION 3.5)

project(react-cad-core)

set(CMAKE_CXX_STANDARD 14)
set(APP_VERSION_MAJOR 1)
set(APP_VERSION_MINOR 0)
set(APP_TARGET react-cad-core)
set(APP_TARGET_ES6 react-cad-core.esm.js)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_CXX_FLAGS "-pthread -fexceptions")
set(CMAKE_CXX_FLAGS_RELEASE "-Oz")
set(CMAKE_CXX_FLAGS_DEBUG "-g3")

INCLUDE_DIRECTORIES(${PROJECT_SOURCE_DIR})
INCLUDE_DIRECTORIES(/usr/local/include)
file(GLOB SOURCES
  *.hpp
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

set(OpenCASCADE_LIBS TKSTL TKRWMesh TKOpenGl TKV3d TKHLR TKMesh TKService TKShHealing TKOffset TKBool TKBO TKPrim TKTopAlgo TKGeomAlgo TKBRep TKGeomBase TKG3d TKG2d TKMath TKernel TKXSBase TKSTEPBase TKSTEP TKSTEPAttr TKSTEP209)

add_executable(${APP_TARGET} ${SOURCES})
target_compile_definitions(${APP_TARGET} PRIVATE $<$<CONFIG:Debug>:REACTCAD_DEBUG>)
target_link_libraries(
  ${APP_TARGET}
  PRIVATE
  ${OpenCASCADE_LIBS}
)
set_target_properties(${APP_TARGET} PROPERTIES LINK_FLAGS "\
  -lembind \
  -fexceptions \
  -s EXPORTED_RUNTIME_METHODS=['FS','ccall','cwrap'] \
  -s EXPORTED_FUNCTIONS=['_main','_shutdown'] \
  -s WASM=1 \
  -s WASM_BIGINT=1 \
  -s MODULARIZE=1 \
  -s USE_WEBGL2=1 \
  -s USE_FREETYPE=1 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s EXIT_RUNTIME=0 \
  -s PTHREAD_POOL_SIZE=1 \
  -s USE_PTHREADS=1 \
  -s EXPORT_NAME=reactCad \
  -s OFFSCREEN_FRAMEBUFFER=1 \
  -s EXCEPTION_CATCHING_ALLOWED=['RevolutionNode::computeShape'] \
")

set_target_properties(${APP_TARGET} PROPERTIES LINK_FLAGS_RELEASE "\
  -Oz \
")
set_target_properties(${APP_TARGET} PROPERTIES LINK_FLAGS_DEBUG "\
  -s EXCEPTION_DEBUG=1 \
  -g3 \
  -gsourcemap \
  --source-map-base 'http://localhost:6006/' \
")


add_custom_command(
  TARGET ${APP_TARGET}
  POST_BUILD
  WORKING_DIRECTORY ${CMAKE_BINARY_DIR}
  COMMAND echo 'export default reactCad\;' | cat ${APP_TARGET}.js - > ${APP_TARGET_ES6}
)

install(TARGETS ${APP_TARGET} DESTINATION lib)
install(FILES "${CMAKE_BINARY_DIR}/${APP_TARGET}.worker.js" "${CMAKE_BINARY_DIR}/${APP_TARGET}.wasm" "${CMAKE_BINARY_DIR}/${APP_TARGET_ES6}" DESTINATION lib)
