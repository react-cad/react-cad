#ifndef SVGPathBuilder_Headerfile
#define SVGPathBuilder_Headerfile

#include <Geom_Plane.hxx>
#include <NCollection_List.hxx>
#include <Standard_Handle.hxx>
#include <TopoDS_Wire.hxx>
#include <string>

#include "ProgressHandler.hpp"

class SVGPathBuilder : public Standard_Transient
{
public:
  SVGPathBuilder(const std::string &pathData, const Handle(Geom_Plane) & plane);
  void Build(const ProgressHandler &handler);
  TopoDS_Shape Shape(const ProgressHandler &handler);
  bool IsDone()
  {
    return m_done;
  }

private:
  Handle(Geom_Plane) m_plane;
  TopoDS_Shape m_shape;
  std::string m_pathData;
  bool m_done = false;
};

#endif
