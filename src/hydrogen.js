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

const {
  sign_BYTES,
  sign_CONTEXTBYTES,
  sign_PUBLICKEYBYTES,
  sign_SECRETKEYBYTES,
  sign_SEEDBYTES,
  signKeygen,
  signKeygenDeterministic,
  signCreate,
  signVerify,
  signInit,
  signUpdate,
  signFinalCreate,
  signFinalVerify,
} = require('./sign');

const {
  kdf_CONTEXTBYTES,
  kdf_KEYBYTES,
  kdf_BYTES_MAX,
  kdf_BYTES_MIN,
  kdfKeygen,
  kdfDeriveFromKey,
} = require('./kdf');

const hydro_init = Module.cwrap('hydro_init');

const ready = new Promise((resolve, reject) => {
  Module.onRuntimeInitialized = () => {
    resolve();
  };
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
  kdf_CONTEXTBYTES,
  kdf_KEYBYTES,
  kdf_BYTES_MAX,
  kdf_BYTES_MIN,
  kdfKeygen,
  kdfDeriveFromKey,
  sign_BYTES,
  sign_CONTEXTBYTES,
  sign_PUBLICKEYBYTES,
  sign_SECRETKEYBYTES,
  sign_SEEDBYTES,
  signKeygen,
  signKeygenDeterministic,
  signCreate,
  signVerify,
  signInit,
  signUpdate,
  signFinalCreate,
  signFinalVerify,
}
