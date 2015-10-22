#include <gvc.h>

extern gvplugin_library_t gvplugin_dot_layout_LTX_library;
extern gvplugin_library_t gvplugin_neato_layout_LTX_library;
extern gvplugin_library_t gvplugin_core_LTX_library;

GVC_t *context = NULL;

__attribute__((used)) char* vizRenderFromString(const char *string, const char *format, const char *engine) {

  Agraph_t *graph;
  char *result;
  unsigned int length;
  
  if (context == NULL) {
    context = gvContext();
    gvAddLibrary(context, &gvplugin_core_LTX_library);
    gvAddLibrary(context, &gvplugin_dot_layout_LTX_library);
    gvAddLibrary(context, &gvplugin_neato_layout_LTX_library);
  }
  
  agreadline(1);
  agreseterrors();
  
  graph = agmemread((char *) string);
  
  gvLayout(context, graph, engine);
  
  gvRenderData(context, graph, format, &result, &length);

  gvFreeLayout(context, graph);
  
  agclose(graph);

  return result;
  
}
