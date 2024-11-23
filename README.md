# LibHydrogen

Making LibHydrogen available to JavaScript through Emscripten.

This interface does not yet expose the entire API. Have a look at the exports to see what's available in src/hydrogen.js:

## Random
~~~js
const hydrogen = require('libhydrogen-wasm');

console.log(hydrogen.hydro_random_u32());
~~~

## Secret Key Encryption
~~~js
const key = hydro_secretbox_keygen();
const messageBytes = new TextEncoder().encode('this is my message!!!');
const cipherTextBytes = hydro_secretbox_encrypt(messageBytes, '12345678', key);
const decryptedBytes = hydro_secretbox_decrypt(cipherTextBytes, '12345678', key);
console.log(new TextDecoder().decode(decryptedBytes));
// prints "this is my message!!!";
~~~
