#ifndef WebGLSentry_HeaderFile
#define WebGLSentry_HeaderFile

#include <emscripten/html5.h>
#include <string>

class WebGLSentry
{
public:
  WebGLSentry(EMSCRIPTEN_WEBGL_CONTEXT_HANDLE context, std::string canvasID);
  ~WebGLSentry();
};

#endif
