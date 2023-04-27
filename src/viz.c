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

static GVC_t *viz_context;

EMSCRIPTEN_KEEPALIVE
int viz_errorf(char *buf) {
  EM_ASM({ Module["errorMessages"].push(UTF8ToString($0)); }, buf);
  return 0;
}

EMSCRIPTEN_KEEPALIVE
void viz_init() {
  if (!viz_context) {
    viz_context = gvContextPlugins(lt_preloaded_symbols, 0);
  }

  agreseterrors();
  agseterr(AGWARN);
  agseterrf(viz_errorf);
}

EMSCRIPTEN_KEEPALIVE
void viz_reset_errors() {
  agreseterrors();
}

EMSCRIPTEN_KEEPALIVE
int viz_errors() {
  return agerrors();
}

EMSCRIPTEN_KEEPALIVE
void viz_set_yinvert(int invert) {
  Y_invert = invert;
}

EMSCRIPTEN_KEEPALIVE
void viz_set_nop(int value) {
  Nop = value;
}

EMSCRIPTEN_KEEPALIVE
Agraph_t *viz_read(char *string) {
  return agmemread(string);
}

EMSCRIPTEN_KEEPALIVE
void viz_rm_graph(Agraph_t *graph) {
  agclose(graph);
}

EMSCRIPTEN_KEEPALIVE
int viz_layout(Agraph_t *graph, const char *engine) {
  gvFreeLayout(viz_context, graph);
  return gvLayout(viz_context, graph, engine);
}

EMSCRIPTEN_KEEPALIVE
char *viz_render(Agraph_t *graph, const char *format) {
  char *data;
  unsigned int length;

  int err = gvRenderData(viz_context, graph, format, &data, &length);

  if (err) {
    return NULL;
  }

  return data;
}
