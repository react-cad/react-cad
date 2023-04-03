#include "export.hpp"

#include <BRepMesh_DiscretFactory.hxx>
#include <BRepMesh_DiscretRoot.hxx>
#include <BRepTools.hxx>
#include <Message_ProgressScope.hxx>
#include <STEPControl_Writer.hxx>
#include <StlAPI.hxx>

#include "Async.hpp"
#include "ReactCADNode.hpp"
#include "UUID.hpp"

Handle(ProgressIndicator)
    renderSTL(Handle(ReactCADShape) shape, const Standard_Real theLinDeflection, const Standard_Real theAngDeflection)
{
  std::string filename(UUID::get());
  return Async::GenerateFile(filename, [=](const ProgressHandler &handler) {
    Message_ProgressScope scope(handler, "Writing STL", 2);

    TopoDS_Shape myShape = shape->getShape();

    Handle(BRepMesh_DiscretRoot) aMeshAlgo =
        BRepMesh_DiscretFactory::Get().Discret(myShape, theLinDeflection, theAngDeflection);

    scope.Next();

    StlAPI::Write(myShape, filename.c_str());
  });
}

Handle(ProgressIndicator) renderBREP(Handle(ReactCADShape) shape)
{
  std::string filename(UUID::get());
  return Async::GenerateFile(filename, [=](const ProgressHandler &handler) {
    TopoDS_Shape myShape = shape->getShape();
    Message_ProgressScope scope(handler, "Writing BREP", 1);
    BRepTools::Write(myShape, filename.c_str(), scope.Next());
  });
}

Handle(ProgressIndicator) renderSTEP(Handle(ReactCADShape) shape)
{
  std::string filename(UUID::get());
  return Async::GenerateFile(filename, [=](const ProgressHandler &handler) {
    TopoDS_Shape myShape = shape->getShape();
    Message_ProgressScope scope(handler, "Writing STEP", 5);
    STEPControl_Writer writer;
    writer.Transfer(myShape, STEPControl_AsIs, Standard_True, scope.Next(2));
    writer.Write(filename.c_str());
  });
}
