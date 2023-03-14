#include <BRepOffsetAPI_ThruSections.hxx>
#include <BRepTools.hxx>
#include <BRep_Builder.hxx>
#include <TopExp_Explorer.hxx>
#include <TopTools_ListOfListOfShape.hxx>
#include <TopoDS.hxx>
#include <TopoDS_Wire.hxx>

#include <vector>

#include "BooleanOperation.hpp"
#include "LoftNode.hpp"
#include "PerformanceTimer.hpp"

LoftNode::LoftNode() : m_compatible(false), m_smooth(true)
{
}

void LoftNode::setCompatible(Standard_Boolean compatible)
{
  if (m_compatible != compatible)
  {
    m_compatible = compatible;
    propsChanged();
  }
}

void LoftNode::setSmooth(Standard_Boolean smooth)
{
  if (m_smooth != smooth)
  {
    m_smooth = smooth;
    propsChanged();
  }
}

void LoftNode::computeChildren(TopTools_ListOfShape children, const ProgressHandler &handler)
{
  m_children = children;
}

std::shared_ptr<BRepOffsetAPI_ThruSections> LoftNode::createLoft()
{
  auto loft = std::shared_ptr<BRepOffsetAPI_ThruSections>(new BRepOffsetAPI_ThruSections(Standard_True, !m_smooth));
  loft->CheckCompatibility(!m_compatible);
  return loft;
}

TopoDS_Shape LoftNode::buildLoft(const std::shared_ptr<BRepOffsetAPI_ThruSections> &loft,
                                 const ProgressHandler &handler)
{
  if (loft->Wires().Size() < 2)
  {
    handler.Abort("loft: not enough wires");
    return TopoDS_Shape();
  }
  loft->Build(/*theRange*/);
  if (!loft->IsDone())
  {
    handler.Abort("loft: construction failed");
    return TopoDS_Shape();
  }
  return loft->Shape();
}

void LoftNode::computeShape(const ProgressHandler &handler)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Compute loft");
#endif
  setShape(TopoDS_Shape());

  BRep_Builder builder;
  TopoDS_Compound compound;
  builder.MakeCompound(compound);

  std::vector<std::vector<std::shared_ptr<BRepOffsetAPI_ThruSections>>> finishedComponents;
  std::vector<std::vector<std::shared_ptr<BRepOffsetAPI_ThruSections>>> components;
  std::vector<std::vector<std::shared_ptr<BRepOffsetAPI_ThruSections>>> finishedNegatives;

  int32_t nbLayers = m_children.Size();
  int32_t layerId = -1;

  Message_ProgressScope scope(handler, "Computing loft", 2);

  Message_ProgressScope layerScope(scope.Next(), "Computing loft layers", nbLayers);

  for (auto layerIt = m_children.begin(); layerIt != m_children.end(); ++layerIt)
  {
    ++layerId;
    TopoDS_Shape layer = *layerIt;

    TopExp_Explorer Faces;

    int32_t nbFaces = 0;
    for (Faces.Init(layer, TopAbs_FACE); Faces.More(); Faces.Next())
    {
      ++nbFaces;
    }

    Message_ProgressScope faceScope(layerScope.Next(), "Computing faces for loft layer", nbFaces);

    // Finish component
    for (int32_t i = nbFaces; i < components.size(); ++i)
    {
      std::vector<std::shared_ptr<BRepOffsetAPI_ThruSections>> component(components[i]);
      component.insert(component.end(), finishedNegatives[i].begin(), finishedNegatives[i].end());
      finishedComponents.push_back(component);
    }

    components.resize(nbFaces);
    finishedNegatives.resize(nbFaces);

    int32_t faceId = -1;
    for (Faces.ReInit(); Faces.More() && scope.More(); Faces.Next())
    {
      TopoDS_Face face = TopoDS::Face(Faces.Current());

      ++faceId;

      TopExp_Explorer Wires;
      int nbWires = 0;
      for (Wires.Init(face, TopAbs_WIRE); Wires.More(); Wires.Next())
      {
        ++nbWires;
      }

      Message_ProgressScope wireScope(scope.Next(), "Computing edges for loft face", nbWires);

      if (components[faceId].size() == 0)
      {
        components[faceId].push_back(createLoft());
      }
      // Add to the positive loft
      TopoDS_Wire outerWire = BRepTools::OuterWire(face);
      components[faceId][0]->AddWire(outerWire);
      wireScope.Next();

      std::stringstream ss;
      ss << "nbWires " << nbWires << " of " << components[faceId].size();
      Message::DefaultMessenger()->Send(ss);

      // Close off finished negative lofts and add finshed shapes to the holes list
      if (nbWires < components[faceId].size())
      {
        for (int32_t i = nbWires; i < components[faceId].size(); ++i)
        {
          finishedNegatives[faceId].push_back(components[faceId][i]);
        }
        components[faceId].resize(nbWires);
      }
      for (int32_t i = components[faceId].size(); i < nbWires; ++i)
      {
        components[faceId].push_back(createLoft());
      }

      // Add to the negative lofts
      int wireId = 0;
      for (Wires.ReInit(); Wires.More() && faceScope.More(); Wires.Next())
      {
        TopoDS_Wire wire = TopoDS::Wire(Wires.Current());
        if (wire.IsEqual(outerWire))
        {
          continue;
        }
        ++wireId;
        components[faceId][wireId]->AddWire(wire);
        wireScope.Next();
      }
    }
  }

  Message_ProgressScope buildScope(scope.Next(), "Combining loft components", 1);

  // Close off all open components
  for (int32_t i = 0; i < components.size(); ++i)
  {
    std::vector<std::shared_ptr<BRepOffsetAPI_ThruSections>> component(components[i]);
    component.insert(component.end(), finishedNegatives[i].begin(), finishedNegatives[i].end());
    finishedComponents.push_back(component);
  }

  // Add each component to the compound
  for (auto componentIt = finishedComponents.begin(); componentIt != finishedComponents.end(); ++componentIt)
  {
    TopoDS_Shape solid = buildLoft((*componentIt)[0], handler);
    TopTools_ListOfShape holes;

    for (int32_t j = 1; j < (*componentIt).size(); ++j)
    {
      holes.Append(buildLoft((*componentIt)[j], handler));
    }
    // Subtract holes
    BooleanOperation op;
    op.Difference(solid, holes, handler);
    if (op.HasErrors())
    {
      handler.Abort("pipe: boolean operation failed\n\n" + op.Errors());
    }
    else
    {
      // Add to final shape
      builder.Add(compound, op.Shape());
    }
  }

  if (scope.More())
  {
    setShape(compound);
  }

#ifdef REACTCAD_DEBUG
  timer.end();
#endif
}
