#ifndef ProgressIndicator_HeaderFile
#define ProgressIndicator_HeaderFile

#include <Message_ProgressIndicator.hxx>
#include <Message_ProgressScope.hxx>

#include <emscripten/proxying.h>
#include <emscripten/val.h>

#include <pthread.h>

class ProgressIndicator : public Message_ProgressIndicator
{
public:
  ProgressIndicator(Standard_Boolean resolveWhenComplete = Standard_True);
  Standard_EXPORT void Delete() const override;
  Standard_Boolean UserBreak() override;
  void Show(const Message_ProgressScope &theScope, const Standard_Boolean isForce) override;
  void Reset() override;

  void subscribe(emscripten::val fn);
  void unsubscribe(emscripten::val fn);
  emscripten::val then(emscripten::val thenFn);
  emscripten::val thenCatch(emscripten::val thenFn, emscripten::val catchFn);
  emscripten::val catchError(emscripten::val catchFn);
  emscripten::val isFulfilled();
  void cancel();
  void resolve(emscripten::val result);

private:
  static const pthread_t main_thread;
  static emscripten::ProxyingQueue deletion_queue;

  Standard_Boolean m_resolve_when_complete;

  emscripten::val m_js_progress;
  Standard_Real m_last_progress;
  const char *m_last_name;
  Standard_Boolean m_cancelled;
};

#endif
