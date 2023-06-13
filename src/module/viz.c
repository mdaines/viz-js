#include <gvc.h>
#include <emscripten.h>

extern int Y_invert;
extern char *Version;

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
void viz_set_y_invert(int value) {
  Y_invert = value;
}

EMSCRIPTEN_KEEPALIVE
char *viz_get_graphviz_version() {
  GVC_t *context = NULL;
  char *result = NULL;

  context = gvContextPlugins(lt_preloaded_symbols, 0);

  result = gvcVersion(context);

  gvFinalize(context);
  gvFreeContext(context);

  return result;
}

EMSCRIPTEN_KEEPALIVE
char **viz_get_plugin_list(const char *kind) {
  GVC_t *context = NULL;
  char **list = NULL;
  int count = 0;

  context = gvContextPlugins(lt_preloaded_symbols, 0);

  list = gvPluginList(context, kind, &count, NULL);

  gvFinalize(context);
  gvFreeContext(context);

  return list;
}

EMSCRIPTEN_KEEPALIVE
char *viz_render_string(char *string, const char *format, const char *engine) {
  GVC_t *context = NULL;
  Agraph_t *graph = NULL;
  Agraph_t *other_graph = NULL;
  char *data = NULL;
  unsigned int length = 0;
  int layout_error = 0;
  int render_error = 0;

  // Initialize context

  context = gvContextPlugins(lt_preloaded_symbols, 0);

  // Reset errors

  agseterr(AGWARN);
  agreseterrors();

  // Try to read one graph

  graph = agmemread(string);

  if (!graph) {
    agerrorf("no valid graph in input\n");
  }

  // Consume the rest of the input

  do {
    other_graph = agmemread(NULL);
    if (other_graph) {
      agclose(other_graph);
    }
  } while (other_graph);

  // Layout (if there is a graph)

  if (graph) {
    layout_error = gvLayout(context, graph, engine);
  }

  // Render (if there is a graph and layout was successful)

  if (graph && !layout_error) {
    render_error = gvRenderData(context, graph, format, &data, &length);

    if (render_error) {
      gvFreeRenderData(data);
      data = NULL;
    }
  }

  // Free the layout, graph, and context

  if (graph) {
    gvFreeLayout(context, graph);
  }

  if (graph) {
    agclose(graph);
  }

  gvFinalize(context);
  gvFreeContext(context);

  // Return the result (if successful, the rendered graph; otherwise, null)

  return data;
}
