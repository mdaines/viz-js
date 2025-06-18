.PHONY: all clean

all: lib/encoded.js lib/metadata.js dist/viz.js dist/viz.cjs dist/viz-global.js

dist/viz.js dist/viz.cjs dist/viz-global.js: lib/encoded.js lib/metadata.js lib/module.mjs src/viz.js src/index.js rollup.config.js
	npm exec -- rollup -c rollup.config.js

lib/encoded.js: lib/module.wasm scripts/encode-wasm.js
	node scripts/encode-wasm.js lib/module.wasm lib/encoded.js

lib/metadata.js: lib/encoded.js lib/module.mjs src/viz.js scripts/encode-wasm.js
	node scripts/generate-metadata.js lib/metadata.js

lib/module.mjs lib/module.wasm: backend/Dockerfile backend/viz.c backend/pre.js
	docker build --progress=plain --build-arg DEBUG="${DEBUG}" -o lib backend
	@test -f lib/module.mjs && touch lib/module.mjs
	@test -f lib/module.wasm && touch lib/module.wasm

clean:
	rm -f lib/module.mjs lib/module.wasm lib/encoded.js lib/metadata.js dist/viz.js dist/viz.cjs dist/viz-global.js
