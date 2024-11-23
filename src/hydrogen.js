const Module = require('../dist/hydrogen.js');

function allocateUint8Array(length) {
  return new Uint8Array(Module.HEAPU8.buffer, Module._malloc(length), length);
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
  var buf = allocateUint8Array(size);
  Module.ccall('hydro_random_buf', 'number', ['number', 'number'], [buf.byteOffset, size]);
  Module._free(buf);
  return buf;
}

const hydro_random_buf_deterministic = (size, seed) => {
  var buf = allocateUint8Array(size);
  Module.ccall('hydro_random_buf_deterministic', 'number', ['number', 'number', 'number'], [buf.byteOffset, size, seed]);
  free(buf);
  return buf;
}

var result = Module.onRuntimeInitialized = () => {
  const seed = new Uint8Array([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]);

  hydro_init();
  console.log(hydro_random_u32());
  console.log(hydro_random_uniform(9999));
  console.log(hydro_random_buf(999));
  console.log(hydro_random_buf_deterministic(100, seed));
  console.log(hydro_random_ratchet());
  console.log(hydro_random_reseed());
}

module.exports = {
  hydro_init,
  hydro_random_u32,
  hydro_random_buf,
  hydro_random_uniform,
  hydro_random_ratchet,
  hydro_random_reseed,
}
