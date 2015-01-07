PREFIX = $(abspath ./prefix)

.PHONY: all clean clobber expat zlib graphviz


all: expat zlib graphviz viz.js

clean:
	rm -rf viz.js viz.js.map viz.js.mem

clobber: | clean
	rm -rf build prefix


viz.js: viz.c
	emcc -v -g4 -O2 -s ASSERTIONS=2 -s EXPORTED_FUNCTIONS="['_vizRenderFromString', '_dtextract', '_Dtqueue']" -o viz.js viz.c -I$(PREFIX)/include -I$(PREFIX)/include/graphviz -L$(PREFIX)/lib -L$(PREFIX)/lib/graphviz -lgvplugin_core -lgvplugin_dot_layout -lgvplugin_neato_layout -lcdt -lcgraph -lgvc -lgvpr -lpathplan -lexpat -lxdot -lz


$(PREFIX):
	mkdir -p $(PREFIX)

expat: | build/expat-2.1.0 $(PREFIX)
	cd build/expat-2.1.0 && emconfigure ./configure --disable-shared --prefix=$(PREFIX) && emmake make clean buildlib installlib

zlib: | build/zlib-1.2.8 $(PREFIX)
	cd build/zlib-1.2.8 && emconfigure ./configure --prefix=$(PREFIX) && emmake make clean install

graphviz: | build/graphviz-2.38.0 $(PREFIX)
	cd build/graphviz-2.38.0 && ./configure
	cd build/graphviz-2.38.0/lib/gvpr && make mkdefs
	mkdir build/graphviz-2.38.0/FEATURE
	cp hacks/FEATURE/sfio hacks/FEATURE/vmalloc build/graphviz-2.38.0/FEATURE
	cd build/graphviz-2.38.0 && emconfigure ./configure --disable-ltdl --enable-static --disable-shared --prefix=$(PREFIX)
	cd build/graphviz-2.38.0 && emmake make CFLAGS="-fno-common -Wall -Wno-implicit-function-declaration -Wno-warn-absolute-paths"
	cd build/graphviz-2.38.0/lib && emmake make install
	cd build/graphviz-2.38.0/plugin && emmake make install


build:
	mkdir -p build

build/expat-2.1.0: sources/expat-2.1.0.tar.gz | build
	tar -xf sources/expat-2.1.0.tar.gz -C build
	
build/zlib-1.2.8: sources/zlib-1.2.8.tar.gz | build
	tar -xf sources/zlib-1.2.8.tar.gz -C build

build/graphviz-2.38.0: sources/graphviz-2.38.0.tar.gz | build
	tar -xf sources/graphviz-2.38.0.tar.gz -C build


sources:
	mkdir -p sources

sources/expat-2.1.0.tar.gz: | sources
	curl -L "http://sourceforge.net/projects/expat/files/expat/2.1.0/expat-2.1.0.tar.gz/download" -o sources/expat-2.1.0.tar.gz

sources/zlib-1.2.8.tar.gz: | sources
	curl -L "http://sourceforge.net/projects/libpng/files/zlib/1.2.8/zlib-1.2.8.tar.gz/download" -o sources/zlib-1.2.8.tar.gz

sources/graphviz-2.38.0.tar.gz: | sources
	curl -L "http://www.graphviz.org/pub/graphviz/stable/SOURCES/graphviz-2.38.0.tar.gz" -o sources/graphviz-2.38.0.tar.gz
