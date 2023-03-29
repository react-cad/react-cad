#include "ImportNode.hpp"

#include "EmJS.hpp"
#include "UUID.hpp"

#include <OSD_File.hxx>
#include <OSD_Path.hxx>

#include <BRepBuilderAPI_Transform.hxx>
#include <gp_Ax2.hxx>

#include <emscripten.h>

ImportNode::ImportNode() : m_filename(UUID::get())
{
}

ImportNode::ImportNode(const ImportNode &other) : ReactCADNode(other), m_filename(UUID::get())
{
  EmJS::copyFile(other.m_filename, m_filename);
}

ImportNode &ImportNode::operator=(const ImportNode &other)
{
  EmJS::deleteFile(m_filename);
  EmJS::copyFile(other.m_filename, m_filename);
  return *this;
}

ImportNode::~ImportNode()
{
  EmJS::deleteFile(m_filename);
}

void ImportNode::setFileContents(emscripten::val contents)
{
  EmJS::deleteFile(m_filename);
  EmJS::writeFile(m_filename, contents);
  propsChanged();
}

void ImportNode::computeShape(const ProgressHandler &handler)
{
  TopoDS_Shape shape = importFile(handler);
  // Translate to our co-ordinate system
  gp_Ax2 mirror(gp::Origin(), gp::DY());
  gp_Trsf trsf;
  trsf.SetMirror(mirror);
  BRepBuilderAPI_Transform transform(trsf);
  transform.Perform(shape, true);
  setShape(transform.Shape());
}
