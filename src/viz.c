#include <gvc.h>

extern gvplugin_library_t gvplugin_dot_layout_LTX_library;
extern gvplugin_library_t gvplugin_neato_layout_LTX_library;
extern gvplugin_library_t gvplugin_core_LTX_library;

GVC_t *context = NULL;

char* vizRenderFromString(const char *src, const char *format, const char *engine) {

  Agraph_t *graph;
  char *result;
  unsigned int length;
  
  if (context == NULL) {
    context = gvContext();
    gvAddLibrary(context, &gvplugin_core_LTX_library);
    gvAddLibrary(context, &gvplugin_dot_layout_LTX_library);
    gvAddLibrary(context, &gvplugin_neato_layout_LTX_library);
  }
  
  // Don't immediately report errors. Instead, we will ask aglasterr in post.js.
  agseterr(AGMAX);
  
  // Reset line numbers.
  agreadline(1);
  
  while ((graph = agmemread(src))) {
    if (result == NULL) {
      gvLayout(context, graph, engine);
      
      // result is freed in post.js.
      gvRenderData(context, graph, format, &result, &length);
      
      gvFreeLayout(context, graph);
    }
    
    agclose(graph);
    
    // agmemread will continue to process graphs from the initial input. Set its *new* input to the empty string so that we don't go into an infinite loop.
    src = "";
  }

  return result;
  
}
