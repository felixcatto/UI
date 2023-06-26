build:
	npx yalc publish --push --changed --scripts=false

build-watch: build
	node scripts/watch.js

publish:
	npm version patch -f
	npm publish --access public

lint:
	npx eslint .
	npx tsc
