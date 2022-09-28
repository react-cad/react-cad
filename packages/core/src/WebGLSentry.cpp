#include "WebGLSentry.hpp"

#include <pthread.h>

pthread_mutex_t webgl_mutex;
pthread_once_t webgl_init_once = PTHREAD_ONCE_INIT;

void webgl_mutex_init()
{
  pthread_mutexattr_t Attr;
  pthread_mutexattr_init(&Attr);
  pthread_mutexattr_settype(&Attr, PTHREAD_MUTEX_RECURSIVE);
  pthread_mutex_init(&webgl_mutex, &Attr);
}

// clang-format off
namespace
{
  EM_JS(void, jsEnableCanvas, (const char *idStr), {
    const id = UTF8ToString(idStr);
    Module.canvas = specialHTMLTargets[id];
  });
}
// clang-format on

WebGLSentry::WebGLSentry(EMSCRIPTEN_WEBGL_CONTEXT_HANDLE context, std::string canvasID)
{
  pthread_once(&webgl_init_once, webgl_mutex_init);
  pthread_mutex_lock(&webgl_mutex);
  jsEnableCanvas(canvasID.c_str());
  emscripten_webgl_make_context_current(context);
}

WebGLSentry::~WebGLSentry()
{
  pthread_mutex_unlock(&webgl_mutex);
}
