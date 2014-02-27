#include "cdt.h"
#include "gvc.h"

extern gvplugin_library_t gvplugin_dot_layout_LTX_library;
extern gvplugin_library_t gvplugin_neato_layout_LTX_library;
extern gvplugin_library_t gvplugin_core_LTX_library;

__attribute__((used)) char* vizRenderFromString(const char *string,
                                                const char *format,
                                                const char *engine) {
  
  GVC_t *context = gvContext();
  gvAddLibrary(context, &gvplugin_core_LTX_library);
  gvAddLibrary(context, &gvplugin_dot_layout_LTX_library);
  gvAddLibrary(context, &gvplugin_neato_layout_LTX_library);
  
  Agraph_t *graph = agmemread((char*)string);
  gvLayout(context, graph, engine);

  char *result = NULL;
  unsigned int length;
  gvRenderData(context, graph, format, &result, &length);

  gvFreeLayout(context, graph);
  agclose(graph);
  gvFinalize(context);
  gvFreeContext(context);

  return result;
}
