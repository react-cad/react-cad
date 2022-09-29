#include "EmJS.hpp"

#include <emscripten.h>
#include <emscripten/val.h>

// clang-format off
EM_JS(emscripten::EM_VAL, jsGetFileContentsAndDelete, (const char *filenameStr), {
  const filename = UTF8ToString(filenameStr);
  const content = Module.FS.readFile(filename);
  Module.FS.unlink(filename);
  return Emval.toHandle(content);
});

EM_JS(void, jsInitCanvas, (emscripten::EM_VAL canvas_handle, const char* idStr), {
  const canvas = Emval.toValue(canvas_handle);
  const id = UTF8ToString(idStr);
  specialHTMLTargets[id] = canvas;
});

EM_JS(float, jsDevicePixelRatio, (), {
  var aDevicePixelRatio = window.devicePixelRatio || 1;
  return aDevicePixelRatio;
});

EM_JS(void, jsEnableCanvas, (const char *idStr), {
  const id = UTF8ToString(idStr);
  Module.canvas = specialHTMLTargets[id];
});

EM_JS(int, jsCanvasGetWidth, (const char* idStr), {
  const id = UTF8ToString(idStr);
  return specialHTMLTargets[id].width;
});

EM_JS(int, jsCanvasGetHeight, (const char* idStr), {
  const id = UTF8ToString(idStr);
  return specialHTMLTargets[id].height;
});

EM_JS(emscripten::EM_VAL, jsGetPromise, (int queueID, int promiseID), {
  const promiseObject = {};
  promiseObject.promise = new Promise(function(resolve, reject) {
    promiseObject.resolve = resolve;
    promiseObject.reject = reject;
  });

  const g = typeof global == "undefined" ? window : global;

  g["ReactCADAsync"] = g["ReactCADAsync"] || {};
  g["ReactCADAsync"][queueID] = g["ReactCADAsync"][queueID] || {};
  g["ReactCADAsync"][queueID][promiseID] = promiseObject;

  return Emval.toHandle(promiseObject.promise);
});

EM_JS(void, jsWriteFile, (const char *filenameStr, emscripten::EM_VAL contents_handle), {
  const filename = UTF8ToString(filenameStr);
  const contents = Emval.toValue(contents_handle);
  Module.FS.writeFile(filename, typeof contents == "string" ? contents : new Uint8Array(contents));
})

EM_JS(void, jsCopyFile, (const char *srcStr, const char *destStr), {
  const src = UTF8ToString(srcStr);
  const dest = UTF8ToString(destStr);
  Module.FS.symlink(src, dest);
})

EM_JS(void, jsDeleteFile, (const char *filenameStr), {
  const filename = UTF8ToString(filenameStr);
  try {
    Module.FS.unlink(filename);
  } catch(e) {}
});

EM_JS(void, jsDownloadSync, (const char *urlStr, const char *filenameStr), {
  const url = UTF8ToString(urlStr);
  const filename = UTF8ToString(filenameStr);
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);  // synchronous request
  xhr.responseType = "arraybuffer";
  xhr.send(null);
  Module.FS.writeFile(filename, new Uint8Array(xhr.response));
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

float EmJS::devicePixelRatio()
{
  return jsDevicePixelRatio();
}

void EmJS::enableCanvas(const std::string &id)
{
  jsEnableCanvas(id.c_str());
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

emscripten::val EmJS::getPromise(int queueID, int promiseID)
{
  return emscripten::val::take_ownership(jsGetPromise(queueID, promiseID));
}

void EmJS::resolvePromise(int queueID, int promiseID)
{
  MAIN_THREAD_EM_ASM(
      {
        const g = typeof global == "undefined" ? window : global;
        const promise = g["ReactCADAsync"][$0][$1];
        delete g["ReactCADAsync"][$0][$1];
        promise.resolve();
      },
      queueID, promiseID);
}

void EmJS::resolvePromiseWithFileContents(int queueID, int promiseID, const std::string &filename)
{
  MAIN_THREAD_EM_ASM(
      {
        const g = typeof global == "undefined" ? window : global;
        const promise = g["ReactCADAsync"][$0][$1];
        delete g["ReactCADAsync"][$0][$1];

        const filename = UTF8ToString($2);
        const content = Module.FS.readFile(filename);
        Module.FS.unlink(filename);
        promise.resolve(content);
      },
      queueID, promiseID, filename.c_str());
}

void EmJS::rejectPromise(int queueID, int promiseID)
{
  MAIN_THREAD_EM_ASM(
      {
        const g = typeof global == "undefined" ? window : global;
        const promise = g["ReactCADAsync"][$0][$1];
        delete g["ReactCADAsync"][$0][$1];
        promise.reject();
      },
      queueID, promiseID);
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
