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
    : m_context(context), m_canvasID(canvasID)
{
  pthread_once(&webgl_init_once, webgl_mutex_init);
  pthread_mutex_lock(&webgl_mutex);
  jsEnableCanvas(m_canvasID.c_str());
  emscripten_webgl_make_context_current(m_context);
}

WebGLSentry::WebGLSentry(const WebGLSentry &other) : m_context(other.m_context), m_canvasID(other.m_canvasID)
{
  pthread_mutex_lock(&webgl_mutex);
  jsEnableCanvas(m_canvasID.c_str());
  emscripten_webgl_make_context_current(m_context);
}

WebGLSentry &WebGLSentry::operator=(const WebGLSentry &other)
{
  m_context = other.m_context;
  m_canvasID = other.m_canvasID;
  jsEnableCanvas(m_canvasID.c_str());
  emscripten_webgl_make_context_current(m_context);
}

WebGLSentry::~WebGLSentry()
{
  pthread_mutex_unlock(&webgl_mutex);
}
