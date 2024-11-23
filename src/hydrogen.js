const Module = require('../dist/hydrogen.js');

function allocateUint8Array(length) {
  const arr = new Uint8Array(Module.HEAPU8.buffer, Module._malloc(length), length);
  arr.fill(0);
  return arr;
};

function free(buffer) {
  Module._free(buffer.byteOffset);
};

const hydro_init = Module.cwrap('hydro_init');
const hydro_random_u32 = Module.cwrap('hydro_random_u32');
const hydro_random_uniform = Module.cwrap('hydro_random_uniform', 'number', ['number']);
const hydro_random_ratchet = Module.cwrap('hydro_random_ratchet');
const hydro_random_reseed = Module.cwrap('hydro_random_reseed');

const hydro_random_buf = (size) => {
  const buf = allocateUint8Array(size);
  Module.ccall('hydro_random_buf', 'number', ['number', 'number'], [buf.byteOffset, size]);
  free(buf);
  return Uint8Array.from(buf);
}

const hydro_random_buf_deterministic = (size, seed) => {
  const buf = allocateUint8Array(size);
  Module.ccall('hydro_random_buf_deterministic', 'number', ['number', 'number', 'number'], [buf.byteOffset, size, seed]);
  free(buf);
  return Uint8Array.from(buf);
}

const hydro_hash_keygen = () => {
  const buf = allocateUint8Array(32);
  Module.ccall('hydro_hash_keygen', 'number', ['number'], [buf.byteOffset]);
  free(buf);
  return Uint8Array.from(buf);
}

const hydro_hash_hash = (message, context, key) => {
  const keyBuffer = allocateUint8Array(32);
  keyBuffer.set(key);
  const buf = allocateUint8Array(32);
  Module.ccall('hydro_hash_hash', 'number', ['number', 'number', 'number', 'number', 'number', 'number'], [buf.byteOffset, 32, message, message.length, context, key.byteOffset]);
  free(buf);
  return Uint8Array.from(buf);
}

const hydro_hash_init = (context, key) => {
  const state = allocateUint8Array(52);
  Module.ccall('hydro_hash_init', 'number', ['number', 'number', 'number'], [state.byteOffset, context, key]);
  return state;
}

const hydro_hash_update = (state, messagePart) => {
  Module.ccall('hydro_hash_update', 'number', ['number', 'string', 'number'], [state.byteOffset, messagePart, messagePart.length]);
}

const hydro_hash_final = (state, len) => {
  const hash = allocateUint8Array(len);
  Module.ccall('hydro_hash_final', 'number', ['number', 'number', 'number'], [state.byteOffset, hash.byteOffset, len]);
  free(state);
  free(hash);
  return Uint8Array.from(hash);
}

const result = Module.onRuntimeInitialized = () => {
  const seed = new Uint8Array([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]);

  // hydro_init();
  // console.log(hydro_random_u32());
  // console.log(hydro_random_uniform(9999));
  // console.log(hydro_random_buf(999));
  // console.log(hydro_random_buf_deterministic(100, seed));
  // console.log(hydro_random_ratchet());
  // console.log(hydro_random_reseed());

  // const key = hydro_hash_keygen();
  // const key2 = hydro_hash_keygen();
  // hydro_hash_hash("Arbitrary data to hash", "Examples", key);
  // hydro_hash_hash("Arbitrary data to hash", "Examples", key2);
  // hydro_hash_hash("Arbitrary data to hash", "Examples", key2);

  // const state = hydro_hash_init("asdfghjk", key);
  // console.log(state);
  // hydro_hash_update(state, 'part1asdfsdf askdljfalsdfjasldfjasldkkfjs');
  // console.log(state);
  // hydro_hash_update(state, 'part2837498374598374985734985734957349875983475');
  // console.log(state);
  // const hash = hydro_hash_final(state, 64);
  // console.log(hash);
}

module.exports = {
  hydro_init,
  hydro_random_u32,
  hydro_random_buf,
  hydro_random_uniform,
  hydro_random_ratchet,
  hydro_random_reseed,
  hydro_hash_keygen,
  hydro_hash_hash,
  hydro_hash_init,
  hydro_hash_update,
  hydro_hash_final,
}
