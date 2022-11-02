#ifndef PolyhedronNode_HeaderFile
#define PolyhedronNode_HeaderFile

#include "Geometry.hpp"
#include "ReactCADNode.hpp"

#include <NCollection_Array1.hxx>
#include <gp_Pnt.hxx>

class PolyhedronNode : public ReactCADNode
{
public:
  PolyhedronNode();
  void setPointsAndFaces(const NCollection_Array1<gp_Pnt> &points,
                         const NCollection_Array1<NCollection_Array1<int>> &faces);

protected:
  bool computeShape(const Message_ProgressRange &theRange = Message_ProgressRange()) override;

private:
  NCollection_Array1<gp_Pnt> m_points;
  NCollection_Array1<NCollection_Array1<int>> m_faces;

  bool checkFaces(const NCollection_Array1<NCollection_Array1<int>> &faces);
};

#endif
