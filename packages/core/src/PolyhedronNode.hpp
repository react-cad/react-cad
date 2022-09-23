#ifndef PolyhedronNode_HeaderFile
#define PolyhedronNode_HeaderFile

#include "Geometry.hpp"
#include "ReactCADNode.hpp"

class PolyhedronNode : public ReactCADNode
{
public:
  PolyhedronNode();
  void setPointsAndFaces(const std::vector<Point> &points, const std::vector<std::vector<unsigned int>> &faces);

protected:
  void computeShape() override;

private:
  std::vector<Point> m_points;
  std::vector<std::vector<unsigned int>> m_faces;

  bool checkFaces(const std::vector<std::vector<unsigned int>> &faces);
};

#endif
