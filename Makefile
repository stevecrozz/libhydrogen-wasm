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
	hydro_secretbox_keygen \
	hydro_secretbox_encrypt \
	hydro_secretbox_decrypt \
	hydro_secretbox_probe_create \
	hydro_secretbox_probe_verify \
	hydro_kdf_keygen \
	hydro_kdf_derive_from_key \
	hydro_sign_create \
	hydro_sign_final_create \
	hydro_sign_final_verify \
	hydro_sign_init \
	hydro_sign_keygen \
	hydro_sign_keygen_deterministic \
	hydro_sign_update \
	hydro_sign_verify \
	hydro_kx_keygen \
	hydro_kx_keygen_deterministic \
	hydro_kx_n_1 \
	hydro_kx_n_2 \
	free \
	malloc

EXPORTED_FUNCTIONS:= $(subst $(EMPTY) $(EMPTY),$(EXPORTED_FUNCTIONS_SEPARATOR),_$(EXPORTED_FUNCTIONS_LIST))

all: build

build:
	mkdir -p wasm
	$(EMCC) \
		-sEXPORTED_RUNTIME_METHODS=[ccall,cwrap] \
		-sEXPORTED_FUNCTIONS=$(EXPORTED_FUNCTIONS) \
		libhydrogen/hydrogen.c -o wasm/libhydrogen.js

test:
	node wasm/hydrogen.js

clean:
	cd libhydrogen; $(EMMAKE) make clean
	rm -f wasm/libhydrogen.*
