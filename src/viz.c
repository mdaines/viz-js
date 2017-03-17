#include <gvc.h>
#include <emscripten.h>

extern gvplugin_library_t gvplugin_core_LTX_library;
extern gvplugin_library_t gvplugin_dot_layout_LTX_library;
#ifndef VIZ_LITE
extern gvplugin_library_t gvplugin_neato_layout_LTX_library;
#endif

char *errorMessage = NULL;

int vizErrorf(char *buf) {
  errorMessage = buf;
  return 0;
}

char* vizLastErrorMessage() {
  return errorMessage;
}

void vizCreateDummyImageFile(char *href, char *width, char *height) {
  EM_ASM_({
    var href = Pointer_stringify($0);
    var width = Pointer_stringify($1);
    var height = Pointer_stringify($2);
    
    FS.createPath("/", PATH.dirname(href));
    FS.writeFile(PATH.join("/", href), "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg width=\"" + width + "\" height=\"" + height + "\"></svg>");
  }, href, width, height);
}

char* vizRenderFromString(const char *src, const char *format, const char *engine) {
  GVC_t *context;
  Agraph_t *graph;
  char *result = NULL;
  unsigned int length;
  
  context = gvContext();
  gvAddLibrary(context, &gvplugin_core_LTX_library);
  gvAddLibrary(context, &gvplugin_dot_layout_LTX_library);
#ifndef VIZ_LITE
  gvAddLibrary(context, &gvplugin_neato_layout_LTX_library);
#endif

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
