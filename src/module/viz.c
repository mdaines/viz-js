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
char *viz_render_string(char *string, const char *format, const char *engine) {
  GVC_t *context;
  Agraph_t *graph, *otherGraph;
  char *data;
  unsigned int length;

  agseterr(AGWARN);

  agreseterrors();

  context = gvContextPlugins(lt_preloaded_symbols, 0);

  graph = agmemread(string);

  if (!graph) {
    gvFinalize(context);
    gvFreeContext(context);

    return NULL;
  }

  do {
    otherGraph = agmemread(NULL);
    if (otherGraph) {
      agclose(otherGraph);
    }
  } while (otherGraph);

  if (gvLayout(context, graph, engine) != 0) {
    gvFreeLayout(context, graph);
    agclose(graph);
    gvFinalize(context);
    gvFreeContext(context);

    return NULL;
  }

  if (gvRenderData(context, graph, format, &data, &length) != 0) {
    gvFreeLayout(context, graph);
    agclose(graph);
    gvFinalize(context);
    gvFreeContext(context);

    return NULL;
  }

  gvFreeLayout(context, graph);
  agclose(graph);
  gvFinalize(context);
  gvFreeContext(context);

  return data;
}
