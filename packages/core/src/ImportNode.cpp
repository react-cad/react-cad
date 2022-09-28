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

EM_JS(void, copyFile, (const char *srcStr, const char *destStr), {
  const src = UTF8ToString(srcStr);
  const dest = UTF8ToString(destStr);
  Module.FS.symlink(src, dest);
})
} // namespace

ImportNode::ImportNode() : m_filename(UUID::get())
{
}

ImportNode::ImportNode(const ImportNode &other) : ReactCADNode(other), m_filename(UUID::get())
{
  copyFile(other.m_filename.c_str(), m_filename.c_str());
}

ImportNode &ImportNode::operator=(const ImportNode &other)
{
  removeFile();
  copyFile(other.m_filename.c_str(), m_filename.c_str());
  return *this;
}

ImportNode::~ImportNode()
{
  removeFile();
}

void ImportNode::removeFile()
{
  OSD_Path path(m_filename.c_str());
  OSD_File file(path);
  file.Remove();
}

void ImportNode::setFileContents(emscripten::val contents)
{
  removeFile();
  writeFile(m_filename.c_str(), contents.as_handle());
  propsChanged();
}

void ImportNode::computeShape()
{
  importFile();
}
