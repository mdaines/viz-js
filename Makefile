# To compile, emcc must be in your path or EMSCRIPTEN_ROOT must be set.
EMCC:=$(shell if command -v emcc > /dev/null; then echo "emcc"; else echo "$(EMSCRIPTEN_ROOT)/emcc"; fi)
SRCDIR=graphviz-src

viz.js: $(SRCDIR) viz.c $(SRCDIR)/lib/cdt/libcdt-em.bc $(SRCDIR)/lib/common/libcommon-em.bc $(SRCDIR)/lib/gvc/libgvc-em.bc $(SRCDIR)/lib/pathplan/libpathplan-em.bc $(SRCDIR)/lib/graph/libgraph-em.bc $(SRCDIR)/lib/dotgen/libdotgen-em.bc $(SRCDIR)/plugin/core/libgvplugin_core-em.bc $(SRCDIR)/plugin/dot_layout/libgvplugin_dot_layout-em.bc post.js pre.js
	$(EMCC) -v -O2 -s EXPORTED_FUNCTIONS='["_vizRenderFromString"]' -o viz.js -I$(SRCDIR)/lib/gvc -I$(SRCDIR)/lib/common -I$(SRCDIR)/lib/pathplan -I$(SRCDIR)/lib/cdt -I$(SRCDIR)/lib/graph viz.c $(SRCDIR)/lib/cdt/libcdt-em.bc $(SRCDIR)/lib/common/libcommon-em.bc $(SRCDIR)/lib/gvc/libgvc-em.bc $(SRCDIR)/lib/pathplan/libpathplan-em.bc $(SRCDIR)/lib/graph/libgraph-em.bc $(SRCDIR)/lib/dotgen/libdotgen-em.bc $(SRCDIR)/plugin/dot_layout/libgvplugin_dot_layout-em.bc $(SRCDIR)/plugin/core/libgvplugin_core-em.bc --pre-js pre.js --post-js post.js --closure 1

$(SRCDIR)/lib/cdt/libcdt-em.bc:
	cd $(SRCDIR)/lib/cdt; $(EMCC) -o libcdt-em.bc -I. dtclose.c dtdisc.c dtextract.c dtflatten.c dthash.c dtlist.c dtmethod.c dtopen.c dtsize.c dtstrhash.c dttree.c dttreeset.c dtrestore.c dtview.c dtwalk.c

$(SRCDIR)/lib/common/libcommon-em.bc:
	cd $(SRCDIR)/lib/common; $(EMCC) -o libcommon-em.bc -I. -I.. -I../.. -I../../.. -I../gvc -I../pathplan -I../cdt -I../graph -I../xdot -DHAVE_CONFIG_H arrows.c emit.c utils.c labels.c memory.c fontmetrics.c geom.c globals.c htmllex.c htmlparse.c htmltable.c ns.c postproc.c routespl.c shapes.c splines.c colxlate.c psusershape.c input.c timing.c output.c

$(SRCDIR)/lib/gvc/libgvc-em.bc:
	cd $(SRCDIR)/lib/gvc; $(EMCC) -o libgvc-em.bc -I. -I.. -I../.. -I../../.. -I../common -I../pathplan -I../cdt -I../graph -DHAVE_CONFIG_H gvc.c gvconfig.c gvcontext.c gvdevice.c gvlayout.c gvevent.c gvjobs.c gvplugin.c gvrender.c gvusershape.c gvloadimage.c gvtextlayout.c

$(SRCDIR)/lib/pathplan/libpathplan-em.bc:
	cd $(SRCDIR)/lib/pathplan; $(EMCC) -o libpathplan-em.bc -I. cvt.c inpoly.c route.c shortest.c solvers.c triang.c util.c visibility.c

$(SRCDIR)/lib/graph/libgraph-em.bc:
	cd $(SRCDIR)/lib/graph; $(EMCC) -o libgraph-em.bc -I. -I../cdt -I../gvc -I../common -I../pathplan agxbuf.c attribs.c edge.c graph.c graphio.c lexer.c node.c parser.c refstr.c trie.c

$(SRCDIR)/lib/dotgen/libdotgen-em.bc:
	cd $(SRCDIR)/lib/dotgen; $(EMCC) -o libdotgen-em.bc -I. -I.. -I../.. -I../../.. -I../common -I../gvc -I../pathplan -I../cdt -I../graph -DHAVE_CONFIG_H acyclic.c aspect.c class1.c class2.c cluster.c compound.c conc.c decomp.c dotinit.c dotsplines.c fastgr.c flat.c mincross.c position.c rank.c sameport.c

$(SRCDIR)/plugin/core/libgvplugin_core-em.bc:
	cd $(SRCDIR)/plugin/core; $(EMCC) -o libgvplugin_core-em.bc -I. -I.. -I../.. -I../../.. -I../../lib -I../../lib/common -I../../lib/gvc -I../../lib/pathplan -I../../lib/cdt -I../../lib/graph -DHAVE_CONFIG_H gvplugin_core.c gvrender_core_dot.c gvrender_core_fig.c gvrender_core_map.c gvrender_core_ps.c gvrender_core_svg.c gvrender_core_tk.c gvrender_core_vml.c gvloadimage_core.c

$(SRCDIR)/plugin/dot_layout/libgvplugin_dot_layout-em.bc:
	cd $(SRCDIR)/plugin/dot_layout; $(EMCC) -o libgvplugin_dot_layout-em.bc -I. -I.. -I../.. -I../../.. -I../../lib -I../../lib/common -I../../lib/gvc -I../../lib/pathplan -I../../lib/cdt -I../../lib/graph -DHAVE_CONFIG_H gvplugin_dot_layout.c gvlayout_dot_layout.c

$(SRCDIR): | graphviz-src.tar.gz
	mkdir -p $(SRCDIR)
	tar xf graphviz-src.tar.gz -C $(SRCDIR) --strip=1

graphviz-src.tar.gz:
	curl "http://www.graphviz.org/pub/graphviz/stable/SOURCES/graphviz-2.28.0.tar.gz" -o graphviz-src.tar.gz

clean:
	rm -f $(SRCDIR)/lib/*/*.bc
	rm -f $(SRCDIR)/plugin/*/*.bc
	rm -f viz.js

clobber: clean
	rm -rf $(SRCDIR)
	rm -f graphviz-src.tar.gz
