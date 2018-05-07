PREFIX_FULL = $(abspath ./prefix-full)
PREFIX_LITE = $(abspath ./prefix-lite)

VIZ_VERSION = $(shell node -p "require('./package.json').version")
EXPAT_VERSION = 2.2.5
GRAPHVIZ_VERSION = 2.40.1
EMSCRIPTEN_VERSION = 1.37.36

EXPAT_SOURCE_URL = "https://github.com/libexpat/libexpat/releases/download/R_2_2_5/expat-2.2.5.tar.bz2"
GRAPHVIZ_SOURCE_URL = "https://graphviz.gitlab.io/pub/graphviz/stable/SOURCES/graphviz.tar.gz"

.PHONY: all deps deps-full deps-lite clean clobber expat–full graphviz-full graphviz-lite


all: full.render.js lite.render.js viz.js viz.es.js

deps: deps-full deps-lite

deps-full: expat-full graphviz-full

deps-lite: graphviz-lite


clean:
	rm -f build-main/viz.js build-main/viz.es.js viz.js viz.es.js
	rm -f build-full/module.js build-full/pre.js full.render.js
	rm -f build-lite/module.js build-lite/pre.js lite.render.js

clobber: | clean
	rm -rf build-main build-full build-lite $(PREFIX_FULL) $(PREFIX_LITE)


viz.es.js: src/boilerplate/pre-main.js build-main/viz.es.js
	sed -e s/{{VIZ_VERSION}}/$(VIZ_VERSION)/ -e s/{{EXPAT_VERSION}}/$(EXPAT_VERSION)/ -e s/{{GRAPHVIZ_VERSION}}/$(GRAPHVIZ_VERSION)/ -e s/{{EMSCRIPTEN_VERSION}}/$(EMSCRIPTEN_VERSION)/ $^ > $@

build-main/viz.es.js: src/index.js .babelrc
	mkdir -p build-main
	node_modules/.bin/rollup --config rollup.config.es.js


viz.js: src/boilerplate/pre-main.js build-main/viz.js
	sed -e s/{{VIZ_VERSION}}/$(VIZ_VERSION)/ -e s/{{EXPAT_VERSION}}/$(EXPAT_VERSION)/ -e s/{{GRAPHVIZ_VERSION}}/$(GRAPHVIZ_VERSION)/ -e s/{{EMSCRIPTEN_VERSION}}/$(EMSCRIPTEN_VERSION)/ $^ > $@

build-main/viz.js: src/index.js .babelrc
	mkdir -p build-main
	node_modules/.bin/rollup --config rollup.config.js


full.render.js: src/boilerplate/pre-module-full.js build-full/module.js src/boilerplate/post-module.js
	sed -e s/{{VIZ_VERSION}}/$(VIZ_VERSION)/ -e s/{{EXPAT_VERSION}}/$(EXPAT_VERSION)/ -e s/{{GRAPHVIZ_VERSION}}/$(GRAPHVIZ_VERSION)/ -e s/{{EMSCRIPTEN_VERSION}}/$(EMSCRIPTEN_VERSION)/ $^ > $@

build-full/module.js: src/viz.c
	emcc --version | grep $(EMSCRIPTEN_VERSION)
	emcc -Oz --memory-init-file 0 -s USE_ZLIB=1 -s MODULARIZE=0 -s LEGACY_VM_SUPPORT=1 -s NO_DYNAMIC_EXECUTION=1 -s EXPORTED_FUNCTIONS="['_vizRenderFromString', '_vizCreateFile', '_vizSetY_invert', '_vizLastErrorMessage', '_dtextract', '_Dtqueue']" -s EXPORTED_RUNTIME_METHODS="['Pointer_stringify', 'ccall', 'UTF8ToString']" -o $@ $< -I$(PREFIX_FULL)/include -I$(PREFIX_FULL)/include/graphviz -L$(PREFIX_FULL)/lib -L$(PREFIX_FULL)/lib/graphviz -lgvplugin_core -lgvplugin_dot_layout -lgvplugin_neato_layout -lcdt -lcgraph -lgvc -lgvpr -lpathplan -lexpat -lxdot
	

lite.render.js: src/boilerplate/pre-module-lite.js build-lite/module.js src/boilerplate/post-module.js
	sed -e s/{{VIZ_VERSION}}/$(VIZ_VERSION)/ -e s/{{GRAPHVIZ_VERSION}}/$(GRAPHVIZ_VERSION)/ -e s/{{EMSCRIPTEN_VERSION}}/$(EMSCRIPTEN_VERSION)/ $^ > $@

build-lite/module.js: src/viz.c
	emcc --version | grep $(EMSCRIPTEN_VERSION)
	emcc -D VIZ_LITE -Oz --memory-init-file 0 -s USE_ZLIB=1 -s MODULARIZE=0 -s LEGACY_VM_SUPPORT=1 -s NO_DYNAMIC_EXECUTION=1 -s EXPORTED_FUNCTIONS="['_vizRenderFromString', '_vizCreateFile', '_vizSetY_invert', '_vizLastErrorMessage', '_dtextract', '_Dtqueue', '_dtopen', '_dtdisc', '_Dtobag', '_Dtoset', '_Dttree']" -s EXPORTED_RUNTIME_METHODS="['Pointer_stringify', 'ccall', 'UTF8ToString']" -o $@ $< -I$(PREFIX_LITE)/include -I$(PREFIX_LITE)/include/graphviz -L$(PREFIX_LITE)/lib -L$(PREFIX_LITE)/lib/graphviz -lgvplugin_core -lgvplugin_dot_layout -lcdt -lcgraph -lgvc -lgvpr -lpathplan -lxdot


$(PREFIX_FULL):
	mkdir -p $(PREFIX_FULL)

expat-full: | build-full/expat-$(EXPAT_VERSION) $(PREFIX_FULL)
	grep $(EXPAT_VERSION) build-full/expat-$(EXPAT_VERSION)/expat_config.h
	cd build-full/expat-$(EXPAT_VERSION) && emconfigure ./configure --quiet --disable-shared --prefix=$(PREFIX_FULL) CFLAGS="-Oz -w"
	cd build-full/expat-$(EXPAT_VERSION) && emmake make --quiet -C lib all install

graphviz-full: | build-full/graphviz-$(GRAPHVIZ_VERSION) $(PREFIX_FULL)
	grep $(GRAPHVIZ_VERSION) build-full/graphviz-$(GRAPHVIZ_VERSION)/graphviz_version.h
	cd build-full/graphviz-$(GRAPHVIZ_VERSION) && ./configure --quiet
	cd build-full/graphviz-$(GRAPHVIZ_VERSION)/lib/gvpr && make --quiet mkdefs CFLAGS="-w"
	mkdir -p build-full/graphviz-$(GRAPHVIZ_VERSION)/FEATURE
	cp hacks/FEATURE/sfio hacks/FEATURE/vmalloc build-full/graphviz-$(GRAPHVIZ_VERSION)/FEATURE
	cd build-full/graphviz-$(GRAPHVIZ_VERSION) && emconfigure ./configure --quiet --without-sfdp --disable-ltdl --enable-static --disable-shared --prefix=$(PREFIX_FULL) CFLAGS="-Oz -w"
	cd build-full/graphviz-$(GRAPHVIZ_VERSION) && emmake make --quiet lib plugin
	cd build-full/graphviz-$(GRAPHVIZ_VERSION)/lib && emmake make --quiet install
	cd build-full/graphviz-$(GRAPHVIZ_VERSION)/plugin && emmake make --quiet install


$(PREFIX_LITE):
	mkdir -p $(PREFIX_LITE)

graphviz-lite: | build-lite/graphviz-$(GRAPHVIZ_VERSION) $(PREFIX_LITE)
	grep $(GRAPHVIZ_VERSION) build-lite/graphviz-$(GRAPHVIZ_VERSION)/graphviz_version.h
	cd build-lite/graphviz-$(GRAPHVIZ_VERSION) && ./configure --quiet
	cd build-lite/graphviz-$(GRAPHVIZ_VERSION)/lib/gvpr && make --quiet mkdefs CFLAGS="-w"
	mkdir -p build-lite/graphviz-$(GRAPHVIZ_VERSION)/FEATURE
	cp hacks/FEATURE/sfio hacks/FEATURE/vmalloc build-lite/graphviz-$(GRAPHVIZ_VERSION)/FEATURE
	cd build-lite/graphviz-$(GRAPHVIZ_VERSION) && emconfigure ./configure --quiet --without-sfdp --disable-ltdl --enable-static --disable-shared --prefix=$(PREFIX_LITE) CFLAGS="-Oz -w"
	cd build-lite/graphviz-$(GRAPHVIZ_VERSION) && emmake make --quiet lib plugin
	cd build-lite/graphviz-$(GRAPHVIZ_VERSION)/lib && emmake make --quiet install
	cd build-lite/graphviz-$(GRAPHVIZ_VERSION)/plugin && emmake make --quiet install


build-full/expat-$(EXPAT_VERSION): sources/expat-$(EXPAT_VERSION).tar.bz2
	mkdir -p $@
	tar -jxf sources/expat-$(EXPAT_VERSION).tar.bz2 --strip-components 1 -C $@

build-full/graphviz-$(GRAPHVIZ_VERSION): sources/graphviz-$(GRAPHVIZ_VERSION).tar.gz
	mkdir -p $@
	tar -zxf sources/graphviz-$(GRAPHVIZ_VERSION).tar.gz --strip-components 1 -C $@

build-lite/graphviz-$(GRAPHVIZ_VERSION): sources/graphviz-$(GRAPHVIZ_VERSION).tar.gz
	mkdir -p $@
	tar -zxf sources/graphviz-$(GRAPHVIZ_VERSION).tar.gz --strip-components 1 -C $@


sources:
	mkdir -p sources

sources/expat-$(EXPAT_VERSION).tar.bz2: | sources
	curl --fail --location $(EXPAT_SOURCE_URL) -o $@

sources/graphviz-$(GRAPHVIZ_VERSION).tar.gz: | sources
	curl --fail --location $(GRAPHVIZ_SOURCE_URL) -o $@
