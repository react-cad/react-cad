#ifndef MeshTools_HeaderFile
#define MeshTools_HeaderFile

#include <Poly_Triangulation.hxx>
#include <TopoDS_Shape.hxx>

#include "ProgressHandler.hpp"

bool shapeFromMesh(Handle(Poly_Triangulation) mesh, TopoDS_Shape &shape, const ProgressHandler &handler);

#endif
