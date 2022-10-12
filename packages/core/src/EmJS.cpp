#include "EmJS.hpp"

#include <emscripten.h>
#include <emscripten/val.h>

// clang-format off
EM_JS(emscripten::EM_VAL, jsGetFileContentsAndDelete, (const char *filenameStr), {
  const filename = UTF8ToString(filenameStr);
  const content = Module["FS"].readFile(filename);
  Module["FS"].unlink(filename);
  return Emval.toHandle(content);
});

EM_JS(void, jsInitCanvas, (emscripten::EM_VAL canvas_handle, const char* idStr), {
  const canvas = Emval.toValue(canvas_handle);
  const id = UTF8ToString(idStr);
  specialHTMLTargets[id] = canvas;
});

EM_JS(int, jsCanvasGetWidth, (const char* idStr), {
  const id = UTF8ToString(idStr);
  return specialHTMLTargets[id].width;
});

EM_JS(int, jsCanvasGetHeight, (const char* idStr), {
  const id = UTF8ToString(idStr);
  return specialHTMLTargets[id].height;
});

EM_JS(void, jsWriteFile, (const char *filenameStr, emscripten::EM_VAL contents_handle), {
  const filename = UTF8ToString(filenameStr);
  const contents = Emval.toValue(contents_handle);
  Module["FS"].writeFile(filename, typeof contents == "string" ? contents : new Uint8Array(contents));
})

EM_JS(void, jsCopyFile, (const char *srcStr, const char *destStr), {
  const src = UTF8ToString(srcStr);
  const dest = UTF8ToString(destStr);
  Module["FS"].symlink(src, dest);
})

EM_JS(void, jsDeleteFile, (const char *filenameStr), {
  const filename = UTF8ToString(filenameStr);
  try {
    Module["FS"].unlink(filename);
  } catch(e) {}
});
// clang-format on

emscripten::val EmJS::getFileContentsAndDelete(const std::string &filename)
{
  return emscripten::val::take_ownership(jsGetFileContentsAndDelete(filename.c_str()));
}

void EmJS::initCanvas(emscripten::val canvas, const std::string &id)
{
  jsInitCanvas(canvas.as_handle(), id.c_str());
}

void EmJS::enableCanvas(const std::string &id)
{
  // clang-format off
  MAIN_THREAD_EM_ASM({
    const id = UTF8ToString($0);
    Module["canvas"] = specialHTMLTargets[id];
  }, id.c_str());
  // clang-format on
}

int EmJS::canvasGetWidth(const std::string &id)
{
  return jsCanvasGetWidth(id.c_str());
}

int EmJS::canvasGetHeight(const std::string &id)
{
  return jsCanvasGetHeight(id.c_str());
}

Graphic3d_Vec2i EmJS::canvasGetSize(const std::string &id)
{
  return Graphic3d_Vec2i(jsCanvasGetWidth(id.c_str()), jsCanvasGetHeight(id.c_str()));
}

void EmJS::writeFile(const std::string &filename, emscripten::val contents)
{
  jsWriteFile(filename.c_str(), contents.as_handle());
}

void EmJS::copyFile(const std::string &src, const std::string &dest)
{
  jsCopyFile(src.c_str(), dest.c_str());
}

void EmJS::deleteFile(const std::string &filename)
{
  jsDeleteFile(filename.c_str());
}
