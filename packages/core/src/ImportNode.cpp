#include "ImportNode.hpp"

#include "EmJS.hpp"
#include "UUID.hpp"

#include <OSD_File.hxx>
#include <OSD_Path.hxx>

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

void ImportNode::computeShape()
{
  importFile();
}
