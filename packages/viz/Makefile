.PHONY: all clean

all: lib/backend.js lib/metadata.js dist/viz.js dist/viz.cjs dist/viz-global.js

dist/viz.js dist/viz.cjs dist/viz-global.js: lib/backend.js lib/metadata.js lib/backend.js src/viz.js src/index.js rollup.config.js
	npm exec -- rollup -c rollup.config.js

lib/metadata.js: lib/backend.js src/viz.js
	node scripts/generate-metadata.js lib/metadata.js

lib/backend.js: backend/Dockerfile backend/viz.c backend/pre.js
	docker build --progress=plain --build-arg DEBUG="${DEBUG}" -o lib backend
	@test -f lib/backend.js && touch lib/backend.js

clean:
	rm -f lib/backend.js lib/encoded.js lib/metadata.js dist/viz.js dist/viz.cjs dist/viz-global.js
