#ifndef EmJS_HeaderFile
#define EmJS_HeaderFile

#include <string>

#include <Graphic3d_Vec2.hxx>

#include <emscripten/val.h>

class EmJS
{
public:
  static emscripten::val getFileContentsAndDelete(const std::string &filename);
  static float devicePixelRatio();
  static void initCanvas(emscripten::val canvas, const std::string &id);
  static void enableCanvas(const std::string &id);
  static int canvasGetWidth(const std::string &id);
  static int canvasGetHeight(const std::string &id);
  static Graphic3d_Vec2i canvasGetSize(const std::string &id);
  static void writeFile(const std::string &filename, emscripten::val contents);
  static void copyFile(const std::string &src, const std::string &dest);
  static void deleteFile(const std::string &filename);
};

#endif
