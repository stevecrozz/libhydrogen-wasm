const Module = require('../wasm/libhydrogen.js');

const { allocateUint8Array } = require('./utility');
const {
  randomSEEDBYTES,
  randomU32,
  randomUniform,
  randomRatchet,
  randomReseed,
  randomBuf,
  randomBufDeterministic,
} = require('./random');

const {
  hash_BYTES,
  hash_BYTES_MAX,
  hash_BYTES_MIN,
  hash_CONTEXTBYTES,
  hash_KEYBYTES,
  hashHash,
  hashKeygen,
  hashInit,
  hashUpdate,
  hashFinal,
} = require('./hash');

const {
  secretbox_CONTEXTBYTES,
  secretbox_HEADERBYTES,
  secretbox_KEYBYTES,
  secretbox_PROBEBYTES,
  secretboxKeygen,
  secretboxEncrypt,
  secretboxDecrypt,
  secretboxProbeCreate,
  secretboxProbeVerify,
} = require('./secretbox');

const hydro_init = Module.cwrap('hydro_init');

const ready = new Promise((resolve, reject) => {
  Module.onRuntimeInitialized = () => {
    resolve();
  };
});

ready.then(() => {
  // /**
  //  * secretbox test
  //  */
  // const key3 = hydro_secretbox_keygen();
  // const messageBytes = new TextEncoder().encode('this is my message!!!');
  // const cipherText = hydro_secretbox_encrypt(messageBytes, '12345678', key3);
  // const probe = hydro_secretbox_probe_create(cipherText, '12345678', key3);
  // const verification = hydro_secretbox_probe_verify(probe, cipherText, '12345678', key3);
  // console.log(`Probe verified: ${verification === 0}`);
  // const decryptedBytes = hydro_secretbox_decrypt(cipherText, '12345678', key3);
  // console.log(new TextDecoder().decode(decryptedBytes));
});

module.exports = {
  ready,
  hydro_init,
  randomSEEDBYTES,
  randomU32,
  randomUniform,
  randomRatchet,
  randomReseed,
  randomBuf,
  randomBufDeterministic,
  hash_BYTES,
  hash_BYTES_MAX,
  hash_BYTES_MIN,
  hash_CONTEXTBYTES,
  hash_KEYBYTES,
  hashHash,
  hashKeygen,
  hashInit,
  hashUpdate,
  hashFinal,
  secretbox_CONTEXTBYTES,
  secretbox_HEADERBYTES,
  secretbox_KEYBYTES,
  secretbox_PROBEBYTES,
  secretboxKeygen,
  secretboxEncrypt,
  secretboxDecrypt,
  secretboxProbeCreate,
  secretboxProbeVerify,
}
