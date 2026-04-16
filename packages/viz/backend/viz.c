#include <gvc.h>
#include <gvplugin_textlayout.h>
#include <emscripten.h>
#include <stdbool.h>
#include <stdlib.h>
#include <string.h>

extern int Y_invert;
extern unsigned char Reduce;

extern gvplugin_library_t gvplugin_core_LTX_library;
extern gvplugin_library_t gvplugin_dot_layout_LTX_library;
extern gvplugin_library_t gvplugin_neato_layout_LTX_library;

static char *viz_textlayout_fontpath = NULL;

EM_JS(int, viz_textlayout_measure, (const char *text, const char *font_name,
                                   double font_size, unsigned int flags,
                                   double *width, double *height,
                                   double *yoffset_layout,
                                   double *yoffset_centerline), {
  const measure = Module["vizjsTextMeasure"];

  if (typeof measure !== "function") {
    return 0;
  }

  let result;

  try {
    result = measure({
      text: UTF8ToString(text),
      fontName: UTF8ToString(font_name),
      fontSize: font_size,
      bold: !!(flags & (1 << 0)),
      italic: !!(flags & (1 << 1)),
      underline: !!(flags & (1 << 2)),
      superscript: !!(flags & (1 << 3)),
      subscript: !!(flags & (1 << 4)),
      strikethrough: !!(flags & (1 << 5)),
      overline: !!(flags & (1 << 6)),
    });
  } catch (error) {
    const message =
      error && typeof error.message === "string"
        ? error.message
        : String(error);
    Module["stderrMessages"].push(`text measurement failed: ${message}`);
    return 0;
  }

  if (result == null || typeof result !== "object") {
    return 0;
  }

  if (typeof result.width !== "number" || typeof result.height !== "number") {
    return 0;
  }

  setValue(width, result.width, "double");
  setValue(height, result.height, "double");

  setValue(
    yoffset_layout,
    typeof result.yoffsetLayout === "number" ? result.yoffsetLayout : font_size,
    "double"
  );
  setValue(
    yoffset_centerline,
    typeof result.yoffsetCenterline === "number" ? result.yoffsetCenterline : 0.05 * font_size,
    "double"
  );

  return 1;
});

static bool viz_textlayout(textspan_t *span, char **fontpath) {
  double width = 0.0;
  double height = 0.0;
  double yoffset_layout = 0.0;
  double yoffset_centerline = 0.0;

  if (span == NULL || span->font == NULL || span->font->name == NULL || span->str == NULL) {
    return false;
  }

  if (!viz_textlayout_measure(span->str, span->font->name, span->font->size,
                              span->font->flags, &width, &height,
                              &yoffset_layout, &yoffset_centerline)) {
    return false;
  }

  span->layout = NULL;
  span->free_layout = NULL;
  span->size.x = width;
  span->size.y = height;
  span->yoffset_layout = yoffset_layout;
  span->yoffset_centerline = yoffset_centerline;

  if (fontpath != NULL) {
    if (viz_textlayout_fontpath == NULL) {
      viz_textlayout_fontpath = strdup("[viz-js textMeasure]");
      if (viz_textlayout_fontpath == NULL) {
        return false;
      }
    }
    *fontpath = viz_textlayout_fontpath;
  }

  return true;
}

static gvtextlayout_engine_t viz_textlayout_engine = {
  viz_textlayout,
};

static gvplugin_installed_t gvtextlayout_viz_types[] = {
  {0, "textlayout", 20, &viz_textlayout_engine, NULL},
  {0, NULL, 0, NULL, NULL},
};

static gvplugin_api_t viz_apis[] = {
  {API_textlayout, gvtextlayout_viz_types},
  {(api_t)0, 0},
};

gvplugin_library_t gvplugin_viz_LTX_library = { "viz", viz_apis };

lt_symlist_t lt_preloaded_symbols[] = {
  { "gvplugin_core_LTX_library", &gvplugin_core_LTX_library},
  { "gvplugin_dot_layout_LTX_library", &gvplugin_dot_layout_LTX_library},
  { "gvplugin_neato_layout_LTX_library", &gvplugin_neato_layout_LTX_library},
  { "gvplugin_viz_LTX_library", &gvplugin_viz_LTX_library},
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
  return agstrfree(g, s, false);
}

EMSCRIPTEN_KEEPALIVE
int viz_string_free_html(Agraph_t * g, const char *s) {
  return agstrfree(g, s, true);
}

EMSCRIPTEN_KEEPALIVE
Agnode_t *viz_add_node(Agraph_t *g, char *name) {
  return agnode(g, name, true);
}

EMSCRIPTEN_KEEPALIVE
Agedge_t *viz_add_edge(Agraph_t *g, char *uname, char *vname) {
  Agnode_t *u = agnode(g, uname, true);
  Agnode_t *v = agnode(g, vname, true);
  return agedge(g, u, v, NULL, true);
}

EMSCRIPTEN_KEEPALIVE
Agraph_t *viz_add_subgraph(Agraph_t *g, char *name) {
  return agsubg(g, name, true);
}

EMSCRIPTEN_KEEPALIVE
void viz_set_default_graph_attribute(Agraph_t *graph, char *name, char *value) {
  if (agattr(graph, AGRAPH, name, NULL) == NULL) {
    agattr(graph, AGRAPH, name, "");
  }
  agattr(graph, AGRAPH, name, value);
}

EMSCRIPTEN_KEEPALIVE
void viz_set_default_node_attribute(Agraph_t *graph, char *name, char *value) {
  if (agattr(graph, AGNODE, name, NULL) == NULL) {
    agattr(graph, AGNODE, name, "");
  }
  agattr(graph, AGNODE, name, value);
}

EMSCRIPTEN_KEEPALIVE
void viz_set_default_edge_attribute(Agraph_t *graph, char *name, char *value) {
  if (agattr(graph, AGEDGE, name, NULL) == NULL) {
    agattr(graph, AGEDGE, name, "");
  }
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
GVC_t *viz_create_context() {
  return gvContextPlugins(lt_preloaded_symbols, 0);
}

EMSCRIPTEN_KEEPALIVE
void viz_free_context(GVC_t *context) {
  gvFinalize(context);
  gvFreeContext(context);
}

EMSCRIPTEN_KEEPALIVE
int viz_layout(GVC_t *context, Agraph_t *graph, const char *engine) {
  return gvLayout(context, graph, engine);
}

EMSCRIPTEN_KEEPALIVE
void viz_free_layout(GVC_t *context, Agraph_t *graph) {
  gvFreeLayout(context, graph);
}

EMSCRIPTEN_KEEPALIVE
void viz_reset_errors() {
  agseterrf(viz_errorf);
  agseterr(AGWARN);
  agreseterrors();
}

EMSCRIPTEN_KEEPALIVE
char *viz_render(GVC_t *context, Agraph_t *graph, const char *format) {
  char *data = NULL;
  size_t length = 0;
  int render_error = 0;

  render_error = gvRenderData(context, graph, format, &data, &length);

  if (render_error) {
    gvFreeRenderData(data);
    data = NULL;
  }

  return data;
}
