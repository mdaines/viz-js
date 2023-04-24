#include <gvc.h>
#include <emscripten.h>

extern int Y_invert;
extern int Nop;

extern gvplugin_library_t gvplugin_core_LTX_library;
extern gvplugin_library_t gvplugin_dot_layout_LTX_library;
extern gvplugin_library_t gvplugin_neato_layout_LTX_library;

lt_symlist_t lt_preloaded_symbols[] = {
  { "gvplugin_core_LTX_library", &gvplugin_core_LTX_library},
  { "gvplugin_dot_layout_LTX_library", &gvplugin_dot_layout_LTX_library},
  { "gvplugin_neato_layout_LTX_library", &gvplugin_neato_layout_LTX_library},
  { 0, 0 }
};

char *errorMessage = NULL;

EMSCRIPTEN_KEEPALIVE
int vizErrorf(char *buf) {
  errorMessage = buf;
  return 0;
}

EMSCRIPTEN_KEEPALIVE
char* vizLastErrorMessage() {
  return errorMessage;
}

EMSCRIPTEN_KEEPALIVE
void vizSetY_invert(int invert) {
  Y_invert = invert;
}

EMSCRIPTEN_KEEPALIVE
void vizSetNop(int value) {
  if (value != 0)
    Nop = value;
}

EMSCRIPTEN_KEEPALIVE
char* vizRenderFromString(const char *src, const char *format, const char *engine) {
  GVC_t *context;
  Agraph_t *graph;
  char *result = NULL;
  unsigned int length;

  context = gvContextPlugins(lt_preloaded_symbols, 0);

  agseterr(AGERR);
  agseterrf(vizErrorf);

  agreadline(1);

  while ((graph = agmemread(src))) {
    if (result == NULL) {
      gvLayout(context, graph, engine);
      gvRenderData(context, graph, format, &result, &length);
      gvFreeLayout(context, graph);
    }

    agclose(graph);

    src = "";
  }

  gvFinalize(context);
  gvFreeContext(context);

  return result;
}
