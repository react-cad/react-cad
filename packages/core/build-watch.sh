#!/bin/bash

if [ "$BUILD_WATCH" = "true" ]; then
  fswatch -o \
    --event Updated \
    /src/react-cad/src \
  | \
  while read event; do \
    emmake make install; \
  done \
fi
