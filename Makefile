build:
	npx yalc publish --push --scripts=false

build-watch: build
	node scripts/watch.js

publish:
	npm version patch -f
	npm publish --access public

lint:
	npx eslint .
	npx tsc
