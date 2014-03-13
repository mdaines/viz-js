EMCC=$(CURDIR)/emscripten/emcc
SRCDIR=graphviz-src
EPSRCDIR=libexpat-src
ZLIBDIR=zlib
LIBSBC= \
	$(EPSRCDIR)/lib/lib-em.bc \
	$(ZLIBDIR)/libz-em.bc \
	$(SRCDIR)/lib/cdt/libcdt-em.bc \
	$(SRCDIR)/lib/common/libcommon-em.bc \
	$(SRCDIR)/lib/xdot/libxdot-em.bc \
	$(SRCDIR)/lib/dotgen/libdotgen-em.bc \
	$(SRCDIR)/lib/circogen/libcircogen-em.bc \
	$(SRCDIR)/lib/neatogen/libneatogen-em.bc \
	$(SRCDIR)/lib/twopigen/libtwopigen-em.bc \
	$(SRCDIR)/lib/patchwork/libpatchwork-em.bc \
	$(SRCDIR)/lib/osage/libosage-em.bc \
	$(SRCDIR)/lib/sparse/libsparse-em.bc \
	$(SRCDIR)/lib/pack/libpack-em.bc \
	$(SRCDIR)/lib/cgraph/libcgraph-em.bc \
	$(SRCDIR)/lib/fdpgen/libfdpgen-em.bc \
	$(SRCDIR)/lib/label/liblabel-em.bc \
	$(SRCDIR)/lib/gvc/libgvc-em.bc \
	$(SRCDIR)/lib/pathplan/libpathplan-em.bc \
	$(SRCDIR)/plugin/core/libgvplugin_core-em.bc \
	$(SRCDIR)/plugin/dot_layout/libgvplugin_dot_layout-em.bc \
	$(SRCDIR)/plugin/neato_layout/libgvplugin_neato_layout-em.bc
VIZOPTS=-v -O2 -s ASM_JS=1 --closure 1
LIBOPTS=-O2

viz.js: $(SRCDIR) viz.c $(LIBSBC) post.js pre.js
	$(EMCC) $(VIZOPTS) -s EXPORTED_FUNCTIONS='["_vizRenderFromString"]' -o viz.js -I$(SRCDIR)/lib/gvc -I$(SRCDIR)/lib/common -I$(SRCDIR)/lib/pathplan -I$(SRCDIR)/lib/cdt -I$(SRCDIR)/lib/cgraph -I$(EPSRCDIR)/lib viz.c $(LIBSBC) --pre-js pre.js --post-js post.js

set_verbose_emscripten:
	$(eval VIZOPTS += -s VERBOSE=1)

verbose: set_verbose_emscripten viz.js

$(EPSRCDIR)/lib/lib-em.bc: $(EPSRCDIR)
	cd $(EPSRCDIR)/lib; $(EMCC) $(LIBOPTS) -o lib-em.bc -I. -I.. -DHAVE_BCOPY -DHAVE_CONFIG_H xmlparse.c xmlrole.c xmltok.c
	
$(ZLIBDIR)/libz-em.bc:
	cd $(ZLIBDIR); $(EMCC) $(LIBOPTS) -o libz-em.bc -D_LARGEFILE64_SOURCE=1 -DHAVE_HIDDEN -D_FILE_OFFSET_BITS=64 -I. adler32.c compress.c crc32.c deflate.c gzclose.c gzlib.c gzread.c gzwrite.c infback.c inffast.c inflate.c inftrees.c trees.c uncompr.c zutil.c

$(SRCDIR)/lib/cdt/libcdt-em.bc:
	cd $(SRCDIR)/lib/cdt; $(EMCC) $(LIBOPTS) -o libcdt-em.bc -DHAVE_CONFIG_H -I. -I../.. -I../../.. dtclose.c dtdisc.c dtextract.c dtflatten.c dthash.c dtlist.c dtmethod.c dtopen.c dtrenew.c dtrestore.c dtsize.c dtstat.c dtstrhash.c dttree.c dttreeset.c dtview.c dtwalk.c

$(SRCDIR)/lib/common/libcommon-em.bc:
	cd $(SRCDIR)/lib/common; $(EMCC) $(LIBOPTS) -o libcommon-em.bc -DHAVE_CONFIG_H -DHAVE_EXPAT_H -DHAVE_EXPAT -I. -I.. -I../.. -I../../.. -I../gvc -I../pathplan -I../cdt -I../cgraph -I../fdpgen -I../label -I../xdot -I../../../$(EPSRCDIR)/lib args.c arrows.c colxlate.c ellipse.c emit.c geom.c globals.c htmllex.c htmlparse.c htmltable.c input.c intset.c labels.c memory.c ns.c output.c pointset.c postproc.c psusershape.c routespl.c shapes.c splines.c strcasecmp.c strncasecmp.c taper.c textspan.c timing.c utils.c

$(SRCDIR)/lib/xdot/libxdot-em.bc:
	cd $(SRCDIR)/lib/xdot; $(EMCC) $(LIBOPTS) -o libxdot-em.bc -DHAVE_CONFIG_H -I. -I.. -I../.. -I../../.. -I../common -I../gvc -I../pathplan -I../cdt -I../cgraph xdot.c

$(SRCDIR)/lib/dotgen/libdotgen-em.bc:
	cd $(SRCDIR)/lib/dotgen; $(EMCC) $(LIBOPTS) -o libdotgen-em.bc -DHAVE_CONFIG_H -I. -I.. -I../.. -I../../.. -I../common -I../gvc -I../pathplan -I../cdt -I../cgraph acyclic.c aspect.c class1.c class2.c cluster.c compound.c conc.c decomp.c dotinit.c dotsplines.c fastgr.c flat.c mincross.c position.c rank.c sameport.c

$(SRCDIR)/lib/circogen/libcircogen-em.bc:
	cd $(SRCDIR)/lib/circogen; $(EMCC) $(LIBOPTS) -o libcircogen-em.bc -DHAVE_CONFIG_H -I. -I.. -I../.. -I../../.. -I../common -I../gvc -I../pathplan -I../cdt -I../cgraph -I../neatogen -I../sparse -I../pack block.c blockpath.c blocktree.c circpos.c circular.c circularinit.c deglist.c edgelist.c nodelist.c nodeset.c

$(SRCDIR)/lib/neatogen/libneatogen-em.bc:
	cd $(SRCDIR)/lib/neatogen; $(EMCC) $(LIBOPTS) -o libneatogen-em.bc -DHAVE_CONFIG_H -I. -I.. -I../.. -I../../.. -I../common -I../gvc -I../pathplan -I../cdt -I../cgraph -I../sparse -I../pack adjust.c bfs.c call_tri.c circuit.c closest.c compute_hierarchy.c conjgrad.c constrained_majorization.c constrained_majorization_ipsep.c constraint.c delaunay.c dijkstra.c edges.c embed_graph.c geometry.c heap.c hedges.c info.c kkutils.c legal.c lu.c matinv.c matrix_ops.c memory.c mosek_quad_solve.c multispline.c neatoinit.c neatosplines.c opt_arrangement.c overlap.c pca.c poly.c printvis.c quad_prog_solve.c quad_prog_vpsc.c site.c smart_ini_x.c solve.c stress.c stuff.c voronoi.c

$(SRCDIR)/lib/twopigen/libtwopigen-em.bc:
	cd $(SRCDIR)/lib/twopigen; $(EMCC) $(LIBOPTS) -o libtwopigen-em.bc -DHAVE_CONFIG_H -I. -I.. -I../.. -I../../.. -I../common -I../gvc -I../pathplan -I../cdt -I../cgraph -I../neatogen -I../sparse -I../pack circle.c twopiinit.c

$(SRCDIR)/lib/patchwork/libpatchwork-em.bc:
	cd $(SRCDIR)/lib/patchwork; $(EMCC) $(LIBOPTS) -o libpatchwork-em.bc -DHAVE_CONFIG_H -I. -I.. -I../.. -I../../.. -I../common -I../gvc -I../pathplan -I../cdt -I../cgraph -I../sparse -I../pack -I../fdpgen -I../neatogen patchwork.c patchworkinit.c tree_map.c

$(SRCDIR)/lib/osage/libosage-em.bc:
	cd $(SRCDIR)/lib/osage; $(EMCC) $(LIBOPTS) -o libosage-em.bc -DHAVE_CONFIG_H -I. -I.. -I../.. -I../../.. -I../common -I../gvc -I../pathplan -I../cdt -I../cgraph -I../sparse -I../pack -I../fdpgen -I../neatogen osageinit.c

$(SRCDIR)/lib/sparse/libsparse-em.bc:
	cd $(SRCDIR)/lib/sparse; $(EMCC) $(LIBOPTS) -o libsparse-em.bc -DHAVE_CONFIG_H -I. -I.. -I../.. -I../../.. -I../common -I../gvc -I../pathplan -I../cdt -I../cgraph BinaryHeap.c general.c IntStack.c SparseMatrix.c

$(SRCDIR)/lib/pack/libpack-em.bc:
	cd $(SRCDIR)/lib/pack; $(EMCC) $(LIBOPTS) -o libpack-em.bc -DHAVE_CONFIG_H -I. -I.. -I../.. -I../../.. -I../common -I../gvc -I../pathplan -I../cdt -I../cgraph -I../neatogen -I../sparse ccomps.c pack.c

$(SRCDIR)/lib/cgraph/libcgraph-em.bc:
	cd $(SRCDIR)/lib/cgraph; $(EMCC) $(LIBOPTS) -o libcgraph-em.bc -DHAVE_STRCASECMP -DHAVE_CONFIG_H -I. -I../../.. -I../cdt -I../gvc -I../common -I../pathplan agerror.c agxbuf.c apply.c attr.c edge.c flatten.c grammar.c graph.c id.c imap.c io.c mem.c node.c obj.c pend.c rec.c refstr.c scan.c subg.c tester.c utils.c write.c
	
$(SRCDIR)/lib/fdpgen/libfdpgen-em.bc:
	cd $(SRCDIR)/lib/fdpgen; $(EMCC) $(LIBOPTS) -o libfdpgen-em.bc -DHAVE_CONFIG_H -I. -I../../.. -I../cdt -I../gvc -I../common -I../pathplan -I../cgraph -I../neatogen -I../sparse -I../pack clusteredges.c comp.c dbg.c fdpinit.c grid.c layout.c tlayout.c xlayout.c
	
$(SRCDIR)/lib/label/liblabel-em.bc:
	cd $(SRCDIR)/lib/label; $(EMCC) $(LIBOPTS) -o liblabel-em.bc -DHAVE_CONFIG_H -I. -I../cdt -I../gvc -I../cgraph -I../../.. -I../common -I../pathplan index.c node.c rectangle.c split.q.c xlabels.c
	
$(SRCDIR)/lib/gvc/libgvc-em.bc:
	cd $(SRCDIR)/lib/gvc; $(EMCC) $(LIBOPTS) -o libgvc-em.bc -DHAVE_CONFIG_H -I. -I.. -I../.. -I../../.. -I../common -I../pathplan -I../cdt -I../cgraph gvbuffstderr.c gvc.c gvconfig.c gvcontext.c gvdevice.c gvevent.c gvjobs.c gvlayout.c gvloadimage.c gvplugin.c gvrender.c gvtextlayout.c gvusershape.c

$(SRCDIR)/lib/pathplan/libpathplan-em.bc:
	cd $(SRCDIR)/lib/pathplan; $(EMCC) $(LIBOPTS) -o libpathplan-em.bc -DHAVE_CONFIG_H -I. -I../../.. cvt.c inpoly.c route.c shortest.c shortestpth.c solvers.c triang.c util.c visibility.c
	
$(SRCDIR)/plugin/core/libgvplugin_core-em.bc:
	cd $(SRCDIR)/plugin/core; $(EMCC) $(LIBOPTS) -o libgvplugin_core-em.bc -DHAVE_CONFIG_H -I. -I.. -I../.. -I../../.. -I../../lib -I../../lib/common -I../../lib/gvc -I../../lib/pathplan -I../../lib/cdt -I../../lib/cgraph gvplugin_core.c gvrender_core_dot.c gvrender_core_fig.c gvrender_core_map.c gvrender_core_ps.c gvrender_core_svg.c gvrender_core_tk.c gvrender_core_vml.c gvrender_core_pic.c gvrender_core_pov.c gvloadimage_core.c

$(SRCDIR)/plugin/dot_layout/libgvplugin_dot_layout-em.bc:
	cd $(SRCDIR)/plugin/dot_layout; $(EMCC) $(LIBOPTS) -o libgvplugin_dot_layout-em.bc -DHAVE_CONFIG_H -I. -I.. -I../.. -I../../.. -I../../lib -I../../lib/common -I../../lib/gvc -I../../lib/pathplan -I../../lib/cdt -I../../lib/cgraph gvplugin_dot_layout.c gvlayout_dot_layout.c

$(SRCDIR)/plugin/neato_layout/libgvplugin_neato_layout-em.bc:
	cd $(SRCDIR)/plugin/neato_layout; $(EMCC) $(LIBOPTS) -o libgvplugin_neato_layout-em.bc -DHAVE_CONFIG_H -I. -I.. -I../.. -I../../.. -I../../lib -I../../lib/common -I../../lib/gvc -I../../lib/pathplan -I../../lib/cdt -I../../lib/cgraph gvlayout_neato_layout.c gvplugin_neato_layout.c

$(SRCDIR): | graphviz-2.36.0.tar.gz
	mkdir -p $(SRCDIR)
	tar xf graphviz-2.36.0.tar.gz -C $(SRCDIR) --strip=1
	patch --input=../../../scan.c.patch --directory=$(SRCDIR)/lib/cgraph

$(EPSRCDIR): | expat-2.1.0.tar.gz
	mkdir -p $(EPSRCDIR)
	tar xf expat-2.1.0.tar.gz -C $(EPSRCDIR) --strip=1

graphviz-2.36.0.tar.gz:
	curl "http://www.graphviz.org/pub/graphviz/stable/SOURCES/graphviz-2.36.0.tar.gz" -o graphviz-2.36.0.tar.gz

expat-2.1.0.tar.gz:
	curl -L "http://sourceforge.net/projects/expat/files/expat/2.1.0/expat-2.1.0.tar.gz/download" -o expat-2.1.0.tar.gz

clean:
	rm -f $(SRCDIR)/lib/*/*.bc
	rm -f $(SRCDIR)/plugin/*/*.bc
	rm -f $(EPSRCDIR)/lib/*.bc
	rm -f $(ZLIBDIR)/*.bc
	rm -f viz.js

clobber: clean
	rm -rf $(SRCDIR)
	rm -rf $(EPSRCDIR)
