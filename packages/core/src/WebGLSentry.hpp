#ifndef WebGLSentry_HeaderFile
#define WebGLSentry_HeaderFile

#include <emscripten/html5.h>
#include <mutex>
#include <string>

class WebGLSentry
{
public:
  WebGLSentry(EMSCRIPTEN_WEBGL_CONTEXT_HANDLE context, const std::string &canvasID);
  WebGLSentry(const WebGLSentry &other) = delete;
  WebGLSentry &operator=(const WebGLSentry &other) = delete;

private:
  std::lock_guard<std::recursive_mutex> m_lock;
};

#endif
