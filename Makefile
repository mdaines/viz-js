lib/viz.js: lib/encoded.mjs lib/module.mjs src/viz.mjs src/standalone.mjs rollup.config.mjs
	yarn rollup -c rollup.config.mjs

lib/encoded.mjs: lib/module.wasm src/encode-wasm.mjs
	node src/encode-wasm.mjs lib/module.wasm lib/encoded.mjs

lib/module.%: src/Dockerfile src/viz.c src/pre.js
	docker build -o lib src
	@test -f lib/module.mjs && touch lib/module.mjs
	@test -f lib/module.wasm && touch lib/module.wasm

.PHONY: clean
clean:
	rm -f lib/module.mjs lib/module.wasm lib/encoded.mjs lib/viz.js
