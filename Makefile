.PHONY: all clean

all: lib/viz-standalone.js lib/viz-standalone.mjs

lib/viz-standalone.%: lib/encoded.mjs lib/module.mjs src/viz.mjs src/standalone.mjs rollup.config.mjs
	yarn rollup -c rollup.config.mjs

lib/encoded.mjs: lib/module.wasm scripts/encode-wasm.mjs
	node scripts/encode-wasm.mjs lib/module.wasm lib/encoded.mjs

lib/module.%: src/module/Dockerfile src/module/viz.c src/module/pre.js
	docker build --progress=plain --build-arg DEBUG="${DEBUG}" -o lib src/module
	@test -f lib/module.mjs && touch lib/module.mjs
	@test -f lib/module.wasm && touch lib/module.wasm

clean:
	rm -f lib/module.mjs lib/module.wasm lib/encoded.mjs lib/viz-standalone.js lib/viz-standalone.mjs
