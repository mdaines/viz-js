{
  description = "Nix build for the Viz.js npm package";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    { self, nixpkgs }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
      ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f system);
    in
    {
      packages = forAllSystems (
        system:
        let
          pkgs = import nixpkgs { inherit system; };

          expatSrc = pkgs.fetchurl {
            url = "https://github.com/libexpat/libexpat/releases/download/R_2_7_5/expat-2.7.5.tar.gz";
            hash = "sha256-mTH5hg0Y5s9y0YPrjzCb+5YZbADh1Ayql46VvJqpeLY=";
          };

          graphvizSrc = pkgs.fetchurl {
            url = "https://gitlab.com/api/v4/projects/4207231/packages/generic/graphviz-releases/14.1.5/graphviz-14.1.5.tar.gz";
            hash = "sha256-9c5bDc8XSBdnPzweOKzyU6c9QLeVl8MQa5avxtrA1w8=";
          };

          vizBackend = pkgs.stdenv.mkDerivation {
            pname = "viz-backend";
            version = "3.26.0";

            src = pkgs.lib.fileset.toSource {
              root = ./.;
              fileset = pkgs.lib.fileset.unions [
                ./packages/viz/backend/Dockerfile
                ./packages/viz/backend/pre.js
                ./packages/viz/backend/viz.c
              ];
            };

            nativeBuildInputs = [
              pkgs.emscripten
              pkgs.perl
            ];

            dontConfigure = true;

            buildPhase = ''
              runHook preBuild

              export HOME="$TMPDIR"
              export EM_CACHE="$TMPDIR/emscripten-cache"
              export PREFIX="$TMPDIR/prefix"

              cp -r "$src" work
              chmod -R u+w work
              cd work/packages/viz/backend

              mkdir expat graphviz
              tar -xzf ${expatSrc} --strip-components=1 -C expat
              tar -xzf ${graphvizSrc} --strip-components=1 -C graphviz

              pushd expat
              emconfigure ./configure \
                --host=wasm32 \
                --disable-shared \
                --prefix="$PREFIX" \
                --libdir="$PREFIX/lib" \
                CFLAGS="-Oz" \
                CXXFLAGS="-Oz"
              emmake make -C lib all install
              popd

              pushd graphviz
              emconfigure ./configure \
                --host=wasm32 \
                --disable-ltdl \
                --prefix="$PREFIX" \
                --libdir="$PREFIX/lib" \
                EXPAT_CFLAGS="-I$PREFIX/include" \
                EXPAT_LIBS="-L$PREFIX/lib -lexpat" \
                CFLAGS="-Oz" \
                CXXFLAGS="-Oz"
              emmake make -C lib install
              emmake make -C plugin install
              popd

              mkdir -p $out
              emcc \
                -I"$PREFIX/include" \
                -I"$PREFIX/include/graphviz" \
                -L"$PREFIX/lib" \
                -L"$PREFIX/lib/graphviz" \
                -lgvplugin_dot_layout \
                -lgvplugin_neato_layout \
                -lgvplugin_core \
                -lgvc \
                -lpathplan \
                -lcgraph \
                -lxdot \
                -lcdt \
                -lexpat \
                -Oz \
                --no-entry \
                -s MODULARIZE=1 \
                -s EXPORT_ES6=1 \
                -s SINGLE_FILE=1 \
                -s ASSERTIONS=0 \
                -s ALLOW_MEMORY_GROWTH=1 \
                -s ENVIRONMENT=web \
                -s EXPORT_KEEPALIVE=1 \
                -s EXPORTED_FUNCTIONS="['_malloc', '_free']" \
                -s EXPORTED_RUNTIME_METHODS="['ccall', 'UTF8ToString', 'lengthBytesUTF8', 'stringToUTF8', 'getValue', 'FS', 'PATH']" \
                -s INCOMING_MODULE_JS_API="['wasm']" \
                -s WASM_BIGINT=1 \
                -o "$out/backend.js" \
                --pre-js pre.js \
                viz.c

              runHook postBuild
            '';
          };

          vizPackage = pkgs.buildNpmPackage {
            pname = "viz-js-viz";
            version = "3.26.0";

            src = ./.;
            npmWorkspace = "packages/viz";
            npmDepsHash = "sha256-ObFQE2SVwvgxTjbIxpCb53mFRScUjgB39ikJd17uotI=";
            npmDepsFetcherVersion = 2;
            nodejs = pkgs.nodejs_24;

            dontNpmBuild = true;
            dontNpmInstall = true;

            buildPhase = ''
              runHook preBuild

              mkdir -p packages/viz/lib
              cp ${vizBackend}/backend.js packages/viz/lib/backend.js
              node packages/viz/scripts/generate-metadata.js packages/viz/lib/metadata.js
              pushd packages/viz
              npm exec -- rollup -c
              popd

              runHook postBuild
            '';

            installPhase = ''
              runHook preInstall

              packageOut="$out/lib/node_modules/@viz-js/viz"
              mkdir -p "$packageOut"

              cp -r packages/viz/dist "$packageOut/dist"
              cp -r packages/viz/lib "$packageOut/lib"
              cp -r packages/viz/src "$packageOut/src"
              cp -r packages/viz/types "$packageOut/types"
              cp packages/viz/package.json "$packageOut/package.json"
              cp packages/viz/README.md "$packageOut/README.md"
              cp packages/viz/CHANGELOG.md "$packageOut/CHANGELOG.md"

              runHook postInstall
            '';

            meta = {
              description = "WebAssembly build of Graphviz with a simple wrapper for using it on the web";
              homepage = "https://github.com/mdaines/viz-js";
              license = pkgs.lib.licenses.mit;
              mainProgram = null;
            };
          };
        in
        {
          default = vizPackage;
          viz = vizPackage;
          viz-backend = vizBackend;
        }
      );

      devShells = forAllSystems (
        system:
        let
          pkgs = import nixpkgs { inherit system; };
        in
        {
          default = pkgs.mkShellNoCC {
            packages = [
              pkgs.nodejs_24
              pkgs.emscripten
              pkgs.perl
            ];
          };
        }
      );
    };
}
