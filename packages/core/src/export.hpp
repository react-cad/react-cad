#ifndef Export_HeaderFile
#define Export_HeaderFile

#include "ReactCADNode.hpp"
#include <emscripten/val.h>

emscripten::val renderSTL(const Handle(ReactCADNode) & node, const Standard_Real theLinDeflection,
                          const Standard_Boolean isRelative, const Standard_Real theAngDeflection);
emscripten::val renderBREP(const Handle(ReactCADNode) & node);
emscripten::val renderSTEP(const Handle(ReactCADNode) & node);

#endif
