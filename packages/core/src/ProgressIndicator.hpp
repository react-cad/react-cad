#ifndef ProgressIndicator_HeaderFile
#define ProgressIndicator_HeaderFile

#include <Message_ProgressIndicator.hxx>
#include <Message_ProgressScope.hxx>

#include <emscripten/val.h>

class ProgressIndicator : public Message_ProgressIndicator
{
public:
  ProgressIndicator();
  ~ProgressIndicator();
  Standard_Boolean UserBreak() override;
  void Show(const Message_ProgressScope &theScope, const Standard_Boolean isForce) override;

  void subscribe(emscripten::val fn);
  void unsubscribe(emscripten::val fn);
  void then(emscripten::val thenFn);
  void thenCatch(emscripten::val thenFn, emscripten::val catchFn);
  void catchError(emscripten::val catchFn);
  void cancel();

private:
  static int NextID();
  int m_progress_id;
  Standard_Boolean m_cancelled;
  emscripten::val m_js_progress;
};

#endif
