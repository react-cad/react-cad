#include "ImportNode.hpp"

#include <OSD_File.hxx>
#include <OSD_Path.hxx>

ImportNode::ImportNode()
{
}

ImportNode::~ImportNode()
{
  if (m_ownFile)
  {
    removeFile();
  }
}

void ImportNode::removeFile()
{
  OSD_Path path(m_filename.c_str());
  OSD_File file(path);
  file.Remove();
}

void ImportNode::setFilename(const std::string &filename, bool ownFile)
{
  if (m_ownFile && filename != m_filename)
  {
    removeFile();
  }
  m_ownFile = ownFile;
  m_filename = filename;
  propsChanged();
}

std::string ImportNode::getFilename()
{
  return m_filename;
}

void ImportNode::computeShape()
{
  importFile();
}
