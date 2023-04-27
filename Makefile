lib/viz.js: lib/encoded.mjs lib/module.mjs src/viz.mjs src/standalone.mjs rollup.config.mjs
	yarn rollup -c rollup.config.mjs

lib/encoded.mjs: src/Dockerfile src/viz.c src/encode-wasm.mjs src/pre.js
	docker build -o lib src
