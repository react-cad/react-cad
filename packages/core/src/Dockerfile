FROM emscripten/emsdk:2.0.10

RUN apt-get update \
  && apt-get -y install tk-dev tcl-dev fswatch

RUN git clone --branch VER-2-10-4 --depth 1 https://git.savannah.gnu.org/git/freetype/freetype2.git freetype \
  && cd freetype\
  && mkdir build \
  && cd build \
  && emcmake cmake .. \
  && emmake make install

RUN git clone --branch V7_5_0 --depth 1 https://git.dev.opencascade.org/repos/occt.git occt \
  && cd occt \
  && mkdir build \
  && cd build \
  && emcmake cmake .. \
    -DBUILD_LIBRARY_TYPE=Static \
    -DBUILD_MODULE_Draw=0 \
    -DCMAKE_CXX_FLAGES="-s USE_FREETYPE=1" \
    -D3RDPARTY_TK_INCLUDE_DIR=/usr/include/tk \
    -D3RDPARTY_FREETYPE_INCLUDE_DIR_ft2build=/usr/local/include/freetype2 \
    -D3RDPARTY_FREETYPE_INCLUDE_DIR_freetype2=/usr/local/include \
  && emmake make -j`nproc` install
