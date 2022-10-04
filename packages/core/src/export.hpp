#ifndef Export_HeaderFile
#define Export_HeaderFile

#include "ReactCADNode.hpp"

#include "ProgressIndicator.hpp"

Handle(ProgressIndicator) renderSTL(const Handle(ReactCADNode) & node, const Standard_Real theLinDeflection,
                                    const Standard_Real theAngDeflection);
Handle(ProgressIndicator) renderBREP(const Handle(ReactCADNode) & node);
Handle(ProgressIndicator) renderSTEP(const Handle(ReactCADNode) & node);

#endif
