FROM react-cad/build:latest

COPY . /src/react-cad

RUN mkdir /src/react-cad-build
WORKDIR /src/react-cad-build

RUN emcmake cmake /src/react-cad/src/cpp -DOpenCASCADE_DIR=/usr/local/lib/cmake/opencascade && chmod -R a+wrx /src/react-cad-build

VOLUME /src/react-cad

CMD emmake make install && fswatch -o --event Updated /src/react-cad/src/cpp | while read event; read event; do emmake make install; done
