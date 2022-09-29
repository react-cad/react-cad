#include "export.hpp"

#include <BRepMesh_IncrementalMesh.hxx>
#include <BRepTools.hxx>
#include <StlAPI.hxx>

#include "Async.hpp"
#include "ReactCADNode.hpp"
#include "UUID.hpp"

emscripten::val renderSTL(const Handle(ReactCADNode) & node, const Standard_Real theLinDeflection,
                          const Standard_Boolean isRelative, const Standard_Real theAngDeflection)
{
  std::string filename(UUID::get());
  return Async::GenerateFile(filename, [=]() {
    node->computeGeometry();
    BRepMesh_IncrementalMesh mesh(node->shape, theLinDeflection, isRelative, theAngDeflection);

    StlAPI::Write(node->shape, filename.c_str());
  });
}

emscripten::val renderBREP(const Handle(ReactCADNode) & node)
{
  std::string filename(UUID::get());
  return Async::GenerateFile(filename, [=]() {
    node->computeGeometry();
    BRepTools::Write(node->shape, filename.c_str());
  });
}
