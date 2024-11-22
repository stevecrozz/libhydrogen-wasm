EMCC = emcc
EMMAKE = emmake

all: build

build:
	mkdir -p dist
	$(EMCC) \
		-sEXPORTED_RUNTIME_METHODS=["cwrap"] \
		-sEXPORTED_FUNCTIONS=_hydro_init,_hydro_random_u32 \
		libhydrogen/hydrogen.c -o dist/hydrogen.js

test:
	node dist/hydrogen.js

clean:
	cd libhydrogen; $(EMMAKE) make clean
	rm -f dist/hydrogen.*
