.PHONY: all clean

all: lib/metadata.js lib/backend.js

lib/metadata.js: lib/backend.js src/viz.js
	node scripts/generate-metadata.js lib/metadata.js

lib/backend.js: backend/Dockerfile backend/viz.c backend/pre.js
	docker build --progress=plain --build-arg DEBUG="${DEBUG}" -o lib backend
	@test -f lib/backend.js && touch lib/backend.js

clean:
	rm -f lib/metadata.js lib/backend.js
