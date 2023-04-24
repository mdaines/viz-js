lib/viz.js: lib/encoded.mjs lib/module.mjs src/index.mjs src/standalone.mjs rollup.config.mjs
	yarn rollup -c rollup.config.mjs

lib/encoded.mjs: src/Dockerfile src/viz.c src/encode-wasm.mjs
	docker build -o lib src
