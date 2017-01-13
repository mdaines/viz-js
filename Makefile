BUILD = $(abspath ./build)
BUILD_LITE = $(abspath ./build-lite)

PREFIX = $(abspath ./prefix)
PREFIX_LITE = $(abspath ./prefix-lite)

.PHONY: all lite clean clobber expat graphviz graphviz-lite


all: expat graphviz viz.js graphviz-lite viz-lite.js
	
lite: graphviz-lite viz-lite.js

clean:
	rm -f module.js viz.js module-lite.js viz-lite.js

clobber: | clean
	rm -rf $(BUILD) $(BUILD_LITE) $(PREFIX) $(PREFIX_LITE)


viz.js: src/pre.js module.js src/post.js
	cat $^ > $@

module.js: src/viz.c
	emcc -Os --closure 1 --memory-init-file 0 -s USE_ZLIB=1 -s MODULARIZE=1 -s ALLOW_MEMORY_GROWTH=1 -s EXPORTED_FUNCTIONS="['_vizRenderFromString', '_vizLastErrorMessage', '_dtextract', '_Dtqueue']" -s EXPORTED_RUNTIME_METHODS="['Pointer_stringify', 'ccall']" -o $@ $< -I$(PREFIX)/include -I$(PREFIX)/include/graphviz -L$(PREFIX)/lib -L$(PREFIX)/lib/graphviz -lgvplugin_core -lgvplugin_dot_layout -lgvplugin_neato_layout -lcdt -lcgraph -lgvc -lgvpr -lpathplan -lexpat -lxdot
	

viz-lite.js: src/pre.js module-lite.js src/post.js
	cat $^ > $@

module-lite.js: src/viz.c
	emcc -D VIZ_LITE -Os --closure 1 --memory-init-file 0 -s USE_ZLIB=1 -s MODULARIZE=1 -s ALLOW_MEMORY_GROWTH=1 -s EXPORTED_FUNCTIONS="['_vizRenderFromString', '_vizLastErrorMessage', '_dtextract', '_Dtqueue', '_dtopen', '_dtdisc', '_Dtobag', '_Dtoset', '_Dttree']" -s EXPORTED_RUNTIME_METHODS="['Pointer_stringify', 'ccall']" -o $@ $< -I$(PREFIX_LITE)/include -I$(PREFIX_LITE)/include/graphviz -L$(PREFIX_LITE)/lib -L$(PREFIX_LITE)/lib/graphviz -lgvplugin_core -lgvplugin_dot_layout -lcdt -lcgraph -lgvc -lgvpr -lpathplan -lxdot


$(PREFIX):
	mkdir -p $(PREFIX)

expat: | $(BUILD)/expat-2.1.0 $(PREFIX)
	cd $(BUILD)/expat-2.1.0 && emconfigure ./configure --disable-shared --prefix=$(PREFIX) CFLAGS="-Os"
	cd $(BUILD)/expat-2.1.0 && emmake make buildlib installlib

graphviz: | $(BUILD)/graphviz-2.38.0 $(PREFIX)
	cd $(BUILD)/graphviz-2.38.0 && ./configure
	cd $(BUILD)/graphviz-2.38.0/lib/gvpr && make mkdefs
	mkdir -p $(BUILD)/graphviz-2.38.0/FEATURE
	cp hacks/FEATURE/sfio hacks/FEATURE/vmalloc $(BUILD)/graphviz-2.38.0/FEATURE
	cd $(BUILD)/graphviz-2.38.0 && emconfigure ./configure --disable-ltdl --enable-static --disable-shared --prefix=$(PREFIX) CFLAGS="-Os -Wno-implicit-function-declaration"
	cd $(BUILD)/graphviz-2.38.0 && emmake make
	cd $(BUILD)/graphviz-2.38.0/lib && emmake make install
	cd $(BUILD)/graphviz-2.38.0/plugin && emmake make install


$(PREFIX_LITE):
	mkdir -p $(PREFIX_LITE)

graphviz-lite: | $(BUILD_LITE)/graphviz-2.38.0 $(PREFIX_LITE)
	cd $(BUILD_LITE)/graphviz-2.38.0 && ./configure
	cd $(BUILD_LITE)/graphviz-2.38.0/lib/gvpr && make mkdefs
	mkdir -p $(BUILD_LITE)/graphviz-2.38.0/FEATURE
	cp hacks/FEATURE/sfio hacks/FEATURE/vmalloc $(BUILD_LITE)/graphviz-2.38.0/FEATURE
	cd $(BUILD_LITE)/graphviz-2.38.0 && emconfigure ./configure --disable-ltdl --enable-static --disable-shared --prefix=$(PREFIX_LITE) CFLAGS="-Os -Wno-implicit-function-declaration"
	cd $(BUILD_LITE)/graphviz-2.38.0 && emmake make
	cd $(BUILD_LITE)/graphviz-2.38.0/lib && emmake make install
	cd $(BUILD_LITE)/graphviz-2.38.0/plugin && emmake make install


$(BUILD):
	mkdir -p $(BUILD)

$(BUILD)/expat-2.1.0: sources/expat-2.1.0.tar.gz | $(BUILD)
	tar -zxf sources/expat-2.1.0.tar.gz -C $(BUILD)

$(BUILD)/graphviz-2.38.0: sources/graphviz-2.38.0.tar.gz | $(BUILD)
	tar -zxf sources/graphviz-2.38.0.tar.gz -C $(BUILD)


$(BUILD_LITE):
	mkdir -p $(BUILD_LITE)

$(BUILD_LITE)/graphviz-2.38.0: sources/graphviz-2.38.0.tar.gz | $(BUILD_LITE)
	tar -zxf sources/graphviz-2.38.0.tar.gz -C $(BUILD_LITE)


sources:
	mkdir -p sources

sources/expat-2.1.0.tar.gz: | sources
	curl -L "http://sourceforge.net/projects/expat/files/expat/2.1.0/expat-2.1.0.tar.gz/download" -o sources/expat-2.1.0.tar.gz

sources/graphviz-2.38.0.tar.gz: | sources
	curl -L "http://www.graphviz.org/pub/graphviz/stable/SOURCES/graphviz-2.38.0.tar.gz" -o sources/graphviz-2.38.0.tar.gz
