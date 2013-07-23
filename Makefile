# To compile, emcc must be in your path or EMSCRIPTEN_ROOT must be set.
EMCC:=$(shell if command -v emcc > /dev/null; then echo "emcc"; else echo "$(EMSCRIPTEN_ROOT)/emcc"; fi)
EMDEFS=-DHAVE_CONFIG_H -I$(PWD)
EMFLAGS=-v -O3 -s ASM_JS=1 $(EMDEFS)
#EMFLAGS=-v -g $(EMDEFS)	# <-- for debugging
SRCDIR=graphviz-src
EPSRCDIR=libexpat-src

viz.js: $(SRCDIR) $(EPSRCDIR) viz.c $(EPSRCDIR)/lib/lib-em.bc $(SRCDIR)/lib/cdt/libcdt-em.bc $(SRCDIR)/lib/common/libcommon-em.bc $(SRCDIR)/lib/gvc/libgvc-em.bc $(SRCDIR)/lib/pathplan/libpathplan-em.bc $(SRCDIR)/lib/graph/libgraph-em.bc $(SRCDIR)/lib/pack/libpack-em.bc $(SRCDIR)/lib/osage/libosage-em.bc $(SRCDIR)/lib/patchwork/libpatchwork-em.bc $(SRCDIR)/lib/sparse/libsparse-em.bc $(SRCDIR)/lib/dotgen/libdotgen-em.bc $(SRCDIR)/lib/neatogen/libneatogen-em.bc $(SRCDIR)/lib/circogen/libcircogen-em.bc $(SRCDIR)/lib/fdpgen/libfdpgen-em.bc $(SRCDIR)/lib/twopigen/libtwopigen-em.bc $(SRCDIR)/plugin/core/libgvplugin_core-em.bc $(SRCDIR)/plugin/dot_layout/libgvplugin_dot_layout-em.bc $(SRCDIR)/plugin/neato_layout/libgvplugin_neato_layout-em.bc post.js pre.js
	$(EMCC) $(EMFLAGS) -s EXPORTED_FUNCTIONS='["_vizRenderFromString"]' -o viz.js -I$(SRCDIR)/lib/gvc \
	-I$(SRCDIR)/lib/common -I$(SRCDIR)/lib/pathplan -I$(SRCDIR)/lib/cdt -I$(SRCDIR)/lib/graph -I$(EPSRCDIR)/lib viz.c \
	$(SRCDIR)/lib/cdt/libcdt-em.bc $(SRCDIR)/lib/common/libcommon-em.bc $(SRCDIR)/lib/gvc/libgvc-em.bc \
	$(SRCDIR)/lib/pathplan/libpathplan-em.bc $(SRCDIR)/lib/graph/libgraph-em.bc $(SRCDIR)/lib/pack/libpack-em.bc $(SRCDIR)/lib/osage/libosage-em.bc \
	$(SRCDIR)/lib/patchwork/libpatchwork-em.bc $(SRCDIR)/lib/circogen/libcircogen-em.bc $(SRCDIR)/lib/fdpgen/libfdpgen-em.bc \
	$(SRCDIR)/lib/sparse/libsparse-em.bc $(SRCDIR)/lib/dotgen/libdotgen-em.bc $(SRCDIR)/lib/neatogen/libneatogen-em.bc \
	$(SRCDIR)/lib/twopigen/libtwopigen-em.bc $(SRCDIR)/plugin/dot_layout/libgvplugin_dot_layout-em.bc \
	$(SRCDIR)/plugin/neato_layout/libgvplugin_neato_layout-em.bc $(SRCDIR)/plugin/core/libgvplugin_core-em.bc $(EPSRCDIR)/lib/lib-em.bc \
	--pre-js pre.js --post-js post.js

$(SRCDIR)/lib/cdt/libcdt-em.bc:
	cd $(SRCDIR)/lib/cdt; $(EMCC) $(EMFLAGS) -o libcdt-em.bc -I. dtclose.c dtdisc.c dtextract.c dtflatten.c dthash.c dtlist.c dtmethod.c dtopen.c dtsize.c dtstrhash.c dttree.c dttreeset.c dtrestore.c dtview.c dtwalk.c

$(EPSRCDIR)/lib/lib-em.bc:
	cd $(EPSRCDIR)/lib; $(EMCC) $(EMFLAGS) -o lib-em.bc -I. -I.. -DHAVE_BCOPY xmlparse.c xmlrole.c xmltok.c

$(SRCDIR)/lib/common/libcommon-em.bc:
	cd $(SRCDIR)/lib/common; $(EMCC) $(EMFLAGS) -o libcommon-em.bc -I../../../ -I. -I.. -I../.. -I../../.. -I../gvc -I../pathplan -I../cdt -I../graph -I../xdot -I../../../$(EPSRCDIR)/lib arrows.c emit.c utils.c labels.c memory.c fontmetrics.c geom.c globals.c htmllex.c htmlparse.c htmltable.c ns.c pointset.c postproc.c routespl.c shapes.c splines.c colxlate.c psusershape.c input.c timing.c output.c

$(SRCDIR)/lib/gvc/libgvc-em.bc:
	cd $(SRCDIR)/lib/gvc; $(EMCC) $(EMFLAGS) -o libgvc-em.bc -I. -I.. -I../.. -I../../.. -I../common -I../pathplan -I../cdt -I../graph gvc.c gvconfig.c gvcontext.c gvdevice.c gvlayout.c gvevent.c gvjobs.c gvplugin.c gvrender.c gvusershape.c gvloadimage.c gvtextlayout.c

$(SRCDIR)/lib/pathplan/libpathplan-em.bc:
	cd $(SRCDIR)/lib/pathplan; $(EMCC) $(EMFLAGS) -o libpathplan-em.bc -I. cvt.c inpoly.c route.c shortest.c shortestpth.c solvers.c triang.c util.c visibility.c

$(SRCDIR)/lib/pack/libpack-em.bc:
	cd $(SRCDIR)/lib/pack; $(EMCC) $(EMFLAGS) -o libpack-em.bc -I. -I../common -I../neatogen -I../pathplan -I../graph -I../cdt -I../gvc ccomps.c pack.c

$(SRCDIR)/lib/osage/libosage-em.bc:
	cd $(SRCDIR)/lib/osage; $(EMCC) $(EMFLAGS) -o libosage-em.bc -I. -I../common -I../gvc -I../neatogen -I../fdpgen -I../pack -I../pathplan -I../sparse -I../graph -I../cdt osageinit.c

$(SRCDIR)/lib/patchwork/libpatchwork-em.bc:
	cd $(SRCDIR)/lib/patchwork; $(EMCC) $(EMFLAGS) -o libpatchwork-em.bc -I. -I../common -I../gvc -I../neatogen -I../fdpgen -I../pack -I../pathplan -I../sparse -I../graph -I../cdt patchwork.c patchworkinit.c tree_map.c

$(SRCDIR)/lib/sparse/libsparse-em.bc:
	cd $(SRCDIR)/lib/sparse; $(EMCC) $(EMFLAGS) -o libsparse-em.bc -I. -I../common SparseMatrix.c general.c BinaryHeap.c IntStack.c

$(SRCDIR)/lib/graph/libgraph-em.bc:
	cd $(SRCDIR)/lib/graph; $(EMCC) $(EMFLAGS) -o libgraph-em.bc -I. -I../cdt -I../gvc -I../common -I../pathplan agxbuf.c attribs.c edge.c graph.c graphio.c lexer.c node.c parser.c refstr.c trie.c

$(SRCDIR)/lib/dotgen/libdotgen-em.bc:
	cd $(SRCDIR)/lib/dotgen; $(EMCC) $(EMFLAGS) -o libdotgen-em.bc -I. -I.. -I../.. -I../../.. -I../common -I../gvc -I../pathplan -I../cdt -I../graph acyclic.c aspect.c class1.c class2.c cluster.c compound.c conc.c decomp.c dotinit.c dotsplines.c fastgr.c flat.c mincross.c position.c rank.c sameport.c

$(SRCDIR)/lib/neatogen/libneatogen-em.bc:
	cd $(SRCDIR)/lib/neatogen; $(EMCC) $(EMFLAGS) -o libneatogen-em.bc -I. -I.. -I../.. -I../../.. -I../common -I../gvc -I../pack -I../ortho -I../rbtree -I../sfdpgen -I../sparse -I../pathplan -I../cdt -I../graph adjust.c circuit.c edges.c geometry.c heap.c hedges.c info.c neatoinit.c legal.c lu.c matinv.c memory.c poly.c printvis.c site.c solve.c neatosplines.c stuff.c voronoi.c stress.c kkutils.c matrix_ops.c embed_graph.c dijkstra.c conjgrad.c pca.c closest.c bfs.c constraint.c quad_prog_solve.c smart_ini_x.c constrained_majorization.c opt_arrangement.c overlap.c call_tri.c compute_hierarchy.c delaunay.c multispline.c

$(SRCDIR)/lib/fdpgen/libfdpgen-em.bc:
	cd $(SRCDIR)/lib/fdpgen; $(EMCC) $(EMFLAGS) -o libfdpgen-em.bc -I. -I.. -I../.. -I../../.. -I../common -I../gvc -I../neatogen -I../pack -I../sparse -I../pathplan -I../cdt -I../graph comp.c dbg.c grid.c fdpinit.c layout.c tlayout.c xlayout.c clusteredges.c

$(SRCDIR)/lib/circogen/libcircogen-em.bc:
	cd $(SRCDIR)/lib/circogen; $(EMCC) $(EMFLAGS) -o libcircogen-em.bc -I. -I.. -I../.. -I../../.. -I../common -I../gvc -I../neatogen -I../pack -I../sparse -I../pathplan -I../cdt -I../graph circularinit.c nodelist.c block.c edgelist.c circular.c deglist.c blocktree.c blockpath.c circpos.c nodeset.c

$(SRCDIR)/lib/twopigen/libtwopigen-em.bc:
	cd $(SRCDIR)/lib/twopigen; $(EMCC) $(EMFLAGS) -o libtwopigen-em.bc -I. -I.. -I../.. -I../../.. -I../common -I../gvc -I../neatogen -I../pack -I../sparse -I../pathplan -I../cdt -I../graph circle.c twopiinit.c

$(SRCDIR)/plugin/core/libgvplugin_core-em.bc:
	cd $(SRCDIR)/plugin/core; $(EMCC) $(EMFLAGS) -o libgvplugin_core-em.bc -I. -I.. -I../.. -I../../.. -I../../lib -I../../lib/common -I../../lib/gvc -I../../lib/pathplan -I../../lib/cdt -I../../lib/graph gvplugin_core.c gvrender_core_dot.c gvrender_core_fig.c gvrender_core_map.c gvrender_core_ps.c gvrender_core_svg.c gvrender_core_tk.c gvrender_core_vml.c gvloadimage_core.c

$(SRCDIR)/plugin/dot_layout/libgvplugin_dot_layout-em.bc:
	cd $(SRCDIR)/plugin/dot_layout; $(EMCC) $(EMFLAGS) -o libgvplugin_dot_layout-em.bc -I. -I.. -I../.. -I../../.. -I../../lib -I../../lib/common -I../../lib/gvc -I../../lib/pathplan -I../../lib/cdt -I../../lib/graph gvplugin_dot_layout.c gvlayout_dot_layout.c

$(SRCDIR)/plugin/neato_layout/libgvplugin_neato_layout-em.bc:
	cd $(SRCDIR)/plugin/neato_layout; $(EMCC) $(EMFLAGS) -o libgvplugin_neato_layout-em.bc -I. -I.. -I../.. -I../../.. -I../../lib -I../../lib/common -I../../lib/gvc -I../../lib/pathplan -I../../lib/cdt -I../../lib/graph gvplugin_neato_layout.c gvlayout_neato_layout.c

$(SRCDIR): | graphviz-2.28.0.tar.gz
	mkdir -p $(SRCDIR)
	tar xf graphviz-2.28.0.tar.gz -C $(SRCDIR) --strip=1

$(EPSRCDIR): | expat-2.1.0.tar.gz
	mkdir -p $(EPSRCDIR)
	tar xf expat-2.1.0.tar.gz -C $(EPSRCDIR) --strip=1

graphviz-2.28.0.tar.gz:
	curl "http://www.graphviz.org/pub/graphviz/stable/SOURCES/graphviz-2.28.0.tar.gz" -o graphviz-2.28.0.tar.gz

expat-2.1.0.tar.gz:
	curl -L "http://sourceforge.net/projects/expat/files/expat/2.1.0/expat-2.1.0.tar.gz/download" -o expat-2.1.0.tar.gz

clean:
	rm -f $(SRCDIR)/lib/*/*.bc
	rm -f $(SRCDIR)/plugin/*/*.bc
	rm -f $(EPSRCDIR)/lib/*.bc
	rm -f viz.js

clobber: clean
	rm -rf $(SRCDIR)
	rm -rf $(EPSRCDIR)
