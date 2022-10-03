#ifndef MeshTools_HeaderFile
#define MeshTools_HeaderFile

#include <Message_ProgressRange.hxx>
#include <Poly_Triangulation.hxx>
#include <TopoDS_Shape.hxx>

TopoDS_Shape shapeFromMesh(Handle(Poly_Triangulation) mesh,
                           const Message_ProgressRange &theRange = Message_ProgressRange());

#endif
