#ifndef Operations_HeaderFile
#define Operations_HeaderFile

#include <TopTools_ListOfShape.hxx>
#include <TopoDS_Shape.hxx>

TopoDS_Shape differenceOp(TopoDS_Shape positive, TopoDS_Shape negative);
TopoDS_Shape differenceOp(TopoDS_Shape positive, TopTools_ListOfShape negative);

TopoDS_Shape intersectionOp(TopoDS_Shape positive, TopoDS_Shape negative);
TopoDS_Shape intersectionOp(TopTools_ListOfShape shapes);

TopoDS_Shape unionOp(TopTools_ListOfShape shapes);

#endif
