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

const hydro_init = Module.cwrap('hydro_init');

const hydro_secretbox_CONTEXTBYTES = 8;
const hydro_secretbox_HEADERBYTES = 20 + 16;
const hydro_secretbox_KEYBYTES = 32;
const hydro_secretbox_PROBEBYTES = 16;

const hydro_secretbox_keygen = () => {
  const buf = allocateUint8Array(hydro_secretbox_KEYBYTES);
  Module.ccall('hydro_secretbox_keygen', 'number', ['number'], [buf.ptr]);
  buf.free();
  return Uint8Array.from(buf);
}

const hydro_secretbox_encrypt = (messageBytes, context, key, id) => {
  const messageBytesBuf = allocateUint8Array(messageBytes.length, messageBytes);
  const cipherTextBuf = allocateUint8Array(hydro_secretbox_HEADERBYTES + messageBytesBuf.length);
  const contextBytes = new TextEncoder().encode(context);
  const contextBuf = allocateUint8Array(contextBytes.length, contextBytes);
  const keyBuf = allocateUint8Array(key.length, key);

  Module.ccall('hydro_secretbox_encrypt', 'number', ['number', 'number', 'number', 'number', 'number', 'number'], [cipherTextBuf.ptr, messageBytesBuf.ptr, messageBytesBuf.length, id || 0, contextBuf.ptr, keyBuf.ptr]);

  messageBytesBuf.free();
  contextBuf.free();
  keyBuf.free();

  return cipherTextBuf.freeAndCopy();
}

const hydro_secretbox_decrypt = (cipherTextBytes, context, key, id) => {
  const decryptedBytesBuf = allocateUint8Array(cipherTextBytes.length - hydro_secretbox_HEADERBYTES);
  const cipherTextBuf = allocateUint8Array(cipherTextBytes.length, cipherTextBytes);
  const contextBytes = new TextEncoder().encode(context);
  const contextBuf = allocateUint8Array(contextBytes.length, contextBytes);
  const keyBuf = allocateUint8Array(key.length, key);

  const decryptStatus = Module.ccall('hydro_secretbox_decrypt', 'number', ['number', 'number', 'number', 'number', 'number', 'number'], [decryptedBytesBuf.ptr, cipherTextBuf.ptr, cipherTextBuf.length, id || 0, contextBuf.ptr, keyBuf.ptr]);

  if (decryptStatus !== 0) {
    throw new Error(`hydro_secretbox_decrypt returned ${decryptStatus}`);
  }

  cipherTextBuf.free();
  contextBuf.free();
  keyBuf.free();

  return decryptedBytesBuf.freeAndCopy();
}

function cmp(b1, b2) {
  return new TextDecoder().decode(b1) === new TextDecoder().decode(b2);
}

const hydro_secretbox_probe_create = (cipherTextBytes, context, key) => {
  const probeBuf = allocateUint8Array(hydro_secretbox_PROBEBYTES);
  const cipherTextBuf = allocateUint8Array(cipherTextBytes.length, cipherTextBytes);
  const keyBuf = allocateUint8Array(key.length, key);
  const contextBytes = new TextEncoder().encode(context);
  const contextBuf = allocateUint8Array(contextBytes.length, contextBytes);

  Module.ccall('hydro_secretbox_probe_create', 'number', ['number', 'number', 'number', 'number', 'number'], [probeBuf.ptr, cipherTextBuf.ptr, cipherTextBuf.length, contextBuf.ptr, keyBuf.ptr]);

  cipherTextBuf.free();
  keyBuf.free();
  contextBuf.free();
  return probeBuf.freeAndCopy();
};

const hydro_secretbox_probe_verify = (probe, cipherTextBytes, context, key) => {
  const probeBuf = allocateUint8Array(hydro_secretbox_PROBEBYTES, probe);
  const cipherTextBuf = allocateUint8Array(cipherTextBytes.length, cipherTextBytes);
  const contextBytes = new TextEncoder().encode(context);
  const contextBuf = allocateUint8Array(contextBytes.length, contextBytes);
  const keyBuf = allocateUint8Array(key.length, key);

  const result = Module.ccall('hydro_secretbox_probe_verify', 'number', ['number', 'number', 'number', 'number', 'number'], [probeBuf.ptr, cipherTextBuf.ptr, cipherTextBuf.length, contextBuf.ptr, keyBuf.ptr]);

  probeBuf.free();
  keyBuf.free();
  cipherTextBuf.free();
  contextBuf.free();
  return result;
};

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
  hydro_secretbox_keygen,
  hydro_secretbox_encrypt,
  hydro_secretbox_decrypt,
  hydro_secretbox_probe_create,
  hydro_secretbox_probe_verify,
}
