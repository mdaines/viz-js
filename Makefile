BUILD = $(abspath ./build)
BUILD_LITE = $(abspath ./build-lite)

PREFIX = $(abspath ./prefix)
PREFIX_LITE = $(abspath ./prefix-lite)

VIZ_VERSION = 1.8.0
EXPAT_VERSION = 2.2.5
GRAPHVIZ_VERSION = 2.40.1
EMSCRIPTEN_VERSION = $(notdir $(EMSCRIPTEN))

EXPAT_SOURCE_URL = "https://github.com/libexpat/libexpat/releases/download/R_2_2_5/expat-2.2.5.tar.bz2"
GRAPHVIZ_SOURCE_URL = "https://graphviz.gitlab.io/pub/graphviz/stable/SOURCES/graphviz.tar.gz"

.PHONY: all lite clean clobber expat graphviz graphviz-lite


all: expat graphviz viz.js graphviz-lite viz-lite.js
	
lite: graphviz-lite viz-lite.js

clean:
	rm -f $(BUILD)/module.js $(BUILD)/pre.js $(BUILD_LITE)/module.js viz.js viz-lite.js

clobber: | clean
	rm -rf $(BUILD) $(BUILD_LITE) $(PREFIX) $(PREFIX_LITE)


viz.js: src/boilerplate/pre.js $(BUILD)/module.js src/api.js src/boilerplate/post.js
	sed -e s/{{VIZ_VERSION}}/$(VIZ_VERSION)/ -e s/{{EXPAT_VERSION}}/$(EXPAT_VERSION)/ -e s/{{GRAPHVIZ_VERSION}}/$(GRAPHVIZ_VERSION)/ -e s/{{EMSCRIPTEN_VERSION}}/$(EMSCRIPTEN_VERSION)/ $^ > $@

$(BUILD)/module.js: src/viz.c
	emcc -Oz --memory-init-file 0 -s USE_ZLIB=1 -s MODULARIZE=1 -s NO_DYNAMIC_EXECUTION=1 -s EXPORTED_FUNCTIONS="['_vizRenderFromString', '_vizCreateFile', '_vizLastErrorMessage', '_dtextract', '_Dtqueue']" -s EXPORTED_RUNTIME_METHODS="['Pointer_stringify', 'ccall', 'UTF8ToString']" -o $@ $< -I$(PREFIX)/include -I$(PREFIX)/include/graphviz -L$(PREFIX)/lib -L$(PREFIX)/lib/graphviz -lgvplugin_core -lgvplugin_dot_layout -lgvplugin_neato_layout -lcdt -lcgraph -lgvc -lgvpr -lpathplan -lexpat -lxdot
	

viz-lite.js: src/boilerplate/pre-lite.js $(BUILD_LITE)/module.js src/api.js src/boilerplate/post.js
	sed -e s/{{VIZ_VERSION}}/$(VIZ_VERSION)/ -e s/{{GRAPHVIZ_VERSION}}/$(GRAPHVIZ_VERSION)/ -e s/{{EMSCRIPTEN_VERSION}}/$(EMSCRIPTEN_VERSION)/ $^ > $@

$(BUILD_LITE)/module.js: src/viz.c
	emcc -D VIZ_LITE -Oz --memory-init-file 0 -s USE_ZLIB=1 -s MODULARIZE=1 -s NO_DYNAMIC_EXECUTION=1 -s EXPORTED_FUNCTIONS="['_vizRenderFromString', '_vizCreateFile', '_vizLastErrorMessage', '_dtextract', '_Dtqueue', '_dtopen', '_dtdisc', '_Dtobag', '_Dtoset', '_Dttree']" -s EXPORTED_RUNTIME_METHODS="['Pointer_stringify', 'ccall', 'UTF8ToString']" -o $@ $< -I$(PREFIX_LITE)/include -I$(PREFIX_LITE)/include/graphviz -L$(PREFIX_LITE)/lib -L$(PREFIX_LITE)/lib/graphviz -lgvplugin_core -lgvplugin_dot_layout -lcdt -lcgraph -lgvc -lgvpr -lpathplan -lxdot


$(PREFIX):
	mkdir -p $(PREFIX)

expat: | $(BUILD)/expat-$(EXPAT_VERSION) $(PREFIX)
	grep $(EXPAT_VERSION) $(BUILD)/expat-$(EXPAT_VERSION)/expat_config.h
	cd $(BUILD)/expat-$(EXPAT_VERSION) && emconfigure ./configure --quiet --disable-shared --prefix=$(PREFIX) CFLAGS="-Oz -w"
	cd $(BUILD)/expat-$(EXPAT_VERSION) && emmake make --quiet -C lib all install

graphviz: | $(BUILD)/graphviz-$(GRAPHVIZ_VERSION) $(PREFIX)
	grep $(GRAPHVIZ_VERSION) $(BUILD)/graphviz-$(GRAPHVIZ_VERSION)/graphviz_version.h
	cd $(BUILD)/graphviz-$(GRAPHVIZ_VERSION) && ./configure --quiet
	cd $(BUILD)/graphviz-$(GRAPHVIZ_VERSION)/lib/gvpr && make --quiet mkdefs CFLAGS="-w"
	mkdir -p $(BUILD)/graphviz-$(GRAPHVIZ_VERSION)/FEATURE
	cp hacks/FEATURE/sfio hacks/FEATURE/vmalloc $(BUILD)/graphviz-$(GRAPHVIZ_VERSION)/FEATURE
	cd $(BUILD)/graphviz-$(GRAPHVIZ_VERSION) && emconfigure ./configure --quiet --disable-ltdl --enable-static --disable-shared --prefix=$(PREFIX) CFLAGS="-Oz -w"
	cd $(BUILD)/graphviz-$(GRAPHVIZ_VERSION) && emmake make --quiet lib plugin
	cd $(BUILD)/graphviz-$(GRAPHVIZ_VERSION)/lib && emmake make --quiet install
	cd $(BUILD)/graphviz-$(GRAPHVIZ_VERSION)/plugin && emmake make --quiet install


$(PREFIX_LITE):
	mkdir -p $(PREFIX_LITE)

graphviz-lite: | $(BUILD_LITE)/graphviz-$(GRAPHVIZ_VERSION) $(PREFIX_LITE)
	grep $(GRAPHVIZ_VERSION) $(BUILD_LITE)/graphviz-$(GRAPHVIZ_VERSION)/graphviz_version.h
	cd $(BUILD_LITE)/graphviz-$(GRAPHVIZ_VERSION) && ./configure --quiet
	cd $(BUILD_LITE)/graphviz-$(GRAPHVIZ_VERSION)/lib/gvpr && make --quiet mkdefs CFLAGS="-w"
	mkdir -p $(BUILD_LITE)/graphviz-$(GRAPHVIZ_VERSION)/FEATURE
	cp hacks/FEATURE/sfio hacks/FEATURE/vmalloc $(BUILD_LITE)/graphviz-$(GRAPHVIZ_VERSION)/FEATURE
	cd $(BUILD_LITE)/graphviz-$(GRAPHVIZ_VERSION) && emconfigure ./configure --quiet --disable-ltdl --enable-static --disable-shared --prefix=$(PREFIX_LITE) CFLAGS="-Oz -w"
	cd $(BUILD_LITE)/graphviz-$(GRAPHVIZ_VERSION) && emmake make --quiet lib plugin
	cd $(BUILD_LITE)/graphviz-$(GRAPHVIZ_VERSION)/lib && emmake make --quiet install
	cd $(BUILD_LITE)/graphviz-$(GRAPHVIZ_VERSION)/plugin && emmake make --quiet install


$(BUILD):
	mkdir -p $(BUILD)

$(BUILD)/expat-$(EXPAT_VERSION): sources/expat-$(EXPAT_VERSION).tar.bz2 | $(BUILD)
	mkdir -p $@
	tar -jxf sources/expat-$(EXPAT_VERSION).tar.bz2 --strip-components 1 -C $@

$(BUILD)/graphviz-$(GRAPHVIZ_VERSION): sources/graphviz-$(GRAPHVIZ_VERSION).tar.gz | $(BUILD)
	mkdir -p $@
	tar -zxf sources/graphviz-$(GRAPHVIZ_VERSION).tar.gz --strip-components 1 -C $@


$(BUILD_LITE):
	mkdir -p $(BUILD_LITE)

$(BUILD_LITE)/graphviz-$(GRAPHVIZ_VERSION): sources/graphviz-$(GRAPHVIZ_VERSION).tar.gz | $(BUILD_LITE)
	mkdir -p $@
	tar -zxf sources/graphviz-$(GRAPHVIZ_VERSION).tar.gz --strip-components 1 -C $@


sources:
	mkdir -p sources

sources/expat-$(EXPAT_VERSION).tar.bz2: | sources
	curl --fail --location $(EXPAT_SOURCE_URL) -o $@

sources/graphviz-$(GRAPHVIZ_VERSION).tar.gz: | sources
	curl --fail --location $(GRAPHVIZ_SOURCE_URL) -o $@
