FROM emscripten/emsdk:3.1.33 AS graphviz

ENV PREFIX=/prefix

ADD "https://github.com/libexpat/libexpat/releases/download/R_2_5_0/expat-2.5.0.tar.gz" ./expat.tar.gz

RUN mkdir -p expat && tar -zxf ./expat.tar.gz --strip-components 1 --directory expat
RUN cd expat && emconfigure ./configure --host=wasm32 --disable-shared --prefix="${PREFIX}" --libdir="${PREFIX}/lib" CFLAGS="-Oz"
RUN cd expat/lib && emmake make all install

ADD "https://gitlab.com/api/v4/projects/4207231/packages/generic/graphviz-releases/8.0.3/graphviz-8.0.3.tar.gz" ./graphviz.tar.gz

RUN mkdir -p graphviz && tar -zxf ./graphviz.tar.gz --strip-components 1 --directory graphviz
RUN cd graphviz && emconfigure ./configure --host=wasm32 --disable-ltdl --prefix="${PREFIX}" --libdir="${PREFIX}/lib" CFLAGS="-Oz"
RUN cd graphviz/lib && emmake make install
RUN cd graphviz/plugin && emmake make install


FROM emscripten/emsdk:3.1.33 AS viz

ENV PREFIX=/prefix
ENV OUTPUT=/output

COPY --from=graphviz "${PREFIX}" "${PREFIX}"
COPY viz.c encode-wasm.mjs .

RUN mkdir -p "${OUTPUT}"
RUN emcc -Oz --closure=0 --no-entry -sMODULARIZE=1 -sMINIMAL_RUNTIME=1 -sFILESYSTEM=0 -sASSERTIONS=0 -sALLOW_MEMORY_GROWTH=1 -sENVIRONMENT=web -sEXPORT_KEEPALIVE=1 -sEXPORTED_FUNCTIONS="['_free']" -s EXPORTED_RUNTIME_METHODS="['ccall', 'UTF8ToString']" -sINCOMING_MODULE_JS_API="['wasm']" -o "${OUTPUT}/module.mjs" viz.c -I"${PREFIX}/include" -I"${PREFIX}/include/graphviz" -L"${PREFIX}/lib" -L"${PREFIX}/lib/graphviz" -lgvplugin_core -lgvplugin_dot_layout -lgvplugin_neato_layout -lcdt -lcgraph -lgvc -lpathplan -lexpat -lxdot
RUN node encode-wasm.mjs "${OUTPUT}/module.wasm" "${OUTPUT}/encoded.mjs"


FROM scratch AS export

ENV OUTPUT=/output

COPY --from=viz "${OUTPUT}" /
