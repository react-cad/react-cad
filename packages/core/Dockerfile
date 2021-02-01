FROM emscripten/emsdk:2.0.10

RUN apt-get update && apt-get -y install tk-dev tcl-dev

RUN git clone --branch VER-2-10-4 --depth 1 https://git.savannah.gnu.org/git/freetype/freetype2.git freetype
RUN mkdir freetype/build
RUN cd freetype/build && emcmake cmake ..
RUN cd freetype/build && emmake make install

RUN git clone --branch V7_5_0 --depth 1 https://git.dev.opencascade.org/repos/occt.git occt
RUN mkdir occt/build
RUN cd occt/build && emcmake cmake .. \
  -DBUILD_LIBRARY_TYPE=Static \
  -DBUILD_MODULE_Draw=0 \
  -DCMAKE_CXX_FLAGS="-s USE_FREETYPE=1" \
  -D3RDPARTY_TK_INCLUDE_DIR=/usr/include/tk \
  -D3RDPARTY_FREETYPE_INCLUDE_DIR_ft2build=/usr/local/include/freetype2 \
  -D3RDPARTY_FREETYPE_INCLUDE_DIR_freetype2=/usr/local/include \
  -DCMAKE_INSTALL_PREFIX=/opt/occt
RUN cd occt/build && emmake make -j`nproc` install

FROM emscripten/emsdk:2.0.10

RUN apt-get update && apt-get -y install tk-dev tcl-dev fswatch
COPY --from=0 /opt/occt /opt/occt
COPY --from=0 /emsdk/upstream/emscripten/cache /emsdk/upstream/emscripten/cache

RUN mkdir /react-cad
WORKDIR /react-cad
