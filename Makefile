PREFIX = $(abspath ./prefix)

.PHONY: all clean clobber expat graphviz


all: expat graphviz viz.js

clean:
	rm -f module.js viz.js

clobber: | clean
	rm -rf build prefix


viz.js: src/pre.js module.js src/post.js
	cat $^ > $@

module.js: src/viz.c
	emcc -v -O2 --memory-init-file 0 -s USE_ZLIB=1 -s MODULARIZE=1 -s EXPORTED_FUNCTIONS="['_vizRenderFromString', '_aglasterr', '_dtextract', '_Dtqueue']" -o $@ $< -I$(PREFIX)/include -I$(PREFIX)/include/graphviz -L$(PREFIX)/lib -L$(PREFIX)/lib/graphviz -lgvplugin_core -lgvplugin_dot_layout -lgvplugin_neato_layout -lcdt -lcgraph -lgvc -lgvpr -lpathplan -lexpat -lxdot -lz


$(PREFIX):
	mkdir -p $(PREFIX)

expat: | build/expat-2.1.0 $(PREFIX)
	cd build/expat-2.1.0 && emconfigure ./configure --disable-shared --prefix=$(PREFIX)
	cd build/expat-2.1.0 && emmake make buildlib installlib

graphviz: | build/graphviz-2.38.0 $(PREFIX)
	cd build/graphviz-2.38.0 && ./configure
	cd build/graphviz-2.38.0/lib/gvpr && make mkdefs
	mkdir -p build/graphviz-2.38.0/FEATURE
	cp hacks/FEATURE/sfio hacks/FEATURE/vmalloc build/graphviz-2.38.0/FEATURE
	cd build/graphviz-2.38.0 && emconfigure ./configure --disable-ltdl --enable-static --disable-shared --prefix=$(PREFIX)
	cd build/graphviz-2.38.0 && emmake make CFLAGS="-fno-common -Wno-implicit-function-declaration -Wno-warn-absolute-paths"
	cd build/graphviz-2.38.0/lib && emmake make install
	cd build/graphviz-2.38.0/plugin && emmake make install


build:
	mkdir -p build

build/expat-2.1.0: sources/expat-2.1.0.tar.gz | build
	tar -xf sources/expat-2.1.0.tar.gz -C build

build/graphviz-2.38.0: sources/graphviz-2.38.0.tar.gz | build
	tar -xf sources/graphviz-2.38.0.tar.gz -C build


sources:
	mkdir -p sources

sources/expat-2.1.0.tar.gz: | sources
	curl -L "http://sourceforge.net/projects/expat/files/expat/2.1.0/expat-2.1.0.tar.gz/download" -o sources/expat-2.1.0.tar.gz

sources/graphviz-2.38.0.tar.gz: | sources
	curl -L "http://www.graphviz.org/pub/graphviz/stable/SOURCES/graphviz-2.38.0.tar.gz" -o sources/graphviz-2.38.0.tar.gz
