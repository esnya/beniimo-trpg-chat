ALL=webroot/js/common.js webroot/js/client.js webroot/js/flip.js

all: $(ALL)

clean:
	rm $(ALL)

webroot/js/common.js:	webroot/ts/common/common.ts
	tsc --module commonjs -t ES5 webroot/ts/common/common.ts -out webroot/js/common.js
	mv webroot/ts/common/common.js webroot/js/common.js

webroot/js/client.js:	webroot/ts/client.ts webroot/ts/common/common.d.ts
	tsc --module commonjs -t ES5 webroot/ts/client.ts -out webroot/js/client.js

webroot/js/flip.js:	webroot/ts/flip.ts
	tsc --module commonjs -t ES5 webroot/ts/flip.ts -out webroot/js/flip.js
