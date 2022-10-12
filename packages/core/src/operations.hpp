#ifndef Operations_HeaderFile
#define Operations_HeaderFile

#include <Message_ProgressRange.hxx>
#include <TopTools_ListOfShape.hxx>
#include <TopoDS_Shape.hxx>

TopoDS_Shape differenceOp(TopoDS_Shape positive, TopoDS_Shape negative,
                          const Message_ProgressRange &theRange = Message_ProgressRange());
TopoDS_Shape differenceOp(TopoDS_Shape positive, TopTools_ListOfShape negative,
                          const Message_ProgressRange &theRange = Message_ProgressRange());

TopoDS_Shape intersectionOp(TopoDS_Shape shape, TopoDS_Shape otherShape,
                            const Message_ProgressRange &theRange = Message_ProgressRange());
TopoDS_Shape intersectionOp(TopTools_ListOfShape shapes,
                            const Message_ProgressRange &theRange = Message_ProgressRange());

TopoDS_Shape unionOp(TopTools_ListOfShape shapes, const Message_ProgressRange &theRange = Message_ProgressRange());

#endif
