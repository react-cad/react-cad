#include "ImportNode.hpp"

#include "UUID.hpp"

#include <OSD_File.hxx>
#include <OSD_Path.hxx>

#include <emscripten.h>

namespace
{
EM_JS(void, writeFile, (const char *filenameStr, emscripten::EM_VAL contents_handle), {
  const filename = UTF8ToString(filenameStr);
  const contents = Emval.toValue(contents_handle);
  Module.FS.writeFile(filename, typeof contents == "string" ? contents : new Uint8Array(contents));
})
}

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

void ImportNode::setFileContents(emscripten::val contents)
{
  std::string filename = UUID::get();
  writeFile(filename.c_str(), contents.as_handle());
  setFilename(filename, true);
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

void ImportNode::computeShape()
{
  importFile();
}
