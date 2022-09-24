#ifndef PolyhedronNode_HeaderFile
#define PolyhedronNode_HeaderFile

#include "Geometry.hpp"
#include "ReactCADNode.hpp"

#include <NCollection_Array1.hxx>

class PolyhedronNode : public ReactCADNode
{
public:
  PolyhedronNode();
  void setPointsAndFaces(const NCollection_Array1<Point> &points,
                         const NCollection_Array1<NCollection_Array1<int>> &faces);

protected:
  void computeShape() override;

private:
  NCollection_Array1<Point> m_points;
  NCollection_Array1<NCollection_Array1<int>> m_faces;

  bool checkFaces(const NCollection_Array1<NCollection_Array1<int>> &faces);
};

#endif
