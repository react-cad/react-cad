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

Handle(ProgressIndicator) renderSTL(const Handle(ReactCADNode) & node, const Standard_Real theLinDeflection,
                                    const Standard_Real theAngDeflection)
{
  std::string filename(UUID::get());
  return Async::GenerateFile(filename, [=](const ProgressHandler &handler) {
    Message_ProgressScope scope(handler, "Writing STL", 5);
    node->computeGeometry(handler.WithRange(scope.Next(2)));

    Handle(BRepMesh_DiscretRoot) aMeshAlgo =
        BRepMesh_DiscretFactory::Get().Discret(node->shape, theLinDeflection, theAngDeflection);
    aMeshAlgo->Perform(scope.Next(2));

    StlAPI::Write(node->shape, filename.c_str());
  });
}

Handle(ProgressIndicator) renderBREP(const Handle(ReactCADNode) & node)
{
  std::string filename(UUID::get());
  return Async::GenerateFile(filename, [=](const ProgressHandler &handler) {
    Message_ProgressScope scope(handler, "Writing BREP", 4);
    node->computeGeometry(handler.WithRange(scope.Next(3)));
    BRepTools::Write(node->shape, filename.c_str(), scope.Next());
  });
}

Handle(ProgressIndicator) renderSTEP(const Handle(ReactCADNode) & node)
{
  std::string filename(UUID::get());
  return Async::GenerateFile(filename, [=](const ProgressHandler &handler) {
    Message_ProgressScope scope(handler, "Writing BREP", 5);
    node->computeGeometry(handler.WithRange(scope.Next(2)));
    STEPControl_Writer writer;
    writer.Transfer(node->shape, STEPControl_AsIs, Standard_True, scope.Next(2));
    writer.Write(filename.c_str());
  });
}
