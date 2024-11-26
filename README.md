# LibHydrogen

[![Test](https://github.com/stevecrozz/libhydrogen-wasm/actions/workflows/test.yml/badge.svg)](https://github.com/stevecrozz/libhydrogen-wasm/actions/workflows/test.yml)

Making LibHydrogen available to JavaScript through Emscripten.

The goal of this project is to expose the complete LibHydrogen API and make it
runnable in both Node.JS and browser runtimes.

## Random
~~~js
import { ready, randomU32 } from "libhydrogen-wasm";

ready.then(() => {
  randomU32();
});
~~~

## Hashing
~~~js
import { ready, hashHash, hashKeygen } from "libhydrogen-wasm";

ready.then(() => {
  const key = hashKeygen();
  hashHash("Arbitrary data to hash", "Examples", key);
});
~~~

## Key Derivation
~~~js
import { ready, kdfKeygen, kdfDeriveFromKey } from "libhydrogen-wasm";

ready.then(() => {
  const key = kdfKeygen();
  const subkey = kdfDeriveFromKey(40, 0, 'CCCCCCCC', key);
});
~~~

## Signing
~~~js
import { ready, signKeygen, signCreate, signVerify } from "libhydrogen-wasm";

ready.then(() => {
  const { pk, sk } = signKeygen();
  const key = kdfKeygen();
  const signature = signCreate('my message', '12345678', sk);
  const verification = signVerify(signature, 'my message', '12345678', pk);
});
~~~

## Encryption
~~~js
import { ready, secretboxKeygen, secretboxEncrypt, secretboxDecrypt } from "libhydrogen-wasm";

ready.then(() => {
  const messageBytes = new TextEncoder().encode('test message');
  const key = secretboxKeygen();
  const cipherText = secretboxEncrypt(messageBytes, '12345678', key);
  const decryptedBytes = secretboxDecrypt(cipherText, '12345678', key);
});
~~~

## Key Exchange N1
~~~js
import { ready, kxKeygen, kxN1, kxN2 } from "libhydrogen-wasm";

ready.then(() => {
  const serverStaticKp = kxKeygen();
  const client = kxN1(null, serverStaticKp.pk);
  const server = kxN2(client.packet, null, serverStaticKp);

  // client.tx === server.rx
  // server.tx === client.rx
});
~~~
