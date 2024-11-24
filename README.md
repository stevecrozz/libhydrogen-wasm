# LibHydrogen

[![Test](https://github.com/stevecrozz/libhydrogen-wasm/actions/workflows/test.yml/badge.svg)](https://github.com/stevecrozz/libhydrogen-wasm/actions/workflows/test.yml)

Making LibHydrogen available to JavaScript through Emscripten.

This interface does not yet expose the entire API. Have a look at the exports to see what's available in src/hydrogen.js:

## Random
~~~js
import { ready, hydro_random_uniform } from 'libhydrogen-wasm';

ready.then(() => {
  console.log(hydro_random_uniform(9999));
});

console.log(hydrogen.hydro_random_u32());
~~~

## Secret Key Encryption
~~~js
import { ready, hydro_secretbox_keygen, hydro_secretbox_encrypt, hydro_secretbox_decrypt } from 'libhydrogen-wasm';

ready.then(() => {
  const key = hydro_secretbox_keygen();
  const messageBytes = new TextEncoder().encode('this is my message!!!');
  const cipherTextBytes = hydro_secretbox_encrypt(messageBytes, '12345678', key);
  const decryptedBytes = hydro_secretbox_decrypt(cipherTextBytes, '12345678', key);
  console.log(new TextDecoder().decode(decryptedBytes));
  // prints "this is my message!!!";
});
~~~
