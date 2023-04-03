#ifndef Export_HeaderFile
#define Export_HeaderFile

#include "ReactCADNode.hpp"

#include "ProgressIndicator.hpp"

Handle(ProgressIndicator)
    renderSTL(Handle(ReactCADShape) shape, const Standard_Real theLinDeflection, const Standard_Real theAngDeflection);
Handle(ProgressIndicator) renderBREP(Handle(ReactCADShape) shape);
Handle(ProgressIndicator) renderSTEP(Handle(ReactCADShape) shape);

#endif
