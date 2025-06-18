FROM emscripten/emsdk:3.1.70 AS graphviz

ENV PREFIX=/prefix

ADD "https://github.com/libexpat/libexpat/releases/download/R_2_7_1/expat-2.7.1.tar.gz" ./expat.tar.gz

RUN mkdir -p expat && tar -zxf ./expat.tar.gz --strip-components 1 --directory expat
RUN cd expat && emconfigure ./configure \
  --host=wasm32 \
  --disable-shared \
  --prefix="${PREFIX}" \
  --libdir="${PREFIX}/lib" \
  CFLAGS="-Oz" \
  CXXFLAGS="-Oz"
RUN cd expat/lib && emmake make all install

ADD "https://gitlab.com/api/v4/projects/4207231/packages/generic/graphviz-releases/13.0.1/graphviz-13.0.1.tar.gz" ./graphviz.tar.gz

RUN mkdir -p graphviz && tar -zxf ./graphviz.tar.gz --strip-components 1 --directory graphviz
RUN cd graphviz && emconfigure ./configure \
  --host=wasm32 \
  --disable-ltdl \
  --prefix="${PREFIX}" \
  --libdir="${PREFIX}/lib" \
  EXPAT_CFLAGS="-I${PREFIX}/include" \
  EXPAT_LIBS="-L${PREFIX}/lib -lexpat" \
  CFLAGS="-Oz" \
  CXXFLAGS="-Oz"
RUN cd graphviz/lib && emmake make install
RUN cd graphviz/plugin && emmake make install


FROM emscripten/emsdk:3.1.70 AS viz

ARG DEBUG=""

ENV PREFIX=/prefix
ENV OUTPUT=/output

COPY --from=graphviz "${PREFIX}" "${PREFIX}"
COPY viz.c pre.js .

RUN mkdir -p "${OUTPUT}"
RUN emcc \
  -I"${PREFIX}/include" \
  -I"${PREFIX}/include/graphviz" \
  -L"${PREFIX}/lib" \
  -L"${PREFIX}/lib/graphviz" \
  -lgvplugin_dot_layout \
  -lgvplugin_neato_layout \
  -lgvplugin_core \
  -lgvc \
  -lpathplan \
  -lcgraph \
  -lxdot \
  -lcdt \
  -lexpat \
  ${DEBUG:+-g2} \
  -Oz \
  --closure=0 \
  --no-entry \
  -s MODULARIZE=1 \
  -s MINIMAL_RUNTIME=1 \
  -s ASSERTIONS=0 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s ENVIRONMENT=web \
  -s EXPORT_KEEPALIVE=1 \
  -s EXPORTED_FUNCTIONS="['_malloc', '_free']" \
  -s EXPORTED_RUNTIME_METHODS="['ccall', 'UTF8ToString', 'lengthBytesUTF8', 'stringToUTF8', 'getValue', 'FS', 'PATH']" \
  -s INCOMING_MODULE_JS_API="['wasm']" \
  -s WASM_BIGINT=1 \
  -o "${OUTPUT}/module.mjs" \
  --pre-js pre.js \
  viz.c


FROM scratch AS export

ENV OUTPUT=/output

COPY --from=viz "${OUTPUT}" /
