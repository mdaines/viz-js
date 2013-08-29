Building
========

### Installing Emscripten

* Install [Emscripten](https://github.com/kripken/emscripten).
* Install Emscripten dependencies (clang, llvm, nodejs, python2).
* If using LLVM >= 3.3, switch to Emscripten's `llvmsvn` branch.
* *Optional:* Download the latest [Closure Compiler](https://developers.google.com/closure/compiler/) and plonk it into
  Emscripten's `third_party/closure-compiler` directory.

### Building Viz.js

* Check out [Viz.js](https://github.com/mdaines/viz.js).
* *Optional:* Edit `Makefile` and change the `EMCC=` line to point to your Emscripten installation.
* Run: `make`
* Done. `viz.js` will be build.

Removing Graph Engines
======================

* Edit the `Makefile` and find the `LIBSBC=` line.
* Delete one of `LIBSBC`'s lines to remove that component from the JS. Ensure that the last line doesn't end in a
  backslash.
* Run: `make`
* Test the new `viz.js` to confirm it still works for you. Repeat until you work out exactly what you need for your
  customisation.

### Removing all but the DOT engine

I was able to remove the following without noticably affecting my ability to render DOT graphs.

       $(SRCDIR)/lib/circogen/libcircogen-em.bc \
       $(SRCDIR)/lib/fdpgen/libfdpgen-em.bc \
       $(SRCDIR)/lib/neatogen/libneatogen-em.bc \
       $(SRCDIR)/lib/osage/libosage-em.bc \
       $(SRCDIR)/lib/patchwork/libpatchwork-em.bc \
       $(SRCDIR)/lib/sparse/libsparse-em.bc \
       $(SRCDIR)/lib/twopigen/libtwopigen-em.bc \
       $(SRCDIR)/plugin/neato_layout/libgvplugin_neato_layout-em.bc

My resulting `LIBSBC` value looked like this:

    LIBSBC= \
      $(EPSRCDIR)/lib/lib-em.bc \
      $(SRCDIR)/lib/cdt/libcdt-em.bc \
      $(SRCDIR)/lib/common/libcommon-em.bc \
      $(SRCDIR)/lib/dotgen/libdotgen-em.bc \
      $(SRCDIR)/lib/graph/libgraph-em.bc \
      $(SRCDIR)/lib/gvc/libgvc-em.bc \
      $(SRCDIR)/lib/pack/libpack-em.bc \
      $(SRCDIR)/lib/pathplan/libpathplan-em.bc \
      $(SRCDIR)/plugin/core/libgvplugin_core-em.bc \
      $(SRCDIR)/plugin/dot_layout/libgvplugin_dot_layout-em.bc

The resulting `viz.js` dropped from 2.2 MB down to 1.8 MB (-20%).

