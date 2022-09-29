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
  static emscripten::val getPromise(int promiseID);
  static void resolvePromise(int promiseID);
  static void rejectPromise(int promiseID);
  static void resolvePromiseWithFileContents(int promiseID, const std::string &filename);
  static void writeFile(const std::string &filename, emscripten::val contents);
  static void copyFile(const std::string &src, const std::string &dest);
  static void deleteFile(const std::string &filename);
};

#endif
