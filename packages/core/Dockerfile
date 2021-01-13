FROM reactcad/build:7.5.0

COPY . /src/react-cad

RUN mkdir /src/react-cad-build
WORKDIR /src/react-cad-build

RUN emcmake cmake /src/react-cad/src -DOpenCASCADE_DIR=/usr/local/lib/cmake/opencascade && chmod -R a+wrx /src/react-cad-build

VOLUME /src/react-cad

CMD emmake make install; /src/react-cad/build-watch.sh
