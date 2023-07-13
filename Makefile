build:
	npx yalc publish --push --scripts=false

build-watch: build
	node scripts/watch.js

bump-version:
	npm version patch -f

publish:
	npm publish --access public

lint:
	npx eslint .
	npx tsc
