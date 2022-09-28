#ifndef WebGLSentry_HeaderFile
#define WebGLSentry_HeaderFile

#include <emscripten/html5.h>
#include <string>

class WebGLSentry
{
public:
  WebGLSentry(EMSCRIPTEN_WEBGL_CONTEXT_HANDLE context, std::string canvasID);
  WebGLSentry(const WebGLSentry &other);
  WebGLSentry &operator=(const WebGLSentry &other);
  ~WebGLSentry();

private:
  EMSCRIPTEN_WEBGL_CONTEXT_HANDLE m_context;
  std::string m_canvasID;
};

#endif
