# LibHydrogen

Making LibHydrogen available to JavaScript through Emscripten.

This interface does not yet expose the entire API. Have a look at the exports to see what's available in src/hydrogen.js:

~~~js
const hydrogen = require('libhydrogen-wasm');

console.log(hydrogen.hydro_random_u32());
~~~
