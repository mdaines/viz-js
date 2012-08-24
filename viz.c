#include "cdt.h"
#include "gvc.h"

extern gvplugin_library_t gvplugin_dot_layout_LTX_library;
extern gvplugin_library_t gvplugin_core_LTX_library;

__attribute__((used)) void vizRenderFromString(char *string, char *format) {
  
  GVC_t *context = gvContext();
  gvAddLibrary(context, &gvplugin_core_LTX_library);
  gvAddLibrary(context, &gvplugin_dot_layout_LTX_library);
  
  Agraph_t *graph = agmemread(string);
  gvLayout(context, graph, "dot");
  gvRender(context, graph, format, stdout);
  
  gvFreeLayout(context, graph);
  agclose(graph);
  gvFreeContext(context);
  
}
