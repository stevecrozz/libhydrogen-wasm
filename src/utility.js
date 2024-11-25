const Module = require('../wasm/libhydrogen.js');

function allocateUint8Array(length, contents) {
  const address = Module._malloc(length);
  const arr = new Uint8Array(Module.HEAPU8.buffer, address, length);

  if (contents) {
    arr.set(contents);
  } else {
    // reset memory so there's no unexpected contents on new allocations
    arr.fill(0);
  }

  arr.free = () => Module._free(address);
  arr.freeAndCopy = () => {
    const copy = Uint8Array.from(arr);
    Module._free(address);
    return copy;
  };
  arr.ptr = address;

  return arr;
};

function allocateInt8Array(length, contents) {
  const address = Module._malloc(length);
  const arr = new Int8Array(Module.HEAPU8.buffer, address, length);

  if (contents) {
    arr.set(contents);
  } else {
    // reset memory so there's no unexpected contents on new allocations
    arr.fill(0);
  }

  arr.free = () => Module._free(address);
  arr.freeAndCopy = () => {
    const copy = Int8Array.from(arr);
    Module._free(address);
    return copy;
  };
  arr.ptr = address;

  return arr;
};

function decode(bytes) {
  return new TextDecoder().decode(bytes);
}

function encode(string) {
  return new TextEncoder().encode(string);
}

module.exports = {
  allocateUint8Array,
  allocateInt8Array,
  decode,
  encode,
}
