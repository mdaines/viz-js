#include <gvc.h>
#include <emscripten.h>

extern gvplugin_library_t gvplugin_dot_layout_LTX_library;
extern gvplugin_library_t gvplugin_neato_layout_LTX_library;
extern gvplugin_library_t gvplugin_core_LTX_library;

GVC_t *context = NULL;
char *errorMessage = NULL;

int vizErrorf(char *buf) {
  errorMessage = buf;
  return 0;
}

char* vizLastErrorMessage() {
  return errorMessage;
}

char* vizRenderFromString(const char *src, const char *format, const char *engine) {
  Agraph_t *graph = NULL;
  char *result = NULL;
  unsigned int length;
  
  if (context == NULL) {
    context = gvContext();
    gvAddLibrary(context, &gvplugin_core_LTX_library);
    gvAddLibrary(context, &gvplugin_dot_layout_LTX_library);
    gvAddLibrary(context, &gvplugin_neato_layout_LTX_library);
  }

  agseterr(AGERR);
  agseterrf(vizErrorf);
  
  while ((graph = agmemread(src))) {
    if (result == NULL) {
      gvLayout(context, graph, engine);
      gvRenderData(context, graph, format, &result, &length);
    }
    
    src = "";
  }
  
  return result;
}
