#ifndef MeshTools_HeaderFile
#define MeshTools_HeaderFile

#include <Message_ProgressRange.hxx>
#include <Poly_Triangulation.hxx>
#include <TopoDS_Shape.hxx>

bool shapeFromMesh(Handle(Poly_Triangulation) mesh, TopoDS_Shape &shape,
                   const Message_ProgressRange &theRange = Message_ProgressRange());

#endif
