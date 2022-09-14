#ifndef MeshTools_HeaderFile
#define MeshTools_HeaderFile

#include <Poly_Triangulation.hxx>
#include <TopoDS_Shape.hxx>

TopoDS_Shape shapeFromMesh(Handle(Poly_Triangulation) mesh);

#endif
