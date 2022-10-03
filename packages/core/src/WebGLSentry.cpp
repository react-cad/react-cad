#include "WebGLSentry.hpp"
#include "EmJS.hpp"

std::recursive_mutex webgl_mutex;

WebGLSentry::WebGLSentry(EMSCRIPTEN_WEBGL_CONTEXT_HANDLE context, const std::string &canvasID) : m_lock(webgl_mutex)
{
  EmJS::enableCanvas(canvasID);
  emscripten_webgl_make_context_current(context);
}
