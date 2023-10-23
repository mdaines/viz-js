#include <gvc.h>
#include <emscripten.h>

extern int Y_invert;
extern unsigned char Reduce;

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
void viz_set_reduce(int value) {
  Reduce = value;
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

  list = gvPluginList(context, kind, &count);

  gvFinalize(context);
  gvFreeContext(context);

  return list;
}

EM_JS(int, viz_errorf, (char *text), {
  Module["agerrMessages"].push(UTF8ToString(text));
  return 0;
});

EMSCRIPTEN_KEEPALIVE
Agraph_t *viz_create_graph(char *name, bool directed, bool strict) {
  Agdesc_t desc = { .directed = directed, .strict = strict };

  return agopen(name, desc, NULL);
}

EMSCRIPTEN_KEEPALIVE
Agraph_t *viz_read_one_graph(char *string) {
  Agraph_t *graph = NULL;
  Agraph_t *other_graph = NULL;

  // Workaround for #218. Set the global default node label.

  agattr(NULL, AGNODE, "label", "\\N");

  // Reset errors

  agseterrf(viz_errorf);
  agseterr(AGWARN);
  agreseterrors();

  // Try to read one graph

  graph = agmemread(string);

  // Consume the rest of the input

  do {
    other_graph = agmemread(NULL);
    if (other_graph) {
      agclose(other_graph);
    }
  } while (other_graph);

  return graph;
}

EMSCRIPTEN_KEEPALIVE
char *viz_string_dup(Agraph_t *g, char *s) {
  return agstrdup(g, s);
}

EMSCRIPTEN_KEEPALIVE
char *viz_string_dup_html(Agraph_t *g, char *s) {
  return agstrdup_html(g, s);
}

EMSCRIPTEN_KEEPALIVE
int viz_string_free(Agraph_t * g, const char *s) {
  return agstrfree(g, s);
}

EMSCRIPTEN_KEEPALIVE
Agnode_t *viz_add_node(Agraph_t *g, char *name) {
  return agnode(g, name, TRUE);
}

EMSCRIPTEN_KEEPALIVE
Agedge_t *viz_add_edge(Agraph_t *g, char *uname, char *vname) {
  Agnode_t *u = agnode(g, uname, TRUE);
  Agnode_t *v = agnode(g, vname, TRUE);
  return agedge(g, u, v, NULL, TRUE);
}

EMSCRIPTEN_KEEPALIVE
Agraph_t *viz_add_subgraph(Agraph_t *g, char *name) {
  return agsubg(g, name, TRUE);
}

EMSCRIPTEN_KEEPALIVE
void viz_set_default_graph_attribute(Agraph_t *graph, char *name, char *value) {
  agattr(graph, AGRAPH, name, value);
}

EMSCRIPTEN_KEEPALIVE
void viz_set_default_node_attribute(Agraph_t *graph, char *name, char *value) {
  agattr(graph, AGNODE, name, value);
}

EMSCRIPTEN_KEEPALIVE
void viz_set_default_edge_attribute(Agraph_t *graph, char *name, char *value) {
  agattr(graph, AGEDGE, name, value);
}

EMSCRIPTEN_KEEPALIVE
void viz_set_attribute(void *object, char *name, char *value) {
  agsafeset(object, name, value, "");
}

EMSCRIPTEN_KEEPALIVE
void viz_free_graph(Agraph_t *g) {
  agclose(g);
}

EMSCRIPTEN_KEEPALIVE
char *viz_render_graph(Agraph_t *graph, const char *format, const char *engine) {
  GVC_t *context = NULL;
  char *data = NULL;
  unsigned int length = 0;
  int layout_error = 0;
  int render_error = 0;

  // Initialize context

  context = gvContextPlugins(lt_preloaded_symbols, 0);

  // Reset errors

  agseterrf(viz_errorf);
  agseterr(AGWARN);
  agreseterrors();

  // Layout

  layout_error = gvLayout(context, graph, engine);

  // Render (if layout was successful)

  if (!layout_error) {
    render_error = gvRenderData(context, graph, format, &data, &length);

    if (render_error) {
      gvFreeRenderData(data);
      data = NULL;
    }
  }

  // Free the layout and context

  if (graph) {
    gvFreeLayout(context, graph);
  }

  gvFinalize(context);
  gvFreeContext(context);

  // Return the result (if successful, the rendered graph; otherwise, null)

  return data;
}
