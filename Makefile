EMCC = emcc
EMMAKE = emmake

EXPORTED_FUNCTIONS_SEPARATOR:= ,_
EMPTY:=
EXPORTED_FUNCTIONS_LIST:= hydro_init \
	hydro_random_u32 \
	hydro_random_uniform \
	hydro_random_buf \
	hydro_random_buf_deterministic \
	hydro_random_ratchet \
	hydro_random_reseed \
	hydro_hash_hash \
	hydro_hash_keygen \
	hydro_hash_init \
	hydro_hash_update \
	hydro_hash_final \
	free \
	malloc

EXPORTED_FUNCTIONS:= $(subst $(EMPTY) $(EMPTY),$(EXPORTED_FUNCTIONS_SEPARATOR),_$(EXPORTED_FUNCTIONS_LIST))

all: build

build:
	mkdir -p dist
	$(EMCC) \
		-sEXPORTED_RUNTIME_METHODS=[ccall,cwrap] \
		-sEXPORTED_FUNCTIONS=$(EXPORTED_FUNCTIONS) \
		libhydrogen/hydrogen.c -o dist/hydrogen.js

test:
	node dist/hydrogen.js

clean:
	cd libhydrogen; $(EMMAKE) make clean
	rm -f dist/hydrogen.*
